/**
 * jsonStore.js
 * -------------------------------------------------------------------------
 * A tiny self-contained, file-backed data store that stands in for MongoDB.
 *
 * It gives us the handful of things the app actually needs from a "real"
 * database:
 *   - named collections (users / projects / tasks)
 *   - auto-generated ids (uuid v4, analogous to Mongo's ObjectId)
 *   - createdAt / updatedAt timestamps managed automatically
 *   - basic CRUD: find, findOne, findById, insert, updateById, deleteById
 *   - simple predicate-based querying (pass a filter function)
 *
 * Persistence strategy: the whole database lives in a single JSON file
 * (data/db.json), loaded into memory on first access and flushed back to
 * disk after every mutation. Writes are serialized through an in-process
 * queue so concurrent requests can't interleave and corrupt the file.
 *
 * This is obviously not built for scale, but it preserves the exact same
 * shape of data and the exact same async API a Mongo-backed layer would
 * expose, which is what lets routes/middleware stay unchanged.
 */

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const DEFAULT_SHAPE = {
  users: [],
  projects: [],
  tasks: [],
};

// ---------------------------------------------------------------------------
// Low-level file access
// ---------------------------------------------------------------------------

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_SHAPE, null, 2));
  }
}

function readDbSync() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    const parsed = JSON.parse(raw || "{}");
    // make sure every known collection exists even on a half-written file
    return { ...DEFAULT_SHAPE, ...parsed };
  } catch (err) {
    console.error("[jsonStore] Failed to parse db.json, resetting to default shape:", err.message);
    return { ...DEFAULT_SHAPE };
  }
}

// Simple write queue so concurrent mutations never race each other.
let writeQueue = Promise.resolve();

function writeDbSync(data) {
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, DB_PATH); // atomic-ish swap
}

function queueWrite(mutateFn) {
  writeQueue = writeQueue.then(() => {
    const db = readDbSync();
    const result = mutateFn(db);
    writeDbSync(db);
    return result;
  });
  return writeQueue;
}

// ---------------------------------------------------------------------------
// Collection class
// ---------------------------------------------------------------------------

class Collection {
  constructor(name) {
    if (!DEFAULT_SHAPE.hasOwnProperty(name)) {
      throw new Error(`Unknown collection "${name}"`);
    }
    this.name = name;
  }

  /** Return all documents matching an optional predicate function. */
  async find(predicate = () => true) {
    const db = readDbSync();
    return db[this.name].filter(predicate);
  }

  /** Return the first document matching a predicate, or null. */
  async findOne(predicate = () => true) {
    const db = readDbSync();
    return db[this.name].find(predicate) || null;
  }

  /** Convenience lookup by id. */
  async findById(id) {
    return this.findOne((doc) => doc.id === id);
  }

  /** Insert a new document. Adds id + timestamps automatically. */
  async insert(doc) {
    const now = new Date().toISOString();
    const record = {
      id: uuidv4(),
      ...doc,
      createdAt: now,
      updatedAt: now,
    };
    await queueWrite((db) => {
      db[this.name].push(record);
      return record;
    });
    return record;
  }

  /** Patch an existing document by id. Returns the updated doc or null. */
  async updateById(id, patch) {
    return queueWrite((db) => {
      const idx = db[this.name].findIndex((doc) => doc.id === id);
      if (idx === -1) return null;
      db[this.name][idx] = {
        ...db[this.name][idx],
        ...patch,
        id, // never allow id to be overwritten
        updatedAt: new Date().toISOString(),
      };
      return db[this.name][idx];
    });
  }

  /** Remove a document by id. Returns true if something was deleted. */
  async deleteById(id) {
    return queueWrite((db) => {
      const before = db[this.name].length;
      db[this.name] = db[this.name].filter((doc) => doc.id !== id);
      return db[this.name].length < before;
    });
  }

  /** Bulk delete by predicate (handy for cascading deletes). Returns count removed. */
  async deleteMany(predicate) {
    return queueWrite((db) => {
      const before = db[this.name].length;
      db[this.name] = db[this.name].filter((doc) => !predicate(doc));
      return before - db[this.name].length;
    });
  }
}

module.exports = {
  users: new Collection("users"),
  projects: new Collection("projects"),
  tasks: new Collection("tasks"),
  _internal: { readDbSync, writeDbSync, DB_PATH }, // exposed for seeding/debug only
};

/**
 * db/seed.js
 * -------------------------------------------------------------------------
 * Creates a fresh, empty data/db.json. Run with `npm run seed`.
 * Safe to re-run — it will overwrite any existing data, so it prompts
 * via a console warning rather than silently nuking dev data.
 */

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");
const EMPTY_SHAPE = { users: [], projects: [], tasks: [] };

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

if (fs.existsSync(DB_PATH)) {
  console.warn(`[seed] Overwriting existing db.json at ${DB_PATH}`);
}

fs.writeFileSync(DB_PATH, JSON.stringify(EMPTY_SHAPE, null, 2));
console.log(`[seed] Wrote empty database to ${DB_PATH}`);

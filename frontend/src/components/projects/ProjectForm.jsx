import { useState } from "react";
import { toInputDate } from "../../utils/formatDate";

export default function ProjectForm({ initialValues, onSubmit, onClose }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [dueDate, setDueDate] = useState(toInputDate(initialValues?.dueDate));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialValues?.id);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2 style={{ fontSize: 19 }}>{isEdit ? "Edit project" : "New project"}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="project-name">Name</label>
            <input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Website Revamp"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="project-desc">Description</label>
            <textarea
              id="project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
            />
          </div>
          <div className="field">
            <label htmlFor="project-due">Due date</label>
            <input
              id="project-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-ember" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

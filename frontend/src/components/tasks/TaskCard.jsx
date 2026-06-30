import { formatDate } from "../../utils/formatDate";

const STATUSES = ["todo", "in-progress", "done"];

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-title">{task.title}</div>
      {task.description && <p className="task-card-desc">{task.description}</p>}
      <div className="task-card-foot">
        <span className="task-due">{formatDate(task.dueDate)}</span>
        <div className="task-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">
            Edit
          </button>
          <button className="icon-btn" onClick={() => onDelete(task)} aria-label="Delete task">
            Delete
          </button>
        </div>
      </div>
      <select
        className="status-select"
        value={task.status}
        onChange={(e) => onStatusChange(task, e.target.value)}
        aria-label="Change status"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

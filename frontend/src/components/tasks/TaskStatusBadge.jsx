const LABELS = {
  todo: "To-do",
  "in-progress": "In progress",
  done: "Done",
};

export default function TaskStatusBadge({ status }) {
  return (
    <span className="task-column-title">
      <span className={`status-dot ${status}`} />
      {LABELS[status] || status}
    </span>
  );
}

export { LABELS as STATUS_LABELS };

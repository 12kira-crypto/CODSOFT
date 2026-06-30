import TaskCard from "./TaskCard";

const COLUMNS = [
  { key: "todo", title: "To-do" },
  { key: "in-progress", title: "In progress" },
  { key: "done", title: "Done" },
];

export default function TaskList({ tasks, onStatusChange, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks yet</h3>
        <p>Add the first task to start tracking this project's progress.</p>
      </div>
    );
  }

  return (
    <div className="task-board">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div className="task-column" key={col.key}>
            <div className="task-column-head">
              <span className="task-column-title">
                <span className={`status-dot ${col.key}`} />
                {col.title}
              </span>
              <span className="task-count">{colTasks.length}</span>
            </div>
            {colTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

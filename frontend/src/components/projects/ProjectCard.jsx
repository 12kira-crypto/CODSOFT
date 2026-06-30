import { Link } from "react-router-dom";
import PaceRing from "./ProgressBar";
import { formatDate } from "../../utils/formatDate";

export default function ProjectCard({ project }) {
  const progress = project.progress || { percent: 0, total: 0, done: 0 };

  return (
    <Link to={`/projects/${project.id}`} className="project-card">
      <div className="project-card-top">
        <div>
          <h3>{project.name}</h3>
          <p>{project.description || "No description yet."}</p>
        </div>
        <PaceRing percent={progress.percent} size={46} stroke={4} />
      </div>
      <div className="project-card-meta">
        <span>
          {progress.done}/{progress.total} tasks done
        </span>
        <span>Due {formatDate(project.dueDate)}</span>
      </div>
    </Link>
  );
}

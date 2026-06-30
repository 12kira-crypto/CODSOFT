import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <h3>No projects yet</h3>
        <p>Start one to begin assigning tasks and tracking deadlines.</p>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

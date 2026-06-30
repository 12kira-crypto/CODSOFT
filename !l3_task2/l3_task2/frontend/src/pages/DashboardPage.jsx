import { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import ProjectList from "../components/projects/ProjectList";
import ProjectForm from "../components/projects/ProjectForm";

export default function DashboardPage() {
  const { projects, loading, error, addProject } = useProjects();
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Workspace</div>
          <h1 className="page-title">Projects</h1>
          <p className="page-sub">{projects.length} active project{projects.length === 1 ? "" : "s"}</p>
        </div>
        <button className="btn btn-ember" onClick={() => setShowForm(true)}>
          + New project
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <div className="loading-row">Loading projects…</div>
      ) : (
        <ProjectList projects={projects} />
      )}

      {showForm && (
        <ProjectForm onSubmit={addProject} onClose={() => setShowForm(false)} />
      )}
    </>
  );
}

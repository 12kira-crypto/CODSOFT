import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>404</h1>
        <p className="auth-sub">That page doesn't exist.</p>
        <Link to="/" className="btn btn-ember" style={{ textDecoration: "none" }}>
          Back to projects
        </Link>
      </div>
    </div>
  );
}

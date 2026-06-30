import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { initials } from "../../utils/formatDate";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">Pace</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          Projects
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="avatar">{initials(user?.name || "?")}</span>
          <span>{user?.name}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}

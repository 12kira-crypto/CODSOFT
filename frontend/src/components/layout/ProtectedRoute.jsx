import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";

export default function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <div className="loading-row" style={{ padding: 40 }}>Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

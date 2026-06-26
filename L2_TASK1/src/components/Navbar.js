import React from 'react';
import './Navbar.css';

function Navbar({ showToast }) {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <div className="nav-logo-dot" />
        WorkSphere
      </div>

      <ul className="nav-links">
        <li>Browse Jobs</li>
        <li>Companies</li>
        <li>Salary Guide</li>
      </ul>

      <div className="nav-actions">
        <button className="btn-ghost" onClick={() => showToast('Login coming soon!')}>
          Log In
        </button>
        <button className="btn-primary" onClick={() => showToast('Employer sign-up coming soon!')}>
          Post a Job
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

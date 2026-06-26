import React from 'react';
import './Hero.css';

function Hero({ search, setSearch }) {
  return (
    <section className="hero">
      <div className="hero-eyebrow">
        <div className="hero-eyebrow-dot" />
        Live Job Market
      </div>

      <h1 className="hero-title">
        Find work that<br />
        <span className="hero-accent">actually fits</span> you.
      </h1>

      <p className="hero-subtitle">
        Thousands of roles at companies that care about craft, culture, and growth.
        Updated daily.
      </p>

      <div className="search-bar">
        <input
          className="search-field"
          placeholder="Job title, skill, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-divider" />
        <input
          className="search-field search-field--location"
          placeholder="Location or Remote"
          readOnly
        />
        <button className="search-btn">Find Jobs</button>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <div className="stat-num">4,536</div>
          <div className="stat-label">Open Roles</div>
        </div>
        <div className="stat">
          <div className="stat-num">1,200+</div>
          <div className="stat-label">Companies</div>
        </div>
        <div className="stat">
          <div className="stat-num">98%</div>
          <div className="stat-label">Response Rate</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

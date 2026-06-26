import React from 'react';
import './JobCard.css';

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function JobCard({ job, onSelect, showToast }) {
  const handleApplyClick = (e) => {
    e.stopPropagation();
    onSelect(job);
  };

  return (
    <div
      className={`job-card ${job.featured ? 'job-card--featured' : ''}`}
      onClick={() => onSelect(job)}
    >
      {job.featured && <div className="featured-bar" />}

      <div className="card-top">
        <div
          className="company-logo"
          style={{ background: job.color + '22', color: job.color }}
        >
          {job.logo}
        </div>
        <div className="card-meta">
          <div className="company-name">{job.company}</div>
          <div className="job-title">{job.title}</div>
        </div>
        {job.featured && <span className="featured-badge">Hot</span>}
      </div>

      <div className="card-info">
        <span className="info-chip">
          <LocationIcon />
          {job.location}
        </span>
        <span className="info-chip">{job.type}</span>
        <span className="info-chip info-chip--salary">{job.salary}</span>
      </div>

      <div className="card-tags">
        {job.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      <div className="card-footer">
        <span className="posted-time">Posted {job.posted}</span>
        <button className="apply-btn" onClick={handleApplyClick}>
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobCard;

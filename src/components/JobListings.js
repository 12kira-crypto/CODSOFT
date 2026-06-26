import React, { useState } from 'react';
import { JOBS, CATEGORIES } from '../data/jobs';
import JobCard from './JobCard';
import './JobListings.css';

function JobListings({ search, onSelectJob, showToast }) {
  const [category, setCategory] = useState('All');

  const filtered = JOBS.filter((job) => {
    const matchCat = category === 'All' || job.category === category;
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <section className="listings">
      <div className="listings-header">
        <h2 className="listings-title">
          {category === 'All' ? 'All Openings' : category}
          <span className="listings-count"> ({filtered.length})</span>
        </h2>
        <span className="listings-link">View all →</span>
      </div>

      <div className="filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`filter-pill ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="jobs-grid">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              showToast={showToast}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No jobs match your search.</div>
          <div className="empty-sub">Try different keywords or browse all categories.</div>
        </div>
      )}
    </section>
  );
}

export default JobListings;

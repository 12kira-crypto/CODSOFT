import React, { useState } from 'react';
import './JobModal.css';

function JobModal({ job, onClose, showToast }) {
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', cover: '', resume: '' });

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      showToast('Please fill in your name and email.');
      return;
    }
    onClose();
    setForm({ name: '', email: '', cover: '', resume: '' });
    showToast('🎉 Application submitted successfully!');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div
          className="modal-logo"
          style={{ background: job.color + '22', color: job.color }}
        >
          {job.logo}
        </div>

        <div className="modal-header">
          <div>
            <h2 className="modal-title">{job.title}</h2>
            <p className="modal-company">{job.company} · {job.location}</p>
          </div>
          {job.featured && <span className="modal-featured-badge">Featured</span>}
        </div>

        <div className="modal-chips">
          <span className="modal-chip modal-chip--teal">{job.salary}</span>
          <span className="modal-chip">{job.type}</span>
          <span className="modal-chip">{job.category}</span>
          <span className="modal-chip">{job.posted}</span>
        </div>

        {!showApply ? (
          <>
            <p className="modal-section-label">About the role</p>
            <p className="modal-desc">{job.description}</p>

            <p className="modal-section-label">Skills &amp; Tools</p>
            <div className="modal-tags">
              {job.tags.map((t) => (
                <span key={t} className="modal-tag">{t}</span>
              ))}
            </div>

            <button className="modal-submit" onClick={() => setShowApply(true)}>
              Apply for this Role →
            </button>
          </>
        ) : (
          <>
            <p className="modal-section-label">Your Application</p>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="jane@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Note (optional)</label>
              <textarea
                className="form-input form-textarea"
                rows="3"
                placeholder="What excites you about this role?"
                value={form.cover}
                onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Resume</label>
              <div className="upload-area" onClick={() => document.getElementById('resume-input').click()}>
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setForm(f => ({ ...f, resume: file.name }));
                  }}
                  />
                  <div className="upload-icon">📎</div>
                  <div className="upload-text">
                  {form.resume
                    ? <span className="upload-text--highlight">✓ {form.resume}</span>
                    : <><span className="upload-text--highlight">Click to upload</span> or drag & drop<br />PDF, DOC up to 5MB</>
    }
                  </div>
                </div>
            </div>

            <div className="form-actions">
              <button className="btn-back" onClick={() => setShowApply(false)}>
                ← Back
              </button>
              <button className="modal-submit modal-submit--flex" onClick={handleSubmit}>
                Submit Application
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JobModal;

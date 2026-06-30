import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import JobListings from './components/JobListings';
import JobModal from './components/JobModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

function App() {
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div>
      <Navbar showToast={showToast} />
      <Hero search={search} setSearch={setSearch} />
      <Ticker />
      <JobListings
        search={search}
        onSelectJob={setSelectedJob}
        showToast={showToast}
      />
      <Footer />

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default App;

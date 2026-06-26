// Animate skill bars when scrolled into view
const skillSection = document.getElementById('skill');
if (skillSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-bar > span').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  skillObserver.observe(skillSection);
}

// Contact form placeholder submit
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.style.display = 'block';
    form.reset();
  });
}
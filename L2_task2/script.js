/* =========================================================
   QuizCraft — front-end quiz creation & taking app.
   Data is persisted in localStorage:
     quizcraft_users     -> [{ username, password }]
     quizcraft_session   -> "username" of the logged-in user
     quizcraft_quizzes   -> [{ id, title, description, createdBy, questions }]
     quizcraft_attempts  -> [{ id, quizId, quizTitle, username, score, total, date }]
   ========================================================= */

const STORAGE_KEYS = {
  users: 'quizcraft_users',
  session: 'quizcraft_session',
  quizzes: 'quizcraft_quizzes',
  attempts: 'quizcraft_attempts'
};

/* ---------------------- Storage helpers ---------------------- */

function loadList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function getUsers() { return loadList(STORAGE_KEYS.users); }
function saveUsers(list) { saveList(STORAGE_KEYS.users, list); }

function getQuizzes() { return loadList(STORAGE_KEYS.quizzes); }
function saveQuizzes(list) { saveList(STORAGE_KEYS.quizzes, list); }

function getAttempts() { return loadList(STORAGE_KEYS.attempts); }
function saveAttempts(list) { saveList(STORAGE_KEYS.attempts, list); }

function getCurrentUser() { return localStorage.getItem(STORAGE_KEYS.session); }
function setCurrentUser(username) { localStorage.setItem(STORAGE_KEYS.session, username); }
function clearCurrentUser() { localStorage.removeItem(STORAGE_KEYS.session); }

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* Seed a couple of sample quizzes the very first time the app runs,
   so "Browse Quizzes" isn't empty on a fresh visit. */
function seedSampleDataIfEmpty() {
  if (getQuizzes().length > 0) return;

  const sample = [
    {
      id: makeId(),
      title: 'General Knowledge Starter',
      description: 'A short warm-up quiz covering a bit of everything.',
      createdBy: 'QuizCraft Team',
      questions: [
        {
          text: 'What is the capital of Japan?',
          options: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'],
          correctIndex: 1
        },
        {
          text: 'Which language is primarily used to style web pages?',
          options: ['HTML', 'CSS', 'Python', 'SQL'],
          correctIndex: 1
        },
        {
          text: 'How many continents are there on Earth?',
          options: ['5', '6', '7', '8'],
          correctIndex: 2
        }
      ]
    }
  ];

  saveQuizzes(sample);
}

/* ---------------------- View navigation ---------------------- */

const VIEW_IDS = ['home', 'auth', 'create', 'listing', 'taking', 'results', 'dashboard'];

function showView(name) {
  VIEW_IDS.forEach((id) => {
    document.getElementById(`view-${id}`).classList.toggle('hidden', id !== name);
  });

  closeMobileNav();

  if (name === 'home') renderHomeStats();
  if (name === 'listing') renderQuizListing();
  if (name === 'dashboard') renderDashboard();
  if (name === 'create') resetQuizForm();

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function closeMobileNav() {
  document.querySelector('.main-nav').classList.remove('open');
}

document.querySelectorAll('[data-nav]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = el.getAttribute('data-nav');

    if ((target === 'create' || target === 'dashboard') && !getCurrentUser()) {
      showView('auth');
      return;
    }

    showView(target);
  });
});

document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.main-nav').classList.toggle('open');
});

/* ---------------------- Auth UI ---------------------- */

function refreshAuthUI() {
  const user = getCurrentUser();
  const navAuth = document.getElementById('navAuth');
  const navLogout = document.getElementById('navLogout');

  if (user) {
    navAuth.textContent = `Hi, ${user}`;
    navLogout.classList.remove('hidden');
  } else {
    navAuth.textContent = 'Log In';
    navLogout.classList.add('hidden');
  }
}

document.querySelectorAll('.auth-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const isLogin = tab.dataset.tab === 'login';
    document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
    document.getElementById('registerForm').classList.toggle('hidden', isLogin);
  });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  const user = getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());

  if (!user || user.password !== password) {
    errorEl.textContent = 'Incorrect username or password.';
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  setCurrentUser(user.username);
  refreshAuthUI();
  showView('dashboard');
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value;
  const errorEl = document.getElementById('registerError');

  if (username.length < 3) {
    errorEl.textContent = 'Username must be at least 3 characters.';
    errorEl.classList.remove('hidden');
    return;
  }

  const users = getUsers();
  const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());

  if (exists) {
    errorEl.textContent = 'That username is already taken.';
    errorEl.classList.remove('hidden');
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  errorEl.classList.add('hidden');
  setCurrentUser(username);
  refreshAuthUI();
  showView('dashboard');
});

document.getElementById('navLogout').addEventListener('click', () => {
  clearCurrentUser();
  refreshAuthUI();
  showView('home');
});

/* ---------------------- Home stats ---------------------- */

function renderHomeStats() {
  document.getElementById('statQuizCount').textContent = getQuizzes().length;
  document.getElementById('statAttemptCount').textContent = getAttempts().length;
  document.getElementById('statUserCount').textContent = getUsers().length;
}

/* ---------------------- Quiz creation ---------------------- */

let questionCounter = 0;

function buildQuestionBlock(index) {
  const block = document.createElement('div');
  block.className = 'question-block';
  block.dataset.index = index;

  block.innerHTML = `
    <div class="question-block-head">
      <h3>Question ${index + 1}</h3>
      <button type="button" class="remove-question">Remove</button>
    </div>
    <input type="text" class="q-text" placeholder="Enter the question…" required>
    ${[0, 1, 2, 3].map((optIdx) => `
      <div class="option-row">
        <input type="radio" name="correct-${index}" value="${optIdx}" ${optIdx === 0 ? 'checked' : ''}>
        <input type="text" class="q-option" placeholder="Option ${optIdx + 1}" required>
        <label class="correct-label">Correct?</label>
      </div>
    `).join('')}
  `;

  block.querySelector('.remove-question').addEventListener('click', () => {
    block.remove();
    renumberQuestionBlocks();
  });

  return block;
}

function renumberQuestionBlocks() {
  document.querySelectorAll('.question-block').forEach((blk, position) => {
    blk.querySelector('.question-block-head h3').textContent = `Question ${position + 1}`;
  });
}

document.getElementById('addQuestionBtn').addEventListener('click', () => {
  const list = document.getElementById('questionList');
  list.appendChild(buildQuestionBlock(questionCounter));
  questionCounter += 1;
});

function resetQuizForm() {
  document.getElementById('quizForm').reset();
  document.getElementById('questionList').innerHTML = '';
  document.getElementById('quizFormError').classList.add('hidden');
  questionCounter = 0;
  // Start every new quiz with one question block ready to fill in.
  document.getElementById('questionList').appendChild(buildQuestionBlock(questionCounter));
  questionCounter += 1;
}

document.getElementById('quizForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const errorEl = document.getElementById('quizFormError');

  const title = document.getElementById('quizTitle').value.trim();
  const description = document.getElementById('quizDescription').value.trim();
  const blocks = Array.from(document.querySelectorAll('.question-block'));

  if (blocks.length === 0) {
    errorEl.textContent = 'Add at least one question before saving.';
    errorEl.classList.remove('hidden');
    return;
  }

  const questions = [];

  for (const block of blocks) {
    const text = block.querySelector('.q-text').value.trim();
    const optionInputs = Array.from(block.querySelectorAll('.q-option'));
    const options = optionInputs.map((inp) => inp.value.trim());
    const correctRadio = block.querySelector('input[type="radio"]:checked');

    if (!text || options.some((o) => !o) || !correctRadio) {
      errorEl.textContent = 'Every question needs text, four filled-in options, and a marked correct answer.';
      errorEl.classList.remove('hidden');
      return;
    }

    questions.push({
      text,
      options,
      correctIndex: parseInt(correctRadio.value, 10)
    });
  }

  errorEl.classList.add('hidden');

  const quiz = {
    id: makeId(),
    title,
    description,
    createdBy: getCurrentUser() || 'Anonymous',
    questions
  };

  const quizzes = getQuizzes();
  quizzes.push(quiz);
  saveQuizzes(quizzes);

  showView('listing');
});

/* ---------------------- Quiz listing ---------------------- */

function renderQuizListing(filterText = '') {
  const grid = document.getElementById('quizGrid');
  const quizzes = getQuizzes().filter((q) =>
    q.title.toLowerCase().includes(filterText.toLowerCase())
  );

  if (quizzes.length === 0) {
    grid.innerHTML = '<p class="muted">No quizzes found. Try a different search, or create one!</p>';
    return;
  }

  grid.innerHTML = quizzes
    .map(
      (q) => `
      <div class="quiz-card">
        <h3>${escapeHtml(q.title)}</h3>
        <p>${escapeHtml(q.description || 'No description provided.')}</p>
        <div class="quiz-card-meta">${q.questions.length} question${q.questions.length === 1 ? '' : 's'} · by ${escapeHtml(q.createdBy)}</div>
        <button class="btn-solid take-quiz-btn" data-quiz-id="${q.id}">Take Quiz</button>
      </div>
    `
    )
    .join('');

  grid.querySelectorAll('.take-quiz-btn').forEach((btn) => {
    btn.addEventListener('click', () => startQuiz(btn.dataset.quizId));
  });
}

document.getElementById('listingSearch').addEventListener('input', (e) => {
  renderQuizListing(e.target.value);
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------- Quiz taking engine ---------------------- */

let activeQuiz = null;
let activeIndex = 0;
let activeAnswers = [];

function startQuiz(quizId) {
  const quiz = getQuizzes().find((q) => q.id === quizId);
  if (!quiz) return;

  activeQuiz = quiz;
  activeIndex = 0;
  activeAnswers = new Array(quiz.questions.length).fill(null);

  showView('taking');
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const quiz = activeQuiz;
  const question = quiz.questions[activeIndex];

  document.getElementById('takingQuizTitle').textContent = quiz.title;
  document.getElementById('questionText').textContent = question.text;

  const progressPct = Math.round((activeIndex / quiz.questions.length) * 100);
  document.getElementById('progressFill').style.width = `${progressPct}%`;
  document.getElementById('progressLabel').textContent =
    `Question ${activeIndex + 1} of ${quiz.questions.length}`;

  const optionList = document.getElementById('optionList');
  optionList.innerHTML = question.options
    .map(
      (opt, idx) => `
      <div class="option-item" data-option-index="${idx}">${escapeHtml(opt)}</div>
    `
    )
    .join('');

  const nextBtn = document.getElementById('nextQuestionBtn');
  nextBtn.disabled = true;
  nextBtn.textContent = activeIndex === quiz.questions.length - 1 ? 'See Results' : 'Next';

  optionList.querySelectorAll('.option-item').forEach((item) => {
    item.addEventListener('click', () => {
      optionList.querySelectorAll('.option-item').forEach((o) => o.classList.remove('selected'));
      item.classList.add('selected');
      activeAnswers[activeIndex] = parseInt(item.dataset.optionIndex, 10);
      nextBtn.disabled = false;
    });
  });

  // Restore a previously selected answer if the user goes back via retake flow.
  if (activeAnswers[activeIndex] !== null) {
    const selected = optionList.querySelector(`[data-option-index="${activeAnswers[activeIndex]}"]`);
    if (selected) {
      selected.classList.add('selected');
      nextBtn.disabled = false;
    }
  }
}

document.getElementById('nextQuestionBtn').addEventListener('click', () => {
  if (activeIndex < activeQuiz.questions.length - 1) {
    activeIndex += 1;
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz() {
  const quiz = activeQuiz;
  let score = 0;

  quiz.questions.forEach((q, idx) => {
    if (activeAnswers[idx] === q.correctIndex) score += 1;
  });

  const attempt = {
    id: makeId(),
    quizId: quiz.id,
    quizTitle: quiz.title,
    username: getCurrentUser() || 'Guest',
    score,
    total: quiz.questions.length,
    date: new Date().toLocaleString()
  };

  const attempts = getAttempts();
  attempts.push(attempt);
  saveAttempts(attempts);

  renderResults(score, quiz.questions.length);
  showView('results');
}

function renderResults(score, total) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);

  document.getElementById('scoreCircle').style.setProperty('--pct', pct);
  document.getElementById('scoreFraction').textContent = `${score}/${total}`;

  let message;
  if (pct === 100) message = 'Perfect score — excellent work!';
  else if (pct >= 70) message = 'Great job, you know your stuff.';
  else if (pct >= 40) message = 'Not bad — a little more practice and you\'ll have it.';
  else message = 'Keep practicing — review the breakdown below and try again.';

  document.getElementById('scoreMessage').textContent = message;

  const breakdown = document.getElementById('answerBreakdown');
  breakdown.innerHTML = activeQuiz.questions
    .map((q, idx) => {
      const userAnswerIdx = activeAnswers[idx];
      const wasCorrect = userAnswerIdx === q.correctIndex;
      const userAnswerText = userAnswerIdx !== null ? q.options[userAnswerIdx] : 'No answer';

      return `
        <div class="breakdown-item">
          <strong>${idx + 1}. ${escapeHtml(q.text)}</strong>
          <p class="${wasCorrect ? 'breakdown-correct' : 'breakdown-wrong'}">
            Your answer: ${escapeHtml(userAnswerText)} ${wasCorrect ? '✓' : '✗'}
          </p>
          ${!wasCorrect ? `<p class="breakdown-correct">Correct answer: ${escapeHtml(q.options[q.correctIndex])}</p>` : ''}
        </div>
      `;
    })
    .join('');
}

document.getElementById('retakeBtn').addEventListener('click', () => {
  startQuiz(activeQuiz.id);
});

/* ---------------------- Dashboard ---------------------- */

function renderDashboard() {
  const user = getCurrentUser();
  document.getElementById('dashboardWelcome').textContent = user
    ? `Welcome back, ${user}.`
    : 'Log in to see your personalized dashboard.';

  const myQuizzesEl = document.getElementById('myQuizzes');
  const myAttemptsEl = document.getElementById('myAttempts');

  if (!user) {
    myQuizzesEl.innerHTML = '';
    myAttemptsEl.innerHTML = '';
    return;
  }

  const myQuizzes = getQuizzes().filter((q) => q.createdBy === user);
  const myAttempts = getAttempts()
    .filter((a) => a.username === user)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  myQuizzesEl.innerHTML = myQuizzes.length
    ? myQuizzes
        .map((q) => `<li><span>${escapeHtml(q.title)}</span><span class="muted">${q.questions.length} Qs</span></li>`)
        .join('')
    : '<li class="muted">You haven\'t created any quizzes yet.</li>';

  myAttemptsEl.innerHTML = myAttempts.length
    ? myAttempts
        .map(
          (a) =>
            `<li><span>${escapeHtml(a.quizTitle)}</span><span class="muted">${a.score}/${a.total} · ${a.date}</span></li>`
        )
        .join('')
    : '<li class="muted">No quiz attempts yet.</li>';
}

/* ---------------------- Init ---------------------- */

seedSampleDataIfEmpty();
refreshAuthUI();
showView('home');
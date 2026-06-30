# Pace — Project Management Tool (Frontend)

A React (Vite) frontend for the Pace project management API. Lets a user
register/log in, create projects, set due dates, add tasks, move tasks
through to-do → in progress → done, and see live progress per project via
the "pace ring" indicator.

## Setup

```
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev             # http://localhost:3000
```

## Build for deployment

```
npm run build
```

Outputs static files to `dist/` — deploy that folder to Netlify, GitHub
Pages, or any static host. Set `VITE_API_URL` to your deployed backend's
URL before building (Netlify/Vercel: set it as an environment variable in
the project settings).

## Structure

See `src/`:
- `api/` — axios calls to the backend (auth, projects, tasks)
- `context/AuthContext.jsx` — login state, persisted in localStorage
- `hooks/` — `useAuth`, `useProjects`, `useTasks`
- `components/` — layout (sidebar, protected route), project UI, task UI
- `pages/` — Login, Register, Dashboard, Project detail, 404

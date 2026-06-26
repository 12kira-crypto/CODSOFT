# WorkSphere — Job Board

A modern job board built with React.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Install & Run

```bash
# 1. Navigate into the project folder
cd worksphere

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

---

## Project Structure

```
worksphere/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js / Navbar.css
│   │   ├── Hero.js / Hero.css
│   │   ├── Ticker.js / Ticker.css
│   │   ├── JobListings.js / JobListings.css
│   │   ├── JobCard.js / JobCard.css
│   │   ├── JobModal.js / JobModal.css
│   │   ├── Toast.js / Toast.css
│   │   └── Footer.js / Footer.css
│   ├── data/
│   │   └── jobs.js        ← Add/edit job listings here
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Features

- Browse & filter jobs by category
- Live keyword search
- Job detail modal
- Application form with resume upload
- Toast notifications
- Fully responsive (mobile-friendly)

## Customising Jobs

Edit `src/data/jobs.js` to add, remove, or update job listings.

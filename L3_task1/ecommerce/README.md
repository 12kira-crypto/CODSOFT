# ShopWave — E-Commerce Platform

A full-stack e-commerce app built with React, Node.js, Express, and MongoDB.

## Features
- Browse and filter products by category & price
- User signup / login with JWT authentication
- Shopping cart with quantity management
- Checkout with order summary
- Protected routes for authenticated users

---

## Project Structure

```
ecommerce/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/   # Reusable UI pieces
│       │   ├── Auth/
│       │   ├── Cart/
│       │   ├── Checkout/
│       │   ├── Filter/
│       │   ├── Navbar/
│       │   └── ProductCard/
│       ├── context/      # Global state (Cart + Auth)
│       ├── pages/        # Route-level views
│       ├── styles/       # Global CSS
│       └── utils/        # API helpers
└── server/               # Express backend
    ├── config/           # DB connection
    ├── controllers/      # Business logic
    ├── middleware/        # Auth guard
    ├── models/           # Mongoose schemas
    └── routes/           # API endpoints
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd ecommerce
npm run install-all
```

### 2. Set up environment variables

Create `server/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopwave
JWT_SECRET=your_super_secret_key_here
```

### 3. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

---

## API Endpoints

| Method | Route | Description | Auth? |
|--------|-------|-------------|-------|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login, get token | No |
| GET | /api/products | List all products | No |
| GET | /api/products/:id | Single product | No |
| POST | /api/orders | Place an order | Yes |
| GET | /api/orders/mine | User's orders | Yes |

---

## Tech Stack

- **Frontend:** React 18, React Router v6, Context API
- **Backend:** Node.js, Express 4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Styling:** Plain CSS (no framework dependency)

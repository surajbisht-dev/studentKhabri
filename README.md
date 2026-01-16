# Lead Management Dashboard (Mini CRM)

A mini CRM-style Lead Management Dashboard built with **React (Vite) + Tailwind**, **Node/Express**, and **MongoDB Atlas**.

## Features

* Basic Login (demo credentials)
* Leads Dashboard (server-side):

  * Search
  * Filters
  * Sorting
  * Pagination
* Lead Details View
* Analytics (3+):

  * Total Leads
  * Converted Leads
  * Leads by Stage

## Tech Stack

* Frontend: React (Vite) + Tailwind CSS
* Backend: Node.js + Express
* Database: MongoDB Atlas (Free Tier)

## Demo Credentials

* Email: `demo@crm.com`
* Password: `Demo@12345`

## Setup (Local)

### 1) Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecret123
ADMIN_EMAIL=demo@crm.com
ADMIN_PASSWORD=Demo@12345
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Seed leads (1000):

```bash
npm run seed
```

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

Run frontend:

```bash
npm run dev
```

Open: `http://localhost:5173`

## API Endpoints

* `POST /api/auth/login`
* `POST /api/auth/logout`
* `GET /api/auth/me`
* `GET /api/leads` (search/filter/sort/pagination + metrics)
* `GET /api/leads/:id`

## Deployment

* Backend: Render/Railway (set backend env vars)
* Frontend: Vercel/Netlify (set `VITE_API_URL` to backend URL)

## Links

* GitHub Repo: *add link*
* Deployed App: *add link*

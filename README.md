# Personal Finance Budgeting Tool (Simple, Local MongoDB)

This is a simple full-stack Personal Finance Budgeting Tool (no authentication) built with:
- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React (Vite) + Tailwind CSS + Chart.js
- Purpose: Track income and expenses, view summaries and charts.

## Quick start

### Backend (local MongoDB)
1. Ensure MongoDB is installed and running locally (default port 27017).
2. cd backend
3. npm install
4. copy `.env.example` to `.env` (it already uses mongodb://localhost:27017/finance)
5. npm run dev

### Frontend
1. cd frontend
2. npm install
3. create `.env` with `VITE_API_BASE=http://localhost:5000/api`
4. npm run dev

The frontend will connect to the backend API for transactions.

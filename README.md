# Expense Tracker – Full Stack Application

A full-stack expense tracking web application that allows users to manage income and expenses, organize categories, and visualize spending patterns using analytics dashboards.

Built with a modern React + Node.js stack and deployed to production.

---

## 🔴 Live Demo

- **Frontend (Vercel):**  
  https://expense-tracker-fullstack-7o6xjl1ur.vercel.app

- **Backend API (Render):**  
  https://expense-tracker-backend-tzhu.onrender.com

---

## ✨ Features

### Authentication & Security
- User registration and login
- JWT-based authentication
- Forgot password & reset password flow
- Change password from dashboard
- Protected backend routes

### Expense Management
- Add, edit, and delete transactions
- Support for income and expenses
- Category-based expense tracking
- Optional notes and transaction dates

### Categories
- Create, rename, and delete categories
- Categories automatically reflected in analytics

### Analytics Dashboard
- Pie chart showing spending by category
- Monthly bar chart showing expense trends
- Color-coded charts for visual clarity
- Year and date-range filtering

### UI / UX
- Clean, professional UI
- Glass-style dashboard card
- Gradient background
- Responsive layout

---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- Chart.js
- Custom CSS + Tailwind base utilities
- Fetch API

### Backend
- Node.js
- Express.js
- Prisma ORM
- SQLite (development & demo)
- JWT Authentication

---

## 📂 Project Structure

expense-tracker/
│
├── frontend/ # React frontend
│ ├── src/
│ └── package.json
│
├── backend/ # Node.js backend
│ ├── prisma/
│ ├── index.js
│ └── package.json
│
├── .gitignore
└── README.md


---

## ⚙️ Local Setup Instructions

### Backend
```bash
cd backend
npm install

Create a .env file in backend/:
JWT_SECRET=your_jwt_secret
DATABASE_URL="file:./dev.db"

Run Prisma migration:
npx prisma migrate dev

Start backend:
npm run dev

Frontend
cd frontend
npm install
npm run dev

Frontend runs on:http://localhost:5173

🔐 API Notes

All protected routes require:
Authorization: Bearer <JWT_TOKEN>

Key endpoints:

POST /api/auth/register

POST /api/auth/login

POST /api/auth/forgot-password

POST /api/auth/reset-password

PUT /api/auth/change-password

CRUD /api/transactions

Analytics /api/analytics/*

🚀 Future Improvements

Monthly budgets & alerts

Recurring transactions

Email-based password reset

PostgreSQL production database

Role-based access control

👩‍💻 Author

Sphoorthi Reddy
Full Stack Developer

📌 Notes

Production and local environments use separate databases.
Users must be registered again in production when using the live app.

This project demonstrates real-world full-stack development, authentication, analytics, and deployment workflows.

---



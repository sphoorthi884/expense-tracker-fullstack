# Expense Tracker – Full Stack Application

A full-stack expense tracking web application that allows users to manage income, expenses, categories, and visualize spending patterns using analytics dashboards.

Built with a modern **React + Vite frontend**, **Node.js + Express backend**, **Prisma ORM**, and deployed to **Vercel** and **Render**.

---

## 🔴 Live Demo

- **Frontend (Vercel):**  
  https://expense-tracker-fullstack-7o6xjl1ur.vercel.app

- **Backend API (Render):**  
  https://expense-tracker-backend-tzhu.onrender.com



---
## 📸 Screenshots

### 📊 Analytics Dashboard
![Analytics Dashboard](./screenshots/expense%20tracker_analytics.png)

---

### 🗂 Categories Management
![Categories Page](./screenshots/expense%20tracker_categories.png)

---

### 🔑 Change Password
![Change Password](./screenshots/expense%20tracker_change%20password.png)

---

### 🔐 Login Page
![Login Page](./screenshots/expense%20tracker_login%20page.png)

---

### 📃 Transactions List
![Transactions Page](./screenshots/expense%20tracker_transaction.png)

---

## ✨ Features

### 🔐 Authentication & Security
- User registration & login  
- JWT-based authentication  
- Forgot password & reset password flow  
- Change password from dashboard  
- Protected backend routes  

### 💸 Expense Management
- Add, edit, and delete transactions  
- Supports **income** & **expenses**  
- Category-linked transactions  
- Optional notes & transaction dates  

### 🗂 Categories
- Create, rename, delete categories  
- Auto-reflected in analytics  

### 📊 Analytics Dashboard
- Pie chart (spending by category)  
- Monthly bar chart (expense trends)  
- Professional color-coded visuals  
- Year & date-range filtering  

### 🎨 UI / UX
- Gradient background  
- Glass-card dashboard design  
- Modern, responsive UI  

---

## 🧰 Tech Stack

### **Frontend**
- React (Vite)
- Chart.js
- Tailwind base utilities
- Custom CSS

### **Backend**
- Node.js
- Express.js
- Prisma ORM
- SQLite (development/demo)
- JWT Authentication

---

## 📂 Project Structure 

expense-tracker/
│
├─ frontend/
│ ├─ src/
│ ├─ package.json
│ └─ vite.config.js
│
├─ backend/
│ ├─ prisma/
│ │ └─ schema.prisma
│ ├─ index.js
│ ├─ routes/
│ ├─ controllers/
│ ├─ package.json
│ └─ .env (local only)
│
├─ .gitignore
└─ README.md


---

## ⚙️ Local Setup Instructions

### **Backend Setup**
```bash
cd backend
npm install

Create a .env file inside /backend:

JWT_SECRET=your_jwt_secret
DATABASE_URL="file:./dev.db"

Run Prisma Migration: 

npx prisma migrate dev

Start backend:

npm run dev

Backend runs at:

http://localhost:4000

🔵 Frontend Setup 
cd frontend
npm install
npm run dev


Frontend will run at:

http://localhost:5173


Keep backend and frontend running in two separate terminals during development.

---

📘 API Notes 

All protected routes require:

Authorization: Bearer <JWT_TOKEN>

Key Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

POST /api/auth/forgot-password

POST /api/auth/reset-password

PUT /api/auth/change-password

Transactions

GET /api/transactions

POST /api/transactions

PUT /api/transactions/:id

DELETE /api/transactions/:id

Analytics

/api/analytics/sum-by-category

/api/analytics/monthly-summary

---

🚀 Future Improvements 

Monthly budgets & alerts

Recurring transactions

Email-based password reset with provider (SendGrid/SMTP)

PostgreSQL for production

Role-based access control

Export transactions to CSV

---

👩‍💻 Author 

Sphoorthi Reddy
Full Stack Developer

---

📌 Notes

Production & local environments use different SQLite databases.

You must register a new user on the deployed site before login.

This project demonstrates modern full-stack development with deployment, authentication workflows, analytics, and database ORM.

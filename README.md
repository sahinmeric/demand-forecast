# 📘 Demand Forecasting App

## 🧠 Project Overview

A full-stack demand forecasting app that allows users to:

- Upload sales data (CSV/XLSX)
- Map and validate fields
- Save cleaned data to a database
- Generate and view forecasts per SKU
- Visualize predictions on interactive charts
- Manage users and configurations (admin only)

Built with:

- **Frontend**: React + TypeScript + MUI + Vite
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Auth**: JWT-based login/logout with refresh tokens
- **Deployment**: Docker + Railway
- **CI/CD**: Manual builds via Railway

---

## 🚀 Features

### ✅ User Functionality

- Register/Login with JWT-based auth
- Upload & preview sales files
- Map columns to required fields
- Validate and clean data row-by-row
- Save to database only when valid
- Generate forecasts for:
  - All SKUs
  - A specific SKU (on-demand)
- View forecasts:
  - Tabular format
  - Filter by SKU, data quality, pagination
  - Interactive chart per SKU

### 🔐 Admin Functionality

- View all users
- Delete non-admin users
- View user roles
- Future: manage user-specific configurations

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js v20+
- Docker & Docker Compose
- Railway account (for deployment)

### 1. Clone the Repo

```bash
git clone https://github.com/sahinmeric/demand-forecast.git
cd demand-forecast
```

### 2. Local `.env` setup

Create `backend/.env.dev` and `frontend/.env.dev` based on `.env.example`. Example backend env:

```env.dev
PORT=3000
DATABASE_URL=postgres://forecast_user:forecast_pass@postgres:5432/forecastdb
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=8h
REFRESH_TOKEN_EXPIRES_IN=7d
```

Frontend:

```env.dev
VITE_API_URL=http://localhost:3000
```

### 3. Start App Locally

```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## 🧪 Test User Credentials

Use the seeded admin:

```bash
Email: admin@test.com
Password: password123
```

---

## 🐳 Production Deployment (Railway)

This app is fully containerized.

1. Create 3 services on Railway:

   - **PostgreSQL**
   - **Backend**
   - **Frontend**

2. Use `docker-compose.prod.yml` and `Dockerfile` for backend + frontend builds.

3. Set environment variables:

   - `VITE_API_URL=https://your-backend-service-name.up.railway.app` (frontend)
   - Database credentials (backend)

4. Railway automatically builds & deploys on push.

---

## 🧩 Project Structure

```
├── backend
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── .env.dev
├── frontend
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.dev
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

---

## 📌 Future Improvements

- Server-side pagination and filters
- Per-user configuration controls
- ML-based forecast model swapping
- Scheduled re-training of forecasts
- Notification settings (alerts, warnings)

---

## 🎨 Frontend Project Structure & Architecture

The frontend is a well-structured, modular React + TypeScript application built with **Vite** and **Material UI (MUI)**. It prioritizes type safety, code reuse, responsive design, and maintainability.

### 🗂️ Folder Overview

```
frontend/
├── src/
│   ├── components/          # Reusable UI components (Loader, Snackbar, ConfirmDialog, etc.)
│   ├── hooks/               # Custom hooks (useLogin, useForecasts, useSaveCleanData, etc.)
│   ├── pages/               # Top-level route views (Login, UploadPage, ForecastPage, AdminPage)
│   ├── utils/               # Validation, filtering, formatting utilities
│   ├── context/             # Global providers (SnackbarContext, ConfirmDialogContext)
│   ├── types/               # Centralized TypeScript interfaces
│   ├── auth.ts              # Auth helpers (token management, role checks)
│   ├── App.tsx              # Main router and layout
│   └── main.tsx             # App bootstrap
```

### 💡 Architecture Highlights

#### ✅ Custom Hooks

Encapsulate API logic (auth, forecasting, saving data) to keep components clean.

#### ✅ Global Contexts

- **SnackbarContext**: Feedback system for success/error messages.
- **ConfirmDialogContext**: Replaces `window.confirm` with MUI-based modal.

#### ✅ Type Safety

All shared data models are fully typed, enabling better dev experience and avoiding runtime issues.

#### ✅ Responsive Design

Built using Material UI’s grid system and `Box`, all views adapt to mobile and desktop.

#### ✅ Code Splitting Ready

With Vite pages can be dynamically loaded to reduce bundle size.

---

## 🛠️ Backend Project Structure & Architecture

The backend is a Node.js + Express API using **Prisma ORM** and JWT-based authentication. It connects to a **PostgreSQL** database and exposes RESTful endpoints for auth, file uploads, forecasting, and admin features.

### 🗂️ Folder Overview

```
backend/
├── prisma/                  # Prisma schema and migration config
│   └── seed.js              # Seed script for admin user, config, and test data
├── src/
│   ├── controllers/         # Route logic: auth, forecast, upload, user
│   ├── middleware/          # Auth & role-check middlewares
│   ├── routes/              # Route definitions (auth, forecast, admin, upload)
│   ├── services/            # Forecasting and token utilities
│   ├── utils/               # CSV parsing, validation helpers (if added)
│   └── index.js             # Express app bootstrap
```

### 🔐 Authentication & Security

- JWT access and refresh token system
- Role-based route protection via `authMiddleware` and `isAdmin`
- Secrets and expiration via `.env`

### 🧠 Forecasting Logic

- Sales data processed by statistical model
- Forecasts saved with base, upper, lower bounds
- Confidence intervals and quality scores computed

### 🔄 File Upload Pipeline

- User uploads CSV/XLSX → preview → map fields → validate → save
- Async validation with inline editing before DB save

### 🧪 Testing & Seeding

- `seed.js` inserts admin + demo data
- Prisma handles schema migration
- Docker-based local dev and production configs available

## ✍️ License

MIT — use freely with attribution

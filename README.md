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

```env
PORT=3000
DATABASE_URL=postgres://forecast_user:forecast_pass@postgres:5432/forecastdb
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=8h
REFRESH_TOKEN_EXPIRES_IN=7d
```

Frontend:

```env
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

## ✍️ License

MIT — use freely with attribution

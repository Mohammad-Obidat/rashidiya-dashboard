# Rashidiya Dashboard

## 📌 Overview
Rashidiya Dashboard is a fullstack web application built with:
- **Frontend**: React + Vite@6.5.0 + TailwindCSS + TypeScript  
- **Backend**: NestJS + Prisma + PostgreSQL + TypeScript  

The project is structured to ensure scalability, modularity, and ease of development.

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 18  
- ⚡ Vite 6.5.0  
- 🎨 TailwindCSS  
- 📝 TypeScript  

### Backend
- 🚀 NestJS  
- 🗂️ Prisma  
- 🐘 PostgreSQL  
- 📝 TypeScript  

---

## 📂 Project Structure
```
rashidiya-dashboard/
│── frontend/     # React + Vite + Tailwind + TS
│── backend/      # NestJS + Prisma + PostgreSQL
│── docker/       # Docker configs (optional)
│── README.md     # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/Mohammad-Obidat/rashidiya-dashboard.git
cd rashidiya-dashboard
```

---

### 2. Backend Setup (NestJS + Prisma + PostgreSQL)

#### Install dependencies
```bash
cd backend
npm install
```

#### Configure environment
Create a `.env` file inside `backend/`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/yourdb?schema=public"
PORT=5000
```

#### Run migrations
```bash
npx prisma migrate dev
```

#### Start backend
```bash
npm run start:dev
```
Backend runs on **http://localhost:3000**

---

### 3. Frontend Setup (React + Vite + Tailwind + TS)

#### Install dependencies
```bash
cd frontend
npm install
```

#### Configure environment
Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

#### Start frontend
```bash
npm run dev
```
Frontend runs on **http://localhost:5173**

---

## 🐳 Docker Setup (Optional)
You can run both frontend & backend using Docker.

```bash
docker-compose up --build
```

---

## 📜 Scripts

### Backend
- `npm run start:dev` → Run backend in dev mode  
- `npm run build` → Build backend  
- `npx prisma studio` → Open Prisma Studio (DB GUI)  

### Frontend
- `npm run dev` → Run frontend in dev mode  
- `npm run build` → Build frontend  
- `npm run preview` → Preview production build  

---

## ✅ Features
- Fullstack TypeScript  
- API with NestJS (REST/GraphQL ready)  
- Database with Prisma ORM  
- PostgreSQL for relational data storage  
- Vite + Tailwind for fast frontend development  
- Environment variable support  

---

## 🚀 Deployment
- **Frontend**: Deploy to Vercel, Netlify, or static hosting.  
- **Backend**: Deploy to Heroku, Railway, AWS, or Docker containers.  
- **Database**: Use managed PostgreSQL (e.g., Supabase, Railway, Neon).  

---

## 🤝 Contributing
1. Fork the repo  
2. Create a new branch (`feature/your-feature`)  
3. Commit changes  
4. Push and create a Pull Request  

---

## 📄 License
This project is licensed under the **MIT License**.

# Priyanshu Sarjan — Dynamic Full-Stack Portfolio & Admin CMS

A production-grade, full-stack personal portfolio and Content Management System (CMS) featuring JWT authentication, work experience management, asset/certificate uploads, and a dynamic PDF resume export engine with 1-Page Modern and Multi-Page Booklet templates.

---

## 🌟 Key Features

### 1. Public Portfolio (`/`)
- **Interactive Experience Timeline**: Displays work history, internships, roles, and tech stack tags.
- **Project Showcase**: Filterable portfolio projects with live demo and GitHub repository links.
- **Categorized Technical Arsenal**: Proficiency levels for Languages, Web Dev, Web3/Blockchain, and DSA.
- **Certifications & Competitions**: Highlighted credentials and hackathon accomplishments.
- **Media Gallery**: High-resolution gallery images and event photos.

### 2. Admin CMS Dashboard (`/admin`)
- **JWT Admin Authentication (`/admin/login`)**: Protected authentication flow with secure password hashing (`bcryptjs`).
- **Experience Manager (`/admin/experience`)**: Add, edit, reorder, and remove work history entries.
- **Asset & Certificate Manager (`/admin/assets`)**: Upload PDF certificates and image assets (up to 15MB) with thumbnail previews, direct URL copying, and file deletion.
- **Content Editors**: Dedicated management pages for Projects, Skills, Certifications, Competitions, Events/Tasks, and Status.

### 3. Dynamic PDF Export Engine (`/resume`)
- **Template 1: 1-Page Modern Resume**: High-density single-page resume layout strictly optimized to fit on 1 standard page.
- **Template 2: Multi-Page Detailed CV Booklet**: Comprehensive multi-page report format with full project dossier, chronological timeline, verified credentials, and skill matrix.
- **One-Click Export**: Live template switcher and browser print/PDF export capabilities.

---

## 🛠️ Architecture & Tech Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion + Lucide Icons
- **Backend API**: Express 5 REST API + Pino Logger + Multer + Cookie Parser
- **Database & ORM**: PostgreSQL / SQLite + Drizzle ORM + Zod Validation
- **Auth**: JWT (JSON Web Tokens) + Bcrypt Password Hashing

---

## 🚀 Local Development Setup

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/priyanshu-sarjan/Priyanshu_Portfolio.git
   cd Priyanshu_Portfolio
   npx pnpm install
   ```

2. **Environment Configuration**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USER`, and `ADMIN_PASSWORD`.

3. **Seed Database**:
   ```bash
   npx pnpm --filter @workspace/scripts run seed
   ```

4. **Run Development Servers**:
   ```bash
   # Start API Server
   npx pnpm --filter @workspace/api-server run dev

   # Start Frontend
   npx pnpm --filter @workspace/portfolio run dev
   ```

---

## 🌐 Deploying to Vercel

1. **Vercel Settings**:
   - Set **Build Command**: `pnpm --filter @workspace/portfolio build`
   - Set **Output Directory**: `artifacts/portfolio/dist/public`

2. **Deployment Protection**:
   If visiting the Vercel URL prompts for Vercel Login, navigate to:
   **Project Settings** → **Deployment Protection** → Disable **Vercel Authentication**.

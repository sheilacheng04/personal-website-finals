# My Aquarium

A full-stack personal portfolio with an immersive underwater-aquarium theme, built with **React**, **NestJS**, and **Supabase**, deployed on **Vercel**.

---

## Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Frontend     | React 18, Vite 6, GSAP 3, Three.js, WebGL/GLSL        |
| Backend      | NestJS 10, TypeScript 5, Express                        |
| Database     | Supabase (PostgreSQL)                                   |
| Deployment   | Vercel (static build + serverless functions)            |

---

## Features

- **3D Aquarium Scene** — Three.js ocean with bubbles, jellyfish, caustic floor, god-rays, and floating glass gems
- **Glassmorphism UI** — Blur filters, specular highlights, glow shadows, and SVG refraction
- **Buoyant Navigation** — GSAP-animated floating circles with magnetic cursor pull
- **Caustics Shader** — WebGL GLSL fragment shader for animated underwater light patterns
- **Dynamic Theme Hue** — Real-time color scheme slider (CSS variables + Three.js lights)
- **Deep Dive Transitions** — Zoom-forward + blur effects between pages
- **Interactive Particles** — Mouse-tracking particle effects
- **Feedback Aquarium** — Submitted feedback animates as floating elements in the scene
- **Project Showcase & Gallery** — Modal project cards and poster lightbox
- **Custom Cursor** — Circular cursor with hover/grab states
- **Responsive Design** — Mobile-friendly with sidebar and overlay menu
- **REST API** — Feedback collection and project data via NestJS + Supabase

---

## Getting Started

### Prerequisites

- **Node.js** v16+ and **npm** v8+
- A **Supabase** project

### Install & Run

```bash
git clone <repository-url>
cd personal-website-finals
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Environment Variables

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-key
NODE_ENV=development
```

---

## API Endpoints

| Method | Path                | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api`              | API info                 |
| GET    | `/api/health`       | Health check             |
| GET    | `/api/feedback`     | List all feedback        |
| POST   | `/api/feedback`     | Submit feedback          |
| GET    | `/api/projects`     | List all projects        |
| GET    | `/api/projects/:id` | Get project by ID        |

---

## Deployment (Vercel)

1. Import the repo on [vercel.com](https://vercel.com)
2. Add env variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`
3. Deploy — Vercel auto-detects the monorepo (`frontend/` as static, `backend/api/` as serverless)

---

© 2026 Sheila. All rights reserved.

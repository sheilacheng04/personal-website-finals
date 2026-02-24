# Sheila's Interactive Personal Portfolio

A full-stack personal portfolio website built with **React** and **NestJS**, featuring an immersive underwater-aquarium theme with glassmorphism UI, interactive 3D scenes, dynamic theme customization, feedback collection, and project showcase. Deployed on **Vercel**.

---

## Features

### Frontend
- **Aquarium-Glassmorphism Theme** — Underwater-inspired UI with glass-bubble navigation, caustic light shaders, and particle effects
- **3D Aquarium Scene** — Full-screen Three.js environment with bubbles, bioluminescent jellyfish, plankton, seaweed, caustic floor, god-rays, and floating glass gems
- **GSAP Buoyant Physics** — Navigation circles float with randomized bobbing and magnetic cursor pull with elastic snap-back
- **Advanced Glassmorphism** — `backdrop-filter: blur()`, specular highlights, soft glow shadows, and SVG barrel-distortion refraction
- **Deep Dive Transitions** — GSAP-driven zoom-forward + blur effect when navigating between pages
- **Caustics Shader** — WebGL GLSL fragment shader rendering animated underwater light patterns
- **Dynamic Theme Hue** — Color slider lets users change the entire site's color scheme in real-time (CSS variables + Three.js lights update together)
- **Interactive Particles** — Custom mouse-tracking particle effects across the content page
- **Water Ripple Effect** — Ripple animations on the home page
- **Smooth Page Transitions** — Seamless animated navigation between pages
- **Custom Cursor** — Circular cursor with hover and grab states
- **Responsive Design** — Mobile-friendly layout with sidebar navigation
- **Photobooth Link** — Quick access button to an external photobooth app
- **Feedback Form** — Collects name and message; submissions animate as floating elements in the feedback aquarium
- **Gallery** — Poster lightbox and project modal showcase
- **Contact Links** — LinkedIn, GitHub, and email with the theme color picker

### Backend
- **RESTful API** — NestJS framework with Express adapter
- **Feedback Management** — Collect and store user feedback via Supabase
- **Projects API** — Dynamic project data retrieval
- **Health Monitoring** — System health check endpoint
- **Data Validation** — DTO-based validation using class-validator
- **Vercel Serverless** — Deployed as serverless functions

### Database
- **Supabase (PostgreSQL)** — Feedback and project storage with real-time capabilities
- **API Key Authentication** — Secure access via Supabase anon/service keys

---

## Tech Stack

| Layer          | Technology                                                  |
|----------------|-------------------------------------------------------------|
| **Frontend**   | React 18, React Router v6, Vite 6, GSAP 3, Three.js, WebGL/GLSL |
| **Backend**    | NestJS 10, TypeScript 5, Express                            |
| **Database**   | Supabase (PostgreSQL)                                       |
| **Styling**    | Custom CSS with glassmorphism, CSS variables for theming    |
| **Deployment** | Vercel (static build + serverless functions)                |
| **Monorepo**   | npm workspaces                                              |

---

## Project Structure

```
personal-website-finals/
│
├── frontend/                       # React frontend (Vite)
│   ├── index.html                  # HTML entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json                 # SPA fallback rewrites
│   ├── public/
│   │   └── assets/                 # Static images & icons
│   │       ├── common/
│   │       ├── home/
│   │       ├── logo/
│   │       ├── posters/
│   │       └── profile/
│   └── src/
│       ├── App.jsx                 # Root component with routing
│       ├── main.jsx                # React entry point
│       ├── pages/
│       │   ├── HomePage.jsx        # Landing page with ripple effects
│       │   ├── ContentPage.jsx     # Main content/portfolio page
│       │   └── ResourcesPage.jsx   # Resources & links
│       ├── components/
│       │   ├── CustomCursor.jsx    # Custom circular cursor
│       │   ├── PageTransition.jsx  # Animated route transitions
│       │   ├── aquarium/           # Aquarium-glass modules
│       │   │   ├── BuoyantCircles.jsx        # GSAP bobbing + magnetic pull
│       │   │   ├── CausticsCanvas.jsx        # WebGL caustic light shader
│       │   │   ├── DeepDiveTransition.jsx    # Zoom-blur page transition
│       │   │   └── GlassRefractionFilter.jsx # SVG refraction filter
│       │   └── content/            # Content page components
│       │       ├── AquariumScene.jsx      # Three.js 3D ocean environment
│       │       ├── BackToTop.jsx          # Scroll-to-top button
│       │       ├── ContactLinks.jsx       # Contact icons + theme picker
│       │       ├── ContentParticles.jsx   # Mouse-tracking particles
│       │       ├── CreditsFooter.jsx      # Footer credits
│       │       ├── FeedbackAquarium.jsx   # Animated feedback display
│       │       ├── FeedbackForm.jsx       # Feedback submission form
│       │       ├── FixedHeader.jsx        # Navigation header
│       │       ├── OverlayMenu.jsx        # Mobile overlay menu
│       │       ├── PosterGallery.jsx      # Poster lightbox gallery
│       │       ├── ProfileSection.jsx     # Profile/bio + links grid
│       │       └── ProjectsSection.jsx    # Project cards showcase
│       ├── services/
│       │   ├── api.js              # Backend API client
│       │   └── supabaseClient.js   # Supabase SDK config
│       └── styles/
│           ├── base.css            # Global styles, sidebar, cursor
│           ├── home.css            # Home page styles
│           ├── content.css         # Content page styles
│           ├── resources.css       # Resources page styles
│           └── aquarium-glass.css  # Glass circles + deep-dive overlay
│
├── backend/                        # NestJS backend
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.vercel.json        # TypeScript config for Vercel build
│   ├── api/
│   │   └── main.ts                 # Vercel serverless entry point
│   └── src/
│       ├── main.ts                 # Local dev entry point
│       ├── app.module.ts           # Root module
│       ├── app.controller.ts       # Root API controller
│       ├── health.controller.ts    # Health check endpoint
│       ├── feedback/
│       │   ├── feedback.module.ts
│       │   ├── feedback.controller.ts
│       │   ├── feedback.service.ts
│       │   └── dto/
│       │       └── create-feedback.dto.ts
│       ├── projects/
│       │   ├── projects.module.ts
│       │   ├── projects.controller.ts
│       │   └── projects.service.ts
│       └── supabase/
│           ├── supabase.module.ts
│           └── supabase.service.ts
│
├── package.json                    # Root monorepo config (npm workspaces)
├── vercel.json                     # Vercel deployment routing
├── .env.example                    # Environment variable template
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v16+ and **npm** v8+
- A **Supabase** project (free tier works)

### Installation

```bash
git clone <repository-url>
cd personal-website-finals
npm install
```

npm workspaces will install dependencies for both `frontend/` and `backend/`.

### Environment Variables

Copy `.env.example` and fill in your values:

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

### Supabase Setup

Create the following tables in your Supabase project:

```sql
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link VARCHAR(500),
  technologies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Development

### Run Both (Recommended)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Run Individually

```bash
npm run dev:frontend    # Vite dev server on :5173
npm run dev:backend     # NestJS watch mode on :3001
```

---

## Production Build

```bash
npm run build           # Builds both frontend and backend
npm run build:frontend  # Vite build → frontend/dist/
npm run build:backend   # NestJS build → backend/dist/
```

---

## Deployment (Vercel)

The root `vercel.json` configures:
- `frontend/` → static build via `@vercel/static-build`
- `backend/api/main.ts` → serverless function via `@vercel/node`
- `/api/*` requests route to the backend; everything else serves the frontend

### Steps

1. Import the repository on [vercel.com](https://vercel.com)
2. Add environment variables in Project Settings:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`
   - `SUPABASE_URL`, `SUPABASE_KEY`
3. Deploy — Vercel auto-detects the monorepo structure

---

## API Endpoints

| Method | Path             | Description                    |
|--------|------------------|--------------------------------|
| GET    | `/api`           | API info and available routes  |
| GET    | `/api/health`    | Health check                   |
| GET    | `/api/feedback`  | List all feedback              |
| POST   | `/api/feedback`  | Submit feedback (`name`, `message`) |
| GET    | `/api/projects`  | List all projects              |
| GET    | `/api/projects/:id` | Get project by ID           |

---

## License

This project is private and personal. All rights reserved. © 2026 Sheila.

---

**Last Updated**: February 24, 2026

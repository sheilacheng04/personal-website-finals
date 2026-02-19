# Sheila's Interactive Personal Portfolio

A modern, full-stack personal portfolio website built with React and NestJS, featuring interactive animations, project showcase, feedback collection, and more. Deployed on Vercel for optimal performance and scalability.

## 🌟 Features

### Frontend
- **Aquarium-Glassmorphism Theme**: Immersive underwater-inspired UI with glass-bubble navigation
- **GSAP Buoyant Physics**: Navigation circles float with randomized vertical bobbing and subtle z-axis rotation; magnetic cursor pull with elastic snap-back (Task 1)
- **Advanced Glassmorphism**: `backdrop-filter: blur(12px)`, specular highlights, soft blue glow shadows, inner curvature rings, and SVG barrel-distortion refraction filter (Task 2)
- **Deep Dive Transitions**: Clicking a nav circle triggers a GSAP-driven zoom-forward + blur effect, simulating a camera diving into the bubble (Task 3)
- **Caustics Shader**: WebGL GLSL fragment shader rendering animated underwater light rays across the background (Task 4)
- **Interactive Animations**: Custom particle effects with mouse tracking
- **Water Ripple Effect**: jQuery-based ripple animations on custom elements
- **Smooth Page Transitions**: Seamless navigation between pages
- **Custom Cursor**: Enhanced user experience with custom cursor styling
- **Responsive Design**: Mobile-friendly layout with modern CSS styling
- **Multi-page Application**: Home, Content, and Resources pages
- **Gallery**: Poster and project galleries for visual content showcase
- **Feedback Form**: Integrated feedback collection system
- **Contact Links**: Easy access to social/contact information

### Backend
- **RESTful API**: Express-style routing with NestJS framework
- **Feedback Management**: Collect and store user feedback via Supabase
- **Projects API**: Dynamic project data retrieval
- **Health Monitoring**: System health check endpoints
- **Data Validation**: DTO-based validation using class-validator

### Database
- **Supabase Integration**: PostgreSQL-backed database with real-time capabilities
- **Feedback Storage**: Persistent storage for user feedback and submissions
- **Secure Authentication**: API key-based authentication

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Routing**: React Router v6
- **Build Tool**: Vite 6.0.0
- **Animation**: GSAP 3.12.x (GreenSock)
- **Graphics**: WebGL / GLSL Shaders
- **Database Client**: Supabase JS SDK
- **Styling**: Custom CSS with animations & glassmorphism

### Backend
- **Framework**: NestJS 10.4.7
- **Language**: TypeScript 5.6.3
- **ORM/Database**: Supabase
- **Validation**: class-validator & class-transformer
- **Runtime**: Node.js

### Infrastructure
- **Deployment**: Vercel
- **Database**: Supabase (PostgreSQL)
- **CDN**: Vercel Edge Network
- **Build System**: Monorepo with npm workspaces

### Dependencies
- **gsap**: 3.12.x (Buoyant physics, magnetic pull, deep-dive transitions)
- **jquery.ripples**: 0.6.3 (Ripple effect animations)
- **@supabase/supabase-js**: 2.47.0
- **reflect-metadata**: 0.2.2
- **rxjs**: 7.8.1

## 📁 Project Structure

```
personal-website-finals/
├── frontend/                          # React frontend application
│   ├── src/
│   │   ├── App.jsx                   # Main app component with routing
│   │   ├── main.jsx                  # React entry point
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Home page with animations
│   │   │   ├── ContentPage.jsx       # Content/about page
│   │   │   └── ResourcesPage.jsx     # Resources page
│   │   ├── components/
│   │   │   ├── CustomCursor.jsx      # Custom cursor component
│   │   │   ├── PageTransition.jsx    # Page transition effects
│   │   │   ├── aquarium/             # Aquarium-Glassmorphism modules
│   │   │   │   ├── BuoyantCircles.jsx    # GSAP bobbing + magnetic pull
│   │   │   │   ├── CausticsCanvas.jsx    # WebGL caustic shader
│   │   │   │   ├── DeepDiveTransition.jsx # Zoom-blur page transition
│   │   │   │   └── GlassRefractionFilter.jsx # SVG refraction filter
│   │   │   └── content/              # Content components
│   │   │       ├── BackToTop.jsx     # Back to top button
│   │   │       ├── ContactLinks.jsx  # Social/contact links
│   │   │       ├── ContentParticles.jsx
│   │   │       ├── CreditsFooter.jsx
│   │   │       ├── FeedbackAquarium.jsx  # Animated feedback display
│   │   │       ├── FeedbackForm.jsx     # Feedback submission form
│   │   │       ├── FixedHeader.jsx      # Navigation header
│   │   │       ├── OverlayMenu.jsx      # Mobile/overlay menu
│   │   │       ├── PosterGallery.jsx    # Poster gallery display
│   │   │       ├── ProfileSection.jsx   # Profile information
│   │   │       └── ProjectsSection.jsx  # Projects showcase
│   │   ├── services/
│   │   │   ├── api.js                # API client wrapper
│   │   │   └── supabaseClient.js     # Supabase configuration
│   │   ├── styles/
│   │   │   ├── base.css              # Base/global styles
│   │   │   ├── home.css              # Home page styles
│   │   │   ├── content.css           # Content page styles
│   │   │   ├── resources.css         # Resources page styles
│   │   │   └── aquarium-glass.css    # Glassmorphism + deep-dive styles
│   │   └── public/
│   │       └── assets/               # Static assets
│   │           ├── common/
│   │           ├── home/
│   │           ├── logo/
│   │           ├── posters/
│   │           └── profile/
│   ├── vite.config.js                # Vite configuration
│   ├── vercel.json                   # Vercel deployment config
│   ├── package.json                  # Frontend dependencies
│   └── index.html                    # HTML entry point
│
├── backend/                           # NestJS backend application
│   ├── src/
│   │   ├── app.controller.ts         # Root API controller
│   │   ├── app.module.ts             # App module definition
│   │   ├── health.controller.ts      # Health check endpoint
│   │   ├── main.ts                   # Backend entry point
│   │   ├── feedback/                 # Feedback module
│   │   │   ├── feedback.controller.ts
│   │   │   ├── feedback.service.ts
│   │   │   ├── feedback.module.ts
│   │   │   └── dto/
│   │   │       └── create-feedback.dto.ts
│   │   ├── projects/                 # Projects module
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.service.ts
│   │   │   └── projects.module.ts
│   │   └── supabase/                 # Supabase integration
│   │       ├── supabase.module.ts
│   │       └── supabase.service.ts
│   ├── api/
│   │   └── main.ts                   # Vercel serverless entry
│   ├── nest-cli.json                 # NestJS CLI config
│   ├── tsconfig.json                 # TypeScript config
│   ├── tsconfig.vercel.json          # Vercel TypeScript config
│   ├── package.json                  # Backend dependencies
│   └── vercel.json                   # Backend Vercel config
│
├── package.json                       # Root monorepo config
├── vercel.json                        # Root Vercel deployment config
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **Git**: For cloning the repository
- **Supabase Account**: For database and backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-website-finals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install dependencies for both frontend and backend using npm workspaces.

3. **Set up environment variables**

   Create a `.env.local` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

   Create a `.env` file in the `backend/` directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   NODE_ENV=development
   ```

4. **Configure Supabase Database**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Create required tables (feedback, projects, etc.)
   - Get your URL and API keys from the Supabase dashboard

## 💻 Development

### Running the Development Server

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Running Only Frontend
```bash
npm run dev:frontend
```
- Runs on http://localhost:5173
- API proxied to http://localhost:3001

### Running Only Backend
```bash
npm run dev:backend
```
- Runs on http://localhost:3001
- Watch mode enabled for auto-reloading

## 🏗️ Building for Production

### Build Both Frontend and Backend
```bash
npm run build
```

### Build Frontend Only
```bash
npm run build:frontend
```
- Creates optimized build in `frontend/dist/`

### Build Backend Only
```bash
npm run build:backend
```
- Creates compiled JavaScript in `backend/dist/`

## 📦 Production Deployment

### Using Vercel (Recommended)

The project is configured for Vercel deployment with the root `vercel.json`:

```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "backend/api/main.ts",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/backend/api/main" },
    { "source": "/(.*)", "destination": "/frontend/$1" }
  ]
}
```

### Deploy Steps:

1. **Connect Repository to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub/GitLab repository
   - Vercel will auto-detect the monorepo structure

2. **Configure Environment Variables**
   - In Vercel Project Settings → Environment Variables
   - Add all required variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_KEY`

3. **Deploy**
   - Push to main branch or manually trigger deploy
   - Vercel will automatically build both frontend and backend
   - API endpoints available at your-domain.vercel.app/api/*

### Alternative Deployment Methods

**Docker Deployment:**
```bash
# Build Docker image
docker build -t sheila-portfolio .

# Run container
docker run -p 3000:3000 sheila-portfolio
```

**Standalone Backend (Node):**
```bash
npm run build:backend
npm run start  # Runs backend in production mode
```

## 🔌 API Documentation

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.vercel.app/api`

### Endpoints

#### Root
```
GET /
```
Returns API information and available endpoints.
```json
{
  "message": "Backend is working! 🎉",
  "timestamp": "2026-02-18T12:00:00.000Z",
  "endpoints": {
    "health": "/api/health",
    "feedback": "/api/feedback",
    "projects": "/api/projects"
  }
}
```

#### Health Check
```
GET /health
```
Returns system health status.

#### Feedback Endpoints
```
GET /feedback
```
Retrieves all feedback submissions.

```
POST /feedback
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "message": "string",
  "rating": "number (optional)"
}
```
Creates a new feedback submission.

#### Projects Endpoints
```
GET /projects
```
Retrieves all projects.

```
GET /projects/:id
```
Retrieves a specific project by ID.

## 🗄️ Database Schema

### Feedback Table
```sql
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link VARCHAR(500),
  technologies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Environment Variables

### Frontend Variables (`frontend/.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_KEY` | Supabase anonymous key | `(anon key from dashboard)` |

### Backend Variables (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_KEY` | Supabase service key | `(service key from dashboard)` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 🎨 Frontend Components Overview

### Core Components
- **CustomCursor**: Renders custom cursor with tracking effects
- **PageTransition**: Handles smooth transitions between routes
- **FixedHeader**: Navigation header with menu
- **OverlayMenu**: Mobile-responsive navigation menu
- **CreditsFooter**: Footer with credits and links

### Aquarium-Glassmorphism Modules (`components/aquarium/`)
- **BuoyantCircles** (`useBuoyantCircles` hook): GSAP timelines for random y-axis bobbing + z-axis rotation; magnetic cursor-follow with `elastic.out` snap-back
- **CausticsCanvas**: WebGL full-screen quad with GLSL fragment shader rendering animated caustic light patterns (layered sine-wave interference)
- **DeepDiveTransition** (`useDeepDiveTransition` hook): GSAP-driven scale-up + blur + overlay fade that simulates diving into a bubble on circle click
- **GlassRefractionFilter**: Hidden SVG `<filter>` using `feTurbulence` + `feDisplacementMap` for barrel-distortion refraction through the glass circles

### Content Components
- **FeedbackForm**: Collects user feedback submissions
- **FeedbackAquarium**: Displays feedback with aquarium-like animation
- **PosterGallery**: Grid gallery for poster/image display
- **ProjectsSection**: Showcases portfolio projects
- **ProfileSection**: Displays profile/bio information
- **ContactLinks**: Social media and contact links
- **ContentParticles**: Particle effect animations
- **BackToTop**: Scroll-to-top button

### Pages
- **HomePage** (`/`): Landing page with water particle effects and ripple interactions
- **ContentPage** (`/content`): About/content page with detailed information
- **ResourcesPage** (`/resources`): Resources and links page

## 📊 Performance Optimizations

- **Code Splitting**: React Router lazy loading for page components
- **Asset Optimization**: Vite build optimizations with minification
- **Caching**: Supabase query caching and client-side state management
- **Image Optimization**: Vercel Image Optimization for responsive images
- **Edge Functions**: Vercel Edge Runtime for API routes (optional)

## 🧪 Testing

(Add your testing setup here)

## 🐛 Troubleshooting

### Common Issues

**Issue**: Backend API not responding
- **Solution**: Ensure backend is running on port 3001
- Check Vite proxy configuration in `vite.config.js`

**Issue**: Supabase connection errors
- **Solution**: Verify environment variables are correctly set
- Check Supabase project is active and keys are valid

**Issue**: Port 5173 or 3001 already in use
- **Solution**: Change port in `vite.config.js` or NestJS configuration
- Or kill existing process: `lsof -ti:5173 | xargs kill -9`

**Issue**: Build fails on Vercel
- **Solution**: Clear build cache in Vercel project settings
- Ensure all environment variables are set
- Check TypeScript compilation errors

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📝 License

This project is private and personal. All rights reserved. © 2026 Sheila.

## 📧 Contact

For questions or feedback about this project, please reach out through the contact links on the website or via the feedback form.

---

**Last Updated**: February 18, 2026

**Project Status**: Active Development

**Version**: 1.0.0

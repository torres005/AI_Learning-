# 🚀 Smart Learning Adventure

> **A Gamified, Role-Based Artificial Intelligence Learning Ecosystem for Kids (Ages 5–16)**

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Hono.js](https://img.shields.io/badge/Hono-4.8-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11.8-2596BE?logo=trpc&logoColor=white)](https://trpc.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 📸 Platform Screenshots

### 🌟 Interactive Landing Page & Curriculum Overview
![Smart Learning Adventure Landing Page](./public/screenshot-landing-full.png)

### 🔐 Multi-Role Authentication & Adventure Paths
<p align="center">
  <img src="./public/screenshot-login.png" width="48%" alt="Login Portal" />
  <img src="./public/register-screenshot.png" width="48%" alt="Role Selection Register" />
</p>

---

## 🎯 1. Why This Website Was Made

In the modern digital era, children interact with artificial intelligence every day—through voice assistants, video recommendation algorithms, smart games, and educational chatbots. However, most children are purely **passive consumers** of these technologies without understanding the underlying concepts, ethics, and logic behind how machines learn.

Traditional computer science resources are frequently dry, heavily math-intensive, or designed strictly for university students and adults. **Smart Learning Adventure** was created to bridge this educational gap by:
1. **Transforming Complex AI into Play:** Turning abstract concepts like neural networks, training data, algorithmic bias, and prompt engineering into gamified adventures, interactive sorting games, and cartoon-guided lessons.
2. **Promoting Safe, Age-Appropriate AI Literacy:** Teaching children to critically evaluate AI outputs, recognize "deepfakes", and use AI as an intellectual multiplier rather than a shortcut.
3. **Connecting the Entire Support Network:** Uniting **Students**, **Parents**, and **Teachers** under a single shared ecosystem to foster collaborative, guided learning.

---

## 💡 2. Purpose of the Platform

The purpose of Smart Learning Adventure is to serve as an all-in-one educational platform offering personalized, multi-perspective dashboards:

### 🎒 For Students (Ages 5–16)
* **Age-Tailored Learning Tracks:**
  * **Ages 5–8 (Interactive Explorers):** Introductory logic, pattern recognition, robot friends, and cartoon-assisted machine learning.
  * **Ages 8–12 (Code Builders):** Chatbot creation, prompt engineering, Scratch integrations, classifier models, and digital ethics.
  * **Ages 12–16 (Future AI Creators):** Python programming, neural networks, natural language processing (NLP), computer vision, and AI fairness.
* **Gamification & Rewards:** Earn XP points, maintain daily learning streaks, unlock achievement badges, and level up.
* **Interactive AI Study Companion:** An integrated AI Tutor tailored to answer student queries, explain complex code, and provide encouraging hints.
* **Curated Video Learning & Quizzes:** Every course features YouTube video tutorials, interactive practical challenges, and randomized Final Knowledge Quizzes.

### 👨‍👩‍👧 For Parents
* **Account Linking:** Easily link to a child’s profile using their username.
* **Live Progress Tracking:** Monitor completed lessons, daily learning time, current streak, and earned badges.
* **Custom Task Assignment:** Assign offline tasks or learning challenges (e.g., "Complete 2 math puzzles" or "Clean up study desk") rewarded with bonus XP.
* **Weekly Performance Reports:** Review analytical charts on learning consistency and subject mastery.

### 👩‍🏫 For Teachers
* **Virtual Classroom Management:** Create classrooms with unique 6-character join codes (e.g., `AI-9943`).
* **Curriculum Homework:** Assign tailored homework with due dates and custom XP rewards.
* **Classroom Analytics & Leaderboards:** Track aggregate classroom engagement, student-by-student completion rates, and streak leaderboards.

---

## 💻 3. Technologies Used

The application is built on a cutting-edge full-stack TypeScript architecture designed for blazing performance, end-to-end type safety, and zero-configuration offline capability.

### 🎨 Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern declarative user interface with the latest concurrent features. |
| **TypeScript 5.9** | Static typing across all components, props, and UI states. |
| **Vite 7.2** | Lightning-fast development server with instant Hot Module Replacement (HMR) and optimized production bundling. |
| **Tailwind CSS 3.4** | Utility-first styling with custom glassmorphic cards, glow effects, and responsive design. |
| **Framer Motion 12** | Fluid micro-animations, glowing background ambient orbs, and interactive card transitions. |
| **Lucide React** | Clean, consistent modern icon library. |
| **Recharts 2.15** | Interactive SVG-based analytical charts for parent and teacher dashboards. |
| **Radix UI Primitives** | Accessible, headless UI components (dialogs, tooltips, tabs, accordions, and dropdowns). |

### ⚙️ Backend & API
| Technology | Purpose |
| :--- | :--- |
| **Hono.js 4.8** | Ultra-fast, lightweight web framework serving both the backend API and frontend static assets. |
| **tRPC 11.8** | End-to-end type-safe API client and router. Eliminates API schema drift between frontend and backend. |
| **Zod 4.3** | Strict runtime schema validation on all inputs (authentication, course completions, task submissions). |
| **JWT & bcryptjs** | Secure password hashing (salted SHA-256) and signed JSON Web Token stateless sessions. |

### 🗄️ Database & ORM
| Technology | Purpose |
| :--- | :--- |
| **Drizzle ORM 0.45** | High-performance, lightweight TypeScript ORM with schema-driven queries and zero runtime overhead. |
| **Dual-Mode Engine** | Custom hybrid data architecture: executes queries in-memory against `db.json` for offline local development, and seamlessly connects to cloud MySQL (TiDB Cloud, AWS RDS) when `DATABASE_URL` is set. |

---

## 🧠 4. How We Chose the Database & Backend Language

### Why TypeScript for Both Frontend & Backend?
* **Zero Context Switching:** Using TypeScript across both the React frontend and Hono backend allows code sharing (contracts, types, validators, and schema definitions).
* **tRPC Integration:** Pairing TypeScript with tRPC provides automatic autocomplete and type checking on API calls. If a backend database field changes, TypeScript immediately flags any affected frontend component during compile time.

### Why Hono over Legacy Frameworks (Express)?
* Traditional frameworks like Express.js are dated, rely on callback middleware, and have heavy package footprints.
* Hono is built natively on standard Web Standards (Fetch API, Request/Response), has negligible memory usage, boots in milliseconds, and is portable across Node.js, Vercel Edge, Docker, and Cloudflare Workers without code changes.

### Why Drizzle ORM + Dual Engine?
* **Drizzle ORM** was selected over Prisma because Prisma relies on heavy binary engines (`prisma-engine`) that slow down deployments and consume excessive memory. Drizzle generates lean, SQL-like queries with full type safety.
* **The Dual Engine Architecture:** A major priority for this educational project was ensuring that **anyone could clone the repo and immediately run it locally without installing MySQL or running local Docker containers**. We developed an AST query proxy executor that translates Drizzle queries to a local, portable JSON database (`db.json`) while preserving standard SQL migration capabilities for cloud production.

---

## 🛠️ 5. Problems Faced & How We Overcame Them

During development and extensive testing, several technical and architectural challenges were encountered and resolved:

### 1. The "133%" Course Progress Calculation Bug
* **The Problem:** When a student repeated a lesson or retook a quiz to improve their score, the backend completion mutation incremented `completedLessons` unconditionally. This caused course progress to exceed 100% (reaching 133% or higher on courses with 3 lessons).
* **The Solution:** We updated `api/routers/lesson.ts` to inspect the `lessonProgress` table before modifying progress. If the lesson was already marked as `"completed"`, the `completedLessons` counter is not incremented. Furthermore, we introduced defensive capping across all routers (`child.ts`, `parent.ts`, `teacher.ts`) using `Math.min(..., 100)` to guarantee statistics never exceed 100%.

### 2. Mock SQL Parser & String Escaping Bug
* **The Problem:** In our local mock database interpreter (`api/queries/connection.ts`), an initial regex was used to split SQL insert statements. When lesson descriptions or quiz questions contained English contractions (`You'll`, `don't`, `it's`) or parentheses (e.g., `Natural Language Processing (NLP)`), the regex split the string prematurely. This shifted columns into wrong attributes, storing JSON blobs inside integer `order` and `duration` fields and corrupting student XP with `NaN`.
* **The Solution:** We built a custom, state-aware SQL tokenizer inside `connection.ts` that tracks quote escapes (`''`) and balanced parentheses. We also added fallback sanitizers (`isNaN(Number(val)) ? 0 : Number(val)`) in `lesson.ts` so student XP and streaks always resolve gracefully.

### 3. YouTube Video Embed Blocking (Cross-Origin Restrictions)
* **The Problem:** Several modern browsers and YouTube privacy policies block embedded `<iframe>` video players when served from local or non-whitelisted domains, leading to "Video unavailable" errors.
* **The Solution:** We redesigned the video module in `CourseDetail.tsx` into a high-fidelity **YouTube Watch Card**. The card dynamically fetches the video's high-resolution YouTube thumbnail, displays a prominent red play icon, and opens the video directly on YouTube in a new tab upon clicking.

### 4. Placeholder PDF Removal & Asset Cleanliness
* **The Problem:** The prototype had dummy links to nonexistent `.pdf` study guides which resulted in 404 errors or confusing downloads for students.
* **The Solution:** We eliminated the dummy PDF download blocks from both the database seeder (`db/seed.ts`) and the course viewer (`CourseDetail.tsx`), keeping student focus squarely on interactive activities, video learning, and quizzes.

### 5. Offline Image Reliability & 36 Unique Thumbnails
* **The Problem:** External Unsplash image links occasionally failed to load on slow connections, resulting in broken image icons on course cards. Additionally, multiple courses were reusing the same graphics.
* **The Solution:** We replaced critical landing page track images with bundled local assets (`/course-ai-basics.jpg`, `/course-coding.jpg`, `/course-ml.jpg`). For the comprehensive 36-course catalog, we assigned unique, curated imagery for every single course so no two cards look identical.

---

## 📁 6. Project Architecture & File Structure

In modern web development standards (Vite, React, Node.js), specific configuration and manifest files **must reside in the root directory** for build tools, package managers, and deployment platforms (like Render, Vercel, and GitHub) to discover and execute them properly.

Below is an overview of the directory structure:

```text
app/
├── 📁 api/                      # Backend API (Hono.js + tRPC)
│   ├── 📁 kimi/                 # Auth & session helpers
│   ├── 📁 lib/                  # Server-side utilities, cookies & environment configuration
│   ├── 📁 queries/              # Database connection manager (Dual Local/MySQL Engine)
│   ├── 📁 routers/              # tRPC routers (user, child, course, lesson, parent, teacher, aiTutor)
│   ├── auth-router.ts           # Authentication route definitions
│   ├── boot.ts                  # Production server entry point (Hono + Static File Server)
│   ├── context.ts               # tRPC context & request bindings
│   ├── middleware.ts            # Public & protected tRPC procedure middleware
│   └── router.ts                # Main tRPC root appRouter merging all feature routers
│
├── 📁 contracts/                # Shared contracts, constants, and error schemas
├── 📁 db/                       # Database layer
│   ├── schema.ts                # Drizzle ORM schema definitions (users, courses, lessons, progress)
│   ├── relations.ts             # Drizzle relation mappings
│   └── seed.ts                  # Database seeding script (36 courses, 108 lessons, badges, demo accounts)
│
├── 📁 public/                   # Static public assets
│   ├── 🖼️ screenshot-landing-full.png  # Landing page screenshot
│   ├── 🖼️ screenshot-login.png         # Login page screenshot
│   ├── 🖼️ register-screenshot.png      # Register page screenshot
│   ├── 🖼️ child-avatar-1.png...        # Student, parent, and teacher avatars
│   └── 🖼️ course-ai-basics.jpg...      # Local course graphics
│
├── 📁 src/                      # Frontend Application (React 19 + TypeScript)
│   ├── 📁 components/           # Reusable UI components & Radix UI primitives
│   │   ├── 📁 layout/           # DashboardLayout (Sidebar, navigation headers, role profiles)
│   │   └── 📁 ui/               # Form, button, badge, dialog, chart, and alert components
│   ├── 📁 hooks/                # Custom React hooks (useAuth, useMobile)
│   ├── 📁 pages/                # Application views
│   │   ├── 📁 child/            # Student Dashboard, Course Catalog, Course Detail, AI Tutor, Badges
│   │   ├── 📁 parent/           # Parent Dashboard, Child Linking, Tasks, Reports
│   │   ├── 📁 teacher/          # Teacher Dashboard, Classrooms, Homework, Analytics
│   │   ├── Landing.tsx          # Modern Hero, About, How-It-Works, Course Preview, FAQ, Contact
│   │   ├── Login.tsx            # Animated glassmorphism login portal
│   │   └── Register.tsx         # Multi-role adventure onboarding
│   ├── 📁 providers/            # tRPC and TanStack React Query providers
│   ├── App.tsx                  # Main client-side router & route protection
│   ├── App.css                  # Core application animations
│   ├── const.ts                 # Frontend constants
│   ├── index.css                # Tailwind CSS directives & custom design tokens
│   └── main.tsx                 # React DOM client entry point
│
├── 📄 .backend-features.json    # Backend platform capabilities descriptor
├── 📄 .dockerignore             # Docker build ignore rules
├── 📄 .env.example              # Sample environment configuration template
├── 📄 .gitattributes            # Git line-ending & file normalization attributes
├── 📄 .gitignore                # Git ignore patterns (node_modules, build artifacts)
├── 📄 .prettierignore           # Code formatting exclusion rules
├── 📄 .prettierrc               # Prettier code formatting rules
├── 📄 components.json           # Shadcn/Radix UI configuration
├── 📄 db.json                   # Local standalone JSON database (auto-populated by seed)
├── 📄 drizzle.config.ts         # Drizzle ORM migration & schema configuration
├── 📄 eslint.config.js          # ESLint code quality rules
├── 📄 index.html                # Main HTML template with custom favicon & splash preloader
├── 📄 package.json              # Project dependencies, metadata, and scripts
├── 📄 package-lock.json         # Pinned dependency lockfile
├── 📄 postcss.config.js         # PostCSS configuration for Tailwind CSS
├── 📄 tailwind.config.js        # Tailwind CSS theme configuration (custom colors, fonts, shadows)
├── 📄 tsconfig.json             # Root TypeScript project references
├── 📄 tsconfig.app.json         # Client-side TypeScript compilation settings
├── 📄 tsconfig.node.json        # Node tooling TypeScript settings
├── 📄 tsconfig.server.json      # Backend API TypeScript compilation settings
├── 📄 vite.config.ts            # Vite configuration, alias mappings, and Hono dev server plugin
└── 📄 vitest.config.ts          # Unit test configuration
```

> **Note on Root Files:** Files such as `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, and `tailwind.config.js` **must remain in the root directory**. Build systems (Vite, TypeScript, PostCSS), package managers (npm), and deployment providers (Render, Vercel) look strictly in the root directory for these files to run scripts and compile the project.

---

## 🚀 7. Getting Started (Run Locally)

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
* `npm` (bundled with Node.js)

### 1. Installation
Clone the repository and install all dependencies:
```bash
cd app
npm install
```

### 2. Seed the Database
Populate the local database with courses, lessons, randomized quizzes, badges, and demo user accounts:
```bash
npx tsx db/seed.ts
```

### 3. Start the Development Server
Launch the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🔑 8. Pre-Seeded Demo Accounts for Immediate Testing

You can use these pre-configured accounts to explore the platform without manually signing up:

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Student** | `alex_explorer` | `password123` | Explore active quests, earn XP, chat with AI Tutor, take quizzes |
| **Parent** | `sarah_parent` | `password123` | Linked to `alex_explorer`, view live stats, assign custom tasks |
| **Teacher** | `mr_davis` | `password123` | Create classrooms, view leaderboards, assign homework |

---

## 🌐 9. Free Cloud Hosting Guide

To deploy this website online for free with all functions intact:

### Option A: Render.com (Recommended — 100% Free)
1. Push your repository to **GitHub**.
2. Go to [Render.com](https://render.com/) and click **New +** → **Web Service**.
3. Select your GitHub repository.
4. Set the following configuration:
   - **Root Directory:** `app`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Click **Create Web Service**. Your website will be live with a free public URL (e.g., `https://smart-learning-adventure.onrender.com`).

### Option B: Optional Permanent Cloud Database (TiDB Cloud)
If you wish to store user accounts on a persistent cloud database rather than the bundled `db.json`:
1. Create a free MySQL database on [TiDB Cloud](https://tidbcloud.com/) (5GB free forever).
2. Copy your connection URL: `mysql://username:password@gateway.tidbcloud.com:4000/dbname?ssl={"rejectUnauthorized":true}`
3. In your Render dashboard, add the environment variable:
   - **Key:** `DATABASE_URL`
   - **Value:** `[Your TiDB connection string]`
4. Run `npx tsx db/seed.ts` to populate the cloud database.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute for educational purposes.

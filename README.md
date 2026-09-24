# Educational Institution Admission Management System

An end-to-end, streamlined Admission Management & CRM platform tailored for educational institutions. This system optimizes prospective student lead capture, admission pipeline tracking, counselor follow-up scheduling, course catalog management, and institutional data backups.

---

## 📋 Table of Contents
1. [Project Report](#-project-report)
   - [Executive Summary](#executive-summary)
   - [Development Methodology & Engineering Paradigm](#development-methodology--engineering-paradigm)
   - [System Architecture](#system-architecture)
   - [Core Features & Modules](#core-features--modules)
   - [Technology Stack](#technology-stack)
   - [Database Schemas & Data Models](#database-schemas--data-models)
   - [API Endpoint Summary](#api-endpoint-summary)
2. [Project File Structure (Used Files)](#-project-file-structure-used-files)
3. [Unwanted & Ignored Files (.gitignore)](#-unwanted--ignored-files-gitignore)
4. [Getting Started & Installation](#-getting-started--installation)
   - [Prerequisites](#prerequisites)
   - [Environment Configuration](#environment-configuration)
   - [Installation & Running](#installation--running)
   - [Database Seeding](#database-seeding)
5. [License](#-license)

---

## 📊 Project Report

### Executive Summary
The **Admission Management System** streamlines candidate management for educational institutions. By replacing manual spreadsheets with a unified platform, institutions can manage prospective student inquiries, track counseling call schedules, assign leads to specialized counselors, monitor course seat capacities, and generate conversion reports.

### Development Methodology & Engineering Paradigm
This platform was conceptualized, architected, and constructed using an **AI-Augmented Software Engineering Paradigm**. Rather than relying solely on manual hand-coding, the end-to-end lifecycle leveraged **Agentic Code Synthesis**, **Prompt-Driven Architecture Design**, and **LLM-Assisted Quality Verification**.

Key aspects of this generative engineering approach include:
- **Generative Architecture & Schema Modeling**: The decoupled client-server model, RESTful endpoint structure, and Mongoose database schemas were synthesized via high-level functional prompt engineering.
- **Automated Frontend & UI Component Generation**: Modern React 18 component structures, responsive Tailwind CSS layouts, Recharts analytics widgets, and Kanban boards were constructed through AI-assisted pair programming workflows.
- **Iterative Verification & Automated Clean Governance**: File structure scoping, dynamic error boundaries, isolated environmental secret management, and comprehensive `.gitignore` rules were programmatically enforced.

---

### System Architecture
The application employs a decoupled client-server architecture:
- **Frontend**: Single Page Application (SPA) built with React 18, Vite, and Tailwind CSS. State management is organized around React Context providers for authentication, toast notifications, and branding.
- **Backend**: Express RESTful API running on Node.js, communicating with a MongoDB database via Mongoose ORM.

```
+-------------------------------------------------------+
|                 React 18 Frontend SPA                 |
|    (Vite, TailwindCSS, Recharts, Context APIs)        |
+---------------------------+---------------------------+
                            | HTTP / REST (JWT Auth)
+---------------------------v---------------------------+
|                  Node.js / Express API                |
|      (Auth, Validation, Middleware, Routing)          |
+---------------------------+---------------------------+
                            | Mongoose ORM
+---------------------------v---------------------------+
|                     MongoDB Database                  |
+-------------------------------------------------------+
```

### Core Features & Modules

1. **Admission Lead Pipeline**:
   - Kanban board and tabular views for prospective candidates.
   - Stage tracking (New Inquiry, Contacted, Counseling Scheduled, Campus Visit, Application Submitted, Enrolled, Lost).
   - Counselor routing and automated lead distribution.

2. **Counselor Management**:
   - Counselor profiles, active lead capacity tracking, and department specializations.
   - Manager oversight for reassigning leads and viewing counselor throughput.

3. **Call Follow-ups & Reminders**:
   - Call logging with outcomes, follow-up dates, and notes.
   - Dedicated follow-up workspace for counselors to prioritize today's scheduled interactions.

4. **Program & Course Catalog**:
   - Course list management with duration, annual fees, total seat capacities, and filled seat counts.

5. **Analytics & Institutional Reports**:
   - Lead conversion rate metrics, stage funnel visualization, and lead acquisition source breakdown.

6. **System Backup & Disaster Recovery**:
   - Encrypted cloud backup triggering, retention policy settings, and audit logs.

---

### Technology Stack

#### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Charts & Data Visualization**: Recharts

#### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt.js
- **Environment & Utilities**: Dotenv, Cors

---

### Database Schemas & Data Models

| Model Name | Description | Key Attributes |
| :--- | :--- | :--- |
| **`User`** | System accounts (Admins, Counselors) | `name`, `email`, `password`, `role`, `specialization`, `activeLeadCount` |
| **`Lead`** | Prospective student records | `studentName`, `email`, `phone`, `preferredCourse`, `status`, `assignedCounsellor` |
| **`Course`** | Program catalog | `code`, `name`, `department`, `durationYears`, `totalSeats`, `annualFee` |
| **`FollowUp`** | Counseling interaction log | `lead`, `counsellor`, `type`, `outcome`, `scheduledFollowUpDate`, `notes` |
| **`Target`** | Counselor targets | `counsellor`, `month`, `leadsAssignedTarget`, `enrollmentsTarget` |

---

### API Endpoint Summary

#### Authentication (`/api/auth`)
- `POST /api/auth/login` - Authenticate user & receive JWT.
- `GET /api/auth/me` - Fetch current user profile.

#### Leads (`/api/leads`)
- `GET /api/leads` - Get leads list with filtering & pagination.
- `POST /api/leads` - Create new prospective lead.
- `PUT /api/leads/:id` - Update lead status or details.
- `DELETE /api/leads/:id` - Remove lead record.

#### Courses & Counsellors (`/api/courses`, `/api/counsellors`)
- `GET /api/courses` - Fetch active course catalog.
- `GET /api/counsellors` - Fetch list of counselor staff.

#### Reports & System (`/api/reports`)
- `GET /api/reports/summary` - Fetch conversion funnel and analytics breakdown.

---

## 📁 Project File Structure (Used Files)

Only active, functional source files and configurations are tracked in the repository:

```
admission-management-system/
├── package.json                 # Root script runner (dev, seed, install:all)
├── package-lock.json            # Root dependency lockfile
├── .gitignore                   # Main repository Git ignore rules
├── .gitattributes               # Git attribute definitions
├── README.md                    # Project documentation & report
├── backend/
│   ├── package.json             # Backend dependencies & npm scripts
│   ├── package-lock.json        # Backend dependency lockfile
│   ├── .gitignore               # Backend-specific ignore rules
│   ├── .env.example             # Template environment variables
│   └── src/
│       ├── app.js               # Express application initialization & middleware
│       ├── server.js            # HTTP Server bootstrap & DB connection
│       ├── config/
│       │   └── db.js            # MongoDB connection handler
│       ├── controllers/         # Request handling (Auth, Lead, Course, Counsellor, Report)
│       ├── middlewares/         # Auth, Role middlewares
│       ├── models/              # Mongoose data schemas (User, Lead, Course, FollowUp, Target)
│       ├── routes/              # Express API endpoint routes
│       └── utils/               # Seed scripts and ID generator
└── frontend/
    ├── package.json             # Frontend dependencies & npm scripts
    ├── package-lock.json        # Frontend dependency lockfile
    ├── .gitignore               # Frontend-specific ignore rules
    ├── index.html               # Vite HTML entrypoint
    ├── vite.config.js           # Vite bundler configuration
    ├── tailwind.config.js       # Tailwind CSS configuration
    ├── postcss.config.js        # PostCSS configuration
    ├── public/                  # Static assets (logo, favicon)
    └── src/
        ├── main.jsx             # React entrypoint
        ├── App.jsx              # Main App layout & route management
        ├── assets/              # Shared image assets
        ├── components/          # React components (auth, leads, followups, counsellors, courses, reports, settings)
        ├── context/             # React Context Providers (Auth, Toast, Branding)
        ├── services/            # Axios / Fetch API client functions
        └── styles/              # Global Tailwind CSS styles
```

---

## 🚫 Unwanted & Ignored Files (.gitignore)

To maintain repository cleanliness, security, and performance, generated, runtime-built, and secret files are strictly excluded via `.gitignore` files:

| Category | Patterns Ignored | Rationale |
| :--- | :--- | :--- |
| **Dependencies** | `node_modules/`, `.pnpm-store/` | Third-party vendor packages restored via `npm install`. |
| **Secrets & Env** | `.env`, `.env.local`, `.env.*` | Sensitive credentials (DB URI, JWT secret). |
| **Build & Executables**| `dist/`, `dist-exe/`, `build/`, `out/`, `bin/`, `*.exe`, `*.dll`, `.vite/` | Compiled production bundles and standalone binaries. |
| **Runtime & Backups** | `backup_config.json`, `uploads/`, `storage/`, `backups/`, `*.db`, `*.sqlite` | User-generated uploads, local backup paths, and local DBs. |
| **Logs & Caches** | `*.log`, `logs/`, `.eslintcache`, `tmp/`, `temp/`, `scratch/` | Debug log output, linter cache, and workspace scratchpads. |

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI.

---

### Environment Configuration

1. Copy `.env.example` to `.env` in `backend/`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` with your settings:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/admission_crm
   JWT_SECRET=your_jwt_secret_key
   ```

---

### Installation & Running

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start Development Servers (Backend + Frontend)**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

### Database Seeding
To populate the database with sample admission leads, courses, and counselors:
```bash
npm run seed
```

---

## 📄 License
Proprietary software for educational institution admission management. All rights reserved.

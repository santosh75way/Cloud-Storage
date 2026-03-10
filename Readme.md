# ☁️ Modern Cloud Storage Platform

An enterprise-grade, end-to-end full-stack cloud storage system built and refined around cutting-edge strict TypeScript architectures and a hyper-premium "Vercel / Stripe" UI aesthetic design.

## 🌟 Platform Overview

Welcome to the Cloud Storage Platform repository. This repository encapsulates a completely custom-built solution for cloud file management, featuring completely decoupled Client and Server ecosystems. 

### Why this project?
- **Strictly Typed Architecture**: Both `frontend` and `backend` directories execute with absolute strict compiler parity. Variables, functions, and deeply-nested database payloads traverse the stack cleanly without `any` logic patching.
- **Deep Hierarchical Management**: Fully recursive Parent-Child relational nodes allow infinite folder depth capabilities mapped directly from PostgreSQL SQL queries.
- **Enterprise RBAC**: Role-Based Access Control powers all administrative activities, alongside micro-permissions granting atomic `VIEW`/`EDIT` capabilities over individual drive storage nodes and branches.
- **Aesthetics First**: Exchanging outdated user components for sharp `#000` pitch grays, high-contrast layouts, smooth `16px` border-radii, and `30px` diffuse focal drop-shadows.

## 🏗️ Monorepo Structure

```text
/
├── backend/            # Express.js API, Prisma ORM, PostgreSQL Models, Auth & Security
└── frontend/           # React 19, Vite, RTK query, Material-UI, Drive Components
```

## 🚀 Core Technologies

### Backend (`/backend`)
- **Node.js + Express**: Core networking layer
- **MySQL / PostgreSQL**: Relational schemas
- **Prisma ORM**: Data abstraction and type-inference
- **Cloudinary**: 100% offloaded physical file blob distribution via signed ephemeral links
- **Redis (`ioredis`)**: Rapid memory querying

### Frontend (`/frontend`)
- **React (v19) + Vite**: Hot Module Replacement rendering
- **Redux Toolkit**: Advanced RTK API endpoint querying, caching, and state hydration
- **Strict Styled Components**: Completely isolated Component CSS overrides preventing JSX clutter
- **React Router Dom (v7)**: Layout-oriented module navigation

## 💡 Key Implementations

- **Direct Storage Integration**: Upload files using real-time signature resolution without ever bottlenecking the Node server instance.
- **Advanced Sharing Layers**: 
  - **Internal Network Sharing**: Select specific application registered users and bind exact `VIEW` or `EDIT` privileges directly against folders.
  - **External Public Links**: Cryptographically issue temporary share tokens exposing access pipelines exclusively for unregistered guests. 
- **Administrative Governance**: Top-tier access feed generating activity streams monitoring global storage allocation.
- **Granular Drive Search**: Find files dynamically filtering by ownership, shared statuses, extensions, and titles recursively.

## 🏁 Getting Started Pipeline

### 1. Database & Server Setup
Open a terminal in `/backend`:
```bash
cp .env.example .env     # Bind DB URIs and Cloudinary secrets
npm install              # Hydrate package modules
npm run prisma:migrate   # Instantiate SQL relations
npm run dev              # Expose API via localhost:5000
```

### 2. Client UI Setup
Open a terminal in `/frontend`:
```bash
cp .env.example .env     # Bind Vite API target (localhost:5000/api)
npm install              # Hydrate package modules
npm run dev              # Expose Hot-Reload UI via localhost:5173
```

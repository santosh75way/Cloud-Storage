# ☁️ Cloud Storage System - Frontend Client

A hyper-modern, highly aesthetic cloud storage web application. Designed around an ultra-premium "Vercel / Stripe" monochrome interface using deep soft shadows and extensive glassmorphism principles.

## 🚀 Tech Stack

- **Core Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Routing:** React Router v7
- **State Management & Caching:** Redux Toolkit (RTK Query)
- **UI Architecture:** Material UI (MUI) via STRICT `styled-components` bounds
- **Date Parsing:** `date-fns`
- **Form Management:** React Hook Form + Zod Resolvers
- **Alerts:** React Toastify

## 🎨 Design Philosophy

This frontend was actively refactored to explicitly forbid inline `<Box sx={{}}>` mapping, achieving strict isolation between logic and CSS.

We utilize a **Jet Black & Pure White** color configuration. Card components rely on delicate `0 8px 30px rgba(0,0,0,0.04)` drop-shadows and softened `16px` border-radii that invoke an air of extreme premium SaaS reliability.

## 📂 Feature Architecture

- **Drive Explorer**: An exact replica of modern drive navigation. Features drag-and-drop mechanics, breadcrumb hierarchies, and immediate visual feedback.
- **Search Nexus**: A centralized debounce-driven data querying hub that intercepts types, ownership, and deep-folder hierarchies instantly.
- **Administrative Observation**: A separated `/admin` routing layer providing timeline feeds of user activities, database usage sizes, and top-down management powers.
- **Public & Internal Share Flows**: Clean interfaces separating native internal account sharing logic (`VIEW`/`EDIT`) from external cryptographic link tokens.

## 🧠 Robust Type Safety Layer

The application executes within pure strict compilation.
- `any`, `unknown`, and unhandled boundary parameters have been eliminated.
- RTK Query maps natively to dynamically inferred generic bounds protecting all caching injections natively inside standard React components.

## 🛠️ Getting Started

Ensure the companion `backend` service is actively running on its specified port.

### 1. Set environment variables
Create a `.env` exposing the backend connection protocol:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Boot Application
```bash
# 1. Install dependencies
npm install

# 2. Start the hot-reloading dev interface
npm run dev

# 3. Compile for production
npm run build
```

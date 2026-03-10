# ☁️ Cloud Storage System - Backend API

A high-performance, strictly-typed Node.js backend system designed for scalable cloud file storage and enterprise-grade role-based sharing, inspired by platforms like Google Drive and Vercel.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js `^4.18`
- **Language:** TypeScript `^5.3` (Strict Mode)
- **Database ORM:** Prisma `^6.19`
- **Database:** PostgreSQL
- **Caching:** Redis (`ioredis`)
- **Storage Provider:** Cloudinary
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod Schema Validation

## 🏗️ Architecture

The backend implements a highly scalable **Controller-Service-Repository** MVC architectural pattern designed for complete component decoupling:

```text
app/
├── admin/          # Admin-level dashboard analytics and feeds
├── auth/           # JWT, Registration, Password Reset flows
├── common/         # Global Middlewares, Error Handlers, and Prisma Singletons
├── public-links/   # Ephemeral public drive sharing engines
├── search/         # Advanced file/folder querying
├── sharing/        # Node-level RBAC and inherited permissions logic
└── storage/        # File Node hierarchy management and Cloudinary sync
```

## 🔒 Security & Authorization

- **Layered Authentication**: Every protected route utilizes strict Bearer JWT decoding.
- **Role-Based Access Control (RBAC)**: Distinguishes between `USER` and `ADMIN` operation limits.
- **Node-Level Permissions**: Calculates deep inherited nested folder permissions dynamically (e.g., recursive `VIEW` vs `EDIT` ownerships).
- **Zod Validation**: Guards all incoming payload borders protecting against DB pollution.

## 📦 Key Capabilities

- **Infinite Nested Storage Algorithms**: Tracks unlimited folder hierarchies through a recursive parent-child relational SQL schema.
- **Direct Asset Streaming**: Hands off physical media blobs securely to Cloudinary through signed signatures to eliminate server bottlenecking.
- **Secure File Sharing**: Generate tokenized sharing links and internal cross-account permissions.
- **Real-time Activity Feeds**: Unified event tracking specifically designed for administrative observability panels.

## 🛠️ Getting Started

### 1. Environment Configuration
Create a `.env` file referencing the `.env.example` structure.
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/cloudstorage"
JWT_SECRET="your_secure_secret"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### 2. Initialization & Boot
```bash
# 1. Install dependencies
npm install

# 2. Push schema to database
npm run prisma:migrate

# 3. Generate TS artifacts
npm run prisma:generate

# 4. Boot Dev Server
npm run dev
```

# 🛒 Shoppy — Full-Stack E-Commerce Platform

A production-grade e-commerce application built with **Next.js 14** and **NestJS**, featuring Stripe payments, role-based access control, real-time updates, and a complete CI/CD pipeline deployed on AWS.

**Live Demo:** [shopping-frontend-ebon.vercel.app](https://shopping-frontend-ebon.vercel.app)

---

## Architecture

```
Browser
  │
  ▼
Next.js 14 (Vercel)                    NestJS (AWS Elastic Beanstalk)
  ├── App Router + SSR                    ├── REST API
  ├── Server Actions                      ├── JWT + Passport.js Auth
  ├── Socket.io Client                    ├── Role-based Access (Admin/User)
  ├── Stripe Checkout                     ├── Socket.io Gateway
  └── Tailwind CSS + MUI                  ├── Stripe Webhook Handler
                                          ├── AWS S3 Image Uploads
                                          └── Prisma ORM
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                              PostgreSQL              AWS S3 Bucket
                              (AWS RDS)             (Product Images)
```

**CI/CD Pipeline:**
```
GitHub Push → AWS CodePipeline → AWS CodeBuild → AWS Elastic Beanstalk (auto-deploy)
```

---

## Features

- **Authentication** — JWT-based auth with HttpOnly cookies, signup/login, password hashing with bcrypt
- **Role-Based Access Control** — Admin and User roles; admins can create/manage products, users can browse and purchase
- **Product Management** — Full CRUD for products with image upload to AWS S3
- **Stripe Payments** — Checkout session creation, webhook handling for payment confirmation
- **Order Management** — Automatic order creation on successful payment, order history per user, admin view of all orders
- **Real-Time Updates** — Socket.io WebSocket gateway for live product updates (development environment)
- **Database Migrations** — Prisma ORM with type-safe queries and migration management
- **Server-Side Rendering** — Next.js 14 App Router with Server Components and Server Actions

---

## Tech Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Frontend       | Next.js 14, TypeScript, Tailwind CSS, Material UI   |
| Backend        | NestJS, TypeScript, Passport.js, Socket.io          |
| Database       | PostgreSQL (AWS RDS), Prisma ORM                    |
| Payments       | Stripe (Checkout Sessions + Webhooks)               |
| File Storage   | AWS S3                                              |
| Hosting        | Vercel (frontend), AWS Elastic Beanstalk (backend)  |
| CI/CD          | AWS CodePipeline, AWS CodeBuild                     |
| Infrastructure | AWS RDS, S3, Elastic Beanstalk, CloudFront          |

---

## Database Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User       │       │   Product    │       │    Order     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id       (PK)│───┐   │ id       (PK)│───┐   │ id       (PK)│
│ email        │   │   │ name         │   │   │ userId   (FK)│
│ password     │   │   │ description  │   │   │ productId(FK)│
│ role (enum)  │   └──▶│ userid   (FK)│   └──▶│ createdAt    │
│              │       │ price        │       │              │
│              │       │ sold         │       │              │
└──────────────┘       └──────────────┘       └──────────────┘

Roles: USER | ADMIN
```

---

## API Endpoints

### Auth
| Method | Endpoint       | Description          | Auth |
|--------|---------------|----------------------|------|
| POST   | `/auth/login`  | Login, returns JWT   | No   |

### Users
| Method | Endpoint     | Description           | Auth |
|--------|-------------|----------------------|------|
| POST   | `/users`     | Register new user     | No   |
| GET    | `/users/me`  | Get current user      | Yes  |

### Products
| Method | Endpoint                      | Description             | Auth  |
|--------|------------------------------|------------------------|-------|
| GET    | `/products`                   | List all products       | Yes   |
| GET    | `/products/:id`               | Get product by ID       | Yes   |
| POST   | `/products`                   | Create product          | Admin |
| POST   | `/products/:id/image`         | Upload product image    | Admin |

### Checkout
| Method | Endpoint              | Description                    | Auth |
|--------|-----------------------|-------------------------------|------|
| POST   | `/checkout/session`    | Create Stripe checkout session | Yes  |
| POST   | `/checkout/webhook`    | Stripe webhook handler         | No   |

### Orders
| Method | Endpoint       | Description              | Auth  |
|--------|---------------|--------------------------|-------|
| GET    | `/orders`      | Get current user's orders | Yes   |
| GET    | `/orders/all`  | Get all orders            | Admin |

---

## Infrastructure (AWS)

```
┌─────────────────────────────────────────────────┐
│                    AWS Cloud                      │
│                                                   │
│  ┌─────────────┐    ┌──────────────────────────┐ │
│  │ CodePipeline │───▶│   Elastic Beanstalk      │ │
│  │  + CodeBuild │    │   (NestJS on Node.js)    │ │
│  └─────────────┘    │                          │ │
│                      │   ┌──────────────┐       │ │
│                      │   │ EC2 Instance │       │ │
│                      │   │  + Nginx     │       │ │
│                      │   └──────────────┘       │ │
│                      └──────────┬───────────────┘ │
│                                 │                  │
│                    ┌────────────┼────────────┐     │
│                    ▼            ▼            ▼     │
│              ┌──────────┐ ┌─────────┐ ┌────────┐  │
│              │ RDS      │ │   S3    │ │CloudFrt│  │
│              │PostgreSQL│ │ Images  │ │  CDN   │  │
│              └──────────┘ └─────────┘ └────────┘  │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Stripe account (test mode)
- AWS account (for S3 — optional for local dev)

### Backend Setup

```bash
git clone https://github.com/mahalingam-dev-8/shopping-backend.git
cd shopping-backend
npm install --legacy-peer-deps
```

Create `.env` from the example:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/shoppy
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d
PORT=3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SUCCESS_URL=http://localhost:3000/success
STRIPE_CANCEL_URL=http://localhost:3000/cancel
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start the server:
```bash
npm run start:dev
```

### Frontend Setup

```bash
git clone https://github.com/mahalingam-dev-8/shopping-frontend.git
cd shopping-frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Backend (AWS Elastic Beanstalk)
The backend auto-deploys via AWS CodePipeline on every push to `main`. The pipeline runs CodeBuild (install, build, prisma generate + migrate) and deploys the artifact to Elastic Beanstalk.

### Frontend (Vercel)
The frontend auto-deploys on Vercel on every push to `main`. Environment variables are configured in the Vercel dashboard.

---

## Project Structure

```
shopping-backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── auth/                  # JWT authentication module
│   ├── users/                 # User registration & profile
│   ├── products/              # Product CRUD + WebSocket gateway
│   ├── checkout/              # Stripe checkout + webhook
│   ├── orders/                # Order management
│   ├── s3/                    # AWS S3 file upload service
│   ├── prisma/                # Prisma service module
│   └── app.module.ts          # Root module
├── buildspec.yaml             # AWS CodeBuild configuration
├── Procfile                   # Elastic Beanstalk process config
└── package.json
```

---

## Repositories

| Repository | Description |
|-----------|-------------|
| [shopping-backend](https://github.com/mahalingam-dev-8/shopping-backend) | NestJS REST API, Prisma, Stripe, S3 |
| [shopping-frontend](https://github.com/mahalingam-dev-8/shopping-frontend) | Next.js 14 App Router, Tailwind, MUI |

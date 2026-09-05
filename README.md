# LegalEase — Online Lawyer Hiring Platform (Client)

LegalEase connects clients with verified lawyers — browse by specialization, hire securely, pay online via Stripe, and manage everything from role-based dashboards (User / Lawyer / Admin).

**Live Site:** _add your deployed URL here_

## Features
- Role-based dashboards for Users, Lawyers, and Admins with distinct workflows
- Search, filter (specialization, fee range), and pagination on the lawyer directory
- End-to-end hiring flow: request -> accept/reject -> Stripe payment -> paid status
- Comment system restricted to clients who have actually hired that lawyer
- Secure JWT-protected API calls bridging Better Auth sessions to the Express backend
- Framer Motion animations, dark/light theme, custom 404/error pages

## Tech Stack
Next.js (App Router), Better Auth + MongoDB, Tailwind CSS, Framer Motion, Stripe Elements, react-hot-toast, lucide-react

## Setup
```bash
npm install
cp .env.local.example .env.local   # fill in MongoDB, Better Auth, Google OAuth, JWT_SECRET, API URL, imgBB key, Stripe publishable key
npm run dev
```

Make sure the [LegalEase server](../legalease-server) is running and `NEXT_PUBLIC_API_URL` points to it, with `JWT_SECRET` matching exactly on both sides.

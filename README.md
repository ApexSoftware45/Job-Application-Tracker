# Job Application Tracker

A full-stack job application and candidate pipeline tracker for job seekers, recruiters, and career coaches. Users can create an account, log in securely, track job opportunities, update application statuses, search and filter their pipeline, and save follow-up actions.

The app uses protected routes and user-owned records, so authenticated users only see and manage their own applications.

## Overview

Job Application Tracker is built as a modern SaaS-style dashboard with a React frontend, an Express API, Prisma ORM, and PostgreSQL persistence hosted on Neon. It is designed to demonstrate full-stack product development, authentication, relational data modeling, and practical dashboard UX.

## Live Demo
Live App: https://job-application-tracker-eight-xi.vercel.app/
GitHub: https://github.com/ApexSoftware45/Job-Application-Tracker
API Health: https://job-application-tracker-api-yn0d.onrender.com/api/health

## Features

- User registration and login
- Custom JWT authentication
- Password hashing with bcrypt
- Protected dashboard routes
- User-owned job applications
- Create, read, update, and delete applications
- Track company, position, location, job URL, status, applied date, and notes
- Search applications by company, position, or location
- Filter applications by status
- Track next action date and follow-up notes
- Dark premium dashboard theme with responsive Tailwind styling

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL hosted on Neon  
**ORM:** Prisma  
**Authentication:** Custom JWT auth with bcrypt password hashing  
**Tools:** Git, GitHub, VS Code

## Screenshots

Add screenshots to the paths below after capturing the app locally.

## Screenshots

### Login Page
![Login Page](Screenshots/create-account.png)

### Dashboard
![Dashboard](Screenshots/dashboard.png)

### Add Application
![Add Application](Screenshots/sign-in.png)


## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-application-tracker.git
cd job-application-tracker
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env` using the placeholders below.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-secure-secret"
PORT=5000
```

Do not commit real secrets or production database credentials.

### 4. Set up the database

From the `server` folder:

```bash
npx prisma migrate deploy
npx prisma generate
```

For local development with new migrations, use:

```bash
npx prisma migrate dev
```

### 5. Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend runs on Vite, and the API runs on the configured Express port.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string for Neon or another PostgreSQL database |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Express server port, usually `5000` |

## API Routes

### Health

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Confirms the API is running |

### Auth

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Return the current authenticated user |

### Applications

All application routes require a valid JWT.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/applications` | Get applications owned by the logged-in user |
| `POST` | `/api/applications` | Create a new application |
| `PUT` | `/api/applications/:id` | Update an owned application |
| `DELETE` | `/api/applications/:id` | Delete an owned application |

## Database Models Summary

### User

Stores account information for authentication and ownership.

- `id`
- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`
- related applications

### Application

Stores job application records tied to a specific user.

- `id`
- `userId`
- `company`
- `position`
- `location`
- `jobUrl`
- `status`
- `dateApplied`
- `nextActionDate`
- `nextActionNote`
- `notes`
- `createdAt`
- `updatedAt`

## What I Learned

- Building a full-stack TypeScript application with separate frontend and backend projects
- Implementing custom JWT authentication and protected API routes
- Hashing passwords securely with bcrypt
- Modeling relational data with Prisma and PostgreSQL
- Enforcing user ownership so users only access their own records
- Connecting a React dashboard to a persistent Express API
- Designing a clean SaaS-style interface with Tailwind CSS
- Managing database migrations against a hosted Neon PostgreSQL database

## Future Improvements

- Add due-soon follow-up reminders
- Add sorting by applied date or next action date
- Add pagination for larger pipelines
- Add recruiter or coach views for managing multiple candidates
- Add email reminders or calendar export
- Add automated tests for auth and application ownership rules

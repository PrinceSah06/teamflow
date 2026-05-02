# Teamflow

Teamflow is a full-stack team and organization management app. It includes user authentication, JWT-based protected routes, organization membership, role checks, and invite links.

## Tech Stack

- Frontend: React, Vite, TypeScript, React Router, Zustand, Axios
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL with Drizzle ORM
- Auth: JWT access tokens, refresh token cookie, bcrypt password hashing

## Project Structure

```txt
client/
  src/
    pages/          React pages
    store/          Zustand auth state
    config/         Axios client

server/
  src/
    controller/     Request handlers
    services/       Business logic and database calls
    routes/         API route definitions
    middleware/     Auth, validation, authorization, error handlers
    db/             Drizzle database setup and schema
    schemas/        Zod request validation schemas
    utils/          Shared helpers
```

## API Response Format

All successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

All errors use:

```json
{
  "success": false,
  "error": "message"
}
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/PrinceSah06/teamflow.git
cd teamflow
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create `server/src/.env`:

```env
DATABASE_URL=your_postgres_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
```

Create `client/.env`:

```env
VITE_SERVER_API=http://localhost:5000
```

### 4. Run the app

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5000`.

## API Routes

### Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Register a new user |
| POST | `/login` | Log in and receive an access token |
| POST | `/logout` | Log out and clear refresh token |

### Organizations

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/orgs` | Create an organization |
| GET | `/api/orgs/me` | Get organizations for the logged-in user |
| POST | `/api/orgs/:orgId/invite-link` | Create an invite link for an organization |
| POST | `/api/invites/:token/accept` | Accept an invite link |

Protected routes require:

```http
Authorization: Bearer <access_token>
```

## Backend Notes

- Input validation is handled with Zod.
- Passwords are hashed with bcrypt before storage.
- Access tokens are sent to the client after login.
- Refresh tokens are stored as HTTP-only cookies.
- Organization invite creation is restricted to `owner` and `admin` roles.
- Express error responses are centralized through shared response helpers.

## Useful Commands

Backend:

```bash
cd server
npm run dev
npx tsc --noEmit
```

Frontend:

```bash
cd client
npm run dev
npm run build
```

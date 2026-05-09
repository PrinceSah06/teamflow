# Teamflow

Teamflow is a full-stack team and organization management app. It includes user authentication, JWT-based protected routes, organization membership, role checks, invite links, and organization notes.

The React client is connected to the Express API with Axios. After login, protected API requests include the JWT access token in the `Authorization` header, and the dashboard loads organization notes from the server.

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
    hooks/          Client hooks, including note autosave
    store/          Zustand auth and notes state
    config/         Axios client
    componets/      Note UI components

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

## Deployment Notes

The backend is ready for Railway-style production deploys:

- `server/package.json` includes `build` and `start` scripts.
- The production entrypoint is `server/dist/index.js`.
- The server reads `process.env.PORT` and falls back to `5000` locally.
- TypeScript is installed as a production dependency so `npm run build` can run during deployment.

For the deployed frontend, set `client/.env` or the Vercel environment variable:

```env
VITE_SERVER_API=https://your-railway-server-url
```

The server CORS allowlist includes the local Vite URLs and the deployed Vercel frontend URL:

```txt
https://teamflow-git-main-prince-s-projects-717f0a10.vercel.app
```

## Client Routing

The frontend uses React Router for public and protected routes.

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page with current auth state |
| `/signup` | Logged-out users only | Create a new account |
| `/login` | Logged-out users only | Log in and receive an access token |
| `/dashboard` | Protected | Organization notes dashboard |
| `/dashBoard` | Protected | Backward-compatible dashboard route |

Routing behavior:

- Logged-out users trying to open the dashboard are redirected to `/login`.
- After login, users are redirected to the dashboard or back to the protected route they originally opened.
- Logged-in users trying to open `/login` or `/signup` are redirected to `/dashboard`.
- Signup creates an account, then redirects to `/login` because registration does not return an access token.
- Unknown routes redirect to `/`.

## Notes Dashboard

The dashboard connects directly to the backend notes and organization APIs.

On load:

1. The client requests the logged-in user's organizations with `GET /api/orgs/me`.
2. If the user has no organization, the client creates one with `POST /api/orgs`.
3. The client loads notes for the active organization with `GET /notes/:id`.

Note actions:

- Create note: `POST /notes/:id`
- Autosave note edits: `PATCH /notes/:orgId/:noteId`
- Notes are stored in Zustand and synced through the shared Axios client.
- Autosave is debounced so the app does not send a request on every key press.

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

### Notes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/notes/:id` | Create a note for an organization |
| GET | `/notes/:id` | Get all notes for an organization |
| GET | `/notes/:orgId/:noteId` | Get a single organization note |
| PATCH | `/notes/:orgId/:noteId` | Update an organization note |
| DELETE | `/notes/:orgId/:noteId` | Delete an organization note |

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
- Notes are scoped to organizations and require membership access.
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

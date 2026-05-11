# TeamFlow Feature README

This file is for interview practice. It explains what was built, why it exists,
and how the frontend and backend work together.

## Product Summary

TeamFlow is a small collaborative notes app. A user can sign up, log in, create
organizations, write notes inside an organization, invite teammates, accept an
invite link, and see which users belong to the same organization.

## Features Implemented

### Authentication

- Sign up page.
- Login page.
- Protected dashboard route.
- Public-only login/signup routes.
- Logout button that clears auth and workspace state.
- User identity box showing the logged-in user's name and email.

### Landing Page

- Traditional home page at `/`.
- Login and sign-up buttons in the navigation.
- App intro and feature cards.
- If logged in, the nav shows user info and a dashboard button.

### Organizations

- Create a new organization.
- See all organizations for the logged-in user.
- Switch between organizations.
- See the active organization name and your role.
- See organization count and role summary.

### Members

- New backend route: `GET /api/orgs/:orgId/members`.
- Dashboard shows the users in the currently selected organization.
- Shows total member count for the active organization.
- Marks the logged-in user with a `You` badge.
- Shows each member email and role.

### Invites

- Create invite link with `POST /api/orgs/:orgId/invite-link`.
- Copy invite link from the dashboard.
- Accept invite route at `/invite/:token`.
- Backend accepts invite with `POST /api/invites/:token/accept`.
- Invite accept flow adds the user to the organization.

### Notes

- Load notes for the selected organization.
- Create note.
- Select note.
- Edit note title and content.
- Auto-save note changes.
- Delete note.
- Search notes in the sidebar.

### Realtime Setup

- Client connects with Socket.IO.
- Dashboard joins a room using the selected organization id.
- This prepares the app for organization-level realtime updates.

## API Routes With UI Coverage

- `POST /register`: Sign-up page.
- `POST /login`: Login page.
- `POST /logout`: Logout button.
- `POST /api/orgs`: New organization button.
- `GET /api/orgs/me`: Organization list and switcher.
- `GET /api/orgs/:orgId/members`: Members panel.
- `POST /api/orgs/:orgId/invite-link`: Invite member form.
- `POST /api/invites/:token/accept`: Invite accept page.
- `GET /notes/:id`: Notes sidebar.
- `POST /notes/:id`: New note button.
- `PATCH /notes/:orgId/:noteId`: Auto-save editor.
- `DELETE /notes/:orgId/:noteId`: Delete note button.

The single-note route exists on the backend, but the current dashboard does not
need a separate UI for it because all notes are already loaded and selected from
the notes list.

## How Same-Organization Users Are Found

The database has a `member` table. Each row connects:

- one `userId`
- one `orgId`
- one `role`

When the dashboard has an active organization, it stores that id as `orgId`.
The frontend calls:

```txt
GET /api/orgs/:orgId/members
```

The backend first checks whether the logged-in user is a member of that org.
If yes, it queries all rows in `member` where `member.orgId` matches the selected
organization id, then joins those rows with the `users` table to get emails.

That is why every user shown in the members panel is in the same organization.

## Frontend Structure

The dashboard was split into reusable components:

- `DashboardHeader`: title, user identity, logout.
- `WorkspacePanel`: active organization, all organizations, org switcher.
- `MembersPanel`: users in the selected organization.
- `NotesSidebar`: note list, search, create/delete/select note.
- `InvitePanel`: create and copy invite links.
- `NoteEditer`: note editor and auto-save.
- `SaveStatus`: save/error status display.

`DashBoard.tsx` now mostly coordinates data loading, socket setup, logout, and
passes props into the smaller components.

## Backend Structure

- `userRoutes`: auth routes.
- `orgRoutes`: organizations, invites, members.
- `notes.routes`: notes CRUD.
- `orgs.services`: organization, invite, and member database logic.
- `notes.services`: note database logic.
- `authMiddleware`: verifies access token.
- `authorizationMiddleware`: checks organization role permissions.

## Important Fixes Made

### Neon Transaction Error

The app originally used `drizzle-orm/neon-http`. Neon HTTP does not support
interactive transactions. The invite accept service uses a transaction to:

1. insert the new member
2. mark the invite token as used

The DB client was changed to `pg` with `drizzle-orm/node-postgres`, which
supports transactions.

### Backend Restart Script

The restart script used `$pid`, but PowerShell reserves `$PID`. It was changed
to `$processId`.

## Interview Talking Points

- Protected routes are handled on the frontend using `accessToken` from Zustand.
- Backend auth is enforced with `authMiddleware`.
- Organization permissions use `allowedUser(["owner", "admin"])`.
- Members are not guessed on the client; they come from the backend using the
  selected `orgId`.
- Auto-save is separated into a reusable hook: `useAutoSave`.
- Dashboard UI is modular, so each panel has one responsibility.
- Invite accepting uses a transaction so the app does not create a member without
  also marking the invite as used.

## Future Features To Add

- Rename organization.
- Remove member from organization.
- Change member role.
- Show pending invites.
- Realtime note collaboration.
- Realtime member joined notification.
- Better note history or versioning.
- Toast notifications for save, invite, and errors.

# Inkline Blog Frontend

Production-ready frontend for Inkline, a publishing community backed by the Inkline Express/Prisma API.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Better Auth React client
- Radix UI primitives
- Lucide icons
- `next-themes` light, dark, and system themes

The frontend runs at `http://localhost:4000`; the backend runs at `http://localhost:3000` by default.

## Current functionality

### Public experience

- Responsive home and About pages
- Published-story archive
- Search by text and tags
- Featured filtering and newest/oldest/popular/title sorting
- Pagination
- Article detail pages with view and comment counts
- Responsive navigation, theme switching, loading/error/not-found states

### Authentication

- Email/password registration and login
- Google sign-in
- Email verification and verification resend
- Forgot-password and reset-password flows
- Session-aware navigation and calls to action
- Protected writer/admin dashboard layout

### Writer workspace

- Create stories
- Save drafts or publish immediately
- Edit, archive, and delete owned stories
- Configure thumbnail URLs and tags
- Review story, view, and comment totals
- Comment, reply, edit owned comments, and delete owned comments

### Admin workspace

- Platform statistics
- Manage every post's status and featured state
- Delete posts
- Approve or reject comments
- Search users by name or email
- Change user/admin roles
- Suspend and reactivate accounts
- Review verification state and post/comment activity counts

Suspended accounts have their backend sessions revoked and cannot access protected functionality.

## Project structure

```text
src/
  app/
    (commonLayout)/       Public pages and authentication flows
    (dashboardLayout)/    Writer and admin dashboards
  components/             Blog, comments, admin, layout, and UI components
  lib/
    auth-client.ts        Better Auth browser client
    blog-api.ts           Typed API models and fetch helper
  providers/              Theme provider
```

## Environment configuration

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Do not add a trailing slash. The backend must set `APP_URL=http://localhost:4000` so cookie requests and CORS work correctly.

## Local setup

1. Start the backend and PostgreSQL first.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` as shown above.

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:4000](http://localhost:4000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Next.js development server on port 4000 |
| `npm run lint` | Run ESLint |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build on port 4000 |

## Main routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page and recent stories |
| `/about` | Public | Inkline mission and platform overview |
| `/blogs` | Public | Searchable/filterable story archive |
| `/blogs/[id]` | Public | Article and comments |
| `/register` | Guest | Create an account |
| `/login` | Guest | Sign in |
| `/verify-email` | Public | Complete email verification |
| `/forgot-password` | Guest | Request a reset email |
| `/reset-password` | Public | Choose a new password |
| `/dashboard` | Authenticated | Writer workspace |
| `/admin-dashboard` | Admin | Posts, comments, stats, and user management |

The About page's “Start writing” button sends signed-in users to `/dashboard` and guests to `/register`.

## API integration

`src/lib/blog-api.ts` centralizes the backend base URL, shared types, and authenticated fetch behavior. Requests use cookies with `credentials: "include"`.

Public pages use server-side fetching where appropriate. Session-dependent client UI is hydration-safe so the server and first browser render remain consistent.

## Production validation

Run both checks before committing or deploying:

```bash
npm run lint
npm run build
```

For production, configure `NEXT_PUBLIC_API_URL` with the public HTTPS API origin. Configure the backend's `APP_URL`, Better Auth URL, trusted origin, cookie settings, and Google OAuth redirect URLs for the deployed frontend domain.

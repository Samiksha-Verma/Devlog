# DevLog — Developer Learning Journal

A full-stack developer learning journal and project tracker built with Next.js 15, Prisma, and Tailwind CSS.

## Features

- **Learning Log** — Create, edit, delete entries with tags and markdown notes
- **Project Tracker** — Track projects with status badges (Idea → Building → Shipped → Paused)
- **Resource Bookmarker** — Save links with categories, read/unread toggle, favourites
- **Dashboard** — Stats, 8-week activity chart, top tags, streak counter
- **Dark Mode** — System-aware with manual toggle

## Tech Stack

- **Next.js 15** (App Router, Server Components, API Routes)
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **Prisma 5 + SQLite** for the database
- **React Query (TanStack)** for server state
- **Zod + react-hook-form** for validation
- **Recharts** for dashboard charts
- **next-themes** for dark mode

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
```bash
npx prisma migrate dev --name init
```

### 3. Seed with sample data
```bash
npm run db:seed
```

### 4. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/               # API routes (entries, projects, resources, dashboard)
│   ├── dashboard/         # Stats dashboard
│   ├── log/               # Learning log + entry detail
│   ├── projects/          # Project grid + detail
│   └── resources/         # Resource bookmarker
├── components/
│   ├── entries/           # EntryCard, EntryForm
│   ├── projects/          # ProjectCard, ProjectForm, StatusBadge
│   ├── resources/         # ResourceCard, ResourceForm
│   └── ui/                # Navbar, Modal, Skeleton, Toaster, etc.
├── lib/                   # db.ts, utils.ts, validations.ts, toast.ts
└── types/                 # Shared TypeScript interfaces
prisma/
├── schema.prisma
└── seed.ts
```

## Switching to PostgreSQL (Production)

1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
2. Update `DATABASE_URL` in your environment to a PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/devlog"
   ```
3. Run `npx prisma migrate deploy`

On Vercel, set `DATABASE_URL` in project environment variables and use a service like [Neon](https://neon.tech) or [Supabase](https://supabase.com) for a free PostgreSQL database.

## AI Tools Used

Claude was used to help architect the project structure, generate boilerplate for API routes and form components, and debug Prisma configuration issues.

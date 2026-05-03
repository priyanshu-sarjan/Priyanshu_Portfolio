# Workspace

## Overview

Personal CMS Portfolio and Resume Builder for Priyanshu Sarjan — a 2nd-year B.Tech CSE student at SATI focused on MERN Stack, Blockchain, and DSA. Full-stack app with a public portfolio, admin dashboard, and auto-generated resume.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS (dark theme)

## Artifacts

- **portfolio** (`/`) — Public portfolio + Admin dashboard + Resume generator
- **api-server** (`/api`) — Express backend serving all portfolio data

## Key Pages

- `/` — Public portfolio (hero, projects, skills, certifications, competitions, gallery)
- `/events` — Public timeline of upcoming events
- `/resume` — Auto-generated ATS-friendly resume with print-to-PDF
- `/admin` — Admin dashboard with stats overview
- `/admin/status` — Update "currently working on" status
- `/admin/projects` — CRUD projects
- `/admin/certifications` — CRUD certifications
- `/admin/skills` — CRUD skills (categorized: language, web, web3, dsa, other)
- `/admin/competitions` — CRUD competitions & workshops
- `/admin/events` — CRUD events/tasks with completion toggle
- `/admin/gallery` — Manage gallery images

## Database Tables

- `status` — Currently working on status
- `projects` — Portfolio projects with tech stack array
- `certifications` — Certifications and courses
- `skills` — Skills with category enum and proficiency 1-100
- `competitions` — Competitions, hackathons, workshops, seminars
- `events` — Upcoming tasks and events with completion flag
- `gallery` — Gallery images with captions

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

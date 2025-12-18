# TourneyPro - Tournament Management Application

## Overview

TourneyPro is a full-stack web application for creating and managing sports tournaments. It supports three sport types: Padel (2 players per team), 8-sided Football (8 players per team), and 5-sided Football (5 players per team). Users can create tournaments with single-elimination or round-robin formats, manage teams and players, track match scores in real-time, and view brackets and standings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based architecture with reusable components:
- Pages located in `client/src/pages/` handle route-specific views
- Shared components in `client/src/components/` include tournament lists, bracket views, standings tables, and score dialogs
- UI primitives from shadcn/ui in `client/src/components/ui/` provide consistent design system

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API with `/api` prefix
- **Validation**: Zod schemas shared between frontend and backend via `shared/schema.ts`

The server uses a simple storage interface (`IStorage`) that currently uses in-memory storage but is designed to be swapped for database persistence. Routes are registered in `server/routes.ts` with standard CRUD operations for tournaments and matches.

### Data Models
Core entities defined in `shared/schema.ts`:
- **Tournament**: Contains type, format, teams, matches, and metadata
- **Team**: Has ID, name, and array of players
- **Match**: Tracks round, scores, status (upcoming/live/completed), and winner
- **Player**: Simple ID and name structure

Tournament types: `padel`, `football-8`, `football-5`
Tournament formats: `single-elimination`, `round-robin`

### Build System
- Development: Vite dev server with HMR proxied through Express
- Production: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- The build script in `script/build.ts` handles both client and server bundling

## External Dependencies

### Database
- **Drizzle ORM**: Schema definitions in `shared/schema.ts` with PostgreSQL dialect
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **drizzle-kit**: Used for database migrations (`db:push` script)

Note: The current implementation uses in-memory storage in `server/storage.ts`. The Drizzle schema is defined but database integration requires running `npm run db:push` after provisioning PostgreSQL.

### UI Component Library
- **shadcn/ui**: Full component suite with Radix UI primitives
- **Radix UI**: Accessible component primitives for dialogs, dropdowns, tabs, etc.
- **Lucide React**: Icon library

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)
- **express-session**: Session middleware support

### Fonts
- **Inter**: Primary UI font (loaded via Google Fonts)
- **JetBrains Mono**: Monospace font for scores and numerical data
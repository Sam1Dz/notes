# AI Agent Instructions for Notes App

## Project Overview

This is a Next.js 15 notes application using the App Router with TypeScript,
MongoDB, and modern React patterns. The app provides note-taking functionality
with archive and trash features.

## Architecture & File Structure

### Core Structure

- **`src/app/`**: Next.js App Router pages and layouts
  - `(main)/`: Main app routes with shared layout
  - `api/database/status/`: Health check endpoint
- **`src/components/`**: React components organized by feature
  - `ui/`: shadcn/ui components (Radix UI primitives)
  - `layout/`: App shell components (sidebar, header)
  - `provider/`: React context providers
- **`src/configs/`**: Configuration files (routes, fonts, env, site)
- **`src/libs/`**: Utilities and external service connections
- **`src/hooks/`**: Custom React hooks

### Key Patterns

#### Path Aliases

Use `~/` prefix for all imports from `src/`:

```typescript
import { cn } from '~/libs/utils';
import { Button } from '~/components/ui/button';
```

#### Component Architecture

- **Providers hierarchy**: `base.tsx` → `theme.tsx` → `app.tsx`
- **UI components**: Use shadcn/ui pattern with `cva` for variants
- **Layout pattern**: Sidebar navigation with `SidebarProvider` from shadcn/ui

#### Database Connection

```typescript
import { dbConnect } from '~/libs/mongodb';
// Connection is cached globally - call anytime
await dbConnect();
```

#### Environment Variables

Use `@t3-oss/env-nextjs` for type-safe env validation:

```typescript
import { envServer } from '~/configs/env';
// envServer.MONGODB_URI is validated and typed
```

## Development Workflow

### Commands

```bash
bun dev          # Start dev server with Turbopack
bun run build    # Production build with Turbopack
bun run lint     # ESLint check
bun run format   # Prettier formatting
bun run outdated # Check for dependency updates
```

### Build Configuration

- **Turbopack**: Enabled for both dev and build
- **TypeScript**: Strict mode with path mapping
- **ESLint**: Next.js + TypeScript + Prettier rules
- **Tailwind**: v4 with CSS variables and custom fonts

## UI/UX Patterns

### Styling

- **Tailwind CSS v4**: Use CSS variables for theming
- **Class merging**: Always use `cn()` utility for conditional classes
- **Fonts**: Roboto variants loaded via Next.js font optimization

### Components

- **shadcn/ui**: Follow established component patterns
- **Icons**: Lucide React icons throughout
- **Theming**: System/light/dark themes with `next-themes`

### Forms

- **React Hook Form**: With `@hookform/resolvers` and Zod
- **Validation**: Zod schemas for type-safe form validation

## Code Quality Standards

### TypeScript

- Strict mode enabled
- Consistent type imports (`import type`)
- Path aliases for clean imports

### Linting

- No console logs (except error/warn)
- Unused variables prefixed with `_` are ignored
- Import ordering enforced

### File Organization

- Feature-based component organization
- Configuration files in `configs/`
- Utilities in `libs/`
- Custom hooks in `hooks/`

## Database & API

### MongoDB

- Mongoose with connection caching
- Environment-based URI configuration
- Health check endpoint at `/api/database/status`

### API Routes

- Next.js API routes in `src/app/api/`
- Standard NextResponse patterns
- Error handling with proper status codes

## Navigation & Routing

### App Router Structure

- Route groups: `(main)` for shared layout
- Dynamic routes for notes management
- Static routes: `/`, `/archived`, `/trash`

### Sidebar Navigation

- Routes defined in `~/configs/route.ts`
- Active state management with `usePathname`
- Mobile-responsive with `useSidebar` hook

## Deployment & Environment

### Requirements

- Node.js >=22
- npm >=10.5.1
- Bun >=1.2 (recommended)

### Environment Setup

- `MONGODB_URI`: Required for database connection
- Validated at startup with helpful error messages

## Common Tasks

### Adding New Routes

1. Add route config to `~/configs/route.ts`
2. Create page in `src/app/(main)/[route]/page.tsx`
3. Update sidebar navigation automatically

### Adding UI Components

1. Use shadcn/ui CLI: `bunx shadcn@latest add [component]`
2. Follow existing patterns in `src/components/ui/`
3. Use `cn()` for class merging

### Database Operations

1. Import `dbConnect` from `~/libs/mongodb`
2. Call `await dbConnect()` before operations
3. Use Mongoose models (when implemented)

### Theming

- Use CSS variables defined in `globals.css`
- Theme switching handled by `next-themes`
- System theme detection enabled

## Key Files to Reference

- **`src/app/layout.tsx`**: Root layout with providers
- **`src/components/provider/app.tsx`**: Main app structure
- **`src/configs/route.ts`**: Navigation configuration
- **`src/libs/utils.ts`**: Utility functions
- **`src/components/ui/button.tsx`**: Component pattern example
- **`package.json`**: Scripts and dependencies
- **`components.json`**: shadcn/ui configuration</content>
  <parameter name="filePath">d:\Projects\Applications\Portfolio\notes\.github\copilot-instructions.md

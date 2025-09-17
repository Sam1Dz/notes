# AI Agent Instructions for Notes App

## Project Overview

This is a Next.js 15 notes application with TypeScript, MongoDB, and shadcn/ui
components. The app provides a clean interface for creating, organizing, and
managing personal notes with archive and trash functionality.

## Architecture & Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Database**: MongoDB with Mongoose (connection caching pattern in
  `src/libs/mongodb.ts`)
- **UI**: shadcn/ui components with Radix UI primitives, Tailwind CSS v4
- **Theming**: next-themes with CSS variables and system preference support
- **Fonts**: Roboto family (regular, serif, mono) configured in
  `src/configs/fonts.ts`
- **Environment**: T3 env for type-safe environment variables
  (`src/configs/env.ts`)
- **Forms**: React Hook Form with Zod validation and @hookform/resolvers

## Key Patterns & Conventions

### Path Aliases

Use `~/*` for imports from the `src/` directory:

```typescript
import { cn } from '~/libs/utils';
import { AppSidebar } from '~/components/app-sidebar';
```

### Component Structure

- Server components by default, client components marked with `'use client'`
- shadcn/ui components in `src/components/ui/` with "new-york" style
- Custom components in `src/components/` (app-sidebar, app-header,
  theme-provider)
- Utility function `cn()` from `src/libs/utils.ts` for className merging
- **Provider Pattern**: Multi-layered providers in `src/components/provider/`
  - `base.tsx`: Main provider wrapper
  - `theme.tsx`: Theme provider with next-themes
  - `app.tsx`: App-specific providers (sidebar, header)

### Route Groups

Use Next.js route groups for layout organization:

```
src/app/
├── layout.tsx          # Root layout with Provider
├── (main)/            # Route group for main app pages
│   ├── layout.tsx     # App layout with AppProvider
│   ├── page.tsx       # Home page
│   ├── archived/      # Archived notes
│   └── trash/         # Trash page
└── api/               # API routes
```

### Database Integration

- Use `dbConnect()` from `src/libs/mongodb.ts` for database connections
- Connection caching prevents multiple connections
- API routes follow Next.js App Router pattern (`src/app/api/`)

### Form Handling

Use React Hook Form with Zod for form validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function NoteForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Form implementation
}
```

### Styling Approach

- Tailwind CSS with custom CSS variables for theming
- Responsive design with mobile breakpoint at 768px (`src/hooks/use-mobile.ts`)
- Font variables applied at root level in `src/app/layout.tsx`
- Enhanced input components in `src/components/ui/shadcn-studio/` with icon
  support

### Code Quality Standards

- ESLint with strict rules including:
  - `@typescript-eslint/consistent-type-imports`: Use `import type` for
    type-only imports
  - `import/order`: Group imports (type, builtin, external, internal with `~/*`
    after external)
  - `react/jsx-sort-props`: Sort JSX props alphabetically
  - `padding-line-between-statements`: Enforce blank lines around statements
- Prettier with Tailwind CSS plugin for consistent formatting

### Navigation Structure

- Sidebar navigation with three main sections: Notes (/), Archived (/archived),
  Trash (/trash)
- Active route highlighting using `usePathname()` from Next.js
- Header with search functionality and user avatar

### Environment Variables

- Server-side env vars validated with Zod schema in `src/configs/env.ts`
- Currently only `MONGODB_URI` required
- Use `envServer.MONGODB_URI` for database connections

## Development Workflow

### Build Commands

```bash
npm run dev      # Development with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
npm run lint:fix # Auto-fix ESLint issues
npm run format   # Format with Prettier
```

### Adding UI Components

Use shadcn CLI for consistent component installation:

```bash
npx shadcn add [component-name]
```

Components install to `src/components/ui/` with proper TypeScript types and
styling.

### Enhanced Components

Use shadcn-studio variants for advanced features:

```typescript
import { Input } from '~/components/ui/shadcn-studio/input';

// Enhanced input with label, icons, and custom styling
<Input
  label="Search notes"
  placeholder='Search notes (e.g., "meeting", "project")'
  startIcon={Search}
  classNames={{
    container: 'max-w-3xl',
    input: 'h-8',
  }}
/>
```

### Database Operations

Always use the cached connection pattern:

```typescript
import { dbConnect } from '~/libs/mongodb';

await dbConnect();
// Perform database operations
```

### Theming Implementation

Theme provider wraps the entire app in `src/app/layout.tsx`:

- Supports system, light, dark themes
- CSS variables update automatically
- `disableTransitionOnChange` prevents flash during theme switches

## File Organization Reference

- `src/app/` - Next.js App Router pages and API routes
- `src/app/(main)/` - Route group for main application pages
- `src/components/` - Reusable React components
- `src/components/ui/` - shadcn/ui component library
- `src/components/ui/shadcn-studio/` - Enhanced UI components with advanced
  features
- `src/components/provider/` - Provider components (base, theme, app)
- `src/components/layout/` - Layout components (header, sidebar)
- `src/configs/` - Configuration files (fonts, site metadata, env)
- `src/hooks/` - Custom React hooks
- `src/libs/` - Utility libraries (MongoDB, utils)
- `src/styles/` - Global CSS and styling

## VS Code Configuration

Key settings in `.vscode/settings.json`:

- **TypeScript SDK**: Points to local `node_modules/typescript/lib`
- **ESLint**: Uses flat config with auto-fix on save
- **Prettier**: Default formatter with Tailwind CSS plugin
- **Tailwind CSS**: Custom regex patterns for class detection:
  ```json
  "tailwindCSS.experimental.classRegex": [
    ["(?:container|input)\\s*:\\s*['\"]([^'\"]*)['\"]"]
  ]
  ```
- **Import Organization**: Auto-organize imports on save
- **Format on Save**: Enabled for all files

## Commit Message Format

Follow Conventional Commits specification:

- Features: `feat(feature-name): description`
- Fixes: `fix: description`
- All messages in lowercase imperative mood
- See `.github/guidance/commit-message.md` for complete rules

## Common Patterns

- Use `React.PropsWithChildren` for components that accept children
- Export metadata from config files for Next.js SEO
- Client components for interactive features (navigation, theme switching)
- Server components for static content and data fetching
- Use React Hook Form for form handling with Zod validation
- Leverage shadcn-studio components for enhanced UI features
- Follow route groups pattern for organized page layouts</content>
  <parameter name="filePath">d:\Projects\Applications\Portfolio\notes\.github\copilot-instructions.md

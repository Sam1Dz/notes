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
import { cn } from '~/utils/core/class-merger';
import { Button } from '~/frontend/components/ui/button';
```

#### Provider Architecture

**Hierarchy**: `base.tsx` → `theme.tsx` → `app.tsx`

- **Base provider**: Wraps theme provider with next-themes configuration
- **Theme provider**: Enables system/light/dark themes with `next-themes`
- **App provider**: Main layout with `SidebarProvider` from shadcn/ui

```typescript
// src/frontend/components/provider/base.tsx
<ThemeProvider
  disableTransitionOnChange
  enableSystem
  attribute="class"
  defaultTheme="system"
>
  {children}
</ThemeProvider>
```

#### Component Architecture

- **UI components**: Use shadcn/ui pattern with `cva` for variants
- **Layout pattern**: Sidebar navigation with `SidebarProvider` and
  `SidebarInset`
- **Forms**: React Hook Form with `@hookform/resolvers` and Zod schemas

#### Database Connection

```typescript
import { dbConnect } from '~/utils/core/mongodb';
// Connection is cached globally - call anytime
await dbConnect();
```

Uses Mongoose with global caching to prevent multiple connections.

#### Environment Variables

Use `@t3-oss/env-nextjs` for type-safe env validation:

```typescript
import { envServer } from '~/configs/env';
// envServer.MONGODB_URI is validated and typed
```

## Development Workflow

### Commands

```bash
bun run dev          # Start dev server with Turbopack
bun run build    # Production build with Turbopack
bun run lint     # ESLint check
bun run lint:fix # ESLint auto-fix
bun run format   # Prettier formatting
bun run outdated # Check for dependency updates (uses npm-check-updates)
```

### Build Configuration

- **Turbopack**: Enabled via package.json scripts for both dev and build
- **TypeScript**: Strict mode with path mapping (`~/` → `./src/*`)
- **ESLint**: Next.js + TypeScript + Prettier rules
- **Tailwind**: v4 with CSS variables and custom fonts

## UI/UX Patterns

### Styling

- **Tailwind CSS v4**: Use CSS variables for theming in OKLCH color space
- **Class merging**: Always use `cn()` utility for conditional classes
- **Fonts**: Roboto variants loaded via Next.js font optimization
- **Theme variables**: Defined in `globals.css` with light/dark variants

### Components

- **shadcn/ui**: Follow established component patterns with `cva` variants
- **Icons**: Lucide React icons throughout
- **Theming**: System/light/dark themes with `next-themes`
- **Sidebar**: Mobile-responsive with `useSidebar` hook

### Forms

- **React Hook Form**: With `@hookform/resolvers` and Zod
- **Validation**: Zod schemas in `src/schemas/` with type inference
- **UI integration**: shadcn/ui form components with proper error handling

```typescript
// Example form pattern
const methods = useForm<Schema>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ },
});

<Form {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <FormField
      control={methods.control}
      name="field"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Database & API

### MongoDB

- Mongoose with connection caching in `src/utils/core/mongodb.ts`
- Environment-based URI configuration with validation
- Health check endpoint at `/api/database/status`

### API Routes

- Next.js API routes in `src/app/api/`
- Standard NextResponse patterns
- Error handling with proper status codes

### API Patterns

**Validation**: Use `withValidation` utility for request parsing:

```typescript
import { withValidation } from '~/utils/shared/validation';

export async function POST(request: Request) {
  const data = await withValidation(request, schema);
  // data is now validated and typed
}
```

**Database**: Use `withDatabase` wrapper for connection management:

```typescript
import { withDatabase } from '~/utils/core/mongodb';

return withDatabase(async () => {
  // Database operations here
});
```

**Responses**: Standardized success/error responses:

```typescript
import { apiSuccess, apiError } from '~/utils/core/api-response';

return apiSuccess('SUCCESS', 200, data, 'Operation completed');
return apiError('VALIDATION_ERROR', 400, [
  { detail: 'Invalid input', attr: 'field' },
]);
```

## Authentication

### JWT Implementation

- Access/refresh token pattern with `jsonwebtoken`
- Password hashing with `bcryptjs` (12 rounds)
- Token generation utilities in `src/utils/core/jwt.ts`

### User Management

- User model with Mongoose timestamps
- Service layer in `src/backend/services/user.service.ts`
- Email uniqueness constraints

## Navigation & Routing

### App Router Structure

- Route groups: `(main)` for shared layout
- Dynamic routes for notes management
- Static routes: `/`, `/archived`, `/trash`

### Sidebar Navigation

- Routes defined in `~/configs/route.ts` with icon components
- Active state management with `usePathname`
- Mobile-responsive with `useSidebar` hook

```typescript
// src/configs/route.ts
export const routes: Route[] = [
  {
    label: 'Notes',
    href: '/',
    icon: LuFileText,
  },
  // ...
];
```

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

## Integration Points

### External Dependencies

- **Database**: MongoDB via Mongoose
- **UI**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS v4 with custom theme system
- **Forms**: React Hook Form + Zod validation
- **Fonts**: Google Fonts (Roboto variants)
- **Icons**: Lucide React

### Authentication

- Auth routes in `src/app/auth/` with separate layout
- Form components in `src/frontend/components/app/auth/`
- Schema validation in `src/schemas/auth.ts`

## Deployment & Environment

### Requirements

- Node.js >=22
- npm >=10.5.1
- Bun >=1.2 (recommended)

### Environment Setup

- `MONGODB_URI`: Required for database connection
- `JWT_ACCESS_SECRET`: >=32 characters for access tokens
- `JWT_REFRESH_SECRET`: >=32 characters for refresh tokens
- Validated at startup with helpful error messages

## Common Tasks

### Adding New Routes

1. Add route config to `~/configs/route.ts`
2. Create page in `src/app/(main)/[route]/page.tsx`
3. Update sidebar navigation automatically

### Adding UI Components

1. Use shadcn/ui CLI: `bunx shadcn@latest add [component]`
2. Follow existing patterns in `src/frontend/components/ui/`
3. Use `cn()` for class merging

### Database Operations

1. Import `dbConnect` from `~/utils/core/mongodb`
2. Call `await dbConnect()` before operations
3. Use Mongoose models (when implemented)

### API Development

1. Create route in `src/app/api/[endpoint]/route.ts`
2. Use `withValidation` for request parsing
3. Wrap operations with `withDatabase`
4. Return standardized responses with `apiSuccess`/`apiError`

### Theming

- Use CSS variables defined in `globals.css`
- Theme switching handled by `next-themes`
- System theme detection enabled

## Key Files to Reference

- **`src/app/layout.tsx`**: Root layout with providers
- **`src/frontend/components/provider/app.tsx`**: Main app structure
- **`src/configs/route.ts`**: Navigation configuration
- **`src/utils/core/class-merger.ts`**: Utility functions (`cn()` for class
  merging)
- **`src/frontend/components/ui/button.tsx`**: Component pattern example with
  `cva`
- **`src/frontend/styles/globals.css`**: Theme variables and Tailwind config
- **`package.json`**: Scripts and dependencies
- **`components.json`**: shadcn/ui configuration (note: css path should be
  `src/frontend/styles/globals.css`)</content>
  <parameter name="filePath">d:\Projects\Applications\Portfolio\notes\.github\copilot-instructions.md

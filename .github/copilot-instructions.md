# AI Agent Instructions for Notes App

## Project Overview

This is a Next.js 15 notes application using the App Router with TypeScript,
MongoDB, and modern React patterns. Currently implements user authentication
with JWT tokens. Notes functionality is planned but not yet implemented.

## Architecture & File Structure

### Core Structure

- **`src/app/`**: Next.js App Router pages and layouts
  - `(main)/`: Main app routes with shared sidebar layout
  - `api/auth/`: Authentication endpoints (signin, signup, refresh)
  - `auth/`: Auth pages with separate layout
- **`src/components/`**: React components organized by feature
  - `ui/`: shadcn/ui components (Radix UI primitives)
  - `layout/`: App shell components (sidebar, header)
  - `providers/`: React context providers
- **`src/lib/config/`**: Configuration files (routes, fonts, env, site)
- **`src/lib/database/`**: Database models and types
- **`src/lib/hooks/`**: Custom React hooks
- **`src/lib/schemas/`**: Zod validation schemas
- **`src/lib/services/`**: Business logic services
- **`src/lib/utils/`**: Utilities organized by domain (api, auth, database,
  common)
- **`src/styles/`**: Global styles and Tailwind configuration

### Provider Architecture

**Hierarchy**: `base.tsx` → `app.tsx`

- **Base provider**: QueryProvider + ThemeProvider with next-themes
- **App provider**: Main layout with `SidebarProvider` from shadcn/ui

```typescript
// src/components/providers/base.tsx
<QueryProvider>
  <ThemeProvider
    disableTransitionOnChange
    enableSystem
    attribute="class"
    defaultTheme="system"
  >
    {children}
  </ThemeProvider>
</QueryProvider>
```

### Path Aliases

Use `~/` prefix for all imports from `src/`:

```typescript
import { cn } from '~/lib/utils/common/class-merger';
import { Button } from '~/components/ui/button';
```

## Development Workflow

### Commands

```bash
bun run dev          # Start dev server with Turbopack
bun run build        # Production build with Turbopack
bun run lint         # ESLint check
bun run lint:fix     # ESLint auto-fix
bun run format       # Prettier formatting
bun run outdated     # Check for dependency updates (uses npm-check-updates)
```

### Build Configuration

- **Turbopack**: Enabled via package.json scripts for both dev and build
- **TypeScript**: Strict mode with path mapping (`~/` → `./src/*`)
- **ESLint**: Next.js + TypeScript + Prettier rules
- **Tailwind**: v4 with CSS variables and custom fonts

## Database & API

### MongoDB

- Mongoose with global caching to prevent multiple connections
- Environment-based URI configuration with validation

```typescript
import { dbConnect } from '~/lib/utils/database/mongodb';
// Connection is cached globally - call anytime
await dbConnect();
```

### API Patterns

**Validation**: Use `withValidation` utility for request parsing:

```typescript
import { withValidation } from '~/lib/utils/api/validation';

export async function POST(request: Request) {
  const data = await withValidation(request, schema);
  // data is now validated and typed
}
```

**Database**: Use `withDatabase` wrapper for connection management:

```typescript
import { withDatabase } from '~/lib/utils/database/mongodb';

return withDatabase(async () => {
  // Database operations here
});
```

**Responses**: Standardized success/error responses:

```typescript
import { apiSuccess, apiError } from '~/lib/utils/api/response';

return apiSuccess('OK', 200, data, 'Operation completed');
return apiError('VALIDATION_ERROR', 400, [
  { detail: 'Invalid input', attr: 'field' },
]);
```

## Authentication

### JWT Implementation

- Access/refresh token pattern with `jsonwebtoken`
- Password hashing with `bcryptjs` (12 rounds)
- Token generation utilities in `src/lib/utils/auth/jwt.ts`

### User Management

- User model with Mongoose timestamps
- Service layer in `src/lib/services/user.ts`
- Email uniqueness constraints

## UI/UX Patterns

### Styling

- **Tailwind CSS v4**: Use CSS variables for theming in OKLCH color space
- **Class merging**: Always use `cn()` utility for conditional classes
- **Fonts**: Roboto variants loaded via Next.js font optimization
- **Theme variables**: Defined in `src/styles/globals.css` with light/dark
  variants

### Components

- **shadcn/ui**: Follow established component patterns with `cva` variants
- **Icons**: Lucide React icons throughout
- **Theming**: System/light/dark themes with `next-themes`
- **Sidebar**: Mobile-responsive with `useSidebar` hook

### Forms

- **React Hook Form**: With `@hookform/resolvers` and Zod validation
- **Validation**: Zod schemas in `src/lib/schemas/auth.ts` with type inference
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

## Navigation & Routing

### App Router Structure

- Route groups: `(main)` for shared layout
- Static routes: `/`, `/archived`, `/trash` (planned)
- Auth routes in separate layout group

### Sidebar Navigation

- Routes defined in `~/lib/config/route.ts` with icon components
- Active state management with `usePathname`
- Mobile-responsive with `useSidebar` hook

```typescript
// src/lib/config/route.ts
export const routes: Route[] = [
  {
    label: 'Notes',
    href: '/',
    icon: LuFileText,
  },
  // ...
];
```

## Environment Variables

Use `@t3-oss/env-nextjs` for type-safe env validation:

```typescript
import { envServer } from '~/lib/config/env';
// envServer.MONGODB_URI is validated and typed
```

Required variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: >=32 characters for access tokens
- `JWT_REFRESH_SECRET`: >=32 characters for refresh tokens

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
- Configuration files in `lib/config/`
- Utilities in `lib/utils/` subdirectories
- Services in `lib/services/`
- Database models in `lib/database/models/`

## Integration Points

### External Dependencies

- **Database**: MongoDB via Mongoose
- **UI**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS v4 with custom theme system
- **Forms**: React Hook Form + Zod validation
- **Fonts**: Google Fonts (Roboto variants)
- **Icons**: Lucide React

## Current Implementation Status

- ✅ User authentication (signup, signin, JWT tokens)
- ✅ Database connection with Mongoose
- ✅ UI component library (shadcn/ui)
- ✅ Theming system (light/dark/system)
- ✅ Sidebar navigation layout
- ✅ API response standardization
- ✅ Request validation utilities
- 🚧 Notes CRUD functionality (planned)
- 🚧 Archive/trash features (planned)

## Key Files to Reference

- **`src/app/layout.tsx`**: Root layout with providers
- **`src/components/providers/app.tsx`**: Main app structure
- **`src/lib/config/route.ts`**: Navigation configuration
- **`src/lib/utils/common/class-merger.ts`**: Utility functions (`cn()` for
  class merging)
- **`src/components/ui/button.tsx`**: Component pattern example with `cva`
- **`src/styles/globals.css`**: Theme variables and Tailwind config
- **`package.json`**: Scripts and dependencies
- **`components.json`**: shadcn/ui configuration</content>
  <parameter name="filePath">d:\Projects\Applications\Portfolio\notes\.github\copilot-instructions.md

# Copilot Instructions for Notes Application

## Project Overview

This is a **Next.js 15** (App Router) notes application with authentication,
built with **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and
**MongoDB/Mongoose**. The architecture follows **Clean Architecture** principles
with feature-based organization.

**Key Technologies**: Next.js 15, React 19, TypeScript, Bun, MongoDB, JWT auth,
React Query, React Hook Form, Zod validation, shadcn/ui (New York style)

## Architecture & Directory Structure

The codebase uses a **three-tier architecture** under `src/`:

### 1. `core/` - Application Infrastructure

Global configuration, database setup, and React providers. This is the
foundation layer.

```typescript
// Environment variables (validated with @t3-oss/env-nextjs + Zod)
import { envServer, envPublic } from '~/core/config/env';

// Database connection with caching
import { dbConnect, withDatabase } from '~/core/lib/database/mongodb';

// Mongoose models
import { User } from '~/core/lib/database/models';

// App-wide providers (React Query, themes)
import { AppProvider } from '~/core/providers/app';
```

### 2. `features/` - Business Features

Self-contained feature modules (auth, notes). Each feature has its own
components, services, schemas, and utilities.

```typescript
// Feature services (business logic - all server actions)
import { signUp, signIn } from '~/features/auth/services/auth';

// Feature schemas (Zod validation)
import { loginSchema } from '~/features/auth/schemas/auth';

// Feature utilities (JWT handling)
import { generateAccessToken } from '~/features/auth/utils/jwt';
```

### 3. `shared/` - Reusable Resources

UI components (shadcn/ui), hooks, utilities, and types used across features.

```typescript
// UI components (shadcn/ui New York style)
import { Button } from '~/shared/components/ui/button';

// Layout components
import { LayoutSidebar } from '~/shared/components/layout/sidebar';

// Utilities
import { cn } from '~/shared/utils/common/class-merger';
import { apiSuccess, apiError } from '~/shared/utils/api/response';
import { request } from '~/shared/utils/http/request';

// Hooks
import { useIsMobile } from '~/shared/hooks/use-mobile';
```

**Critical Rule**: Always use absolute imports with `~/` prefix (configured in
`tsconfig.json`). Never use relative imports across directories.

## API Route Patterns

All API routes follow a consistent pattern using **higher-order functions** for
validation and database connection:

```typescript
// Standard API route structure (see src/app/api/auth/signin/route.ts)
export async function POST(request: Request) {
  try {
    // 1. Validate request body with Zod schema
    const credentials = await withValidation(request, loginSchema);

    // 2. Ensure database connection + execute business logic
    return await withDatabase(async () => {
      const result = await authService.signIn(credentials);
      return apiSuccess('OK', 200, result, 'Login successful');
    });
  } catch (error) {
    // 3. Handle errors with standardized responses
    if (error instanceof ApiError) {
      return apiError('UNAUTHORIZED', error.status, [
        { detail: error.message, attr: null },
      ]);
    }
    if (error instanceof Response) return error;
    return internalServerError(error);
  }
}
```

**Key utilities**:

- `withValidation(request, schema)` - Validates request body, throws validation
  error response
- `withDatabase(handler)` - Ensures DB connection before executing handler
- `apiSuccess(code, status, data, detail)` - Returns standardized success
  response
- `apiError(code, status, errors, type?)` - Returns standardized error response

## Authentication Flow

**JWT-based authentication** with access & refresh tokens:

1. **Sign up/Sign in** → Returns `{ accessToken, refreshToken, user }`
2. **Client stores tokens** → Access token (15min), refresh token (7d)
3. **API calls** → Include `Authorization: Bearer {accessToken}` header
4. **Token refresh** → POST to `/api/auth/refresh` with `{ refreshToken }`

**Service layer** (`features/auth/services/auth.ts`):

- All functions are **server actions** (`'use server'`)
- Password hashing with `bcryptjs` (salt rounds: 12)
- JWT signing/verification in `features/auth/utils/jwt.ts`
- Uses `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` from env

## Forms & Validation

**React Hook Form + Zod** pattern (see
`features/auth/components/form/login.tsx`):

```typescript
const methods = useForm<LoginSchema>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '', rememberMe: false },
});

const { mutate, isPending } = useMutation({
  mutationFn: async (data: LoginSchema) => {
    await signIn('credentials', data);
  },
  onError: (error) => {
    showToast({
      message: 'Login Failed',
      description: error.message,
      type: 'error',
    });
  },
});
```

**Form components**: Use shadcn/ui `Form`, `FormField`, `FormControl`,
`FormMessage` wrappers around base inputs.

## Database Patterns

**Mongoose models** in `core/lib/database/models/`:

- All models have `EntityType` enum for type safety (see
  `shared/types/database.ts`)
- Use `stringifyObjectId()` to convert MongoDB ObjectId to string
- Connection is **cached globally** to prevent multiple connections in
  serverless

```typescript
// Always use withDatabase for DB operations in API routes
return await withDatabase(async () => {
  const user = await userService.findUserByEmail(email);
  // ... business logic
});
```

## Environment Variables

**Validation with @t3-oss/env-nextjs** (see `core/config/env.ts`):

**Server-only** (`envServer`):

- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Min 32 chars
- `JWT_REFRESH_SECRET` - Min 32 chars
- `SESSION_SECRET` - Min 32 chars

**Public** (`envPublic`):

- `NEXT_PUBLIC_API_URL` - API base URL

**Critical**: Environment variables are validated at build time. Missing or
invalid values will cause build failures.

## UI Components & Styling

**shadcn/ui (New York style)** with custom variants:

- Base components in `shared/components/ui/`
- Enhanced variants in `shared/components/ui/shadcn-studio/` (button, input,
  sonner)
- Use `cn()` utility for conditional classes:
  `cn('base-class', condition && 'conditional-class')`
- Tailwind config uses CSS variables for theming (see `src/styles/globals.css`)
- Icon library: `react-icons/lu` (Lucide icons)

**Responsive patterns**:

- `useIsMobile()` hook for mobile detection (< 768px)
- Sidebar uses `useSidebar()` from shadcn/ui for state management
- Mobile navigation auto-closes on route change

## Development Workflow

**Package manager**: Bun (required: `>= 1.2`)  
**Node version**: `>= 22`

**Commands**:

```bash
bun dev              # Start dev server with Turbopack
bun run build        # Production build
bun start            # Start production server
bun run lint         # ESLint check
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format with Prettier
bun run outdated     # Check for package updates
```

**ESLint config** (`eslint.config.mjs`):

- Next.js core-web-vitals + TypeScript
- TanStack Query plugin (enforces best practices)
- Prettier integration (no conflicting rules)

## Adding New Features

Follow the **feature-based structure**:

1. **Create feature directory**: `src/features/{feature-name}/`
2. **Standard structure**:
   ```
   {feature-name}/
   ├── components/      # Feature-specific UI
   ├── schemas/         # Zod validation schemas
   ├── services/        # Business logic (server actions)
   ├── utils/           # Feature utilities
   └── index.ts         # Barrel exports
   ```
3. **API routes** in `src/app/api/{feature-name}/`
4. **Pages** in `src/app/(main)/{feature-name}/` or `src/app/{feature-name}/`

**Decision guide**:

- **Shared across features?** → `shared/`
- **Feature-specific?** → `features/{feature}/`
- **Global config/infra?** → `core/`

## Common Patterns

**Error handling**:

- Throw `ApiError(message, status)` in services
- Catch in API routes and return standardized error responses
- Use `internalServerError(error)` for unexpected errors

**Type safety**:

- Infer types from Zod schemas: `type LoginSchema = z.infer<typeof loginSchema>`
- Use MongoDB type: `MongoEntityId` for ObjectId references
- Never use `any` - use `unknown` and type guards instead

**React Query**:

- Configure in `core/providers/query.tsx`
- Use `useMutation` for write operations
- Use `useQuery` for read operations (not yet implemented in codebase)

## References

- Full architecture details: `docs/PROJECT_STRUCTURE.md`
- shadcn/ui config: `components.json`
- TypeScript config: `tsconfig.json` (paths: `~/*` → `./src/*`)

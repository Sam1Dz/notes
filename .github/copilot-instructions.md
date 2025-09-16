# AI Coding Guidelines for Notes Portfolio App

## Architecture Overview

- **Framework**: Next.js 15 with App Router (`src/app/` structure)
- **Language**: TypeScript with strict mode enabled
- **Database**: MongoDB with Mongoose ODM, connection caching in
  `src/libs/mongodb.ts`
- **Styling**: Tailwind CSS v4 with shadcn/ui components (New York style)
- **Theme**: next-themes with system/dark/light modes via
  `src/components/theme-provider.tsx`
- **Package Manager**: Bun (≥1.1) with lockfile `bun.lock`

## Key Patterns & Conventions

### Path Aliases

- Use `~/*` for imports from `src/` directory (configured in `tsconfig.json`)
- Example: `import { dbConnect } from '~/libs/mongodb'`

### Environment Variables

- Use `@t3-oss/env-nextjs` for validation in `src/config/env.ts`
- Server variables: `envServer.MONGODB_URI`
- Always validate required env vars at startup

### Database Connection

- Use cached connection pattern in `src/libs/mongodb.ts`
- Call `await dbConnect()` before database operations
- API routes handle connection errors gracefully (see
  `src/app/api/database/status/route.ts`)

### Component Structure

- shadcn/ui components installed via `components.json` config
- Utility function `cn()` in `src/libs/utils.ts` for class merging
- Theme provider wraps entire app in `src/app/layout.tsx`
- Font configuration in `src/configs/fonts.ts` with Roboto variants

### Build Configuration

- **Next.js**: `next.config.ts` with `typedRoutes: true` enabled
- **PostCSS**: Configured for Tailwind CSS v4 in `postcss.config.mjs`
- **ESLint**: Flat config in `eslint.config.mjs` with TypeScript and Prettier
  integration
- **Tailwind**: CSS variables for theming in `src/styles/globals.css`

### Development Workflow

- **Start dev server**: `bun dev` (uses turbopack)
- **Build**: `bun run build` (with turbopack)
- **Lint**: `bun run lint` (ESLint with TypeScript rules)
- **Format**: `bun run format` (Prettier)
- **Check outdated deps**: `bun run outdated`
- **Version scheme**: YYYY.DDD.PATCH (e.g., 2025.915.0 for Sept 15, 2025)

### Code Quality Rules

- `no-console` warnings except for error/warn
- Consistent type imports required
  (`@typescript-eslint/consistent-type-imports`)
- Unused vars prefixed with `_` are ignored
- Import order: type → builtin → object → external → internal → parent → sibling
- JSX curly braces: never required for children/props
- React props sorted alphabetically with specific rules

### File Organization

- Components: `src/components/` (shadcn/ui compatible)
- Pages: `src/app/` (App Router)
- API routes: `src/app/api/` (database operations)
- Utils: `src/libs/` (database, helpers)
- Config: `src/configs/` (environment, fonts, site metadata)

## Common Patterns

### API Route Structure

```typescript
export async function GET() {
  try {
    await dbConnect();
    // ... logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

### Component Props with Theme

- Use `className={cn("base-classes", props.className)}` for extensible
  components
- Theme-aware styling via CSS variables in `src/app/globals.css`

### Database Operations

- Always await `dbConnect()` before MongoDB operations
- Use Mongoose models (when implemented) for type safety
- Handle connection errors with try/catch blocks

### Font Usage

```tsx
<body className={`${fontRoboto.variable} ${fontRobotoSerif.variable} ${fontRobotoMono.variable} antialiased`}>
```

### Theme Provider Setup

```tsx
<ThemeProvider
  disableTransitionOnChange
  enableSystem
  attribute="class"
  defaultTheme="system"
>
  {children}
</ThemeProvider>
```

</content>
  <parameter name="filePath">d:\Projects\Applications\Portfolio\notes\.github\copilot-instructions.md

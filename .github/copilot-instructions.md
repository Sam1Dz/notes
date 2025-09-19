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
- **Animations**: Framer Motion for component animations and transitions
- **Theming**: next-themes with CSS variables and system preference support
- **Fonts**: Roboto family (regular, serif, mono) configured in
  `src/configs/fonts.ts`
- **Environment**: T3 env for type-safe environment variables
  (`src/configs/env.ts`)
- **Forms**: React Hook Form with Zod validation and @hookform/resolvers
- **Icons**: react-icons for social SSO and UI elements

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
- **Auth Components**: Authentication system in `src/components/app/auth/`
  - `form/login.tsx`: Login form with validation
  - `logo.tsx`: Auth page logo component
  - `social-sso.tsx`: Social login buttons (GitHub)
- Utility function `cn()` from `src/libs/utils.ts` for className merging
- **Provider Pattern**: Multi-layered providers in `src/components/provider/`
  - `base.tsx`: Main provider wrapper
  - `theme.tsx`: Theme provider with next-themes
  - `app.tsx`: App-specific providers (sidebar, header)
- **Layout Components**: Modular layout structure in `src/components/layout/`
  - `header/index.tsx`: Main header component
  - `header/logo.tsx`: Logo component
  - `header/search.tsx`: Search component
  - `header/user.tsx`: User menu with theme switching and logout
  - `sidebar.tsx`: Sidebar navigation component
- **Enhanced Components**: shadcn-studio variants with advanced features
  - `shadcn-studio/button.tsx`: Animated button with ripple effects using Framer
    Motion
  - `shadcn-studio/input.tsx`: Enhanced input with label, icons, helper text,
    and error states
  - `shadcn-studio/button-group.tsx`: Grouped buttons with seamless styling

### Component Composition Patterns

Use composition for complex UI components:

```typescript
// Header composition pattern
export function LayoutHeader() {
  return (
    <header>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <HeaderLogo className="hidden md:flex" />
        <HeaderSearch className="md:hidden" />
      </div>
      <HeaderSearch className="hidden md:block" />
      <Avatar />
    </header>
  );
}
```

Centralize route configuration for maintainable navigation:

```typescript
// Route configuration pattern
interface Route {
  label: string;
  href: string;
  icon: ComponentType;
}

export const routes: Route[] = [
  { label: 'Notes', href: '/', icon: FileTextIcon },
  { label: 'Archived', href: '/archived', icon: ArchiveIcon },
  { label: 'Trash', href: '/trash', icon: Trash2Icon },
];
```

### Animation Patterns

Use Framer Motion for smooth component animations:

```typescript
// Animated button with ripple effect
import { Button } from '~/components/ui/shadcn-studio/button';

<Button variant="default" scale={10}>
  Click me!
</Button>
```

### Enhanced UI Components

Leverage shadcn-studio components for advanced features:

```typescript
// Enhanced input with label and icons
import { Input } from '~/components/ui/shadcn-studio/input';

<Input
  label="Search notes"
  placeholder="Search notes (e.g., 'meeting', 'project')"
  startIcon={SearchIcon}
  classNames={{
    container: 'max-w-3xl',
    input: 'h-8',
  }}
/>
```

### User Interface Patterns

Use dropdown menus and sheets for user interactions:

```typescript
// User menu with theme switching
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Color Scheme</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuCheckboxItem checked={theme === 'light'}>
          Light
        </DropdownMenuCheckboxItem>
        {/* ... other theme options */}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

Group related buttons for cohesive UI:

```typescript
// Button group for theme selection
<ButtonGroup className="w-full">
  <Button variant={theme === 'light' ? 'default' : 'outline'}>
    Light
  </Button>
  <Button variant={theme === 'dark' ? 'default' : 'outline'}>
    Dark
  </Button>
</ButtonGroup>
```

### Authentication Patterns

Use React Hook Form with Zod for authentication forms:

```typescript
// Auth schema with validation
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// Form component with validation
function AuthFormLogin() {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    // Handle authentication
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField name="email">
          <FormItem>
            <FormLabel isRequired>Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter your email" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        {/* ... other fields */}
      </form>
    </Form>
  );
}
```

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
├── auth/              # Route group for authentication pages
│   ├── layout.tsx     # Auth layout with centered content
│   ├── login/         # Login page
│   └── register/      # Register page
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

// Basic form schema
const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

function NoteForm() {
  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="title">
          <FormItem>
            <FormLabel isRequired>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter note title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="content">
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter note content" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>
    </Form>
  );
}
```

For authentication forms, use enhanced validation and error handling:

```typescript
// Auth schema with comprehensive validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
```

````

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
- **Route Configuration**: Centralized route definitions in
  `src/configs/route.ts`

```typescript
import { routes } from '~/configs/route';

// Routes are defined with label, href, and icon
routes.map((item) => (
  <SidebarMenuButton asChild isActive={pathname === item.href}>
    <Link href={item.href}>
      <item.icon />
      <span>{item.label}</span>
    </Link>
  </SidebarMenuButton>
));
````

### Environment Variables

- Server-side env vars validated with Zod schema in `src/configs/env.ts`
- Currently only `MONGODB_URI` required
- Use `envServer.MONGODB_URI` for database connections

## Development Workflow

### Build Commands

```bash
bun run dev      # Development with Turbopack
bun run build    # Production build with Turbopack
bun run start    # Start production server
bun run lint     # Run ESLint
bun run lint:fix # Auto-fix ESLint issues
bun run format   # Format with Prettier
```

### Adding UI Components

Use shadcn CLI for consistent component installation:

```bash
bunx shadcn add [component-name]
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

## File Organization Reference

- `src/app/` - Next.js App Router pages and API routes
- `src/app/(main)/` - Route group for main application pages
- `src/app/auth/` - Route group for authentication pages (login, register)
- `src/components/` - Reusable React components
- `src/components/app/` - Application-specific components
- `src/components/app/auth/` - Authentication components (login form, social
  SSO)
- `src/components/ui/` - shadcn/ui component library
- `src/components/ui/shadcn-studio/` - Enhanced UI components with advanced
  features
- `src/components/provider/` - Provider components (base, theme, app)
- `src/components/layout/` - Layout components (header, sidebar)
- `src/components/layout/header/` - Header sub-components (logo, search, user)
- `src/configs/` - Configuration files (fonts, site metadata, env, routes)
- `src/hooks/` - Custom React hooks
- `src/libs/` - Utility libraries (MongoDB, utils)
- `src/schemas/` - Zod validation schemas (auth, forms)
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
- Follow route groups pattern for organized page layouts
- **Component Composition**: Break down complex components into smaller,
  reusable parts
- **Route Configuration**: Centralize navigation routes in
  `src/configs/route.ts`
- **Responsive Design**: Use responsive classes for mobile-first approach
  (`md:hidden`, `md:flex`)
- **Sidebar Integration**: Use `useSidebar()` hook for mobile sidebar management
- **Animation Patterns**: Use Framer Motion for smooth component transitions and
  effects
- **User Interface Patterns**: Use dropdown menus for desktop and sheets for
  mobile interactions
- **Authentication Patterns**: Use React Hook Form with Zod for auth forms with
  comprehensive validation
- **Sidebar Integration**: Use `useSidebar()` hook for mobile sidebar management
- **Animation Patterns**: Use Framer Motion for smooth component transitions and
  effects
- **Component Composition**: Break down complex components into smaller,
  reusable parts
- **Route Configuration**: Centralize navigation routes in
  `src/configs/route.ts`
- **Responsive Design**: Use responsive classes for mobile-first approach
  (`md:hidden`, `md:flex`)
- **Sidebar Integration**: Use `useSidebar()` hook for mobile sidebar
  management</content>
  <parameter name="filePath">d:\Projects\Applications\Portfolio\notes\.github\copilot-instructions.md

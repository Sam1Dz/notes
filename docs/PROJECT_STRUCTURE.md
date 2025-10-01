# 📁 Enterprise Project Structure - Quick Reference

## 🎯 Three Main Directories

### 1. **`core/`** - Application Infrastructure

**When to use**: Global configs, database, providers

```typescript
import { envServer } from '~/core/config/env';
import { dbConnect } from '~/core/lib/database/mongodb';
```

### 2. **`features/`** - Business Features

**When to use**: Feature-specific logic (auth, notes, etc.)

```typescript
import { signIn } from '~/features/auth';
import { signUp } from '~/features/auth/services/auth';
```

### 3. **`shared/`** - Reusable Resources

**When to use**: UI components, hooks, utilities

```typescript
import { Button } from '~/shared/components/ui/button';
import { cn } from '~/shared/utils/common/class-merger';
```

---

## 📂 Full Directory Tree

```
src/
├── 📱 app/                          Next.js App Router
│   ├── (main)/                      Main app with sidebar
│   ├── api/                         API routes
│   └── auth/                        Auth pages
│
├── ⚙️ core/                          Core Infrastructure
│   ├── config/                      App configuration
│   │   ├── env.ts                  Environment validation
│   │   ├── fonts.ts                Font configuration
│   │   ├── route.ts                Navigation routes
│   │   └── site.ts                 Site metadata
│   ├── lib/
│   │   └── database/               Database setup
│   │       ├── models/             Mongoose models
│   │       └── mongodb.ts          Connection
│   └── providers/                   React providers
│       ├── app.tsx                 App provider
│       ├── base.tsx                Base provider
│       └── query.tsx               Query provider
│
├── 🎭 features/                     Business Features
│   ├── auth/                       Authentication
│   │   ├── components/            Auth components
│   │   ├── schemas/               Validation
│   │   ├── services/              Business logic
│   │   ├── utils/                 Auth utilities
│   │   ├── auth.ts                API client
│   │   ├── session.ts             Session mgmt
│   │   └── sign-in.ts             Sign-in action
│   └── notes/                      Notes (planned)
│
├── 🔧 shared/                       Shared Resources
│   ├── components/
│   │   ├── ui/                    shadcn/ui
│   │   └── layout/                Layouts
│   ├── hooks/                      Custom hooks
│   ├── types/                      TypeScript types
│   └── utils/                      Utilities
│       ├── api/                   API helpers
│       ├── common/                Common utils
│       └── http/                  HTTP helpers
│
└── 🎨 styles/                       Global Styles
    └── globals.css                 Tailwind + CSS vars
```

---

## 🔀 Import Path Examples

### ✅ Configuration

```typescript
import { envServer } from '~/core/config/env';
import { routes } from '~/core/config/route';
```

### ✅ Database

```typescript
import { User } from '~/core/lib/database/models';
import { dbConnect } from '~/core/lib/database/mongodb';
```

### ✅ Providers

```typescript
import { BaseProvider } from '~/core/providers/base';
import { AppProvider } from '~/core/providers/app';
```

### ✅ Auth Feature

```typescript
import { signUp } from '~/features/auth/services/auth';
import { loginSchema } from '~/features/auth/schemas/auth';
import { generateAccessToken } from '~/features/auth/utils/jwt';
```

### ✅ Shared Components

```typescript
import { Button } from '~/shared/components/ui/button';
import { LayoutHeader } from '~/shared/components/layout/header';
```

### ✅ Shared Utilities

```typescript
import { cn } from '~/shared/utils/common/class-merger';
import { apiSuccess } from '~/shared/utils/api/response';
import { request } from '~/shared/utils/http/request';
```

### ✅ Shared Hooks & Types

```typescript
import { useIsMobile } from '~/shared/hooks/use-mobile';
import type { EntityType } from '~/shared/types/database';
```

---

## 🎯 Decision Guide

### Where should I put...

#### **Configuration files?** → `core/config/`

- Environment variables
- Route definitions
- Site metadata
- Font configuration

#### **Database models?** → `core/lib/database/models/`

- Mongoose schemas
- Database types
- DB connection logic

#### **Feature-specific code?** → `features/{feature-name}/`

- Components used only by this feature
- Business logic services
- Feature-specific schemas
- Feature-specific utilities

#### **Reusable components?** → `shared/components/`

- UI components (buttons, inputs, etc.)
- Layout components (headers, sidebars)
- Components used across multiple features

#### **Utility functions?** → `shared/utils/`

- API helpers
- HTTP utilities
- Common functions (cn, formatters)
- Type definitions

#### **Custom hooks?** → `shared/hooks/`

- useIsMobile
- useDebounce
- Any reusable React hooks

---

## 📋 Best Practices

### ✅ DO

- Use barrel exports (`index.ts`) for cleaner imports
- Keep features self-contained
- Put shared code in `shared/`
- Use absolute imports with `~/`
- Group by feature, not by file type

### ❌ DON'T

- Mix feature-specific code with shared code
- Create circular dependencies between features
- Put all utilities in one giant file
- Use relative imports across directories
- Duplicate code between features

---

## 🚀 Adding a New Feature

1. **Create feature directory**: `src/features/new-feature/`
2. **Add standard structure**:
   ```
   new-feature/
   ├── components/      # Feature UI
   ├── schemas/         # Validation
   ├── services/        # Business logic
   ├── utils/           # Feature utilities
   └── index.ts         # Barrel exports
   ```
3. **Export from index**: `export * from './services/new-service';`
4. **Use in app**: `import { something } from '~/features/new-feature';`

---

## 🔍 Quick Search

**Find a component**: Check `shared/components/ui/` first **Find business
logic**: Check `features/{feature}/services/` **Find utilities**: Check
`shared/utils/{category}/` **Find types**: Check `shared/types/` or
`features/{feature}/schemas/` **Find config**: Check `core/config/`

---

## 📚 Related Documentation

- Full refactoring details: `REFACTORING_SUMMARY.md`
- AI instructions: `.github/copilot-instructions.md`
- Component library: `components.json` (shadcn/ui)

---

**Last Updated**: October 1, 2025  
**Architecture Pattern**: Clean Architecture + Feature-based Organization  
**Status**: ✅ Production Ready

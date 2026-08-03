# AGENTS.md — ECTYRE Frontend

## Build / Lint / Test

```bash
npm run dev      # Start Vite dev server (--host)
npm run build    # Production build (Terser minification, code splitting)
npm run lint     # ESLint check (JS/JSX, react-hooks, react-refresh)
npm run preview  # Preview production build
```

**No test framework is configured.** If you add tests, use Vitest (already compatible with Vite).

## Project Overview

- **Stack:** React 19, Vite 7, JavaScript (JSX), Tailwind CSS 3
- **State:** Redux Toolkit (slices in `src/store/slices/*.slice.js`)
- **Routing:** React Router v7 (`src/router/index.jsx`)
- **HTTP:** Axios (`src/lib/api.js` — JWT interceptor, 401 handling)
- **UI Library:** shadcn/ui (Radix-based), `class-variance-authority`, `tailwind-merge`
- **Path alias:** `@/` → `./src/` (configured in `vite.config.js` and `jsconfig.json`)

## Code Style Guidelines

### Imports
- Group: React/third-party first, then local modules (separated by blank line)
- Use `.jsx` extension for local component imports
- Use `@/` alias for src-relative imports (e.g., `import { cn } from '@/lib/utils'`)
- Named exports preferred for utilities/hooks; default exports for page components
- Example:
  ```jsx
  import { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import { cn } from "@/lib/utils";
  import api from "../../lib/api";
  ```

### Components
- Functional components only, using `function` or `const` declarations
- PascalCase for component names and filenames (`Button.jsx`, `Header.jsx`)
- shadcn components go in `src/components/ui/`
- Page components go in `src/pages/shop/` or `src/pages/admin/`
- Reusable business components go in `src/components/` (subfolders by domain)
- Custom hooks go in `src/hooks/` with `use` prefix (`useCart.js`, `useAuth.js`)
- Services go in `src/services/` as object literals or named exports
- Constants go in `src/constants/index.js` using `UPPER_SNAKE_CASE`
- Redux slices follow `name.slice.js` naming convention

### Formatting & Syntax
- 2-space indentation
- Semicolons required
- Trailing commas on multiline objects/arrays
- Single or double quotes (both used — be consistent with surrounding code)
- No `console.log` in committed code (stripped in production build via Terser)

### Types
- This is a **JavaScript** project (no TypeScript)
- Use JSDoc for non-trivial function signatures
- Use `prop-types` package for component props validation (sparingly)

### Error Handling
- Async thunks: catch errors, return `rejectWithValue(error.response?.data?.message || 'fallback message')`
- API service methods: use try/catch, reject with descriptive messages
- API interceptors in `src/lib/api.js` handle 401 globally (clear token, dispatch `auth:logout` event, redirect)
- Optional: wrap route trees with `<ErrorBoundary>` (component exists at `src/components/ui/ErrorBoundary.jsx`)

### State Management (Redux Toolkit)
- Use `createSlice` with `name`, `initialState`, `reducers`, `extraReducers`
- Async operations use `createAsyncThunk`
- Export slice actions (`actions`) and reducer (`reducer`) separately
- File pattern: `src/store/slices/{name}.slice.js`

### Routing
- Shop pages: lazy-loaded, wrapped in `<PublicLayout>` (Header + Footer)
- Admin pages: lazy-loaded, wrapped in `<AdminLayout>` + `<AdminRoute>` guard
- Protected routes use `<ProtectedRoute>` component
- All routes defined in `src/router/index.jsx`

### Styling
- **Tailwind CSS** is the primary styling approach
- CSS files only for complex animations, print styles, or base resets
- shadcn CSS variables defined in `src/index.css`
- Utility: `cn()` from `@/lib/utils` (combines `clsx` + `tailwind-merge`)

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase file | `Header.jsx`, `ProductCard.jsx` |
| Hooks | camelCase with `use` prefix | `useAuth.js`, `useCart.js` |
| Services | camelCase | `auth.service.js`, `cart.service.js` |
| Redux slices | kebab-case with `.slice` suffix | `cart.slice.js` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEYS`, `API_TIMEOUT` |
| CSS files | PascalCase (matching component) | `Header.css`, `HomePage.css` |
| Utilities | camelCase | `apiCache.js`, `leafletIconFix.js` |

### Language
- **All comments and documentation must be in SPANISH**
- Code identifiers (variables, functions, components) in English
- Commit messages in Spanish or English (follow existing style)

### Before Creating Routes/Components/API Calls
- **ALWAYS** review the service files in `src/services/` to identify real backend endpoints
- Refer to `plan_cloudinary_ectyre_frontend.md` for Cloudinary image upload integration details
- Do not invent fake endpoints or schemas

### Existing Rules (Cursor & Copilot)
From `.agents/rules/.cursorrules`:
- Comments/documentation in Spanish
- Functional components + React Hooks
- Tailwind CSS preferred over separate CSS files
- Reusable components in `src/components`
- Validate API endpoints via Postman collection before creating routes/components

From `.github/copilot-instructions.md`:
- Always verify React/JSX syntax correctness
- Use modern React/JSX patterns

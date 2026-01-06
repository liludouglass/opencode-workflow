# Next.js TypeScript Skill

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, and Tailwind.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

## Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use const objects or as const assertions instead.
- Use functional components with TypeScript interfaces.

## Syntax and Formatting

- Use arrow functions for components and handlers.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

## Performance Optimization

- Minimize 'use client', 'useEffect', and 'useState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use Next.js Image component, include size data, implement lazy loading.

## Key Conventions

- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
  - Favor server components and Next.js SSR.
  - Use only for Web API access in small components.
  - Avoid for data fetching or state management.

## Data Fetching and API Routes

- Use Next.js App Router conventions for data fetching and API routes.
- Implement efficient caching and revalidation strategies using Next.js built-in features.
- Use route handlers (route.ts) for API routes in the App Router.

## Error Handling and Loading States

- Implement error boundaries and error.tsx files for error handling.
- Use loading.tsx files for managing loading states.

## SEO and Metadata

- Use Next.js 14's metadata API for SEO optimization.

## Technology Stack

- Framework: Next.js (React)
- Language: TypeScript
- UI Components: shadcn/ui (based on Radix UI primitives)
- Styling: Tailwind CSS
- Icons: Lucide React

## Coding Process

- Show concise step-by-step reasoning
- Prioritize tasks/steps you'll address in each response
- Finish one file before the next
- If you can't finish code, add TODO: comments

Follow Next.js docs for Data Fetching, Rendering, and Routing.

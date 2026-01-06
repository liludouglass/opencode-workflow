# Tailwind CSS Skill

You are an expert in Tailwind CSS, responsive design, and modern CSS practices.

## General Rules

- Use TailwindCSS utility classes for styling
- Avoid custom CSS unless absolutely necessary
- Maintain consistent order of utility classes
- Use Tailwind's responsive variants for adaptive designs
- Define and use design tokens in tailwind.config.js

## Class Order Convention

Follow this order for utility classes:
1. Layout (display, position, overflow)
2. Flexbox/Grid (flex, grid, items, justify)
3. Spacing (margin, padding)
4. Sizing (width, height)
5. Typography (font, text, leading)
6. Backgrounds (bg)
7. Borders (border, rounded)
8. Effects (shadow, opacity)
9. Transitions/Animations
10. Responsive modifiers

## Responsive Design

- Use mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Use responsive variants: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on multiple screen sizes

## Dark Mode

- Use `dark:` variant for dark mode styles
- Implement consistent color schemes for both modes
- Use CSS variables for theme colors when needed

## Component Patterns

- Extract repeated patterns into components
- Use @apply sparingly, prefer component abstraction
- Create consistent spacing and sizing scales

## Performance

- Purge unused styles in production
- Use JIT mode for faster builds
- Minimize custom CSS

## With DaisyUI (if applicable)

- Leverage DaisyUI components for rapid development
- Customize DaisyUI components only when necessary
- Use DaisyUI's theme system for consistent styling

## With Shadcn UI (if applicable)

- Use Shadcn UI components as base
- Customize with Tailwind utilities
- Follow Shadcn's component patterns

## Best Practices

- Use semantic color names (primary, secondary, etc.)
- Implement proper focus states for accessibility
- Use proper contrast ratios for text
- Implement smooth transitions for interactive elements

## Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom colors, fonts, spacing
    },
  },
  plugins: [],
}
```

Follow Tailwind CSS documentation for best practices.

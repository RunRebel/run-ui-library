# RUN:REBEL System v2.0

## Taxonomy (5 Levels)

### Level 0: Tokens
CSS custom properties for design system values.
- Colors, spacing, typography, shadows, animations
- No logic, pure values
- Location: `00-tokens/`

### Level 1: Elements
Enhanced HTML elements with styling but no JavaScript.
- Buttons, inputs, headings, cards
- Visual variations through data attributes
- Location: `01-elements/`

### Level 2: Components
Functional units with state and behavior.
- **Simple**: Single-purpose (modal, dropdown, tooltip)
- **Complex**: Multi-part coordination (product-card, data-table)
- **Sections**: Page sections (hero, features, testimonials)
- Location: `02-components/{simple,complex,sections}/`

### Level 3: Layouts
Spatial organization structures without business logic.
- Container, grid, stack, sidebar, split
- Responsive by default
- Location: `03-layouts/`

### Level 4: Templates
Full page compositions orchestrating components and layouts.
- Landing, product, dashboard, article
- High-level coordination
- Location: `04-templates/`

## Decision Rules

1. **Is it just a value?** → Token
2. **HTML without logic?** → Element
3. **Has state or events?** → Component
4. **Defines spatial structure?** → Layout
5. **Full page composition?** → Template

## Code Patterns

### Element Pattern
```html
<element data-element="name" data-variant="primary">
  <slot>Content</slot>
</element>
<style>/* Only CSS */</style>
<!-- NO SCRIPT -->
```

### Component Pattern
```html
<div data-component="name" data-state='{}'>  
  <style>/* Scoped styles */</style>
  <script>
  CS.component('name', {
    init() { /* Initialize */ },
    method() { /* Custom methods */ }
  });
  </script>
</div>
```

### Layout Pattern
```html
<div data-layout="name" data-config="value">
  <style>/* Structural CSS only */</style>
  <slot><!-- Components go here --></slot>
  <!-- Minimal/No script -->
</div>
```

### Template Pattern
```html
<div data-template="name">
  <style>/* Page-level styles */</style>
  <!-- Compose layouts and components -->
  <script>
  CS.template('name', {
    init() { /* Orchestration only */ }
  });
  </script>
</div>
```

## Transform Guidelines

When transforming existing code:

1. **Extract tokens first** - Identify all values
2. **Separate structure from behavior** - HTML/CSS vs JS
3. **Identify components by state** - If it changes, it's a component
4. **Group related components** - But keep them independent
5. **Use composition over inheritance** - Small, focused units

## Best Practices

- **Single Responsibility**: Each unit does one thing well
- **Data Attributes**: Configuration through `data-*`
- **Scoped Styles**: Styles within component boundaries
- **Event Communication**: Components emit, don't couple
- **Progressive Enhancement**: Works without JS when possible
- **Accessibility First**: ARIA labels, keyboard navigation

## File Naming

- Tokens: `{category}.css` (colors.css, spacing.css)
- Elements: `{element}.html` (button.html, card.html)
- Components: `{component}.html` (modal.html, carousel.html)
- Layouts: `{layout}.html` (grid.html, sidebar.html)
- Templates: `{template}.html` (landing.html, dashboard.html)

## Version
Current: v2.0.0
Previous: v1.0.0 (7-level system, deprecated)
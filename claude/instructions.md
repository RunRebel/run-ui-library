# RUN:REBEL Component Intelligence System v2.0

## Overview

RUN:REBEL is a 5-level taxonomy system for building maintainable web components with zero dependencies. Designed specifically for Webflow integration but works everywhere.

## Taxonomy Levels

### Level 0: Tokens 🎨
CSS custom properties that define your design system.

**Location**: `00-tokens/`  
**Example**: `--color-primary: #007bff`  
**Usage**: Design consistency across all levels

### Level 1: Elements 🏗️
Enhanced HTML elements without JavaScript logic.

**Location**: `01-elements/`  
**Identifier**: `data-element="name"`  
**Example**: `<button data-element="button" data-variant="primary">`

### Level 2: Components 🧩
Self-contained units with state and logic.

**Location**: `02-components/`  
**Subcategories**:
- `simple/` - Single responsibility (modal, dropdown)
- `complex/` - Multiple coordinated parts (product-card, data-table)
- `sections/` - Page sections (hero, testimonials)

**Identifier**: `data-component="name"`  
**Example**: `<div data-component="modal" data-open="false">`

### Level 3: Layouts 📐
Spatial organization structures without business logic.

**Location**: `03-layouts/`  
**Identifier**: `data-layout="name"`  
**Example**: `<div data-layout="grid" data-columns="3">`

### Level 4: Templates 📄
Complete page compositions.

**Location**: `04-templates/`  
**Identifier**: `data-template="name"`  
**Example**: `<div data-template="landing">`

## Decision Tree

```
┌─ Has only visual properties? ──→ Token
├─ Is HTML without logic? ───────→ Element  
├─ Has state or behavior? ───────→ Component
├─ Defines spatial structure? ───→ Layout
└─ Is a complete page? ──────────→ Template
```

## Component Features

Former "patterns" are now optional component features:

```html
<!-- v1.0 (deprecated) -->
<div data-component="card" data-pattern="draggable">

<!-- v2.0 -->
<div data-component="card" data-draggable="true">
```

## API Reference

### Core Methods

```javascript
// Detection
CS.detect(element) // Returns: 'element' | 'component' | 'layout' | 'template'

// Registration
CS.token(name, value)
CS.element(name, config)
CS.component(name, definition)
CS.layout(name, definition)
CS.template(name, definition)

// Instance Management
CS.get(element)
CS.create(element, definition)
CS.enhance(selector)

// Events
CS.on(event, handler)
CS.emit(event, data)
```

### Component Instance API

```javascript
{
  el,                    // DOM element
  type,                  // Taxonomy level
  config,                // Parsed data attributes
  state,                 // Component state
  $(selector),           // querySelector
  $$(selector),          // querySelectorAll
  emit(event, data),     // Emit namespaced event
  destroy()              // Cleanup
}
```

## Webflow Integration

### Installation

1. **Project Settings > Custom Code > Head**:
```html
<script src="https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/cs/core.js"></script>
```

2. **Project Settings > Custom Code > Footer** (optional):
```html
<script>
window.Webflow && window.Webflow.push(() => CS.init());
</script>
```

### Usage in Webflow

1. Add HTML Embed element
2. Paste component code
3. Component auto-initializes

## Migration from v1.0

Run the migration script:
```bash
node scripts/migrate-v2.js
```

Changes:
- `data-pattern` → `data-{feature}="true"`
- `data-module` → `data-component`
- `data-section` → `data-component`

## Best Practices

1. **Tokens First**: Define your design system
2. **Compose, Don't Inherit**: Use composition over complexity
3. **Single Responsibility**: Each component does one thing well
4. **Progressive Enhancement**: Works without JavaScript
5. **Semantic HTML**: Use appropriate elements

## Examples

### Simple Component
```html
<div data-component="alert" data-type="success" data-dismissible="true">
  <p>Operation successful!</p>
  <button data-action="dismiss">×</button>
</div>
```

### Layout + Components
```html
<div data-layout="grid" data-columns="3">
  <div data-component="card">...</div>
  <div data-component="card">...</div>
  <div data-component="card">...</div>
</div>
```

## Performance

- Core: 2kb gzipped
- Reactive module: +1.5kb when needed
- VDOM module: +2.5kb when needed
- Lazy loading for heavy components

## Browser Support

- Modern browsers (ES6+)
- Graceful degradation for older browsers
- No polyfills required

## License

MIT

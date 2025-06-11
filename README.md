# 🚀 RUN:REBEL - Component Intelligence System

## Mínimo Máximo para Webflow

Sistema híbrido inteligente que transforma cualquier código en componentes optimizados para Webflow.

### 🎯 Características

- **Sin dependencias**: Todo es vanilla JS
- **Carga adaptativa**: Solo carga lo que necesita (2kb - 15kb)  
- **Transform inteligente**: React/Vue/jQuery → Componentes limpios
- **Claude MCP Ready**: Generación inteligente con IA
- **Taxonomía clara**: 5 niveles bien definidos

### 📊 Nueva Estructura v2.0

```
00-tokens/           # Variables de diseño
├── base.css        # Tokens del sistema

01-elements/         # HTML mejorado (sin JS)
├── button.html     
├── input.html      
└── card.html       

02-components/       # Unidades funcionales
├── simple/         # Un solo propósito
├── complex/        # Multi-componentes  
└── sections/       # Secciones de página

03-layouts/          # Estructuras espaciales
├── container.html  
├── grid.html       
└── sidebar.html    

04-templates/        # Páginas completas
├── landing.html    
└── dashboard.html  

.cs/                 # Sistema core
├── core.js         # Base (2kb) - v2.0
├── reactive.js     # Estado reactivo (5kb)
└── vdom.js         # Virtual DOM (8kb)

.claude/             # Configuración IA
├── instructions.md # Guía completa v2.0
└── patterns.json   # Reglas de detección
```

### 🚀 Quick Start

1. **En Webflow:**
```html
<script src="https://cdn.jsdelivr.net/gh/zaste/run-rebel@v2/.cs/core.js"></script>
```

2. **Usar un componente:**
```html
<div data-component="modal">
  <button data-trigger>Abrir</button>
  <div data-content>
    <h2>Mi Modal</h2>
    <p>Contenido aquí</p>
  </div>
</div>
```

3. **Copiar y pegar en Webflow Embed**

### 📐 Reglas de Decisión

| Si es... | Usar... | Ejemplo |
|----------|---------|---------|
| Solo valores | Token | `--color-primary` |
| HTML sin lógica | Element | `<button data-element="button">` |
| Tiene estado/eventos | Component | `<div data-component="dropdown">` |
| Define espacio | Layout | `<div data-layout="grid">` |
| Página completa | Template | `<div data-template="landing">` |

### 🔄 Migración de v1 a v2

```bash
# Automático
[data-pattern="x"] → [data-x="true"]
[data-module] → [data-component]  
[data-section] → [data-component]
```

### 📚 Documentación

- [Guía completa](.claude/instructions.md)
- [Ejemplos](docs/quick-start.md)
- [Patrones](.claude/patterns.json)

### 🌟 v2.0 Changelog

- ✅ Simplificado de 7 a 5 niveles
- ✅ Patterns → Features opcionales
- ✅ Modules/Sections → Components
- ✅ Nuevo nivel Layouts
- ✅ Mejor detección automática
- ✅ Retrocompatible con v1

### 📄 Licencia

MIT
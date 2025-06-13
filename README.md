# 🚀 RUN:UI.LIBRARY - Component Intelligence System - Webflow compatible

Sistema híbrido inteligente que transforma cualquier código en componentes optimizados para Webflow.

### 🎯 Características

- **Sin dependencias**: Todo es vanilla JS
- **Carga adaptativa**: Solo carga lo que necesita (2kb - 15kb)
- **Transform inteligente**: React/Vue/jQuery → Componentes limpios
- **Claude MCP Ready**: Generación inteligente con IA

### 📁 Estructura

```
components/          # Tus componentes listos
├── simple/         # Sin estado (0kb extra)
├── reactive/       # Con estado (5kb extra)
└── complex/        # Con virtual DOM (13kb extra)

.cs/                # Sistema core
├── core.js         # Base siempre presente (2kb)
├── reactive.js     # Módulo reactivo (5kb)
└── vdom.js         # Virtual DOM (8kb)

.claude/            # Configuración IA
├── instructions.md # Instrucciones para Claude
├── patterns.json   # Patrones aprendidos
└── examples/       # Ejemplos de referencia
```

### 🚀 Quick Start

1. **En Webflow:**
```html
<script src="https://cdn.jsdelivr.net/gh/zaste/run-rebel/.cs/core.js"></script>
```

2. **Usar con Claude:**
```
Genera un modal con el sistema run-rebel
```

3. **Copiar y pegar en Webflow Embed**

### 📖 Documentación

Ver [.claude/instructions.md](.claude/instructions.md) para guía completa.

### 📄 Licencia

MIT

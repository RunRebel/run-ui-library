# RUN:REBEL - Instrucciones para Claude

## 🎯 Objetivo

Transformar cualquier código en componentes optimizados para Webflow usando el sistema RUN:REBEL.

## 📦 Sistema de Componentes

### Categorías

1. **Simple** (0kb extra)
   - Sin estado
   - Solo eventos DOM
   - Ejemplo: modals, tooltips, accordions

2. **Reactive** (+5kb)
   - Con estado reactivo
   - Necesita `CS.reactive`
   - Ejemplo: forms, counters, filters

3. **Complex** (+13kb)
   - Listas dinámicas
   - Necesita `CS.vdom`
   - Ejemplo: tables, galleries, trees

## 🔄 Reglas de Transformación

### React → RUN:REBEL

```javascript
// React
const [count, setCount] = useState(0);

// RUN:REBEL
const count = CS.reactive.state(0);
count.set(1); // o count.set(c => c + 1);
```

### jQuery → RUN:REBEL

```javascript
// jQuery
$('.button').click(function() {
  $(this).toggleClass('active');
});

// RUN:REBEL
this.$('.button').onclick = () => {
  this.el.classList.toggle('active');
};
```

### Vue → RUN:REBEL

```javascript
// Vue
data() {
  return { open: false }
}

// RUN:REBEL
const open = CS.reactive.state(false);
```

## 📝 Template Base

```html
<div data-cs="component-name" data-prop="value">
  <style>
    /* Estilos locales */
    [data-cs="component-name"] {
      /* ... */
    }
  </style>
  
  <!-- Markup -->
  
  <script>
  CS['component-name'] = {
    init() {
      // Setup
    },
    
    render() {
      // Actualizar DOM
    }
  };
  </script>
</div>
```

## 🎯 Best Practices

1. **Análisis primero**: Detecta qué features necesita
2. **Mínimo necesario**: No cargues reactive/vdom si no se necesita
3. **Data attributes**: Toda config via data-*
4. **Eventos globales**: Usa el formato `component:action`
5. **Sin dependencias**: Todo debe ser autocontenido

## 🚀 Ejemplos

Ver `/components/` para ejemplos de cada categoría:
- Simple: `/components/simple/modal.html`
- Reactive: `/components/reactive/form.html`
- Complex: `/components/complex/datatable.html`
# Integración con Webflow

## Setup Inicial

### 1. Agregar RUN:REBEL a tu proyecto Webflow

**Opción A: CDN (Recomendado)**

En Project Settings > Custom Code > Head Code:

```html
<!-- RUN:REBEL Core - Siempre presente -->
<script src="https://cdn.jsdelivr.net/gh/zaste/run-rebel@latest/.cs/core.js"></script>

<!-- Opcional: Pre-cargar módulos si sabes que los necesitas -->
<script>
// CS.load('reactive'); // Para componentes con estado
// CS.load('vdom');     // Para listas dinámicas
</script>
```

**Opción B: Código Inline (Más confiable)**

Copia el contenido de `core.js` directamente:

```html
<script>
// Contenido de core.js pegado aquí
(function(global) {
  // ... código del sistema
})(window);
</script>
```

### 2. Configurar Re-inicialización

Webflow re-renderiza elementos dinámicamente. Agrega esto al Custom Code:

```html
<script>
// Re-init cuando Webflow actualiza el DOM
if (window.Webflow) {
  window.Webflow.push(function() {
    CS.init();
  });
  
  // Para interacciones de Webflow
  window.Webflow.ready = function() {
    CS.init();
  };
}

// Para cambios dinámicos
document.addEventListener('DOMContentLoaded', function() {
  // Observar el DOM para nuevos componentes
  const observer = new MutationObserver(function() {
    CS.init();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
</script>
```

## Uso en Webflow

### 1. Componente Simple (Embed)

1. Agrega un **Embed** element donde quieras el componente
2. Pega el HTML del componente:

```html
<div data-cs="notification" data-message="¡Bienvenido!" data-type="success">
  <style>
    [data-cs="notification"] {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    [data-cs="notification"][data-type="success"] {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    [data-cs="notification"] .close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.5;
    }
    
    [data-cs="notification"] .close:hover {
      opacity: 1;
    }
  </style>
  
  <div class="message"></div>
  <button class="close">×</button>
  
  <script>
  CS.notification = {
    init() {
      this.$('.message').textContent = this.config.message;
      
      this.$('.close').onclick = () => {
        this.el.style.display = 'none';
        this.emit('closed');
      };
      
      // Auto-close after 5s
      if (this.config.autoclose !== 'false') {
        setTimeout(() => {
          this.el.style.display = 'none';
        }, 5000);
      }
    }
  };
  </script>
</div>
```

### 2. Componente con CMS

Puedes usar datos del CMS de Webflow:

```html
<!-- En un Collection List -->
<div data-cs="product-card" 
     data-name="{Product Name}" 
     data-price="{Price}"
     data-image="{Main Image}">
  
  <img class="product-image" src="">
  <h3 class="product-name"></h3>
  <p class="product-price"></p>
  <button class="add-to-cart">Add to Cart</button>
  
  <script>
  CS['product-card'] = {
    init() {
      // Populate from CMS data
      this.$('.product-image').src = this.config.image;
      this.$('.product-name').textContent = this.config.name;
      this.$('.product-price').textContent = `$${this.config.price}`;
      
      // Cart functionality
      this.$('.add-to-cart').onclick = () => {
        this.emit('cart:add', {
          name: this.config.name,
          price: parseFloat(this.config.price)
        });
        
        // Visual feedback
        const btn = this.$('.add-to-cart');
        btn.textContent = 'Added!';
        btn.disabled = true;
        
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.disabled = false;
        }, 2000);
      };
    }
  };
  </script>
</div>
```

### 3. Interacción con Webflow Interactions

Puedes trigger Webflow interactions desde componentes:

```html
<div data-cs="trigger-interaction">
  <button>Trigger Webflow Animation</button>
  
  <script>
  CS['trigger-interaction'] = {
    init() {
      this.$('button').onclick = () => {
        // Trigger click en elemento con interacción Webflow
        const target = document.querySelector('.my-animated-element');
        if (target) {
          target.click();
        }
        
        // O cambiar clases que Webflow observa
        document.body.classList.add('interaction-active');
      };
    }
  };
  </script>
</div>
```

## Componentes Comunes para Webflow

### 1. Cookie Banner

```html
<div data-cs="cookie-banner" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;">
  <style>
    [data-cs="cookie-banner"] {
      background: #2c3e50;
      color: white;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }
    
    [data-cs="cookie-banner"].show {
      transform: translateY(0);
    }
    
    [data-cs="cookie-banner"] button {
      background: white;
      color: #2c3e50;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
    }
  </style>
  
  <div>
    <p>Usamos cookies para mejorar tu experiencia.</p>
  </div>
  <button>Aceptar</button>
  
  <script>
  CS['cookie-banner'] = {
    init() {
      // Check if already accepted
      if (!localStorage.getItem('cookies-accepted')) {
        setTimeout(() => {
          this.el.classList.add('show');
        }, 1000);
      }
      
      this.$('button').onclick = () => {
        localStorage.setItem('cookies-accepted', 'true');
        this.el.classList.remove('show');
        setTimeout(() => {
          this.el.remove();
        }, 300);
      };
    }
  };
  </script>
</div>
```

### 2. Form con Webflow

```html
<div data-cs="webflow-form-enhancer">
  <script>
  CS['webflow-form-enhancer'] = {
    init() {
      // Buscar el form de Webflow más cercano
      const form = this.el.closest('form') || document.querySelector('form[data-name]');
      
      if (form) {
        // Añadir validación en tiempo real
        form.addEventListener('input', (e) => {
          if (e.target.type === 'email') {
            if (!e.target.value.includes('@')) {
              e.target.setCustomValidity('Email inválido');
            } else {
              e.target.setCustomValidity('');
            }
          }
        });
        
        // Mejorar el submit
        const submitBtn = form.querySelector('input[type="submit"]');
        if (submitBtn) {
          form.addEventListener('submit', () => {
            submitBtn.value = 'Enviando...';
            submitBtn.disabled = true;
          });
        }
      }
    }
  };
  </script>
</div>
```

## Tips para Webflow

### 1. Clases y Estilos

- Usa `data-cs` para componentes, no clases de Webflow
- Los estilos inline en `<style>` tienen prioridad sobre Webflow
- Puedes combinar clases de Webflow con componentes RUN:REBEL

### 2. Performance

- Carga solo los módulos necesarios
- Usa lazy loading para componentes pesados
- Minimiza el CSS inline

### 3. SEO

- El contenido inicial debe estar en el HTML
- Usa componentes para mejorar, no reemplazar contenido
- Los componentes reactivos pueden actualizar meta tags

### 4. Debug

```javascript
// En la consola del navegador
CS.debug = true; // Activa logs

// Ver todos los componentes
document.querySelectorAll('[data-cs]').forEach(el => {
  console.log(el.dataset.cs, CS.get(el));
});

// Trigger eventos manualmente
document.dispatchEvent(new CustomEvent('cs:modal:open', {
  detail: { content: 'Test' }
}));
```
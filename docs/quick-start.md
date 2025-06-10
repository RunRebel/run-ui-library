# 🚀 Quick Start Guide

## 1. Instalación en Webflow (2 minutos)

### Paso 1: Agregar el Core

En **Project Settings > Custom Code > Head Code**:

```html
<script src="https://cdn.jsdelivr.net/gh/zaste/run-rebel@latest/.cs/core.js"></script>
```

### Paso 2: Configurar Re-init (Opcional pero recomendado)

En **Project Settings > Custom Code > Footer Code**:

```html
<script>
// Para que funcione con las interacciones de Webflow
if (window.Webflow) {
  window.Webflow.push(() => CS.init());
}
</script>
```

## 2. Tu Primer Componente

### Crear un Modal Simple

1. Agrega un **Embed** element en Webflow
2. Pega este código:

```html
<div data-cs="modal" id="my-modal">
  <style>
    [data-cs="modal"] {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      display: none;
      place-items: center;
      z-index: 1000;
    }
    
    [data-cs="modal"].open {
      display: grid;
    }
    
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      max-width: 500px;
    }
  </style>
  
  <div class="modal-content">
    <h2>Mi Modal</h2>
    <p>Contenido del modal</p>
    <button onclick="CS.get(document.querySelector('#my-modal')).close()">
      Cerrar
    </button>
  </div>
  
  <script>
  CS.modal = {
    init() {
      this.el.onclick = (e) => {
        if (e.target === this.el) this.close();
      };
    },
    
    open() {
      this.el.classList.add('open');
    },
    
    close() {
      this.el.classList.remove('open');
    }
  };
  </script>
</div>
```

3. Para abrir el modal, agrega un botón en Webflow con este código:

```html
<button onclick="CS.get(document.querySelector('#my-modal')).open()">
  Abrir Modal
</button>
```

## 3. Componente con Estado (Reactivo)

### Contador Interactivo

```html
<div data-cs="counter" data-initial="0">
  <style>
    [data-cs="counter"] {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
    }
    
    .count {
      font-size: 2rem;
      font-weight: bold;
      min-width: 3ch;
      text-align: center;
    }
  </style>
  
  <button class="dec">-</button>
  <span class="count">0</span>
  <button class="inc">+</button>
  
  <script>
  CS.counter = {
    async init() {
      // Cargar módulo reactivo
      if (!CS.reactive) {
        await CS.load('reactive');
      }
      
      // Estado reactivo
      const count = CS.reactive.state(this.config.initial);
      
      // Actualizar DOM cuando cambia el estado
      CS.reactive.effect(() => {
        this.$('.count').textContent = count();
      });
      
      // Botones
      this.$('.inc').onclick = () => count.set(c => c + 1);
      this.$('.dec').onclick = () => count.set(c => c - 1);
    }
  };
  </script>
</div>
```

## 4. Integrar con CMS de Webflow

### Product Card desde Collection

```html
<!-- Dentro de un Collection List -->
<div data-cs="product" 
     data-name="{{Name}}" 
     data-price="{{Price}}"
     data-id="{{ItemID}}">
  
  <h3 class="name"></h3>
  <p class="price"></p>
  <button class="add-cart">Add to Cart</button>
  
  <script>
  CS.product = {
    init() {
      // Poblar con datos del CMS
      this.$('.name').textContent = this.config.name;
      this.$('.price').textContent = `$${this.config.price}`;
      
      // Funcionalidad del carrito
      this.$('.add-cart').onclick = () => {
        // Emitir evento global
        this.emit('cart:add', {
          id: this.config.id,
          name: this.config.name,
          price: parseFloat(this.config.price)
        });
        
        // Feedback visual
        const btn = this.$('.add-cart');
        btn.textContent = '✓ Added';
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

## 5. Comunicación entre Componentes

### Cart Manager

```html
<div data-cs="cart-manager">
  <style>
    [data-cs="cart-manager"] {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
  </style>
  
  <div>Cart: <span class="count">0</span> items</div>
  <div>Total: $<span class="total">0.00</span></div>
  
  <script>
  CS['cart-manager'] = {
    init() {
      this.items = [];
      
      // Escuchar eventos de productos
      CS.on('product:cart:add', (data) => {
        this.items.push(data);
        this.updateDisplay();
      });
    },
    
    updateDisplay() {
      this.$('.count').textContent = this.items.length;
      
      const total = this.items.reduce((sum, item) => sum + item.price, 0);
      this.$('.total').textContent = total.toFixed(2);
    }
  };
  </script>
</div>
```

## 6. Tips Rápidos

### 💡 Selección de Elementos
```javascript
this.$('.class')   // querySelector
this.$$('.class')  // querySelectorAll (array)
```

### 💡 Configuración via Data Attributes
```html
<div data-cs="thing" data-color="blue" data-size="10">
<!-- this.config.color === "blue" -->
<!-- this.config.size === 10 (number) -->
```

### 💡 Eventos Globales
```javascript
// Emitir
this.emit('happened', { info: 'data' });

// Escuchar
CS.on('component:happened', (data) => {
  console.log(data.info);
});
```

### 💡 Debug
```javascript
// En la consola
CS.debug = true;

// Ver componente
const modal = CS.get(document.querySelector('[data-cs="modal"]'));
console.log(modal);
```

## Próximos Pasos

1. Explora los [ejemplos](/components)
2. Lee sobre [transformaciones](.claude/examples/)
3. Revisa la [integración con Webflow](.claude/examples/webflow-integration.md)

¡Listo! Ya puedes crear componentes poderosos en Webflow 🚀
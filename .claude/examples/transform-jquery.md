# Transformación: jQuery → RUN:REBEL

## Ejemplo 1: Toggle Simple

### Input (jQuery)
```javascript
$(document).ready(function() {
  $('.toggle-btn').click(function() {
    $(this).toggleClass('active');
    $('.panel').slideToggle();
  });
});
```

### Output (RUN:REBEL)
```html
<div data-cs="toggle">
  <button class="toggle-btn">Toggle</button>
  <div class="panel" style="display: none;">
    <p>Contenido del panel</p>
  </div>
  
  <script>
  CS.toggle = {
    init() {
      const btn = this.$('.toggle-btn');
      const panel = this.$('.panel');
      
      btn.onclick = () => {
        btn.classList.toggle('active');
        
        // slideToggle equivalent
        if (panel.style.display === 'none') {
          panel.style.display = 'block';
          panel.style.height = '0';
          panel.style.overflow = 'hidden';
          panel.style.transition = 'height 0.3s ease';
          
          requestAnimationFrame(() => {
            panel.style.height = panel.scrollHeight + 'px';
          });
        } else {
          panel.style.height = panel.scrollHeight + 'px';
          panel.style.transition = 'height 0.3s ease';
          
          requestAnimationFrame(() => {
            panel.style.height = '0';
          });
          
          setTimeout(() => {
            panel.style.display = 'none';
          }, 300);
        }
        
        this.emit('toggled', { active: btn.classList.contains('active') });
      };
    }
  };
  </script>
</div>
```

## Ejemplo 2: Form con Validación

### Input (jQuery)
```javascript
$('#contact-form').submit(function(e) {
  e.preventDefault();
  
  $('.error').hide();
  
  var email = $('#email').val();
  var message = $('#message').val();
  
  var hasError = false;
  
  if (!email.includes('@')) {
    $('#email-error').text('Email inválido').show();
    hasError = true;
  }
  
  if (message.length < 10) {
    $('#message-error').text('Mensaje muy corto').show();
    hasError = true;
  }
  
  if (!hasError) {
    $.ajax({
      url: '/api/contact',
      method: 'POST',
      data: $(this).serialize(),
      success: function() {
        $('#success').show();
        $('#contact-form')[0].reset();
      },
      error: function() {
        alert('Error al enviar');
      }
    });
  }
});
```

### Output (RUN:REBEL)
```html
<div data-cs="contact-form">
  <form id="contact-form">
    <div>
      <input type="email" id="email" name="email" placeholder="Email">
      <div class="error" id="email-error" style="display: none;"></div>
    </div>
    
    <div>
      <textarea id="message" name="message" placeholder="Mensaje"></textarea>
      <div class="error" id="message-error" style="display: none;"></div>
    </div>
    
    <button type="submit">Enviar</button>
    <div id="success" style="display: none;">Enviado con éxito!</div>
  </form>
  
  <script>
  CS['contact-form'] = {
    init() {
      const form = this.$('#contact-form');
      const emailInput = this.$('#email');
      const messageInput = this.$('#message');
      const emailError = this.$('#email-error');
      const messageError = this.$('#message-error');
      const success = this.$('#success');
      
      form.onsubmit = async (e) => {
        e.preventDefault();
        
        // Hide errors
        this.$$('.error').forEach(el => el.style.display = 'none');
        
        const email = emailInput.value;
        const message = messageInput.value;
        
        let hasError = false;
        
        // Validation
        if (!email.includes('@')) {
          emailError.textContent = 'Email inválido';
          emailError.style.display = 'block';
          hasError = true;
        }
        
        if (message.length < 10) {
          messageError.textContent = 'Mensaje muy corto';
          messageError.style.display = 'block';
          hasError = true;
        }
        
        if (!hasError) {
          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              body: new FormData(form)
            });
            
            if (response.ok) {
              success.style.display = 'block';
              form.reset();
              this.emit('submitted');
            } else {
              throw new Error('Server error');
            }
          } catch (error) {
            alert('Error al enviar');
            this.emit('error', error);
          }
        }
      };
    }
  };
  </script>
</div>
```

## Ejemplo 3: Tabs con AJAX

### Input (jQuery)
```javascript
$('.tab').click(function() {
  var tabId = $(this).data('tab');
  
  // Active state
  $('.tab').removeClass('active');
  $(this).addClass('active');
  
  // Load content
  $('#tab-content').html('<div class="loading">Cargando...</div>');
  
  $.get('/api/tabs/' + tabId, function(data) {
    $('#tab-content').html(data);
  });
});

// Initialize first tab
$('.tab:first').click();
```

### Output (RUN:REBEL)
```html
<div data-cs="tabs">
  <style>
    [data-cs="tabs"] .tab-nav {
      display: flex;
      border-bottom: 2px solid #ddd;
    }
    
    [data-cs="tabs"] .tab {
      padding: 1rem;
      cursor: pointer;
      border: none;
      background: none;
    }
    
    [data-cs="tabs"] .tab.active {
      border-bottom: 2px solid #0066cc;
      margin-bottom: -2px;
    }
    
    [data-cs="tabs"] #tab-content {
      padding: 1rem;
    }
    
    [data-cs="tabs"] .loading {
      text-align: center;
      color: #666;
    }
  </style>
  
  <div class="tab-nav">
    <button class="tab" data-tab="tab1">Tab 1</button>
    <button class="tab" data-tab="tab2">Tab 2</button>
    <button class="tab" data-tab="tab3">Tab 3</button>
  </div>
  
  <div id="tab-content"></div>
  
  <script>
  CS.tabs = {
    init() {
      const tabs = this.$$('.tab');
      const content = this.$('#tab-content');
      
      // Tab click handler
      tabs.forEach(tab => {
        tab.onclick = async () => {
          const tabId = tab.dataset.tab;
          
          // Active state
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Load content
          content.innerHTML = '<div class="loading">Cargando...</div>';
          
          try {
            const response = await fetch(`/api/tabs/${tabId}`);
            const data = await response.text();
            content.innerHTML = data;
            
            this.emit('tab:changed', { tab: tabId });
          } catch (error) {
            content.innerHTML = '<div class="error">Error al cargar</div>';
          }
        };
      });
      
      // Initialize first tab
      if (tabs.length > 0) {
        tabs[0].click();
      }
    }
  };
  </script>
</div>
```

## Mapeo de Patrones jQuery

### Selectores
- `$('.class')` → `this.$('.class')` (uno) o `this.$$('.class')` (todos)
- `$(this)` → `event.currentTarget` o guardar referencia
- `$('#id')` → `this.$('#id')`

### Manipulación DOM
- `.addClass()` → `.classList.add()`
- `.removeClass()` → `.classList.remove()`
- `.toggleClass()` → `.classList.toggle()`
- `.hasClass()` → `.classList.contains()`
- `.hide()` → `.style.display = 'none'`
- `.show()` → `.style.display = ''`
- `.text()` → `.textContent`
- `.html()` → `.innerHTML`
- `.val()` → `.value`
- `.attr()` → `.getAttribute()` / `.setAttribute()`
- `.prop()` → propiedad directa

### Eventos
- `.click()` → `.onclick =`
- `.on('event', handler)` → `.addEventListener('event', handler)`
- `.submit()` → `.onsubmit =`

### AJAX
- `$.ajax()` / `$.get()` / `$.post()` → `fetch()`
- Callbacks → async/await

### Animaciones
- `.fadeIn()` / `.fadeOut()` → CSS transitions + classes
- `.slideUp()` / `.slideDown()` → height transitions
- `.animate()` → CSS animations o Web Animations API
/* RUN:REBEL Core - v1.0.0
   Mínimo Máximo Component System
   Solo 2kb - Siempre presente */

(function(global) {
  'use strict';
  
  const instances = new WeakMap();
  const components = {};
  
  // Component Factory
  function create(el, def) {
    const c = {
      el,
      $: sel => el.querySelector(sel),
      $$: sel => Array.from(el.querySelectorAll(sel)),
      
      config: {},
      state: {},
      
      // Parse data attributes
      init() {
        for (let [k, v] of Object.entries(el.dataset)) {
          if (k === 'cs' || k === 'init') continue;
          this.config[k] = v === 'true' ? true : 
                           v === 'false' ? false : 
                           !isNaN(v) && v !== '' ? +v : v;
        }
        if (def.init) def.init.call(this);
      },
      
      // Emit events
      emit(event, data = {}) {
        document.dispatchEvent(new CustomEvent(`cs:${el.dataset.cs}:${event}`, {
          detail: { ...data, source: el },
          bubbles: true
        }));
      },
      
      // Listen to events
      on(event, handler) {
        if (event.includes(':')) {
          document.addEventListener(`cs:${event}`, e => handler.call(this, e.detail));
        } else {
          el.addEventListener(event, handler.bind(this));
        }
      },
      
      // Update state
      set(newState) {
        Object.assign(this.state, newState);
        if (this.render) this.render();
      }
    };
    
    // Apply definition
    Object.assign(c, def);
    c.init();
    
    el.setAttribute('data-init', '');
    instances.set(el, c);
    
    return c;
  }
  
  // Public API
  const CS = {
    // Register component
    component(name, def) {
      components[name] = def;
      CS[name] = def; // For template access
      
      // Auto-init existing
      document.querySelectorAll(`[data-cs="${name}"]:not([data-init])`).forEach(el => {
        create(el, def);
      });
    },
    
    // Get instance
    get: el => instances.get(el),
    
    // Manual init
    init() {
      Object.entries(components).forEach(([name, def]) => {
        document.querySelectorAll(`[data-cs="${name}"]:not([data-init])`).forEach(el => {
          create(el, def);
        });
      });
    },
    
    // Ready helper
    ready(fn) {
      if (document.readyState !== 'loading') fn();
      else document.addEventListener('DOMContentLoaded', fn);
      if (global.Webflow) global.Webflow.push(fn);
    },
    
    // Lazy load modules
    async load(module) {
      if (!CS[module]) {
        const script = document.createElement('script');
        script.src = `https://cdn.jsdelivr.net/gh/zaste/run-rebel/.cs/${module}.js`;
        document.head.appendChild(script);
        await new Promise(r => script.onload = r);
      }
      return CS[module];
    }
  };
  
  // Auto-init on DOM ready
  CS.ready(() => {
    CS.init();
    
    // Watch for new elements
    if (global.MutationObserver) {
      new MutationObserver(() => CS.init()).observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  });
  
  // Export
  global.CS = CS;
  
})(window);
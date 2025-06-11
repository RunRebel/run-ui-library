/* RUN:REBEL Core v2.0.0
   Component Intelligence System with 5-Level Taxonomy
   Zero dependencies - 2kb gzipped */

(function(global) {
  'use strict';
  
  const instances = new WeakMap();
  const registry = {
    tokens: new Map(),
    elements: new Map(),
    components: new Map(),
    layouts: new Map(),
    templates: new Map()
  };
  const events = new Map();
  
  // Component Factory
  function create(el, def) {
    const type = CS.detect(el);
    
    const instance = {
      el,
      type,
      $: sel => el.querySelector(sel),
      $$: sel => Array.from(el.querySelectorAll(sel)),
      
      config: {},
      state: {},
      
      // Parse configuration from data attributes
      init() {
        // Extract config
        Object.keys(el.dataset).forEach(key => {
          if (key !== type) {
            let value = el.dataset[key];
            // Auto-parse numbers and booleans
            if (!isNaN(value)) value = Number(value);
            else if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (value.startsWith('{') || value.startsWith('[')) {
              try { value = JSON.parse(value); } catch(e) {}
            }
            this.config[key] = value;
          }
        });
        
        // Initialize based on type
        if (def && typeof def.init === 'function') {
          def.init.call(this);
        }
      },
      
      // Event emitter
      emit(event, data) {
        const eventName = `${this.type}:${event}`;
        CS.emit(eventName, { ...data, source: this });
      },
      
      // Lifecycle
      destroy() {
        if (def && typeof def.destroy === 'function') {
          def.destroy.call(this);
        }
        instances.delete(el);
      }
    };
    
    // Mix in definition methods
    if (def) {
      Object.keys(def).forEach(key => {
        if (!['init', 'destroy'].includes(key)) {
          instance[key] = def[key];
        }
      });
    }
    
    instances.set(el, instance);
    return instance;
  }
  
  // Core System
  const CS = {
    version: '2.0.0',
    debug: false,
    
    // Registry access
    registry,
    
    // Detect element type
    detect(element) {
      const types = ['element', 'component', 'layout', 'template'];
      for (const type of types) {
        if (element.dataset[type] !== undefined) return type;
      }
      return null;
    },
    
    // Register definitions
    token(name, value) {
      registry.tokens.set(name, value);
      document.documentElement.style.setProperty(`--${name}`, value);
    },
    
    element(name, config = {}) {
      registry.elements.set(name, config);
      this.enhance(`[data-element="${name}"]`);
    },
    
    component(name, definition) {
      registry.components.set(name, definition);
    },
    
    layout(name, definition) {
      registry.layouts.set(name, definition);
    },
    
    template(name, definition) {
      registry.templates.set(name, definition);
    },
    
    // Instance management
    get(element) {
      return instances.get(element);
    },
    
    create(element, definition) {
      return create(element, definition);
    },
    
    // Enhancement
    enhance(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!instances.has(el)) {
          const type = this.detect(el);
          const name = el.dataset[type];
          const definition = registry[type + 's'].get(name);
          
          if (definition || type === 'element') {
            const instance = create(el, definition);
            instance.init();
          }
        }
      });
    },
    
    // Initialization
    init() {
      if (this.debug) console.log('CS.init v2.0');
      
      // Initialize all levels in order
      this.initTokens();
      this.initElements();
      this.initLayouts();
      this.initComponents();
      this.initTemplates();
      
      // Watch for new elements
      if (global.MutationObserver) {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) {
                const type = this.detect(node);
                if (type) {
                  const name = node.dataset[type];
                  const definition = registry[type + 's'].get(name);
                  if (definition || type === 'element') {
                    const instance = create(node, definition);
                    instance.init();
                  }
                }
              }
            });
          });
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    },
    
    // Level-specific initialization
    initTokens() {
      // Apply any registered tokens
      registry.tokens.forEach((value, name) => {
        document.documentElement.style.setProperty(`--${name}`, value);
      });
    },
    
    initElements() {
      this.enhance('[data-element]');
    },
    
    initLayouts() {
      this.enhance('[data-layout]');
    },
    
    initComponents() {
      this.enhance('[data-component]');
    },
    
    initTemplates() {
      this.enhance('[data-template]');
    },
    
    // Module loading
    async load(module) {
      if (this[module]) return;
      
      const config = global.CS_CONFIG || {};
      const basePath = config.basePath || 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/cs/';
      const url = `${basePath}${module}.js`;
      
      const script = document.createElement('script');
      script.src = url;
      
      return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    
    // Event system
    on(event, handler) {
      if (!events.has(event)) {
        events.set(event, new Set());
      }
      events.get(event).add(handler);
      
      return () => events.get(event).delete(handler);
    },
    
    emit(event, data) {
      if (this.debug) console.log(`CS.emit: ${event}`, data);
      
      if (events.has(event)) {
        events.get(event).forEach(handler => {
          try {
            handler(data);
          } catch (e) {
            console.error(`Error in event handler for ${event}:`, e);
          }
        });
      }
    },
    
    // Utilities
    ready(fn) {
      if (document.readyState !== 'loading') {
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    }
  };
  
  // Auto-initialize
  CS.ready(() => CS.init());
  
  // Export
  global.CS = CS;
  
})(window);

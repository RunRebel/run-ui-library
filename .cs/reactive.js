/* RUN:REBEL Reactive Module - v1.0.0
   Estado reactivo minimalista
   +5kb cuando se necesita */

(function(global) {
  'use strict';
  
  if (!global.CS) {
    console.error('CS Core required for Reactive module');
    return;
  }
  
  // Reactive State
  function createState(initial) {
    let value = initial;
    const listeners = new Set();
    
    const state = () => value;
    
    state.set = (newValue) => {
      if (typeof newValue === 'function') {
        value = newValue(value);
      } else {
        value = newValue;
      }
      listeners.forEach(fn => fn(value));
    };
    
    state.subscribe = (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    };
    
    return state;
  }
  
  // Effect System
  const effects = new WeakMap();
  
  function createEffect(fn, deps = []) {
    let cleanup;
    
    const run = () => {
      if (cleanup) cleanup();
      cleanup = fn();
    };
    
    // Run immediately
    run();
    
    // Subscribe to dependencies
    deps.forEach(dep => {
      if (dep && dep.subscribe) {
        dep.subscribe(run);
      }
    });
    
    return () => {
      if (cleanup) cleanup();
    };
  }
  
  // Computed Values
  function createComputed(fn, deps = []) {
    const state = createState(fn());
    
    createEffect(() => {
      state.set(fn());
    }, deps);
    
    return state;
  }
  
  // Add to CS
  CS.reactive = {
    state: createState,
    effect: createEffect,
    computed: createComputed,
    
    // Helper: Two-way binding
    bind(input, state) {
      input.value = state();
      input.addEventListener('input', e => state.set(e.target.value));
      state.subscribe(v => input.value = v);
    }
  };
  
})(window);
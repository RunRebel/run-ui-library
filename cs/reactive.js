/* RUN:REBEL Reactive Module v2.0.0
   Minimal reactive state management
   +1.5kb when needed */

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
        newValue = newValue(value);
      }
      
      if (value !== newValue) {
        value = newValue;
        listeners.forEach(listener => listener(value));
      }
    };
    
    state.subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    
    return state;
  }
  
  // Reactive Effect
  let currentEffect = null;
  const effectStack = [];
  
  function effect(fn) {
    const execute = () => {
      currentEffect = execute;
      effectStack.push(execute);
      
      try {
        fn();
      } finally {
        effectStack.pop();
        currentEffect = effectStack[effectStack.length - 1];
      }
    };
    
    execute();
    return () => {
      // Cleanup logic if needed
    };
  }
  
  // Computed Values
  function computed(fn) {
    let cached;
    let dirty = true;
    
    const state = createState();
    
    effect(() => {
      if (dirty) {
        cached = fn();
        state.set(cached);
        dirty = false;
      }
    });
    
    const computedState = () => {
      if (currentEffect && dirty) {
        cached = fn();
        dirty = false;
      }
      return cached;
    };
    
    computedState.invalidate = () => {
      dirty = true;
    };
    
    return computedState;
  }
  
  // Reactive Arrays
  function reactiveArray(initial = []) {
    const state = createState(initial);
    
    return {
      get: () => state(),
      set: state.set,
      push: (...items) => state.set(arr => [...arr, ...items]),
      pop: () => state.set(arr => arr.slice(0, -1)),
      shift: () => state.set(arr => arr.slice(1)),
      unshift: (...items) => state.set(arr => [...items, ...arr]),
      splice: (start, deleteCount, ...items) => 
        state.set(arr => {
          const copy = [...arr];
          copy.splice(start, deleteCount, ...items);
          return copy;
        }),
      filter: (fn) => state.set(arr => arr.filter(fn)),
      map: (fn) => state.set(arr => arr.map(fn)),
      subscribe: state.subscribe
    };
  }
  
  // Reactive Objects
  function reactiveObject(initial = {}) {
    const state = createState(initial);
    
    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'subscribe') return state.subscribe;
        if (prop === 'toJSON') return () => state();
        
        const obj = state();
        return obj[prop];
      },
      
      set(target, prop, value) {
        state.set(obj => ({ ...obj, [prop]: value }));
        return true;
      },
      
      deleteProperty(target, prop) {
        state.set(obj => {
          const copy = { ...obj };
          delete copy[prop];
          return copy;
        });
        return true;
      }
    });
  }
  
  // Export to CS
  CS.reactive = {
    version: '2.0.0',
    state: createState,
    effect,
    computed,
    array: reactiveArray,
    object: reactiveObject
  };
  
})(window);

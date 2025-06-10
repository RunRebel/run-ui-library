/* RUN:REBEL Configuration - v1.0.0 */

// Component System Configuration
window.CS_CONFIG = {
  // Auto-load modules based on usage
  autoLoad: true,
  
  // Module CDN paths (can be customized)
  modules: {
    reactive: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@latest/.cs/reactive.js',
    vdom: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@latest/.cs/vdom.js'
  },
  
  // Debug mode
  debug: false,
  
  // Webflow specific
  webflow: {
    autoReinit: true,
    watchInterval: 100
  },
  
  // Component defaults
  defaults: {
    animation: {
      duration: 200,
      easing: 'ease'
    }
  }
};

// Apply config
if (window.CS) {
  Object.assign(window.CS, window.CS_CONFIG);
}
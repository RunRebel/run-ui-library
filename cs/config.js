/* RUN:REBEL Configuration v2.0.0 */

// Component System Configuration
window.CS_CONFIG = {
  // Version
  version: '2.0.0',
  
  // Auto-load modules based on usage
  autoLoad: true,
  
  // Module CDN paths
  modules: {
    reactive: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/cs/reactive.js',
    vdom: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/cs/vdom.js'
  },
  
  // Base path for modules (no dot prefix)
  basePath: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/cs/',
  
  // Taxonomy paths
  paths: {
    tokens: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/00-tokens/',
    elements: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/01-elements/',
    components: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/02-components/',
    layouts: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/03-layouts/',
    templates: 'https://cdn.jsdelivr.net/gh/zaste/run-rebel@2/04-templates/'
  },
  
  // Debug mode
  debug: false,
  
  // Taxonomy configuration
  taxonomy: {
    version: '2.0.0',
    levels: ['tokens', 'elements', 'components', 'layouts', 'templates'],
    autoDetect: true
  },
  
  // Webflow specific
  webflow: {
    autoReinit: true,
    watchForChanges: true
  },
  
  // Performance
  performance: {
    lazyLoad: true,
    cacheModules: true,
    minify: true
  },
  
  // Feature flags
  features: {
    reactive: true,
    vdom: true,
    typescript: false,
    jsx: false
  }
};

// Auto-configuration based on environment
(function() {
  // Detect development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.CS_CONFIG.debug = true;
    window.CS_CONFIG.performance.minify = false;
    window.CS_CONFIG.basePath = '/cs/';
    window.CS_CONFIG.paths = {
      tokens: '/00-tokens/',
      elements: '/01-elements/',
      components: '/02-components/',
      layouts: '/03-layouts/',
      templates: '/04-templates/'
    };
  }
  
  // Detect Webflow editor
  if (window.Webflow && window.Webflow.env && window.Webflow.env() === 'editor') {
    window.CS_CONFIG.webflow.watchForChanges = false;
  }
})();

/* RUN:REBEL Virtual DOM Module - v1.0.0
   Virtual DOM ultra ligero
   +8kb cuando se necesita */

(function(global) {
  'use strict';
  
  if (!global.CS) {
    console.error('CS Core required for VDOM module');
    return;
  }
  
  // Virtual Node
  function h(tag, props, ...children) {
    return {
      tag,
      props: props || {},
      children: children.flat()
    };
  }
  
  // Create DOM element from vnode
  function createElement(vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      return document.createTextNode(vnode);
    }
    
    const el = document.createElement(vnode.tag);
    
    // Props
    Object.entries(vnode.props).forEach(([k, v]) => {
      if (k.startsWith('on')) {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === 'className') {
        el.className = v;
      } else {
        el.setAttribute(k, v);
      }
    });
    
    // Children
    vnode.children.forEach(child => {
      el.appendChild(createElement(child));
    });
    
    return el;
  }
  
  // Simple diff & patch
  function render(vnode, container) {
    const newEl = createElement(vnode);
    container.innerHTML = '';
    container.appendChild(newEl);
  }
  
  // List helper
  function map(items, fn) {
    return items.map((item, i) => fn(item, i));
  }
  
  // Add to CS
  CS.vdom = {
    h,
    render,
    map,
    
    // Helper: Table component
    table(data, columns) {
      return h('table', { className: 'cs-table' }, [
        h('thead', {}, 
          h('tr', {}, columns.map(col => h('th', {}, col.label)))
        ),
        h('tbody', {},
          data.map(row => 
            h('tr', {}, columns.map(col => 
              h('td', {}, row[col.key])
            ))
          )
        )
      ]);
    }
  };
  
})(window);
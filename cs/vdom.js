/* RUN:REBEL Virtual DOM Module v2.0.0
   Ultra-lightweight virtual DOM
   +2.5kb when needed */

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
      children: children.flat().map(child =>
        typeof child === 'object' ? child : String(child)
      )
    };
  }
  
  // Create DOM element from vnode
  function createElement(vnode) {
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode);
    }
    
    const el = document.createElement(vnode.tag);
    
    // Set properties
    Object.entries(vnode.props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key === 'className') {
        el.className = value;
      } else if (key in el) {
        el[key] = value;
      } else {
        el.setAttribute(key, value);
      }
    });
    
    // Add children
    vnode.children.forEach(child => {
      el.appendChild(createElement(child));
    });
    
    return el;
  }
  
  // Diff vnodes
  function diff(oldVnode, newVnode) {
    const patches = [];
    
    if (!oldVnode) {
      patches.push({ type: 'CREATE', vnode: newVnode });
    } else if (!newVnode) {
      patches.push({ type: 'REMOVE' });
    } else if (typeof oldVnode === 'string' || typeof newVnode === 'string') {
      if (oldVnode !== newVnode) {
        patches.push({ type: 'REPLACE', vnode: newVnode });
      }
    } else if (oldVnode.tag !== newVnode.tag) {
      patches.push({ type: 'REPLACE', vnode: newVnode });
    } else {
      // Diff props
      const propPatches = diffProps(oldVnode.props, newVnode.props);
      if (propPatches.length > 0) {
        patches.push({ type: 'PROPS', patches: propPatches });
      }
      
      // Diff children
      const childPatches = diffChildren(oldVnode.children, newVnode.children);
      if (childPatches.length > 0) {
        patches.push({ type: 'CHILDREN', patches: childPatches });
      }
    }
    
    return patches;
  }
  
  // Diff properties
  function diffProps(oldProps, newProps) {
    const patches = [];
    const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
    
    allKeys.forEach(key => {
      const oldVal = oldProps[key];
      const newVal = newProps[key];
      
      if (oldVal !== newVal) {
        patches.push({ key, value: newVal });
      }
    });
    
    return patches;
  }
  
  // Diff children
  function diffChildren(oldChildren, newChildren) {
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    
    for (let i = 0; i < maxLength; i++) {
      patches.push(diff(oldChildren[i], newChildren[i]));
    }
    
    return patches;
  }
  
  // Apply patches to DOM
  function patch(el, patches, index = 0) {
    patches.forEach(patch => {
      switch (patch.type) {
        case 'CREATE':
          el.appendChild(createElement(patch.vnode));
          break;
          
        case 'REMOVE':
          el.removeChild(el.childNodes[index]);
          break;
          
        case 'REPLACE':
          el.replaceChild(
            createElement(patch.vnode),
            el.childNodes[index]
          );
          break;
          
        case 'PROPS':
          patchProps(el, patch.patches);
          break;
          
        case 'CHILDREN':
          patch.patches.forEach((childPatch, i) => {
            patch(el, childPatch, i);
          });
          break;
      }
    });
  }
  
  // Apply property patches
  function patchProps(el, patches) {
    patches.forEach(({ key, value }) => {
      if (value === undefined) {
        el.removeAttribute(key);
        delete el[key];
      } else if (key.startsWith('on')) {
        const event = key.slice(2).toLowerCase();
        // Remove old listener (simplified - in real app track them)
        el[key] = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key === 'className') {
        el.className = value;
      } else if (key in el) {
        el[key] = value;
      } else {
        el.setAttribute(key, value);
      }
    });
  }
  
  // Component class
  class Component {
    constructor(props = {}) {
      this.props = props;
      this.state = {};
      this._vnode = null;
      this._el = null;
    }
    
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.update();
    }
    
    mount(container) {
      this._vnode = this.render();
      this._el = createElement(this._vnode);
      container.appendChild(this._el);
    }
    
    update() {
      const newVnode = this.render();
      const patches = diff(this._vnode, newVnode);
      patch(this._el.parentNode, patches);
      this._vnode = newVnode;
    }
    
    render() {
      throw new Error('Component must implement render()');
    }
  }
  
  // Export to CS
  CS.vdom = {
    version: '2.0.0',
    h,
    createElement,
    diff,
    patch,
    Component
  };
  
})(window);

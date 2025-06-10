# Transformación: React → RUN:REBEL

## Ejemplo 1: Botón Simple

### Input (React)
```jsx
function Button({ text, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
```

### Output (RUN:REBEL)
```html
<div data-cs="button" data-text="Click me" data-variant="primary">
  <button class="btn btn-primary">Click me</button>
  
  <script>
  CS.button = {
    init() {
      const btn = this.$('button');
      
      // Apply config
      btn.textContent = this.config.text;
      btn.className = `btn btn-${this.config.variant}`;
      
      // Handle click
      btn.onclick = () => {
        this.emit('click', { variant: this.config.variant });
      };
    }
  };
  </script>
</div>
```

## Ejemplo 2: Contador con Estado

### Input (React)
```jsx
function Counter({ initial = 0, max = 99 }) {
  const [count, setCount] = useState(initial);
  
  return (
    <div className="counter">
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)} disabled={count >= max}>
        +1
      </button>
      <button onClick={() => setCount(initial)}>
        Reset
      </button>
    </div>
  );
}
```

### Output (RUN:REBEL)
```html
<div data-cs="counter" data-initial="0" data-max="99">
  <div class="counter">
    <span class="count">0</span>
    <button class="inc">+1</button>
    <button class="reset">Reset</button>
  </div>
  
  <script>
  CS.counter = {
    async init() {
      // Necesita reactive
      if (!CS.reactive) await CS.load('reactive');
      
      // Estado
      const count = CS.reactive.state(this.config.initial);
      
      // Referencias
      const span = this.$('.count');
      const incBtn = this.$('.inc');
      const resetBtn = this.$('.reset');
      
      // Effect: actualizar DOM cuando cambia count
      CS.reactive.effect(() => {
        span.textContent = count();
        incBtn.disabled = count() >= this.config.max;
      });
      
      // Handlers
      incBtn.onclick = () => {
        if (count() < this.config.max) {
          count.set(c => c + 1);
          this.emit('increment', { value: count() });
        }
      };
      
      resetBtn.onclick = () => {
        count.set(this.config.initial);
        this.emit('reset');
      };
    }
  };
  </script>
</div>
```

## Ejemplo 3: Lista Dinámica

### Input (React)
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }]);
      setInput('');
    }
  };
  
  return (
    <div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Output (RUN:REBEL)
```html
<div data-cs="todolist">
  <style>
    [data-cs="todolist"] li {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    
    [data-cs="todolist"] li button {
      background: none;
      border: none;
      color: #dc3545;
      cursor: pointer;
      font-size: 1.2rem;
    }
  </style>
  
  <div>
    <input type="text" placeholder="Nueva tarea...">
    <button class="add">Add</button>
    <ul></ul>
  </div>
  
  <script>
  CS.todolist = {
    async init() {
      // Cargar módulos necesarios
      if (!CS.reactive) await CS.load('reactive');
      if (!CS.vdom) await CS.load('vdom');
      
      // Estado
      const todos = CS.reactive.state([]);
      const input = CS.reactive.state('');
      
      // Referencias
      const inputEl = this.$('input');
      const addBtn = this.$('.add');
      const list = this.$('ul');
      
      // Bind input
      CS.reactive.bind(inputEl, input);
      
      // Add handler
      const addTodo = () => {
        if (input().trim()) {
          todos.set([...todos(), { 
            id: Date.now(), 
            text: input() 
          }]);
          input.set('');
        }
      };
      
      addBtn.onclick = addTodo;
      inputEl.onkeypress = (e) => {
        if (e.key === 'Enter') addTodo();
      };
      
      // Render con VDOM
      CS.reactive.effect(() => {
        const { h, render } = CS.vdom;
        
        render(
          h('ul', {},
            todos().map(todo =>
              h('li', { key: todo.id }, [
                todo.text,
                h('button', {
                  onclick: () => {
                    todos.set(todos().filter(t => t.id !== todo.id));
                  }
                }, '×')
              ])
            )
          ),
          list.parentElement
        );
      });
    }
  };
  </script>
</div>
```

## Reglas de Transformación

1. **Props → data attributes**
   - `<Component prop={value}>` → `<div data-cs="component" data-prop="value">`

2. **useState → CS.reactive.state**
   - `const [x, setX] = useState(0)` → `const x = CS.reactive.state(0)`
   - `x` → `x()`
   - `setX(1)` → `x.set(1)`

3. **useEffect → CS.reactive.effect**
   - Dependencies se pasan igual
   - Se ejecuta inmediatamente

4. **JSX → HTML o VDOM**
   - Estático: HTML directo
   - Dinámico: CS.vdom con h() y render()

5. **Eventos**
   - `onClick={handler}` → `element.onclick = handler`
   - Emitir eventos custom con `this.emit()`
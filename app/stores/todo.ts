import { defineStore } from 'pinia'

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
}

// Tipos de filtros disponibles
export type FilterType = 'all' | 'pending' | 'completed'

// Estado inicial del store
interface TodoState {
  todos: Todo[]
  filter: FilterType
}

export const useTodoStore = defineStore('todo', {
  // Estado inicial
  state: (): TodoState => ({
    todos: [],
    filter: 'all'
  }),

  // Getters - computed properties del store
  getters: {
    // Obtener todas las tareas
    getAllTodos: (state): Todo[] => state.todos,

    // Obtener tareas filtradas según el filtro activo
    getFilteredTodos: (state): Todo[] => {
      switch (state.filter) {
        case 'pending':
          return state.todos.filter(todo => !todo.completed)
        case 'completed':
          return state.todos.filter(todo => todo.completed)
        default:
          return state.todos
      }
    },

    // Contador de tareas pendientes
    getPendingCount: (state): number => {
      return state.todos.filter(todo => !todo.completed).length
    },

    // Contador de tareas completadas
    getCompletedCount: (state): number => {
      return state.todos.filter(todo => todo.completed).length
    },

    // Contador total de tareas
    getTotalCount: (state): number => state.todos.length,

    // Verificar si todas las tareas están completadas
    areAllCompleted: (state): boolean => {
      return state.todos.length > 0 && state.todos.every(todo => todo.completed)
    },

    // Verificar si hay tareas completadas
    hasCompletedTodos: (state): boolean => {
      return state.todos.some(todo => todo.completed)
    }
  },

  // Actions - métodos para modificar el estado
  actions: {
    // Inicializar el store cargando datos del localStorage
    initializeStore() {
      if (process.client) {
        try {
          const storedTodos = localStorage.getItem('todos')
          if (storedTodos) {
            const parsedTodos = JSON.parse(storedTodos)
            // Convertir las fechas de string a Date object
            this.todos = parsedTodos.map((todo: any) => ({
              ...todo,
              createdAt: new Date(todo.createdAt)
            }))
          }
        } catch (error) {
          console.error('Error al cargar tareas del localStorage:', error)
          this.todos = []
        }
      }
    },

    // Guardar tareas en localStorage
    saveToLocalStorage() {
      if (process.client) {
        try {
          localStorage.setItem('todos', JSON.stringify(this.todos))
        } catch (error) {
          console.error('Error al guardar en localStorage:', error)
        }
      }
    },

    // Generar un ID único para nueva tarea
    generateId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    },

    // Agregar una nueva tarea
    addTodo(title: string, description?: string) {
      if (!title.trim()) return

      const newTodo: Todo = {
        id: this.generateId(),
        title: title.trim(),
        description: description?.trim() || '',
        completed: false,
        createdAt: new Date()
      }

      this.todos.unshift(newTodo) // Agregar al inicio de la lista
      this.saveToLocalStorage()
    },

    // Editar una tarea existente
    updateTodo(id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'completed'>>) {
      const todoIndex = this.todos.findIndex(todo => todo.id === id)
      if (todoIndex !== -1) {
        // Actualizar solo los campos proporcionados
        if (updates.title !== undefined) {
          this.todos[todoIndex].title = updates.title.trim()
        }
        if (updates.description !== undefined) {
          this.todos[todoIndex].description = updates.description.trim()
        }
        if (updates.completed !== undefined) {
          this.todos[todoIndex].completed = updates.completed
        }
        
        this.saveToLocalStorage()
      }
    },

    // Alternar el estado completado/pendiente de una tarea
    toggleTodo(id: string) {
      const todo = this.todos.find(todo => todo.id === id)
      if (todo) {
        todo.completed = !todo.completed
        this.saveToLocalStorage()
      }
    },

    // Eliminar una tarea
    deleteTodo(id: string) {
      const index = this.todos.findIndex(todo => todo.id === id)
      if (index !== -1) {
        this.todos.splice(index, 1)
        this.saveToLocalStorage()
      }
    },

    // Marcar todas las tareas como completadas
    markAllAsCompleted() {
      this.todos.forEach(todo => {
        todo.completed = true
      })
      this.saveToLocalStorage()
    },

    // Eliminar todas las tareas completadas
    deleteCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
      this.saveToLocalStorage()
    },

    // Cambiar el filtro activo
    setFilter(filter: FilterType) {
      this.filter = filter
    },

    // Limpiar todas las tareas (útil para reset)
    clearAllTodos() {
      this.todos = []
      this.saveToLocalStorage()
    },

    // Buscar tarea por ID
    getTodoById(id: string): Todo | undefined {
      return this.todos.find(todo => todo.id === id)
    }
  }
})
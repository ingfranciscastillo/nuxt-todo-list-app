<template>
  <div class="space-y-6">
    <!-- Lista de tareas con animaciones -->
    <div v-if="filteredTodos.length > 0" class="space-y-3">
      <TransitionGroup
        name="fade"
        tag="div"
        class="space-y-3"
      >
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          class="group"
        />
      </TransitionGroup>
    </div>

    <!-- Estado vacío -->
    <div v-else class="text-center py-12">
      <div class="max-w-md mx-auto">
        <!-- Icono dinámico según el filtro activo -->
        <div class="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <component
            :is="emptyStateConfig.icon"
            class="w-10 h-10 text-gray-400 dark:text-gray-500"
          />
        </div>
        
        <!-- Mensaje dinámico según el filtro activo -->
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ emptyStateConfig.title }}
        </h3>
        
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ emptyStateConfig.description }}
        </p>
        
        <!-- Botón de acción dinámico -->
        <button
          v-if="emptyStateConfig.actionButton"
          @click="emptyStateConfig.actionButton.action"
          class="btn-primary inline-flex items-center space-x-2"
        >
          <component :is="emptyStateConfig.actionButton.icon" class="w-4 h-4" />
          <span>{{ emptyStateConfig.actionButton.label }}</span>
        </button>
      </div>
    </div>

    <!-- Estadísticas adicionales cuando hay tareas -->
    <div v-if="todoStore.getTotalCount > 0" class="card">
      <div class="p-4">
        <div class="flex items-center justify-between text-sm">
          <!-- Progreso general -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-primary-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${completionPercentage}%` }"
                ></div>
              </div>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ completionPercentage }}%
              </span>
            </div>
            
            <span class="text-gray-600 dark:text-gray-400">
              {{ todoStore.getCompletedCount }} de {{ todoStore.getTotalCount }} completadas
            </span>
          </div>

          <!-- Indicador de productividad -->
          <div class="flex items-center space-x-2">
            <div
              class="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
              :class="productivityBadgeClass"
            >
              <component :is="productivityIcon" class="w-3 h-3" />
              <span>{{ productivityLabel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  QueueListIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  FunnelIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline'
import { useTodoStore, type FilterType } from '~/stores/todo'
import TodoItem from './TodoItem.vue'

// Store de tareas
const todoStore = useTodoStore()

// Computed para obtener las tareas filtradas
const filteredTodos = computed(() => todoStore.getFilteredTodos)

// Computed para el porcentaje de completitud
const completionPercentage = computed(() => {
  const total = todoStore.getTotalCount
  const completed = todoStore.getCompletedCount
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

// Computed para el indicador de productividad
const productivityConfig = computed(() => {
  const percentage = completionPercentage.value
  
  if (percentage === 100 && todoStore.getTotalCount > 0) {
    return {
      label: '¡Genial!',
      icon: TrophyIcon,
      class: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    }
  } else if (percentage >= 80) {
    return {
      label: 'Excelente',
      icon: FireIcon,
      class: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    }
  } else if (percentage >= 50) {
    return {
      label: 'Buen progreso',
      icon: SparklesIcon,
      class: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    }
  } else {
    return {
      label: 'Sigue así',
      icon: ClockIcon,
      class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }
})

const productivityLabel = computed(() => productivityConfig.value.label)
const productivityIcon = computed(() => productivityConfig.value.icon)
const productivityBadgeClass = computed(() => productivityConfig.value.class)

// Configuración del estado vacío según el filtro activo
const emptyStateConfig = computed(() => {
  const currentFilter = todoStore.filter
  
  switch (currentFilter) {
    case 'pending':
      if (todoStore.getTotalCount === 0) {
        return {
          icon: PlusIcon,
          title: 'No hay tareas aún',
          description: 'Comienza agregando tu primera tarea para organizar tu día.',
          actionButton: {
            label: 'Crear primera tarea',
            icon: PlusIcon,
            action: () => scrollToForm()
          }
        }
      } else {
        return {
          icon: CheckCircleIcon,
          title: '¡Todas las tareas completadas!',
          description: 'Excelente trabajo. Has completado todas tus tareas pendientes.',
          actionButton: {
            label: 'Ver todas las tareas',
            icon: QueueListIcon,
            action: () => todoStore.setFilter('all')
          }
        }
      }
      
    case 'completed':
      return {
        icon: ClockIcon,
        title: 'No hay tareas completadas',
        description: 'Las tareas que completes aparecerán aquí.',
        actionButton: {
          label: 'Ver tareas pendientes',
          icon: ClockIcon,
          action: () => todoStore.setFilter('pending')
        }
      }
      
    default: // 'all'
      return {
        icon: PlusIcon,
        title: 'No hay tareas aún',
        description: 'Comienza agregando tu primera tarea para organizar tu día.',
        actionButton: {
          label: 'Crear primera tarea',
          icon: PlusIcon,
          action: () => scrollToForm()
        }
      }
  }
})

// Función para hacer scroll al formulario
const scrollToForm = () => {
  const formElement = document.querySelector('form')
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Enfocar en el campo de título después del scroll
    setTimeout(() => {
      const titleInput = formElement.querySelector('input[type="text"]') as HTMLInputElement
      titleInput?.focus()
    }, 500)
  }
}

// Función para obtener mensaje motivacional aleatorio
const getMotivationalMessage = (): string => {
  const messages = [
    '¡Vas muy bien! Sigue así.',
    '¡Excelente progreso!',
    '¡Estás en racha!',
    '¡Sigue completando tareas!',
    '¡Eres muy productivo hoy!',
    '¡Cada tarea completada cuenta!'
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

// Watchers para efectos adicionales
watch(
  () => todoStore.getCompletedCount,
  (newCount, oldCount) => {
    // Mostrar mensaje motivacional cuando se completa una tarea
    if (newCount > oldCount && newCount > 0) {
      const message = getMotivationalMessage()
      showMotivationalMessage(message)
    }
  }
)

// Función para mostrar mensajes motivacionales
const showMotivationalMessage = (message: string) => {
  const notification = document.createElement('div')
  notification.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-in'
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      <span>${message}</span>
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-in-out forwards'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Función para animar la entrada de nuevas tareas
const animateNewTodo = () => {
  // Esta función se puede expandir para efectos visuales adicionales
  nextTick(() => {
    const lastTodo = document.querySelector('.group:first-child')
    if (lastTodo) {
      lastTodo.classList.add('animate-bounce-in')
    }
  })
}

// Watch para detectar nuevas tareas
watch(
  () => todoStore.getTotalCount,
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      animateNewTodo()
    }
  }
)
</script>

<style scoped>
/* Estilos para las transiciones de lista */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.fade-move {
  transition: transform 0.3s ease;
}

.fade-leave-active {
  position: absolute;
  width: calc(100% - 1rem);
}

/* Animación personalizada para fadeOut */
@keyframes fadeOut {
  from { 
    opacity: 1; 
    transform: translateY(0);
  }
  to { 
    opacity: 0; 
    transform: translateY(-10px);
  }
}

/* Mejora visual para el progreso */
.progress-bar {
  background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}
</style>
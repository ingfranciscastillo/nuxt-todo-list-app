<template>
  <div class="card mb-6">
    <div class="p-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <!-- Filtros de visualización -->
        <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="todoStore.setFilter(filter.value)"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            :class="getFilterButtonClass(filter.value)"
          >
            <component :is="filter.icon" class="h-4 w-4" />
            <span>{{ filter.label }}</span>
            <span
              v-if="filter.count > 0"
              class="px-2 py-0.5 text-xs rounded-full"
              :class="getFilterCountClass(filter.value)"
            >
              {{ filter.count }}
            </span>
          </button>
        </div>

        <!-- Acciones rápidas -->
        <div class="flex items-center space-x-2">
          <!-- Marcar todas como completadas -->
          <button
            v-if="todoStore.getPendingCount > 0"
            @click="markAllCompleted"
            class="btn-secondary text-sm flex items-center space-x-1"
            title="Marcar todas como completadas"
          >
            <CheckIcon class="h-4 w-4" />
            <span class="hidden sm:inline">Completar todas</span>
          </button>

          <!-- Eliminar completadas -->
          <button
            v-if="todoStore.hasCompletedTodos"
            @click="showDeleteCompletedConfirm = true"
            class="btn-danger text-sm flex items-center space-x-1"
            title="Eliminar todas las tareas completadas"
          >
            <TrashIcon class="h-4 w-4" />
            <span class="hidden sm:inline">Limpiar completadas</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación para eliminar tareas completadas -->
  <TransitionRoot appear :show="showDeleteCompletedConfirm" as="template">
    <Dialog as="div" @close="showDeleteCompletedConfirm = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center space-x-2"
              >
                <ExclamationTriangleIcon class="h-6 w-6 text-red-500" />
                <span>Confirmar eliminación</span>
              </DialogTitle>
              
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ¿Estás seguro de que quieres eliminar todas las tareas completadas? 
                  Esta acción no se puede deshacer.
                </p>
                <p class="text-sm font-medium text-red-600 dark:text-red-400 mt-2">
                  Se eliminarán {{ todoStore.getCompletedCount }} tareas completadas.
                </p>
              </div>

              <div class="mt-4 flex space-x-2 justify-end">
                <button
                  type="button"
                  class="btn-secondary"
                  @click="showDeleteCompletedConfirm = false"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="btn-danger"
                  @click="deleteCompleted"
                >
                  Eliminar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  QueueListIcon,
  ClockIcon,
  CheckCircleIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useTodoStore, type FilterType } from '~/stores/todo'

// Store de tareas
const todoStore = useTodoStore()

// Estado para el modal de confirmación
const showDeleteCompletedConfirm = ref(false)

// Configuración de filtros con iconos y etiquetas
const filters = computed(() => [
  {
    value: 'all' as FilterType,
    label: 'Todas',
    icon: QueueListIcon,
    count: todoStore.getTotalCount
  },
  {
    value: 'pending' as FilterType,
    label: 'Pendientes',
    icon: ClockIcon,
    count: todoStore.getPendingCount
  },
  {
    value: 'completed' as FilterType,
    label: 'Completadas',
    icon: CheckCircleIcon,
    count: todoStore.getCompletedCount
  }
])

// Función para obtener las clases CSS del botón de filtro
const getFilterButtonClass = (filterValue: FilterType): string => {
  const isActive = todoStore.filter === filterValue
  
  if (isActive) {
    return 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
  }
  
  return 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
}

// Función para obtener las clases CSS del contador de filtro
const getFilterCountClass = (filterValue: FilterType): string => {
  const isActive = todoStore.filter === filterValue
  
  if (isActive) {
    return 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
  }
  
  return 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
}

// Función para marcar todas las tareas como completadas
const markAllCompleted = () => {
  todoStore.markAllAsCompleted()
  
  // Mostrar mensaje de confirmación
  showNotification('✅ Todas las tareas han sido marcadas como completadas', 'success')
}

// Función para eliminar todas las tareas completadas
const deleteCompleted = () => {
  const completedCount = todoStore.getCompletedCount
  todoStore.deleteCompleted()
  showDeleteCompletedConfirm.value = false
  
  // Mostrar mensaje de confirmación
  showNotification(`🗑️ ${completedCount} tareas completadas eliminadas`, 'success')
}

// Función para mostrar notificaciones
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  const notification = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  
  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  // Remover después de 4 segundos
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-in-out forwards'
    setTimeout(() => notification.remove(), 300)
  }, 4000)
}

// Watchers para detectar cambios en los filtros
watch(
  () => todoStore.filter,
  (newFilter) => {
    // Opcional: guardar el filtro activo en localStorage
    localStorage.setItem('todoFilter', newFilter)
  }
)

// Inicializar el filtro desde localStorage al montar
onMounted(() => {
  const savedFilter = localStorage.getItem('todoFilter') as FilterType
  if (savedFilter && ['all', 'pending', 'completed'].includes(savedFilter)) {
    todoStore.setFilter(savedFilter)
  }
})
</script>

<style scoped>
@keyframes fadeOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}
</style>
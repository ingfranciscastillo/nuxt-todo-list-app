<template>
  <div
    class="card mb-3 hover:shadow-lg transition-all duration-200"
    :class="{
      'opacity-75 bg-gray-50 dark:bg-gray-800/50': todo.completed,
      'ring-2 ring-primary-200 dark:ring-primary-800': isEditing
    }"
  >
    <div class="p-4">
      <div class="flex items-start space-x-3">
        <!-- Checkbox para marcar como completada -->
        <button
          @click="toggleComplete"
          class="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
        >
          <div
            class="w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
            :class="checkboxClasses"
          >
            <CheckIcon
              v-if="todo.completed"
              class="w-3 h-3 text-white animate-bounce-in"
            />
          </div>
        </button>

        <!-- Contenido de la tarea -->
        <div class="flex-1 min-w-0">
          <div v-if="!isEditing" class="space-y-1">
            <!-- Título -->
            <h3
              class="text-sm font-medium transition-all duration-200"
              :class="{
                'line-through text-gray-500 dark:text-gray-400': todo.completed,
                'text-gray-900 dark:text-white': !todo.completed
              }"
            >
              {{ todo.title }}
            </h3>

            <!-- Descripción (si existe) -->
            <p
              v-if="todo.description"
              class="text-sm transition-all duration-200"
              :class="{
                'line-through text-gray-400 dark:text-gray-500': todo.completed,
                'text-gray-600 dark:text-gray-300': !todo.completed
              }"
            >
              {{ todo.description }}
            </p>

            <!-- Metadatos -->
            <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <CalendarIcon class="w-3 h-3" />
              <time>{{ formatDate(todo.createdAt) }}</time>
              <span v-if="todo.completed" class="text-green-600 dark:text-green-400">
                • Completada
              </span>
            </div>
          </div>

          <!-- Formulario de edición -->
          <div v-else class="space-y-3">
            <input
              ref="editTitleInput"
              v-model="editForm.title"
              type="text"
              class="input-field text-sm"
              :class="{ 'border-red-500': editErrors.title }"
              placeholder="Título de la tarea..."
              maxlength="100"
              @keydown.enter="saveEdit"
              @keydown.escape="cancelEdit"
            />
            <p v-if="editErrors.title" class="text-red-500 text-xs">
              {{ editErrors.title }}
            </p>
            
            <textarea
              v-model="editForm.description"
              class="input-field text-sm resize-none"
              placeholder="Descripción opcional..."
              rows="2"
              maxlength="300"
              @keydown.ctrl.enter="saveEdit"
              @keydown.escape="cancelEdit"
            ></textarea>
            
            <div class="flex items-center space-x-2">
              <button
                @click="saveEdit"
                class="btn-primary text-xs py-1 px-2"
                :disabled="!editForm.title.trim()"
              >
                <CheckIcon class="w-3 h-3 mr-1" />
                Guardar
              </button>
              <button
                @click="cancelEdit"
                class="btn-secondary text-xs py-1 px-2"
              >
                <XMarkIcon class="w-3 h-3 mr-1" />
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div v-if="!isEditing" class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            @click="startEdit"
            class="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            title="Editar tarea"
          >
            <PencilIcon class="w-4 h-4" />
          </button>
          
          <button
            @click="showDeleteConfirm = true"
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
            title="Eliminar tarea"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación para eliminar -->
  <TransitionRoot appear :show="showDeleteConfirm" as="template">
    <Dialog as="div" @close="showDeleteConfirm = false" class="relative z-50">
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
                <span>Eliminar tarea</span>
              </DialogTitle>
              
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
                </p>
                <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ todo.title }}
                  </p>
                  <p v-if="todo.description" class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ todo.description }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex space-x-2 justify-end">
                <button
                  type="button"
                  class="btn-secondary"
                  @click="showDeleteConfirm = false"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="btn-danger"
                  @click="deleteTodo"
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
  CheckIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useTodoStore, type Todo } from '~/stores/todo'

// Props del componente
interface Props {
  todo: Todo
}

const props = defineProps<Props>()

// Store de tareas
const todoStore = useTodoStore()

// Estado para la edición
const isEditing = ref(false)
const showDeleteConfirm = ref(false)

// Formulario de edición
const editForm = reactive({
  title: '',
  description: ''
})

// Errores de validación para edición
const editErrors = reactive({
  title: ''
})

// Referencia al input de título para hacer focus
const editTitleInput = ref<HTMLInputElement>()

// Computed para las clases del checkbox
const checkboxClasses = computed(() => {
  if (props.todo.completed) {
    return 'border-green-500 bg-green-500'
  }
  return 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
})

// Función para alternar el estado completado/pendiente
const toggleComplete = () => {
  todoStore.toggleTodo(props.todo.id)
}

// Función para iniciar la edición
const startEdit = () => {
  editForm.title = props.todo.title
  editForm.description = props.todo.description || ''
  editErrors.title = ''
  isEditing.value = true
  
  // Hacer focus en el input después de que se renderice
  nextTick(() => {
    editTitleInput.value?.focus()
    editTitleInput.value?.select()
  })
}

// Función para cancelar la edición
const cancelEdit = () => {
  isEditing.value = false
  editForm.title = ''
  editForm.description = ''
  editErrors.title = ''
}

// Función para validar y guardar los cambios
const saveEdit = () => {
  // Validar título
  if (!editForm.title.trim()) {
    editErrors.title = 'El título es obligatorio'
    return
  }
  
  if (editForm.title.trim().length < 3) {
    editErrors.title = 'El título debe tener al menos 3 caracteres'
    return
  }
  
  // Actualizar la tarea
  todoStore.updateTodo(props.todo.id, {
    title: editForm.title,
    description: editForm.description
  })
  
  // Salir del modo edición
  cancelEdit()
}

// Función para eliminar la tarea
const deleteTodo = () => {
  todoStore.deleteTodo(props.todo.id)
  showDeleteConfirm.value = false
}

// Función para formatear la fecha
const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Hoy'
  } else if (diffDays === 1) {
    return 'Ayer'
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`
  } else {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}
</script>

<style scoped>
/* Hover effect para mostrar botones de acción */
.card:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
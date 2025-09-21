<template>
  <div class="card mb-6">
    <div class="p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Agregar Nueva Tarea
      </h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Campo de título (obligatorio) -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="¿Qué necesitas hacer?"
            class="input-field"
            :class="{ 'border-red-500': errors.title }"
            @input="clearError('title')"
            maxlength="100"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">
            {{ errors.title }}
          </p>
          <p class="text-gray-500 text-xs mt-1">
            {{ form.title.length }}/100 caracteres
          </p>
        </div>

        <!-- Campo de descripción (opcional) -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Agrega más detalles sobre la tarea..."
            rows="3"
            class="input-field resize-none"
            maxlength="300"
          ></textarea>
          <p class="text-gray-500 text-xs mt-1">
            {{ form.description.length }}/300 caracteres
          </p>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            @click="resetForm"
            class="btn-secondary"
            :disabled="isFormEmpty"
          >
            <XMarkIcon class="h-4 w-4 mr-2" />
            Limpiar
          </button>
          
          <button
            type="submit"
            class="btn-primary"
            :disabled="!form.title.trim() || isSubmitting"
            :class="{ 'opacity-50 cursor-not-allowed': !form.title.trim() || isSubmitting }"
          >
            <PlusIcon v-if="!isSubmitting" class="h-4 w-4 mr-2" />
            <div v-else class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            {{ isSubmitting ? 'Agregando...' : 'Agregar Tarea' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '~/stores/todo'

// Store de tareas
const todoStore = useTodoStore()

// Estado reactivo del formulario
const form = reactive({
  title: '',
  description: ''
})

// Estado para errores de validación
const errors = reactive({
  title: ''
})

// Estado para indicar si se está enviando el formulario
const isSubmitting = ref(false)

// Computed para verificar si el formulario está vacío
const isFormEmpty = computed(() => {
  return !form.title.trim() && !form.description.trim()
})

// Función para limpiar un error específico
const clearError = (field: keyof typeof errors) => {
  errors[field] = ''
}

// Función para validar el formulario
const validateForm = (): boolean => {
  // Limpiar errores previos
  errors.title = ''
  
  // Validar título
  if (!form.title.trim()) {
    errors.title = 'El título es obligatorio'
    return false
  }
  
  if (form.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres'
    return false
  }
  
  return true
}

// Función para manejar el envío del formulario
const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    isSubmitting.value = true
    
    // Simular un pequeño delay para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Agregar la tarea al store
    todoStore.addTodo(form.title, form.description)
    
    // Limpiar el formulario después de agregar
    resetForm()
    
    // Mostrar feedback visual (opcional)
    showSuccessMessage()
    
  } catch (error) {
    console.error('Error al agregar tarea:', error)
    errors.title = 'Error al agregar la tarea. Inténtalo de nuevo.'
  } finally {
    isSubmitting.value = false
  }
}

// Función para resetear el formulario
const resetForm = () => {
  form.title = ''
  form.description = ''
  errors.title = ''
}

// Función para mostrar mensaje de éxito (simple feedback visual)
const showSuccessMessage = () => {
  // Crear elemento de notificación temporal
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce-in'
  notification.textContent = '✅ Tarea agregada correctamente'
  
  document.body.appendChild(notification)
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Atajo de teclado para enviar el formulario (Ctrl/Cmd + Enter)
const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    handleSubmit()
  }
}

// Agregar y remover event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

</script>
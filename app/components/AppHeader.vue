<template>
  <header class="card mb-6">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="bg-gradient-to-r from-primary-500 to-purple-600 p-2 rounded-lg">
            <CheckCircleIcon class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Todo App
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Gestiona tus tareas de forma eficiente
            </p>
          </div>
        </div>
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
          :title="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
        >
          <SunIcon v-if="isDark" class="h-5 w-5 text-yellow-500" />
          <MoonIcon v-else class="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div class="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <span class="flex items-center space-x-1">
          <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Total: {{ todoStore.getTotalCount }}</span>
        </span>
        <span class="flex items-center space-x-1">
          <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span>Pendientes: {{ todoStore.getPendingCount }}</span>
        </span>
        <span class="flex items-center space-x-1">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Completadas: {{ todoStore.getCompletedCount }}</span>
        </span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CheckCircleIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useTodoStore } from '~/stores/todo'

// Store de tareas
const todoStore = useTodoStore()

// Estado del dark mode
const isDark = ref(false)

// Función para alternar el dark mode
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  
  // Aplicar la clase dark al documento
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Inicializar el tema desde localStorage al montar el componente
onMounted(() => {
  // Verificar preferencia guardada o preferencia del sistema
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <AppHeader />
      
      <main class="space-y-6">
        <NuxtPage />
      </main>
      
      <!-- Footer -->
      <footer class="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          <p class="mb-2">
            Hecho con ❤️ usando 
            <a href="https://nuxt.com" target="_blank" rel="noopener" class="text-primary-500 hover:text-primary-600 font-medium">
              Nuxt 4
            </a>, 
            <a href="https://pinia.vuejs.org" target="_blank" rel="noopener" class="text-primary-500 hover:text-primary-600 font-medium">
              Pinia
            </a> y 
            <a href="https://tailwindcss.com" target="_blank" rel="noopener" class="text-primary-500 hover:text-primary-600 font-medium">
              TailwindCSS
            </a>
          </p>
          <p class="text-xs">
            © {{ new Date().getFullYear() }} Todo App - Organiza tus tareas de manera eficiente
          </p>
        </div>
      </footer>
    </div>
    <div
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-purple-600 z-50 transition-all duration-300"
      :style="{ width: scrollProgress + '%' }"
    ></div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        title="Volver arriba"
      >
        <ChevronUpIcon class="w-5 h-5" />
      </button>
    </Transition>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Cargando tareas...</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronUpIcon } from '@heroicons/vue/24/outline'
import { useTodoStore } from '~/stores/todo'
import AppHeader from '~/components/AppHeader.vue'

// Store de tareas
const todoStore = useTodoStore()

// Estados reactivos
const scrollProgress = ref(0)
const showScrollTop = ref(false)
const isLoading = ref(true)

// Función para calcular el progreso del scroll
const updateScrollProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = (scrollTop / docHeight) * 100
  
  scrollProgress.value = Math.min(Math.max(progress, 0), 100)
  showScrollTop.value = scrollTop > 400
}

// Función para scroll suave hacia arriba
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Función de throttle para optimizar el rendimiento
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Event listener throttled para scroll
const throttledScrollHandler = throttle(updateScrollProgress, 16) // ~60fps

// Lifecycle hooks
onMounted(async () => {
  try {
    // Inicializar el store con los datos del localStorage
    todoStore.initializeStore()
    
    // Simular carga inicial
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Agregar event listener para scroll
    window.addEventListener('scroll', throttledScrollHandler)
    
    // Configurar detección de preferencias del sistema para dark mode
    setupSystemThemeDetection()
    
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Limpiar event listeners
  window.removeEventListener('scroll', throttledScrollHandler)
})

// Función para configurar detección automática de tema del sistema
const setupSystemThemeDetection = () => {
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Listener para cambios en preferencias del sistema
    mediaQuery.addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem('theme')
      
      // Solo aplicar tema del sistema si no hay preferencia guardada
      if (!savedTheme) {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    })
  }
}

// Meta tags dinámicos
useHead({
  title: 'Todo App - Gestiona tus tareas',
  meta: [
    { name: 'description', content: 'Una aplicación moderna para gestionar tus tareas diarias con Nuxt 4, Vue 4 y TailwindCSS' },
    { name: 'keywords', content: 'todo, tareas, productividad, nuxt, vue, tailwindcss' },
    { name: 'author', content: 'Todo App' },
    { property: 'og:title', content: 'Todo App - Gestiona tus tareas' },
    { property: 'og:description', content: 'Una aplicación moderna para gestionar tus tareas diarias' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Todo App - Gestiona tus tareas' },
    { name: 'twitter:description', content: 'Una aplicación moderna para gestionar tus tareas diarias' }
  ],
  link: [
    { rel: 'canonical', href: 'https://todo-app.example.com' }
  ]
})

// Watchers para efectos dinámicos
watch(
  () => todoStore.getTotalCount,
  (newCount) => {
    // Actualizar título dinámicamente con el número de tareas
    if (newCount > 0) {
      const pendingCount = todoStore.getPendingCount
      if (pendingCount > 0) {
        useHead({
          title: `(${pendingCount}) Todo App - ${pendingCount} tareas pendientes`
        })
      } else {
        useHead({
          title: '✅ Todo App - ¡Todas las tareas completadas!'
        })
      }
    } else {
      useHead({
        title: 'Todo App - Gestiona tus tareas'
      })
    }
  },
  { immediate: true }
)

// Prevenir cierre accidental con tareas pendientes
onBeforeUnmount(() => {
  if (todoStore.getPendingCount > 0) {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault()
      e.returnValue = '¿Estás seguro de que quieres salir? Tienes tareas pendientes.'
    })
  }
})
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
<template>
  <div>
    <TodoForm />
    <TodoFilters />
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import TodoForm from '~/components/TodoForm.vue'
import TodoFilters from '~/components/TodoFilters.vue'
import TodoList from '~/components/TodoList.vue'
import { useTodoStore } from '~/stores/todo'

// Inicializar el store de tareas
const todoStore = useTodoStore()

// Inicializar el store cuando el componente se monte
onMounted(() => {
  todoStore.initializeStore()
})

// Configurar meta tags para la página principal
useHead({
  title: 'Todo App - Gestiona tus tareas diarias',
  meta: [
    {
      name: 'description',
      content: 'Organiza y gestiona tus tareas diarias de forma eficiente con nuestra aplicación todo construida con Nuxt 4, Vue 3 y TailwindCSS.'
    }
  ]
})

// Configuración de SEO estructurado
useSchemaOrg([
  {
    '@type': 'WebApplication',
    name: 'Todo App',
    description: 'Una aplicación web para gestionar tareas diarias',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }
])
</script>
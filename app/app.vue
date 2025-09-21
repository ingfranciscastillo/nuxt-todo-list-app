<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
// Configuración global de la aplicación

// Error handling global
const handleError = (error: any) => {
  console.error('Error global capturado:', error)
  
  // Aquí puedes agregar logging a servicios externos
  // como Sentry, LogRocket, etc.
}

// Registrar handler de errores globales
if (process.client) {
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason)
  })
}

// Limpiar event listeners al desmontar
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleError)
  }
})
</script>
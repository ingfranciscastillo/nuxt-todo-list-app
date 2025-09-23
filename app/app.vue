<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">

const handleError = (error: any) => {
  console.error('Error global capturado:', error)
  
}

if (import.meta.client) {
  window.addEventListener('error', handleError)
  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason)
  })
}

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('error', handleError)
    window.removeEventListener('unhandledrejection', handleError)
  }
})
</script>
<script setup>
import { RouterView } from 'vue-router'
import ToastNotification from './components/ToastNotification.vue'
</script>

<template>
  <ToastNotification />
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<template>
  <div v-if="authStore.isAuthenticated" class="min-h-screen bg-slate-50 flex">
    <AppSidebar :is-open="isSidebarOpen" @toggle-sidebar="isSidebarOpen = false" />
    
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <main class="flex-1 overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
           <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
           </router-view>
        </div>
      </main>
    </div>
  </div>
  
  <div v-else class="min-h-screen bg-slate-50">
      <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
       </router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from './stores/authStore';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';

const authStore = useAuthStore();
const isSidebarOpen = ref(false);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
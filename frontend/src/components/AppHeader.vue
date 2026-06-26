<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const userInitials = computed(() => {
  if (authStore.user && authStore.user.name) {
    return authStore.user.name.charAt(0).toUpperCase();
  }
  return 'U';
});

function handleLogout() {
    authStore.logoutUser();
    router.push('/login');
}
</script>

<template>
  <header class="glass-panel sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6 border-b border-r-0">
    <div class="flex items-center gap-4">
        <!-- Optional Breadcrumbs or Title could go here -->
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
            Painel de Controle
        </h2>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ authStore.user?.name || 'Usuário' }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ authStore.user?.email || 'admin@taskflow.com' }}</p>
        </div>
        
        <div class="relative group">
            <div class="h-10 w-10 overflow-hidden rounded-full border-2 border-indigo-500/50 shadow-md cursor-pointer hover:border-indigo-500 transition-colors bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                <img src="/images/backgrounds/img_user_avatar_placeholder.png" alt="Avatar" class="h-full w-full object-cover hidden" />
                <span>{{ userInitials }}</span>
            </div>
            
            <div class="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                <div class="glass-card py-2 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                    <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                        Sair do sistema
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  </header>
</template>

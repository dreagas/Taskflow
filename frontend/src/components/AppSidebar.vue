<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navigationLinks = [
    { name: 'Dashboard', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Clientes', path: '/clients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Ordens de Serviço', path: '/service-orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Calculadora', path: '/calculator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
];

function isCurrentRouteActive(path) {
    if (path === '/') {
        return route.path === '/';
    }
    return route.path.startsWith(path);
}
</script>

<template>
  <aside class="glass-panel w-64 hidden md:flex flex-col min-h-screen">
    <div class="h-16 flex items-center justify-center border-b border-white/20 dark:border-slate-700/30">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">TaskFlow</span>
        </div>
    </div>

    <div class="flex-1 overflow-y-auto py-6 px-4">
        <nav class="space-y-2">
            <router-link
                v-for="link in navigationLinks"
                :key="link.path"
                :to="link.path"
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
                :class="isCurrentRouteActive(link.path)
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'"
            >
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                     :class="isCurrentRouteActive(link.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500'"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon"></path>
                </svg>
                <span class="font-medium">{{ link.name }}</span>
            </router-link>
        </nav>
    </div>

    <div class="p-4 border-t border-white/20 dark:border-slate-700/30">
        <div class="glass-card p-4 rounded-xl text-center shadow-inner">
            <p class="text-xs text-slate-500 font-medium">TaskFlow OS v1.0</p>
            <p class="text-[10px] text-slate-400 mt-1">Criado por André Agas</p>
        </div>
    </div>
  </aside>
</template>

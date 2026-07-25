<template>
    <div :class="['fixed inset-y-0 left-0 z-50 w-64 glass-panel transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex', isOpen ? 'translate-x-0' : '-translate-x-full']">
        <div class="flex flex-col flex-1 h-full min-h-screen border-r border-slate-200/50">
            <!-- Logo -->
            <div class="flex items-center justify-center h-16 border-b border-slate-200/50">
                <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                    TaskFlow
                </h1>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <router-link to="/" class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out hover:bg-indigo-50/80 hover:text-indigo-600 group" active-class="bg-indigo-50/80 text-indigo-600 shadow-sm">
                    <LayoutDashboardIcon class="w-5 h-5 mr-3 group-hover:-translate-y-0.5 transition-transform" />
                    Dashboard
                </router-link>
                
                <router-link to="/clientes" class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out hover:bg-indigo-50/80 hover:text-indigo-600 group" active-class="bg-indigo-50/80 text-indigo-600 shadow-sm">
                    <UsersIcon class="w-5 h-5 mr-3 group-hover:-translate-y-0.5 transition-transform" />
                    Clientes
                </router-link>

                <router-link to="/ordens-de-servico" class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out hover:bg-indigo-50/80 hover:text-indigo-600 group" active-class="bg-indigo-50/80 text-indigo-600 shadow-sm">
                    <ClipboardListIcon class="w-5 h-5 mr-3 group-hover:-translate-y-0.5 transition-transform" />
                    Ordens de Serviço
                </router-link>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { LayoutDashboard as LayoutDashboardIcon, Users as UsersIcon, ClipboardList as ClipboardListIcon } from 'lucide-vue-next';

defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});
</script>
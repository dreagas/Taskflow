<template>
    <header class="sticky top-0 z-50 glass-panel shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Mobile Menu Button -->
                <div class="flex items-center lg:hidden">
                    <button @click="$emit('toggle-sidebar')" class="text-slate-500 hover:text-slate-700 focus:outline-none">
                        <MenuIcon class="h-6 w-6" />
                    </button>
                </div>
                
                <div class="flex-shrink-0 flex items-center lg:hidden">
                    <h1 class="text-xl font-bold text-indigo-600">TaskFlow</h1>
                </div>

                <div class="flex-1 px-4 flex justify-end">
                    <div class="ml-4 flex items-center md:ml-6">
                        <div class="relative ml-3 group">
                            <div class="flex items-center space-x-3 cursor-pointer">
                                <span class="hidden md:block text-sm font-medium text-slate-700">{{ authStore.user?.name || 'Usuário' }}</span>
                                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                    {{ getInitials(authStore.user?.name) }}
                                </div>
                            </div>
                            <!-- Dropdown -->
                            <div class="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg glass-panel ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                                <div class="py-1">
                                    <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100/50 hover:text-indigo-600">
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { Menu as MenuIcon } from 'lucide-vue-next';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
};

const handleLogout = () => {
    authStore.logoutUser();
    router.push('/login');
};
</script>
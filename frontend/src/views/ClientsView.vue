<script setup>
import { ref, onMounted } from 'vue';
import { useClientStore } from '../stores/clientStore';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';

const clientStore = useClientStore();

const showAddModal = ref(false);
const newClientForm = ref({ name: '', email: '', phone: '', address: '' });
const isSubmitting = ref(false);

onMounted(async () => {
    await clientStore.fetchAllClients();
});

function openAddModal() {
    newClientForm.value = { name: '', email: '', phone: '', address: '' };
    showAddModal.value = true;
}

async function handleCreateClient() {
    if (!newClientForm.value.name || !newClientForm.value.email) {
        window.showAppToast('Nome e E-mail são obrigatórios.', 'error');
        return;
    }

    isSubmitting.value = true;
    const result = await clientStore.createNewClient(newClientForm.value);
    isSubmitting.value = false;

    if (result.success) {
        window.showAppToast('Cliente cadastrado com sucesso!', 'success');
        showAddModal.value = false;
    } else {
        window.showAppToast(result.errorMessage, 'error');
    }
}

async function handleDeleteClient(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const result = await clientStore.removeClient(id);
        if (result.success) {
             window.showAppToast('Cliente removido.', 'success');
        } else {
             window.showAppToast(result.errorMessage, 'error');
        }
    }
}
</script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[20%] left-[10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
    </div>

    <AppSidebar class="z-10" />

    <div class="flex-1 flex flex-col z-10 w-full overflow-hidden">
        <AppHeader />

        <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            <div class="max-w-7xl mx-auto space-y-6">

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Clientes</h1>
                        <p class="text-slate-500 dark:text-slate-400 mt-1">Gerencie sua carteira de clientes.</p>
                    </div>
                    <button @click="openAddModal" class="glass-button flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Novo Cliente
                    </button>
                </div>

                <div class="glass-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                                    <th class="p-4 pl-6">Nome</th>
                                    <th class="p-4">Contato</th>
                                    <th class="p-4">Endereço</th>
                                    <th class="p-4 pr-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200/30 dark:divide-slate-700/30">
                                <tr v-if="clientStore.isLoading" class="animate-pulse">
                                    <td colspan="4" class="p-8 text-center text-slate-400">Carregando dados...</td>
                                </tr>
                                <tr v-else-if="clientStore.clients.length === 0">
                                    <td colspan="4" class="p-8 text-center text-slate-500 dark:text-slate-400">Nenhum cliente cadastrado.</td>
                                </tr>
                                <tr v-for="client in clientStore.clients" :key="client.id" class="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors duration-200 group">
                                    <td class="p-4 pl-6">
                                        <div class="font-medium text-slate-900 dark:text-slate-100">{{ client.name }}</div>
                                        <div class="text-xs text-slate-500 mt-0.5">ID: {{ client.id }}</div>
                                    </td>
                                    <td class="p-4">
                                        <div class="text-sm text-slate-700 dark:text-slate-300">{{ client.email }}</div>
                                        <div class="text-xs text-slate-500 mt-0.5">{{ client.phone || 'Sem telefone' }}</div>
                                    </td>
                                    <td class="p-4 text-sm text-slate-600 dark:text-slate-400">{{ client.address || 'Não informado' }}</td>
                                    <td class="p-4 pr-6 text-right space-x-2">
                                        <button @click="handleDeleteClient(client.id)" class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded-lg transition-colors">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- Add Client Modal -->
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddModal = false"></div>

            <div class="glass-card w-full max-w-lg relative z-10 p-6 md:p-8 shadow-2xl">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-white">Novo Cliente</h2>
                    <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form @submit.prevent="handleCreateClient" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                        <input type="text" v-model="newClientForm.name" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail *</label>
                        <input type="email" v-model="newClientForm.email" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                        <input type="text" v-model="newClientForm.phone" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Endereço</label>
                        <input type="text" v-model="newClientForm.address" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" />
                    </div>

                    <div class="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700/50 mt-6">
                        <button type="button" @click="showAddModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
                        <button type="submit" :disabled="isSubmitting" class="glass-button py-2">{{ isSubmitting ? 'Salvando...' : 'Salvar Cliente' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </Transition>

  </div>
</template>

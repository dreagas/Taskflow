<script setup>
import { ref, onMounted } from 'vue';
import { useServiceOrderStore } from '../stores/serviceOrderStore';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';
import StatusBadge from '../components/StatusBadge.vue';

const serviceOrderStore = useServiceOrderStore();

const showAddModal = ref(false);
const newOrderForm = ref({ client_name: '', category: '', title: '', description: '', amount: 0 });
const isSubmitting = ref(false);

const orderCategories = [
    'Manutenção',
    'Troca',
    'Garantia',
    'Instalação',
    'Suporte Técnico',
    'Outros'
];

onMounted(async () => {
    await serviceOrderStore.fetchAllServiceOrders();
});

function openAddModal() {
    newOrderForm.value = { client_name: '', category: '', title: '', description: '', amount: 0 };
    showAddModal.value = true;
}

async function handleCreateOrder() {
    if (!newOrderForm.value.client_name || !newOrderForm.value.category || !newOrderForm.value.title) {
        window.showAppToast('Nome do cliente, Categoria e Título são obrigatórios.', 'error');
        return;
    }

    isSubmitting.value = true;
    const result = await serviceOrderStore.createNewServiceOrder(newOrderForm.value);
    isSubmitting.value = false;

    if (result.success) {
        window.showAppToast('Ordem de serviço criada com sucesso!', 'success');
        showAddModal.value = false;
    } else {
        window.showAppToast(result.errorMessage, 'error');
    }
}

async function updateStatus(orderId, currentStatus) {
    let nextStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'completed';
    else if (currentStatus === 'completed') nextStatus = 'pending';

    await serviceOrderStore.updateOrderStatus(orderId, nextStatus);
}

function formatCurrency(value) {
    if (value === undefined || value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[20%] left-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
    </div>

    <AppSidebar class="z-10" />

    <div class="flex-1 flex flex-col z-10 w-full overflow-hidden">
        <AppHeader />

        <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            <div class="max-w-7xl mx-auto space-y-6">

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Ordens de Serviço</h1>
                        <p class="text-slate-500 dark:text-slate-400 mt-1">Gerencie os serviços prestados aos clientes.</p>
                    </div>
                    <button @click="openAddModal" class="glass-button flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Nova O.S.
                    </button>
                </div>

                <div class="glass-card overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                                    <th class="p-4 pl-6">ID / Data</th>
                                    <th class="p-4">Cliente</th>
                                    <th class="p-4">Serviço / Categoria</th>
                                    <th class="p-4 text-center">Status</th>
                                    <th class="p-4 pr-6 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200/30 dark:divide-slate-700/30">
                                <tr v-if="serviceOrderStore.isLoading" class="animate-pulse">
                                    <td colspan="5" class="p-8 text-center text-slate-400">Carregando ordens de serviço...</td>
                                </tr>
                                <tr v-else-if="serviceOrderStore.serviceOrders.length === 0">
                                    <td colspan="5" class="p-8 text-center text-slate-500 dark:text-slate-400">Nenhuma ordem de serviço registrada.</td>
                                </tr>
                                <tr v-for="order in serviceOrderStore.serviceOrders" :key="order.id" class="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors duration-200 group">
                                    <td class="p-4 pl-6">
                                        <div class="font-bold text-slate-900 dark:text-slate-100">#{{ order.id }}</div>
                                        <div class="text-xs text-slate-500 mt-0.5">{{ new Date(order.created_at).toLocaleDateString('pt-BR') }}</div>
                                    </td>
                                    <td class="p-4 font-medium text-slate-700 dark:text-slate-300">{{ order.client_name }}</td>
                                    <td class="p-4">
                                        <div class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ order.title }}</div>
                                        <div class="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">{{ order.category }}</div>
                                    </td>
                                    <td class="p-4 text-center cursor-pointer" @click="updateStatus(order.id, order.status)" title="Clique para avançar status">
                                        <StatusBadge :status="order.status" class="hover:ring-2 hover:ring-indigo-500/30 transition-all" />
                                    </td>
                                    <td class="p-4 pr-6 text-right font-semibold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(order.amount) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- Add OS Modal -->
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
                    <h2 class="text-xl font-bold text-slate-800 dark:text-white">Nova Ordem de Serviço</h2>
                    <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form @submit.prevent="handleCreateOrder" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Cliente *</label>
                        <input type="text" v-model="newOrderForm.client_name" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" placeholder="Ex: João da Silva" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria *</label>
                        <select v-model="newOrderForm.category" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" required>
                            <option value="" disabled>Selecione uma categoria...</option>
                            <option v-for="category in orderCategories" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título do Serviço *</label>
                        <input type="text" v-model="newOrderForm.title" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" placeholder="Ex: Formatação de Computador" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                        <textarea v-model="newOrderForm.description" rows="2" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Valor (R$)</label>
                        <input type="number" step="0.01" min="0" v-model="newOrderForm.amount" class="glass-input w-full px-4 py-2 text-slate-800 dark:text-white" />
                    </div>

                    <div class="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700/50 mt-6">
                        <button type="button" @click="showAddModal = false" class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
                        <button type="submit" :disabled="isSubmitting" class="glass-button py-2">{{ isSubmitting ? 'Salvando...' : 'Salvar O.S.' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </Transition>

  </div>
</template>

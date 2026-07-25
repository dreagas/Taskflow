<template>
    <div class="space-y-6">
        <div class="sm:flex sm:items-center sm:justify-between">
            <div>
                <h2 class="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                    Ordens de Serviço
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                    Gerenciamento de chamados e ordens ativas
                </p>
            </div>
            <div class="mt-4 sm:mt-0">
                <button @click="openModal()" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
                    Nova O.S.
                </button>
            </div>
        </div>

        <div class="glass-panel shadow-sm rounded-2xl overflow-hidden">
             <!-- Filters -->
             <div class="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                  <div class="flex-1">
                      <select v-model="filterStatus" class="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-colors">
                          <option value="">Todos os Status</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Em Andamento">Em Andamento</option>
                          <option value="Concluído">Concluído</option>
                      </select>
                  </div>
                  <div class="flex-1">
                      <select v-model="filterPriority" class="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-colors">
                          <option value="">Todas as Prioridades</option>
                          <option value="Baixa">Baixa</option>
                          <option value="Média">Média</option>
                          <option value="Alta">Alta</option>
                      </select>
                  </div>
             </div>
             
             <div class="overflow-x-auto">
                 <table class="min-w-full divide-y divide-slate-200">
                     <thead class="bg-slate-50">
                         <tr>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descrição</th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Datas</th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status & Prioridade</th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Total</th>
                             <th scope="col" class="relative px-6 py-3"><span class="sr-only">Ações</span></th>
                         </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-slate-200">
                         <tr v-for="order in processedOrders" :key="order.id" class="hover:bg-slate-50 transition-colors">
                             <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                 #{{ order.id }}
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap">
                                 <div class="text-sm font-medium text-slate-900">{{ order.client_name || 'Desconhecido' }}</div>
                             </td>
                             <td class="px-6 py-4">
                                 <div class="text-sm text-slate-900 line-clamp-2">{{ order.description }}</div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                 <div v-if="order.start_date">Início: {{ formatDateBR(order.start_date) }}</div>
                                 <div v-if="order.end_date">Fim: {{ formatDateBR(order.end_date) }}</div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap space-y-2">
                                 <div class="flex gap-2 flex-col items-start">
                                     <StatusBadge :status="order.status" type="status" />
                                     <StatusBadge :status="order.priority" type="priority" />
                                 </div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                 {{ formatCurrency(order.total_amount) }}
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <div class="relative inline-block text-left group">
                                     <button type="button" class="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                         Ações
                                         <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                     </button>
                                     <div class="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-10">
                                         <div class="py-1">
                                             <button @click="openModal(order)" class="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                 Editar
                                             </button>
                                         </div>
                                         <div class="py-1">
                                             <button @click="confirmDelete(order.id)" class="group flex w-full items-center px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 hover:text-rose-900">
                                                 Excluir
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             </td>
                         </tr>
                         <tr v-if="processedOrders.length === 0">
                              <td colspan="7" class="px-6 py-10 text-center text-sm text-slate-500">Nenhuma ordem de serviço encontrada.</td>
                         </tr>
                     </tbody>
                 </table>
             </div>
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                
                <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeModal"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div class="inline-block align-bottom glass-panel rounded-2xl text-left overflow-hidden shadow-2xl shadow-indigo-500/10 transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <form @submit.prevent="saveServiceOrder">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                                        {{ currentOrder.id ? 'Editar Ordem de Serviço #' + currentOrder.id : 'Nova Ordem de Serviço' }}
                                    </h3>
                                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        
                                        <div class="sm:col-span-6">
                                            <label class="block text-sm font-medium text-slate-700">Cliente <span class="text-rose-500">*</span></label>
                                            <select v-model="currentOrder.client_id" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option value="" disabled>Selecione um cliente...</option>
                                                <option v-for="client in clientStore.clientsList" :key="client.id" :value="client.id">
                                                    {{ client.name }}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="sm:col-span-6">
                                            <label class="block text-sm font-medium text-slate-700">Descrição do Serviço <span class="text-rose-500">*</span></label>
                                            <textarea v-model="currentOrder.description" rows="3" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                                        </div>

                                        <div class="sm:col-span-2">
                                            <label class="block text-sm font-medium text-slate-700">Status</label>
                                            <select v-model="currentOrder.status" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option value="Pendente">Pendente</option>
                                                <option value="Em Andamento">Em Andamento</option>
                                                <option value="Concluído">Concluído</option>
                                            </select>
                                        </div>

                                        <div class="sm:col-span-2">
                                            <label class="block text-sm font-medium text-slate-700">Prioridade</label>
                                            <select v-model="currentOrder.priority" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option value="Baixa">Baixa</option>
                                                <option value="Média">Média</option>
                                                <option value="Alta">Alta</option>
                                            </select>
                                        </div>

                                        <div class="sm:col-span-3">
                                            <label class="block text-sm font-medium text-slate-700">Data de Início</label>
                                            <input v-model="currentOrder.start_date" type="date" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>
                                        
                                        <div class="sm:col-span-3">
                                            <label class="block text-sm font-medium text-slate-700">Data de Término</label>
                                            <input v-model="currentOrder.end_date" type="date" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>

                                        <div class="sm:col-span-2">
                                            <label class="block text-sm font-medium text-slate-700">Horas Estimadas</label>
                                            <input v-model.number="currentOrder.hours" type="number" step="0.5" min="0" @input="calculateTotalAmount" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>
                                        
                                        <div class="sm:col-span-2">
                                            <label class="block text-sm font-medium text-slate-700">Valor Hora (R$)</label>
                                            <input v-model.number="currentOrder.rate" type="number" step="0.01" min="0" @input="calculateTotalAmount" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>

                                        <div class="sm:col-span-2">
                                            <label class="block text-sm font-medium text-slate-700">Valor Total (R$)</label>
                                            <input v-model.number="currentOrder.total_amount" type="number" step="0.01" min="0" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50" readonly>
                                        </div>

                                    </div>
                                    
                                    <div v-if="dateError" class="mt-4 text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100 animate-pulse">
                                        {{ dateError }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t border-slate-200">
                            <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                                Salvar O.S.
                            </button>
                            <button type="button" @click="closeModal" class="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useServiceOrderStore } from '../stores/serviceOrderStore';
import { useClientStore } from '../stores/clientStore';
import { Plus as PlusIcon, ChevronDown as ChevronDownIcon } from 'lucide-vue-next';
import StatusBadge from '../components/StatusBadge.vue';

const serviceOrderStore = useServiceOrderStore();
const clientStore = useClientStore();

const filterStatus = ref('');
const filterPriority = ref('');
const isModalOpen = ref(false);
const dateError = ref('');

const currentOrder = ref({
    id: null,
    client_id: '',
    description: '',
    status: 'Pendente',
    priority: 'Baixa',
    start_date: '',
    end_date: '',
    hours: 0,
    rate: 0,
    total_amount: 0
});

const calculateTotalAmount = () => {
    const hrs = Number(currentOrder.value.hours) || 0;
    const rt = Number(currentOrder.value.rate) || 0;
    currentOrder.value.total_amount = hrs * rt;
};

const formatDateBR = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
};

const formatCurrency = (value) => {
    const val = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const processedOrders = computed(() => {
    const list = serviceOrderStore.serviceOrdersList;
    let filteredList = [];

    // Imperative filtering
    for (let i = 0; i < list.length; i++) {
        const order = list[i];
        let statusMatch = true;
        let priorityMatch = true;

        if (filterStatus.value !== '') {
            if (order.status !== filterStatus.value) {
                statusMatch = false;
            }
        }

        if (filterPriority.value !== '') {
            if (order.priority !== filterPriority.value) {
                priorityMatch = false;
            }
        }

        if (statusMatch === true && priorityMatch === true) {
            filteredList.push(order);
        }
    }
    
    return filteredList;
});

const openModal = (order = null) => {
    dateError.value = '';
    if (order) {
        currentOrder.value = { ...order };
    } else {
        currentOrder.value = { 
            id: null, 
            client_id: '', 
            description: '', 
            status: 'Pendente', 
            priority: 'Baixa',
            start_date: '',
            end_date: '',
            hours: 0,
            rate: 0,
            total_amount: 0 
        };
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const validateServiceOrderInput = () => {
    dateError.value = '';
    if (currentOrder.value.start_date && currentOrder.value.end_date) {
        const start = new Date(currentOrder.value.start_date);
        const end = new Date(currentOrder.value.end_date);
        
        if (end < start) {
            dateError.value = 'A data de término não pode ser anterior à data de início.';
            return false;
        }
    }

    if (currentOrder.value.total_amount < 0) {
        currentOrder.value.total_amount = 0;
    }
    return true;
};

const saveServiceOrder = async () => {
    const isValid = validateServiceOrderInput();
    if (isValid === false) {
        return;
    }
    
    let isSuccess = false;
    if (currentOrder.value.id) {
        isSuccess = await serviceOrderStore.updateServiceOrder(currentOrder.value.id, currentOrder.value);
    } else {
        isSuccess = await serviceOrderStore.createServiceOrder(currentOrder.value);
    }

    if (isSuccess === true) {
        closeModal();
    } else {
        alert('Erro ao salvar Ordem de Serviço.');
    }
};

const confirmDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) {
        const isSuccess = await serviceOrderStore.deleteServiceOrder(id);
        if (!isSuccess) {
            alert('Erro ao excluir Ordem de Serviço.');
        }
    }
};

onMounted(async () => {
    await clientStore.fetchAllClients();
    await serviceOrderStore.fetchAllServiceOrders();
});
</script>
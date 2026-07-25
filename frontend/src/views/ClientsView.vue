<template>
    <div class="space-y-6">
        <div class="sm:flex sm:items-center sm:justify-between">
            <div>
                <h2 class="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                    Clientes
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                    Gerenciamento da base de clientes e contatos
                </p>
            </div>
            <div class="mt-4 sm:mt-0">
                <button @click="openModal()" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
                    Novo Cliente
                </button>
            </div>
        </div>

        <div class="glass-panel shadow-sm rounded-2xl overflow-hidden">
             <div class="p-4 border-b border-slate-200 bg-slate-50/50">
                 <div class="relative max-w-sm">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <SearchIcon class="h-5 w-5 text-slate-400" />
                     </div>
                     <input v-model="searchQuery" type="text" class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Buscar clientes..." />
                 </div>
             </div>
             
             <div class="overflow-x-auto">
                 <table class="min-w-full divide-y divide-slate-200">
                     <thead class="bg-slate-50">
                         <tr>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer select-none" @click="toggleSort('name')">
                                 <div class="flex items-center space-x-1">
                                    <span>Nome</span>
                                    <ChevronUpIcon v-if="sortKey === 'name' && sortOrder === 'asc'" class="w-4 h-4" />
                                    <ChevronDownIcon v-if="sortKey === 'name' && sortOrder === 'desc'" class="w-4 h-4" />
                                 </div>
                             </th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer select-none" @click="toggleSort('company')">
                                <div class="flex items-center space-x-1">
                                    <span>Empresa</span>
                                    <ChevronUpIcon v-if="sortKey === 'company' && sortOrder === 'asc'" class="w-4 h-4" />
                                    <ChevronDownIcon v-if="sortKey === 'company' && sortOrder === 'desc'" class="w-4 h-4" />
                                </div>
                             </th>
                             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer select-none" @click="toggleSort('email')">
                                <div class="flex items-center space-x-1">
                                    <span>Contato</span>
                                    <ChevronUpIcon v-if="sortKey === 'email' && sortOrder === 'asc'" class="w-4 h-4" />
                                    <ChevronDownIcon v-if="sortKey === 'email' && sortOrder === 'desc'" class="w-4 h-4" />
                                </div>
                             </th>
                             <th scope="col" class="relative px-6 py-3"><span class="sr-only">Ações</span></th>
                         </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-slate-200">
                         <tr v-for="client in processedClients" :key="client.id" class="hover:bg-slate-50 transition-colors">
                             <td class="px-6 py-4 whitespace-nowrap">
                                 <div class="text-sm font-medium text-slate-900">{{ client.name }}</div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap">
                                 <div class="text-sm text-slate-500">{{ client.company || '-' }}</div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap">
                                 <div class="text-sm text-slate-900">{{ client.email }}</div>
                                 <div class="text-sm text-slate-500">{{ client.phone }}</div>
                             </td>
                             <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                 <div class="relative inline-block text-left group">
                                     <button type="button" class="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                         Ações
                                         <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                     </button>
                                     <div class="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-slate-100 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-10">
                                         <div class="py-1">
                                             <button @click="openModal(client)" class="group flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                 Editar
                                             </button>
                                         </div>
                                         <div class="py-1">
                                             <button @click="confirmDelete(client.id)" class="group flex w-full items-center px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 hover:text-rose-900">
                                                 Excluir
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             </td>
                         </tr>
                         <tr v-if="processedClients.length === 0">
                              <td colspan="4" class="px-6 py-10 text-center text-sm text-slate-500">Nenhum cliente encontrado.</td>
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

                <div class="inline-block align-bottom glass-panel rounded-2xl text-left overflow-hidden shadow-2xl shadow-indigo-500/10 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form @submit.prevent="saveClient">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 class="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                                        {{ currentClient.id ? 'Editar Cliente' : 'Novo Cliente' }}
                                    </h3>
                                    <div class="mt-4 space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700">Nome <span class="text-rose-500">*</span></label>
                                            <input v-model="currentClient.name" type="text" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700">E-mail <span class="text-rose-500">*</span></label>
                                            <input v-model="currentClient.email" type="email" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700">Telefone <span class="text-rose-500">*</span></label>
                                            <input v-model="currentClient.phone" type="text" required class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-700">Empresa</label>
                                            <input v-model="currentClient.company" type="text" class="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t border-slate-200">
                            <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                                Salvar
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
import { useClientStore } from '../stores/clientStore';
import { Plus as PlusIcon, Search as SearchIcon, ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'lucide-vue-next';

const clientStore = useClientStore();
const searchQuery = ref('');
const isModalOpen = ref(false);
const sortKey = ref('name');
const sortOrder = ref('asc');

const currentClient = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    company: ''
});

const toggleSort = (key) => {
    if (sortKey.value === key) {
        if (sortOrder.value === 'asc') {
            sortOrder.value = 'desc';
        } else {
            sortOrder.value = 'asc';
        }
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

const processedClients = computed(() => {
    const query = searchQuery.value.toLowerCase();
    const clients = clientStore.clientsList;
    let filteredList = [];

    // Imperative filtering
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        if (!query) {
            filteredList.push(client);
        } else {
            const nameMatch = client.name.toLowerCase().includes(query);
            const emailMatch = client.email.toLowerCase().includes(query);
            let companyMatch = false;
            
            if (client.company) {
                 companyMatch = client.company.toLowerCase().includes(query);
            }

            if (nameMatch === true || emailMatch === true || companyMatch === true) {
                filteredList.push(client);
            }
        }
    }

    // Imperative sorting
    filteredList.sort((a, b) => {
        let valueA = a[sortKey.value];
        let valueB = b[sortKey.value];

        if (valueA === null || valueA === undefined) {
             valueA = '';
        }
        if (valueB === null || valueB === undefined) {
             valueB = '';
        }

        const stringA = valueA.toString().toLowerCase();
        const stringB = valueB.toString().toLowerCase();

        if (sortOrder.value === 'asc') {
            if (stringA < stringB) return -1;
            if (stringA > stringB) return 1;
            return 0;
        } else {
            if (stringA > stringB) return -1;
            if (stringA < stringB) return 1;
            return 0;
        }
    });

    return filteredList;
});

const openModal = (client = null) => {
    if (client) {
        currentClient.value = { ...client };
    } else {
        currentClient.value = { id: null, name: '', email: '', phone: '', company: '' };
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const formatUserInputsBeforeSaving = () => {
    // A simple human-like check/format function
    currentClient.value.name = currentClient.value.name.trim();
    currentClient.value.email = currentClient.value.email.trim();
    currentClient.value.phone = currentClient.value.phone.trim();
    if (currentClient.value.company) {
        currentClient.value.company = currentClient.value.company.trim();
    }
};

const saveClient = async () => {
    formatUserInputsBeforeSaving();
    
    let isSuccess = false;
    if (currentClient.value.id) {
        isSuccess = await clientStore.updateClient(currentClient.value.id, currentClient.value);
    } else {
        isSuccess = await clientStore.createClient(currentClient.value);
    }

    if (isSuccess === true) {
        closeModal();
    } else {
        alert('Erro ao salvar cliente.');
    }
};

const confirmDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        const isSuccess = await clientStore.deleteClient(id);
        if (!isSuccess) {
            alert('Erro ao excluir cliente.');
        }
    }
};

onMounted(async () => {
    await clientStore.fetchAllClients();
});
</script>
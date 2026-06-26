import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

const API_URL = 'http://localhost:3000/api';

export const useClientStore = defineStore('client', () => {
    const clients = ref([]);
    const isLoading = ref(false);
    const authStore = useAuthStore();

    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
        };
    }

    async function fetchAllClients() {
        isLoading.value = true;
        try {
            console.log(`[clientStore -> fetchAllClients] Buscando clientes...`);
            const response = await fetch(`${API_URL}/clients`, {
                headers: getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (response.ok && data.success === true) {
                clients.value = data.clients;
                return { success: true };
            } else {
                if (response.status === 401) authStore.logoutUser();
                return { success: false, errorMessage: data.errorMessage || 'Falha ao buscar clientes.' };
            }
        } catch (error) {
            console.error(`[clientStore -> fetchAllClients] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        } finally {
            isLoading.value = false;
        }
    }

    async function createNewClient(clientData) {
        try {
            console.log(`[clientStore -> createNewClient] Criando novo cliente: ${clientData.name}`);
            const response = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(clientData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success === true) {
                clients.value.unshift(data.client); // Add to top
                return { success: true, client: data.client };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Falha ao criar cliente.' };
            }
        } catch (error) {
            console.error(`[clientStore -> createNewClient] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        }
    }
    
    async function removeClient(clientId) {
         try {
            console.log(`[clientStore -> removeClient] Removendo cliente: ${clientId}`);
            const response = await fetch(`${API_URL}/clients/${clientId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (response.ok && data.success === true) {
                clients.value = clients.value.filter(c => c.id !== clientId);
                return { success: true };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Falha ao remover cliente.' };
            }
        } catch (error) {
            console.error(`[clientStore -> removeClient] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        }
    }

    return {
        clients,
        isLoading,
        fetchAllClients,
        createNewClient,
        removeClient
    };
});

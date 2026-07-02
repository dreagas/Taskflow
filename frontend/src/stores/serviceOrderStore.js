import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './authStore';

const API_URL = 'http://localhost:3000/api';

export const useServiceOrderStore = defineStore('serviceOrder', () => {
    const serviceOrders = ref([]);
    const dashboardMetrics = ref(null);
    const isLoading = ref(false);
    const authStore = useAuthStore();

    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
        };
    }

    async function fetchDashboardMetrics() {
        try {
            console.log(`[serviceOrderStore -> fetchDashboardMetrics] Buscando métricas...`);
            const response = await fetch(`${API_URL}/service-orders/metrics`, {
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                dashboardMetrics.value = data.metrics;
                return { success: true };
            } else {
                if (response.status === 401) authStore.logoutUser();
                return { success: false, errorMessage: data.errorMessage || 'Falha ao buscar métricas.' };
            }
        } catch (error) {
            console.error(`[serviceOrderStore -> fetchDashboardMetrics] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        }
    }

    async function fetchAllServiceOrders() {
        isLoading.value = true;
        try {
            console.log(`[serviceOrderStore -> fetchAllServiceOrders] Buscando OS...`);
            const response = await fetch(`${API_URL}/service-orders`, {
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                serviceOrders.value = data.serviceOrders;
                return { success: true };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Falha ao buscar ordens de serviço.' };
            }
        } catch (error) {
            console.error(`[serviceOrderStore -> fetchAllServiceOrders] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        } finally {
            isLoading.value = false;
        }
    }

    async function createNewServiceOrder(orderData) {
        try {
            console.log(`[serviceOrderStore -> createNewServiceOrder] Criando nova OS...`);
            const response = await fetch(`${API_URL}/service-orders`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                await fetchAllServiceOrders();
                fetchDashboardMetrics();
                return { success: true, serviceOrder: data.serviceOrder };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Falha ao criar ordem de serviço.' };
            }
        } catch (error) {
            console.error(`[serviceOrderStore -> createNewServiceOrder] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        }
    }

    async function updateOrderStatus(orderId, newStatus) {
         try {
            console.log(`[serviceOrderStore -> updateOrderStatus] Atualizando OS ${orderId} para ${newStatus}...`);

            // First fetch the current order to keep other fields
            const currentOrder = serviceOrders.value.find(o => o.id === orderId);
            if (!currentOrder) return { success: false, errorMessage: 'OS não encontrada.' };

            const payload = {
                client_name: currentOrder.client_name,
                category: currentOrder.category,
                title: currentOrder.title,
                description: currentOrder.description,
                status: newStatus,
                amount: currentOrder.amount
            };

            const response = await fetch(`${API_URL}/service-orders/${orderId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                await fetchAllServiceOrders();
                fetchDashboardMetrics();
                return { success: true };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Falha ao atualizar status.' };
            }
        } catch (error) {
            console.error(`[serviceOrderStore -> updateOrderStatus] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        }
    }

    async function removeServiceOrder(orderId) {
         try {
            console.log(`[serviceOrderStore -> removeServiceOrder] Removendo OS: ${orderId}`);
            const response = await fetch(`${API_URL}/service-orders/${orderId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                serviceOrders.value = serviceOrders.value.filter(o => o.id !== orderId);
                fetchDashboardMetrics();
                return { success: true };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Falha ao remover OS.' };
            }
        } catch (error) {
            console.error(`[serviceOrderStore -> removeServiceOrder] Erro de rede:`, error);
            return { success: false, errorMessage: 'Erro de conexão com o servidor.' };
        }
    }

    return {
        serviceOrders,
        dashboardMetrics,
        isLoading,
        fetchAllServiceOrders,
        fetchDashboardMetrics,
        createNewServiceOrder,
        updateOrderStatus,
        removeServiceOrder
    };
});

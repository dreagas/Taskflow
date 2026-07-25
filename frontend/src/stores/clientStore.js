import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useClientStore = defineStore('client', {
    state: () => ({
        clientsList: [],
        metrics: {
            totalClients: 0,
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            totalRevenue: 0
        }
    }),
    actions: {
        getAuthHeaders() {
            const authStore = useAuthStore();
            return {
                headers: { Authorization: `Bearer ${authStore.token}` }
            };
        },
        async fetchAllClients() {
            try {
                const response = await axios.get('http://localhost:3000/api/clients', this.getAuthHeaders());
                if (response.data) {
                    this.clientsList = response.data;
                }
            } catch (error) {
                console.log('Error fetching clients list:', error);
            }
        },
        async createClient(clientData) {
            try {
                await axios.post('http://localhost:3000/api/clients', clientData, this.getAuthHeaders());
                await this.fetchAllClients();
                return true;
            } catch (error) {
                console.log('Error creating client:', error);
                return false;
            }
        },
        async updateClient(clientId, clientData) {
            try {
                await axios.put(`http://localhost:3000/api/clients/${clientId}`, clientData, this.getAuthHeaders());
                await this.fetchAllClients();
                return true;
            } catch (error) {
                console.log('Error updating client:', error);
                return false;
            }
        },
        async deleteClient(clientId) {
            try {
                await axios.delete(`http://localhost:3000/api/clients/${clientId}`, this.getAuthHeaders());
                await this.fetchAllClients();
                return true;
            } catch (error) {
                console.log('Error deleting client:', error);
                return false;
            }
        },
        async fetchDashboardMetrics() {
             try {
                const response = await axios.get('http://localhost:3000/api/clients/dashboard-metrics', this.getAuthHeaders());
                if (response.data) {
                    this.metrics = response.data;
                }
            } catch (error) {
                console.log('Error fetching dashboard metrics:', error);
            }
        }
    }
});
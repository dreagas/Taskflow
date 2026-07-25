import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

export const useServiceOrderStore = defineStore('serviceOrder', {
    state: () => ({
        serviceOrdersList: []
    }),
    actions: {
        getAuthHeaders() {
            const authStore = useAuthStore();
            return {
                headers: { Authorization: `Bearer ${authStore.token}` }
            };
        },
        async fetchAllServiceOrders() {
            try {
                const response = await axios.get('http://localhost:3000/api/service-orders', this.getAuthHeaders());
                if (response.data) {
                    this.serviceOrdersList = response.data;
                }
            } catch (error) {
                console.log('Error fetching service orders list:', error);
            }
        },
        async createServiceOrder(orderData) {
            try {
                await axios.post('http://localhost:3000/api/service-orders', orderData, this.getAuthHeaders());
                await this.fetchAllServiceOrders();
                return true;
            } catch (error) {
                console.log('Error creating service order:', error);
                return false;
            }
        },
        async updateServiceOrder(orderId, orderData) {
             try {
                await axios.put(`http://localhost:3000/api/service-orders/${orderId}`, orderData, this.getAuthHeaders());
                await this.fetchAllServiceOrders();
                return true;
            } catch (error) {
                console.log('Error updating service order:', error);
                return false;
            }
        },
        async deleteServiceOrder(orderId) {
             try {
                await axios.delete(`http://localhost:3000/api/service-orders/${orderId}`, this.getAuthHeaders());
                await this.fetchAllServiceOrders();
                return true;
            } catch (error) {
                console.log('Error deleting service order:', error);
                return false;
            }
        }
    }
});
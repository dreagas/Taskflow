<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                Dashboard Geral
            </h2>
            <p class="mt-1 text-sm text-slate-500">
                Visão geral das métricas do TaskFlow
            </p>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
                title="Faturamento Total" 
                :value="formatCurrency(clientStore.metrics.totalRevenue)" 
                icon-name="dollar-sign" 
                color-theme="emerald" 
            />
            <MetricCard 
                title="OS Pendentes" 
                :value="clientStore.metrics.pendingOrders" 
                icon-name="clipboard-list" 
                color-theme="amber" 
            />
            <MetricCard 
                title="OS Concluídas" 
                :value="clientStore.metrics.completedOrders" 
                icon-name="check-circle" 
                color-theme="indigo" 
            />
            <MetricCard 
                title="Total de Clientes" 
                :value="clientStore.metrics.totalClients" 
                icon-name="users" 
                color-theme="slate" 
            />
        </div>

        <!-- Progress Indicator -->
        <div class="glass-panel p-6 rounded-2xl shadow-sm mt-8">
            <h3 class="text-lg font-medium leading-6 text-slate-900 mb-4">Progresso de Resolução de OS</h3>
            
            <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100">
                            Eficiência
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-semibold inline-block text-indigo-600">
                            {{ completionPercentage }}%
                        </span>
                    </div>
                </div>
                <div class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-200 shadow-inner">
                    <div :style="{ width: completionPercentage + '%' }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out"></div>
                </div>
                <p class="text-sm text-slate-500">
                    {{ clientStore.metrics.completedOrders }} de {{ clientStore.metrics.totalOrders }} ordens de serviço foram concluídas.
                </p>
            </div>
        </div>

        <!-- Recent Orders (simplified display) -->
        <div class="glass-panel rounded-2xl shadow-sm overflow-hidden mt-8">
            <div class="px-6 py-5 border-b border-slate-200">
                 <h3 class="text-lg font-medium leading-6 text-slate-900">Últimas Ordens de Serviço</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-slate-200">
                        <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{{ order.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ order.client_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <StatusBadge :status="order.status" type="status" />
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                {{ formatCurrency(order.total_amount) }}
                            </td>
                        </tr>
                        <tr v-if="recentOrders.length === 0">
                             <td colspan="4" class="px-6 py-8 text-center text-sm text-slate-500">Nenhuma ordem de serviço recente encontrada.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useClientStore } from '../stores/clientStore';
import { useServiceOrderStore } from '../stores/serviceOrderStore';
import MetricCard from '../components/MetricCard.vue';
import StatusBadge from '../components/StatusBadge.vue';

const clientStore = useClientStore();
const serviceOrderStore = useServiceOrderStore();

const formatCurrency = (value) => {
    const val = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const completionPercentage = computed(() => {
    const total = clientStore.metrics.totalOrders;
    const completed = clientStore.metrics.completedOrders;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
});

const recentOrders = computed(() => {
    // Return top 5 recent
    return serviceOrderStore.serviceOrdersList.slice(0, 5);
});

onMounted(async () => {
    await clientStore.fetchDashboardMetrics();
    await serviceOrderStore.fetchAllServiceOrders();
});
</script>
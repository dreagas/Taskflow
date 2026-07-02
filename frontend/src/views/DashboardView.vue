<script setup>
import { onMounted, computed } from 'vue';
import { useServiceOrderStore } from '../stores/serviceOrderStore';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';
import MetricCard from '../components/MetricCard.vue';
import StatusBadge from '../components/StatusBadge.vue';

const serviceOrderStore = useServiceOrderStore();

onMounted(async () => {
    await serviceOrderStore.fetchDashboardMetrics();
    await serviceOrderStore.fetchAllServiceOrders();
});

const recentOrders = computed(() => {
    return serviceOrderStore.serviceOrders.slice(0, 5);
});

function formatCurrency(value) {
    if (value === undefined || value === null) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
</script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

    <!-- Background elements for Glassmorphism base -->
    <div class="fixed inset-0 z-0 pointer-events-none">
        <img src="/images/backgrounds/img_homepage.jpg" alt="Background" class="w-full h-full object-cover opacity-10 dark:opacity-20 mix-blend-overlay" @error="$event.target.style.display='none'" />
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-[80px]"></div>
    </div>

    <AppSidebar class="z-10" />

    <div class="flex-1 flex flex-col z-10 w-full overflow-hidden">
        <AppHeader />

        <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            <div class="max-w-7xl mx-auto space-y-8">

                <div>
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Visão Geral</h1>
                    <p class="text-slate-500 dark:text-slate-400 mt-1">Acompanhe as métricas principais do seu negócio.</p>
                </div>

                <!-- Metrics Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total de Clientes"
                        :value="serviceOrderStore.dashboardMetrics?.totalClients || 0"
                        icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        colorClass="from-blue-500 to-indigo-600"
                    />
                    <MetricCard
                        title="Ordens Totais"
                        :value="serviceOrderStore.dashboardMetrics?.totalOrders || 0"
                        icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        colorClass="from-indigo-500 to-purple-600"
                    />
                    <MetricCard
                        title="Pendentes"
                        :value="serviceOrderStore.dashboardMetrics?.pendingOrders || 0"
                        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        colorClass="from-amber-400 to-orange-500"
                    />
                    <MetricCard
                        title="Receita (Concluídas)"
                        :value="formatCurrency(serviceOrderStore.dashboardMetrics?.totalRevenue)"
                        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        colorClass="from-emerald-400 to-teal-500"
                    />
                </div>

                <!-- Recent Orders Table -->
                <div class="glass-card overflow-hidden">
                    <div class="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-slate-800 dark:text-white">Ordens de Serviço Recentes</h2>
                        <router-link to="/service-orders" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Ver todas</router-link>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                                    <th class="p-4 pl-6">ID</th>
                                    <th class="p-4">Cliente</th>
                                    <th class="p-4">Serviço / Categoria</th>
                                    <th class="p-4">Status</th>
                                    <th class="p-4 pr-6 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200/30 dark:divide-slate-700/30">
                                <tr v-if="serviceOrderStore.isLoading" class="animate-pulse">
                                    <td colspan="5" class="p-8 text-center text-slate-400">Carregando dados...</td>
                                </tr>
                                <tr v-else-if="recentOrders.length === 0">
                                    <td colspan="5" class="p-8 text-center text-slate-500 dark:text-slate-400">Nenhuma ordem de serviço encontrada.</td>
                                </tr>
                                <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors duration-200 group">
                                    <td class="p-4 pl-6 font-medium text-slate-900 dark:text-slate-100">#{{ order.id }}</td>
                                    <td class="p-4 text-slate-600 dark:text-slate-300">{{ order.client_name }}</td>
                                    <td class="p-4">
                                        <div class="text-slate-600 dark:text-slate-300 font-medium">{{ order.title }}</div>
                                        <div class="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-0.5">{{ order.category }}</div>
                                    </td>
                                    <td class="p-4"><StatusBadge :status="order.status" /></td>
                                    <td class="p-4 pr-6 text-right font-semibold text-slate-700 dark:text-slate-200">{{ formatCurrency(order.amount) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    </div>
  </div>
</template>

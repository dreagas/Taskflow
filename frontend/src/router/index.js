import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import ClientsView from '../views/ClientsView.vue';
import ServiceOrdersView from '../views/ServiceOrdersView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView,
            meta: { requiresAuth: true }
        },
        {
            path: '/clientes',
            name: 'clients',
            component: ClientsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/ordens-de-servico',
            name: 'serviceOrders',
            component: ServiceOrdersView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Always try to fetch current user on reload if token exists
    if (!authStore.isAuthenticated && authStore.token) {
        await authStore.fetchCurrentUser();
    }

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && authStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
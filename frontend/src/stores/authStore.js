import { defineStore } from 'pinia';
import { ref } from 'vue';

const API_URL = '/api'; // Changed for deployment to use relative path

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('token') || null);
    const isAuthenticated = ref(!!token.value);

    function setAuthenticationState(userData, authToken) {
        user.value = userData;
        token.value = authToken;
        isAuthenticated.value = true;

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    }

    function logoutUser() {
        user.value = null;
        token.value = null;
        isAuthenticated.value = false;

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        if (window.showAppToast) {
            window.showAppToast('Sessão encerrada com sucesso.', 'info');
        }
    }

    async function login(email, password) {
        try {
            console.log(`[authStore -> login] Tentando autenticar usuário: ${email}`);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                setAuthenticationState(data.user, data.token);
                return { success: true };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Erro desconhecido ao fazer login.' };
            }
        } catch (error) {
            console.error(`[authStore -> login] Erro de rede ou servidor:`, error);
            return { success: false, errorMessage: 'Não foi possível conectar ao servidor. Verifique sua conexão.' };
        }
    }

    async function register(name, email, password) {
        try {
            console.log(`[authStore -> register] Registrando novo usuário: ${email}`);

            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok && data.success === true) {
                setAuthenticationState(data.user, data.token);
                return { success: true };
            } else {
                return { success: false, errorMessage: data.errorMessage || 'Erro ao registrar usuário.' };
            }
        } catch (error) {
            console.error(`[authStore -> register] Erro de rede ou servidor:`, error);
            return { success: false, errorMessage: 'Não foi possível conectar ao servidor. Verifique sua conexão.' };
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        register,
        logoutUser
    };
});

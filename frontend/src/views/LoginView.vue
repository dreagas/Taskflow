<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
        <!-- Background decorations -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>

        <div class="max-w-md w-full space-y-8 glass-panel p-10 rounded-2xl shadow-xl shadow-indigo-500/10 z-10 relative">
            <div>
                <h2 class="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    TaskFlow
                </h2>
                <p class="mt-2 text-center text-sm text-slate-500">
                    {{ isRegistering ? 'Crie sua conta para começar' : 'Entre com suas credenciais' }}
                </p>
            </div>
            
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md space-y-4">
                    <div v-if="isRegistering">
                        <label for="name" class="block text-sm font-medium text-slate-700">Nome</label>
                        <input id="name" v-model="form.name" name="name" type="text" required class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-300" placeholder="Seu nome">
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-700">E-mail</label>
                        <input id="email" v-model="form.email" name="email" type="email" required class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-300" placeholder="seu@email.com">
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-700">Senha</label>
                        <input id="password" v-model="form.password" name="password" type="password" required class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors duration-300" placeholder="••••••••">
                    </div>
                </div>

                <div v-if="errorMessage" class="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100 animate-pulse">
                    {{ errorMessage }}
                </div>

                <div>
                    <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                        <span v-if="isLoading" class="mr-2">
                           <Loader2Icon class="animate-spin w-5 h-5" />
                        </span>
                        {{ isRegistering ? 'Cadastrar' : 'Entrar' }}
                    </button>
                </div>
            </form>
            
            <div class="text-center mt-4">
                 <button @click="toggleMode" type="button" class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                     {{ isRegistering ? 'Já tem uma conta? Entre aqui.' : 'Não tem conta? Cadastre-se.' }}
                 </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { Loader2 as Loader2Icon } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const isRegistering = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const form = reactive({
    name: '',
    email: '',
    password: ''
});

const toggleMode = () => {
    isRegistering.value = !isRegistering.value;
    errorMessage.value = '';
    form.name = '';
    form.password = '';
};

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
        let success = false;
        if (isRegistering.value) {
            success = await authStore.registerNewUser(form.name, form.email, form.password);
        } else {
            success = await authStore.loginUser(form.email, form.password);
        }

        if (success === true) {
            router.push('/');
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            const apiError = error.response.data.error;
            if (apiError === 'All fields are required.') {
                errorMessage.value = 'Todos os campos são obrigatórios.';
            } else if (apiError === 'Email already registered.') {
                errorMessage.value = 'E-mail já está cadastrado.';
            } else if (apiError === 'Email and password are required.') {
                errorMessage.value = 'E-mail e senha são obrigatórios.';
            } else if (apiError === 'Invalid email or password.') {
                errorMessage.value = 'E-mail ou senha inválidos.';
            } else {
                 errorMessage.value = 'Ocorreu um erro. Verifique seus dados e tente novamente.';
            }
        } else {
            errorMessage.value = 'Ocorreu um erro inesperado. Tente novamente.';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
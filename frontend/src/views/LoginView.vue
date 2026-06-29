<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const emailInput = ref('');
const passwordInput = ref('');
const isSubmitting = ref(false);

async function handleLoginSubmit() {
    if (!emailInput.value || !passwordInput.value) {
        window.showAppToast('Por favor, preencha todos os campos.', 'error');
        return;
    }

    isSubmitting.value = true;

    const result = await authStore.login(emailInput.value, passwordInput.value);

    isSubmitting.value = false;

    if (result.success === true) {
        window.showAppToast('Login realizado com sucesso!', 'success');
        router.push('/');
    } else {
        window.showAppToast(result.errorMessage, 'error');
    }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">

    <!-- Background Image with fallback styling -->
    <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-purple-900/80 mix-blend-multiply z-10"></div>
        <img src="/images/backgrounds/img_login.jpg" alt="Background" class="w-full h-full object-cover object-center opacity-40"
             @error="$event.target.style.display='none'" />
    </div>

    <!-- Floating Orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse z-0"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000 z-0"></div>

    <div class="w-full max-w-md relative z-10 px-6">
      <div class="glass p-10 rounded-3xl text-center">

        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>

        <h1 class="text-3xl font-bold text-white mb-2">Bem-vindo ao TaskFlow</h1>
        <p class="text-slate-300 text-sm mb-8">Faça login para acessar seu painel.</p>

        <form @submit.prevent="handleLoginSubmit" class="space-y-5 text-left">

          <div>
            <label class="block text-sm font-medium text-slate-200 mb-1.5">E-mail</label>
            <input type="email" v-model="emailInput" class="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-400 bg-white/5 border-white/10" placeholder="admin@taskflow.com" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-200 mb-1.5">Senha</label>
            <input type="password" v-model="passwordInput" class="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-400 bg-white/5 border-white/10" placeholder="••••••••" required />
          </div>

          <div class="pt-2">
              <button type="submit" :disabled="isSubmitting" class="glass-button w-full flex justify-center items-center py-3">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Entrando...' : 'Entrar no Sistema' }}
              </button>
          </div>
        </form>

        <p class="mt-6 text-sm text-slate-400">
          Não tem uma conta?
          <router-link to="/register" class="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Registre-se aqui</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const nameInput = ref('');
const emailInput = ref('');
const passwordInput = ref('');
const isSubmitting = ref(false);

async function handleRegisterSubmit() {
    if (!nameInput.value || !emailInput.value || !passwordInput.value) {
        window.showAppToast('Por favor, preencha todos os campos.', 'error');
        return;
    }

    isSubmitting.value = true;

    const result = await authStore.register(nameInput.value, emailInput.value, passwordInput.value);

    isSubmitting.value = false;

    if (result.success === true) {
        window.showAppToast('Conta criada com sucesso!', 'success');
        router.push('/');
    } else {
        window.showAppToast(result.errorMessage, 'error');
    }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">

    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-purple-900/80 mix-blend-multiply z-10"></div>
        <img src="/images/backgrounds/img_cadastro.jpg" alt="Background" class="w-full h-full object-cover object-center opacity-40"
             @error="$event.target.style.display='none'" />
    </div>

    <div class="w-full max-w-md relative z-10 px-6">
      <div class="glass p-10 rounded-3xl text-center">

        <h1 class="text-3xl font-bold text-white mb-2">Criar Conta</h1>
        <p class="text-slate-300 text-sm mb-8">Junte-se ao TaskFlow OS hoje mesmo.</p>

        <form @submit.prevent="handleRegisterSubmit" class="space-y-4 text-left">

          <div>
            <label class="block text-sm font-medium text-slate-200 mb-1.5">Nome Completo</label>
            <input type="text" v-model="nameInput" class="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-400 bg-white/5 border-white/10" placeholder="Seu Nome" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-200 mb-1.5">E-mail</label>
            <input type="email" v-model="emailInput" class="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-400 bg-white/5 border-white/10" placeholder="seu@email.com" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-200 mb-1.5">Senha</label>
            <input type="password" v-model="passwordInput" class="glass-input w-full px-4 py-3 text-slate-100 placeholder-slate-400 bg-white/5 border-white/10" placeholder="••••••••" required />
          </div>

          <div class="pt-4">
              <button type="submit" :disabled="isSubmitting" class="glass-button w-full flex justify-center items-center py-3">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Registrando...' : 'Registrar-se' }}
              </button>
          </div>
        </form>

        <p class="mt-6 text-sm text-slate-400">
          Já possui conta?
          <router-link to="/login" class="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Voltar ao Login</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

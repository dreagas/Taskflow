<script setup>
import { ref } from 'vue';

const isVisible = ref(false);
const message = ref('');
const type = ref('info'); // 'success', 'error', 'info'

let timeoutId = null;

function showToast(msg, toastType = 'info', duration = 3000) {
    message.value = msg;
    type.value = toastType;
    isVisible.value = true;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        isVisible.value = false;
    }, duration);
}

// Expose method to global window for easy access from anywhere (without needing a store for this simple app)
window.showAppToast = showToast;

</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" class="fixed bottom-4 right-4 z-50 w-full max-w-sm overflow-hidden glass-card shadow-2xl border-t-4"
         :class="{
             'border-t-emerald-500': type === 'success',
             'border-t-rose-500': type === 'error',
             'border-t-indigo-500': type === 'info'
         }">
      <div class="p-4 flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg v-if="type === 'success'" class="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-if="type === 'error'" class="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
           <svg v-if="type === 'info'" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        <div class="w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-slate-800 dark:text-slate-100">{{ message }}</p>
        </div>
        <div class="flex-shrink-0 flex ml-4">
          <button @click="isVisible = false" type="button" class="rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none">
            <span class="sr-only">Fechar</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

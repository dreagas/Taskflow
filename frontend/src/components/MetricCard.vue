<script setup>
const props = defineProps({
    title: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, required: true },
    colorClass: { type: String, default: 'from-indigo-500 to-purple-600' }
});
</script>

<template>
  <div class="glass-card p-6 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10 group">
    <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br transition-transform duration-300 group-hover:scale-110', props.colorClass]">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="props.icon"></path>
      </svg>
    </div>
    
    <div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{{ props.title }}</p>
        <h3 class="text-2xl font-bold text-slate-800 dark:text-white">{{ props.value }}</h3>
    </div>
  </div>
</template>

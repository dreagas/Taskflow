<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true
    }
});

const statusConfig = computed(() => {
    if (props.status === 'pending') {
        return {
            label: 'Pendente',
            colors: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
            dot: 'bg-amber-500'
        };
    } else if (props.status === 'in_progress') {
        return {
            label: 'Em Andamento',
            colors: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50',
            dot: 'bg-indigo-500'
        };
    } else if (props.status === 'completed') {
        return {
            label: 'Concluído',
            colors: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50',
            dot: 'bg-emerald-500'
        };
    } else if (props.status === 'cancelled') {
        return {
            label: 'Cancelado',
            colors: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50',
            dot: 'bg-rose-500'
        };
    } else {
        return {
            label: 'Desconhecido',
            colors: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
            dot: 'bg-slate-500'
        };
    }
});
</script>

<template>
  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm transition-colors', statusConfig.colors]">
    <span class="relative flex h-2 w-2">
      <span v-if="props.status === 'in_progress'" :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', statusConfig.dot]"></span>
      <span :class="['relative inline-flex rounded-full h-2 w-2', statusConfig.dot]"></span>
    </span>
    {{ statusConfig.label }}
  </span>
</template>

<template>
    <span :class="[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm transition-colors duration-300',
        badgeClasses
    ]">
        <span v-if="isActive" class="w-1.5 h-1.5 mr-1.5 rounded-full animate-pulse" :class="indicatorColor"></span>
        {{ text }}
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'status' or 'priority'
        default: 'status'
    }
});

const text = computed(() => props.status);

const isActive = computed(() => {
    return props.status === 'Em Andamento' || props.status === 'Alta';
});

const indicatorColor = computed(() => {
    if (props.type === 'status') {
        if (props.status === 'Em Andamento') return 'bg-amber-500';
    } else {
        if (props.status === 'Alta') return 'bg-rose-500';
    }
    return '';
});

const badgeClasses = computed(() => {
    const statusVal = props.status.toLowerCase();
    
    if (props.type === 'status') {
        if (statusVal === 'concluído' || statusVal === 'concluido') {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        } else if (statusVal === 'em andamento') {
            return 'bg-amber-50 text-amber-700 border-amber-200';
        } else {
            return 'bg-slate-100 text-slate-700 border-slate-200'; // Pendente
        }
    } else {
        if (statusVal === 'alta') {
            return 'bg-rose-50 text-rose-700 border-rose-200';
        } else if (statusVal === 'média' || statusVal === 'media') {
            return 'bg-amber-50 text-amber-700 border-amber-200';
        } else {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Baixa
        }
    }
});
</script>
<template>
    <div class="glass-panel rounded-xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 ease-in-out group">
        <div class="flex items-center">
            <div :class="['p-3 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110 duration-300', iconBgClass]">
                <component :is="icon" :class="['w-6 h-6', iconColorClass]" />
            </div>
            <div class="ml-5 w-0 flex-1">
                <dl>
                    <dt class="text-sm font-medium text-slate-500 truncate">
                        {{ title }}
                    </dt>
                    <dd>
                        <div class="text-2xl font-bold text-slate-900 mt-1">
                            {{ value }}
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { DollarSign, ClipboardList, CheckCircle, Users } from 'lucide-vue-next';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    iconName: {
        type: String,
        required: true
    },
    colorTheme: {
        type: String,
        default: 'indigo'
    }
});

const iconMap = {
    'dollar-sign': DollarSign,
    'clipboard-list': ClipboardList,
    'check-circle': CheckCircle,
    'users': Users
};

const icon = computed(() => iconMap[props.iconName] || Users);

const iconBgClass = computed(() => {
    const map = {
        'indigo': 'bg-indigo-50 border border-indigo-100',
        'amber': 'bg-amber-50 border border-amber-100',
        'emerald': 'bg-emerald-50 border border-emerald-100',
        'slate': 'bg-slate-100 border border-slate-200'
    };
    return map[props.colorTheme] || map['indigo'];
});

const iconColorClass = computed(() => {
     const map = {
        'indigo': 'text-indigo-600',
        'amber': 'text-amber-600',
        'emerald': 'text-emerald-600',
        'slate': 'text-slate-600'
    };
    return map[props.colorTheme] || map['indigo'];
});
</script>
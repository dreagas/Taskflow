<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppSidebar from '../components/AppSidebar.vue';

const display = ref('0');
const previousValue = ref(null);
const operator = ref(null);
const newNumberExpected = ref(false);

function inputDigit(digit) {
    if (newNumberExpected.value) {
        display.value = String(digit);
        newNumberExpected.value = false;
    } else {
        display.value = display.value === '0' ? String(digit) : display.value + digit;
    }
}

function inputDecimal() {
    if (newNumberExpected.value) {
        display.value = '0.';
        newNumberExpected.value = false;
        return;
    }

    if (!display.value.includes('.')) {
        display.value += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);

    if (operator.value && newNumberExpected.value) {
        operator.value = nextOperator;
        return;
    }

    if (previousValue.value === null) {
        previousValue.value = inputValue;
    } else if (operator.value) {
        const currentValue = previousValue.value || 0;
        let result = 0;

        if (operator.value === '+') result = currentValue + inputValue;
        else if (operator.value === '-') result = currentValue - inputValue;
        else if (operator.value === '*') result = currentValue * inputValue;
        else if (operator.value === '/') result = currentValue / inputValue;

        display.value = String(result);
        previousValue.value = result;
    }

    newNumberExpected.value = true;
    operator.value = nextOperator;
}

function calculate() {
    if (operator.value === null || newNumberExpected.value) return;
    handleOperator(operator.value);
    operator.value = null;
    newNumberExpected.value = true;
}

function clear() {
    display.value = '0';
    previousValue.value = null;
    operator.value = null;
    newNumberExpected.value = false;
}
</script>

<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

    <div class="fixed inset-0 z-0 pointer-events-none">
        <div class="absolute top-[20%] left-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
    </div>

    <AppSidebar class="z-10" />

    <div class="flex-1 flex flex-col z-10 w-full overflow-hidden">
        <AppHeader />

        <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 flex flex-col items-center justify-center">
            <div class="w-full max-w-sm">
                <div class="text-center mb-6">
                    <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Calculadora</h1>
                    <p class="text-slate-500 dark:text-slate-400 mt-1">Realize orçamentos rápidos</p>
                </div>

                <div class="glass-card p-6 shadow-2xl border-white/40 dark:border-slate-700/50">
                    <div class="bg-white/50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 shadow-inner text-right min-h-[80px] flex flex-col justify-end overflow-hidden">
                        <div class="text-sm text-slate-500 dark:text-slate-400 h-5">
                            {{ previousValue !== null ? previousValue + ' ' + (operator || '') : '' }}
                        </div>
                        <div class="text-4xl font-bold text-slate-800 dark:text-white truncate tracking-wider">
                            {{ display }}
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-3">
                        <!-- Row 1 -->
                        <button @click="clear" class="col-span-3 py-3 rounded-xl font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors shadow-sm active:scale-95">AC</button>
                        <button @click="handleOperator('/')" :class="['py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-lg', operator === '/' ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20']">÷</button>

                        <!-- Row 2 -->
                        <button @click="inputDigit(7)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">7</button>
                        <button @click="inputDigit(8)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">8</button>
                        <button @click="inputDigit(9)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">9</button>
                        <button @click="handleOperator('*')" :class="['py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-lg', operator === '*' ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20']">×</button>

                        <!-- Row 3 -->
                        <button @click="inputDigit(4)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">4</button>
                        <button @click="inputDigit(5)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">5</button>
                        <button @click="inputDigit(6)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">6</button>
                        <button @click="handleOperator('-')" :class="['py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-lg', operator === '-' ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20']">−</button>

                        <!-- Row 4 -->
                        <button @click="inputDigit(1)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">1</button>
                        <button @click="inputDigit(2)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">2</button>
                        <button @click="inputDigit(3)" class="py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">3</button>
                        <button @click="handleOperator('+')" :class="['py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-lg', operator === '+' ? 'bg-indigo-600 text-white shadow-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20']">+</button>

                        <!-- Row 5 -->
                        <button @click="inputDigit(0)" class="col-span-2 py-3 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">0</button>
                        <button @click="inputDecimal" class="py-3 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm active:scale-95 text-xl">,</button>
                        <button @click="calculate" class="glass-button !rounded-xl !py-3 text-xl">=</button>
                    </div>
                </div>

            </div>
        </main>
    </div>
  </div>
</template>

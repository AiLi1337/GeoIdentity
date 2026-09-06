<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3 backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95"
    >
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
        <Check class="w-4 h-4" />
      </div>
      <div class="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {{ message }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Check } from 'lucide-vue-next';

const visible = ref(false);
const message = ref('');
let timer: any = null;

function show(msg: string, duration = 2000) {
  message.value = msg;
  visible.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    visible.value = false;
  }, duration);
}

defineExpose({ show });
</script>

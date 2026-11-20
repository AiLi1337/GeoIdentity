<template>
  <img
    v-if="flagSrc"
    :src="flagSrc"
    :alt="decorative ? '' : accessibleLabel"
    :aria-hidden="decorative ? 'true' : undefined"
    :width="pixelSize.w"
    :height="pixelSize.h"
    decoding="async"
    draggable="false"
    :class="[
      sizeClasses,
      'inline-block shrink-0 object-contain rounded-[2px] ring-1 ring-slate-900/10 dark:ring-white/15 bg-slate-100 dark:bg-slate-800/40 select-none'
    ]"
  />
  <span
    v-else
    role="img"
    :aria-hidden="decorative ? 'true' : undefined"
    :aria-label="decorative ? undefined : accessibleLabel"
    :title="decorative ? undefined : accessibleLabel"
    :class="[
      sizeClasses,
      'inline-flex shrink-0 items-center justify-center rounded-[2px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ring-1 ring-slate-900/10 dark:ring-white/15'
    ]"
  >
    <Globe class="w-3/4 h-3/4" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Globe } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  code?: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  decorative?: boolean;
}>(), {
  code: '',
  label: '',
  size: 'sm',
  decorative: false
});

const rawModules = import.meta.glob('../assets/flags/*.svg', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const FLAG_ASSETS: Record<string, string> = Object.fromEntries(
  Object.entries(rawModules).flatMap(([filePath, url]) => {
    const match = filePath.match(/\/([a-z]{2})\.svg$/i);
    return match ? [[match[1].toUpperCase(), url]] : [];
  })
);

const DIMENSIONS: Record<'xs' | 'sm' | 'md' | 'lg', { w: number; h: number; cls: string }> = {
  xs: { w: 16, h: 12, cls: 'w-4 h-3' },
  sm: { w: 20, h: 15, cls: 'w-5 h-[15px]' },
  md: { w: 24, h: 18, cls: 'w-6 h-[18px]' },
  lg: { w: 32, h: 24, cls: 'w-8 h-6' }
};

const normalizedCode = computed(() => (props.code || '').trim().toUpperCase());
const flagSrc = computed(() => FLAG_ASSETS[normalizedCode.value] || '');
const pixelSize = computed(() => DIMENSIONS[props.size]);
const sizeClasses = computed(() => DIMENSIONS[props.size].cls);
const accessibleLabel = computed(() => props.label || normalizedCode.value || 'Region');
</script>

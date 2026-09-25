<template>
  <section class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-6 space-y-4">
    <div class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
      <MapPin class="w-4 h-4 shrink-0 mt-0.5 text-primary-600" />
      <span>{{ t('addressMode.sourcedDesc') }}</span>
    </div>
    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <div class="inline-flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button v-for="gender in genders" :key="gender.value" type="button"
            @click="update({ gender: gender.value })"
            class="px-3 py-1.5 text-xs rounded-md"
            :class="filters.gender === gender.value ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'">
            {{ t(gender.label) }}
          </button>
        </div>
        <label class="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          {{ t('filter.age') }}
          <select :value="filters.ageRange" @change="update({ ageRange: ($event.target as HTMLSelectElement).value as FilterOptions['ageRange'] })"
            class="text-base sm:text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2">
            <option v-for="age in ages" :key="age.value" :value="age.value">{{ t(age.label) }}</option>
          </select>
        </label>
        <label class="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
          <input type="checkbox" :checked="filters.isTaxFreeOnly || false"
            @change="update({ isTaxFreeOnly: ($event.target as HTMLInputElement).checked })" />
          {{ t('filter.taxFreeOnly') }}
        </label>
      </div>
      <button type="button" @click="$emit('generate')" :disabled="isGenerating"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60">
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isGenerating }" />
        {{ isGenerating ? t('filter.generating') : t('filter.generateBtn') }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MapPin, RefreshCw } from 'lucide-vue-next';
import type { FilterOptions } from '../types/identity';
import { useI18n } from '../i18n';

const props = defineProps<{ filters: FilterOptions; isGenerating?: boolean }>();
const emit = defineEmits<{
  (e: 'update:filters', filters: FilterOptions): void;
  (e: 'generate'): void;
}>();
const { t } = useI18n();
const genders: { value: FilterOptions['gender']; label: string }[] = [
  { value: 'random', label: 'filter.genderAll' },
  { value: 'male', label: 'filter.genderMale' },
  { value: 'female', label: 'filter.genderFemale' }
];
const ages: { value: FilterOptions['ageRange']; label: string }[] = [
  { value: 'random', label: 'filter.ageAll' },
  { value: '18-25', label: 'filter.ageYouth' },
  { value: '26-35', label: 'filter.ageAdult' },
  { value: '36-50', label: 'filter.ageMiddle' },
  { value: '51-65', label: 'filter.ageSenior' }
];
function update(partial: Partial<FilterOptions>) {
  emit('update:filters', { ...props.filters, ...partial });
  emit('generate');
}
</script>

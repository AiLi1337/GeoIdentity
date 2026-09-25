<template>
  <section class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
      <div>
        <button type="button" @click="$emit('back-to-generator')" class="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 mb-2">
          <ArrowLeft class="w-4 h-4" />{{ t('monitor.backToGenerator') }}
        </button>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ t('monitor.pageTitle') }}</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">{{ t('addressMode.sourcedDesc') }}</p>
      </div>
      <div class="text-xs text-slate-600 dark:text-slate-400">
        <div>{{ t('monitor.lastSync') }}: {{ metadata.lastUpdatedFormattedEn }}</div>
        <div>{{ t('monitor.sourcedCount', { count: OSM_APARTMENTS.length }) }}</div>
      </div>
    </div>
    <p class="text-xs text-slate-600 dark:text-slate-400">
      {{ t('monitor.sourceNotice') }}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" class="underline">© OpenStreetMap contributors (ODbL)</a>
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <label class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        <Search class="w-4 h-4" />
        <input v-model="query" type="search" :placeholder="t('monitor.searchPlaceholder')"
          class="min-w-0 w-56 max-w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-2 py-1.5" />
      </label>
      <span class="text-xs text-slate-500">{{ t('monitor.sourcedCount', { count: filtered.length }) }}</span>
    </div>
    <div class="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
      <table class="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <thead class="bg-slate-100 dark:bg-slate-800">
          <tr><th class="p-3">{{ t('card.street') }}</th><th class="p-3">{{ t('card.cityState') }}</th><th class="p-3">{{ t('card.postcode') }}</th><th class="p-3">{{ t('monitor.colActions') }}</th></tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
          <tr v-for="addr in filtered" :key="addr.sourceId">
            <td class="p-3 font-medium">{{ addr.street }}</td>
            <td class="p-3">{{ addr.city }}, {{ addr.stateFull }}</td>
            <td class="p-3 font-mono">{{ addr.postcode }}</td>
            <td class="p-3"><a :href="`https://www.openstreetmap.org/${addr.sourceId}`" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 underline">OpenStreetMap ↗</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Search } from 'lucide-vue-next';
import { useI18n } from '../../i18n';
import metadata from '../../data/addresses/metadata.json';
import { OSM_APARTMENTS } from '../../data/addresses';
import type { CountryCode } from '../../types/identity';

defineEmits<{
  (e: 'back-to-generator'): void;
  (e: 'jump-to-country', code: CountryCode): void;
}>();
const { t } = useI18n();
const query = ref('');
const filtered = computed(() => {
  const term = query.value.trim().toLowerCase();
  return term ? OSM_APARTMENTS.filter(a => `${a.street} ${a.city} ${a.state} ${a.postcode}`.toLowerCase().includes(term)) : OSM_APARTMENTS;
});
</script>

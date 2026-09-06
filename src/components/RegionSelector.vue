<template>
  <div class="space-y-3">
    <!-- Top Bar: Title & Search & State Filter -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Section Title & Continent Tabs -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <div class="flex items-center gap-1.5 font-bold text-sm text-slate-800 dark:text-slate-100 mr-2">
          <Globe2 class="w-4 h-4 text-primary-500" />
          <span>{{ t('regions.title') }}</span>
        </div>

        <!-- Continent Filter Tabs -->
        <button
          v-for="cat in continentTabs"
          :key="cat.id"
          type="button"
          @click="activeContinent = cat.id"
          :class="[
            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all',
            activeContinent === cat.id
              ? cat.id === 'tax_free'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : cat.id === 'tax_free'
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full md:w-64">
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('regions.searchPlaceholder')"
          class="w-full text-xs pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Country Flag Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2 max-h-72 overflow-y-auto pr-1">
      <button
        v-for="country in filteredCountries"
        :key="country.code"
        type="button"
        @click="selectCountry(country.code)"
        :class="[
          'relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-150 text-center group cursor-pointer',
          selectedCountryCode === country.code
            ? 'bg-primary-50/90 dark:bg-primary-950/50 border-primary-500 dark:border-primary-500 ring-2 ring-primary-500/30 text-primary-950 dark:text-primary-100 shadow-sm font-semibold'
            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        ]"
      >
        <!-- Tax Free Badge -->
        <span
          v-if="country.isTaxFreeZone || (country.code === 'US' && activeContinent === 'tax_free')"
          class="absolute top-1 right-1 px-1 py-0.2 text-[8px] font-bold rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
          :title="locale === 'zh' ? '免税州 / 低税特区' : 'Tax-Free / Low Tax'"
        >
          {{ locale === 'zh' ? '免税' : 'Tax-Free' }}
        </span>

        <span class="text-2xl mb-1 filter drop-shadow-xs group-hover:scale-110 transition-transform">
          {{ country.flag }}
        </span>
        <span class="text-xs truncate w-full">
          {{ locale === 'zh' ? country.nameZh : country.nameEn }}
        </span>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
          {{ country.code }} · {{ country.dialCode }}
        </span>
      </button>
    </div>

    <!-- State/City & Tax-Free Filter Row for Selected Country -->
    <div
      v-if="currentCountry.popularStates.length > 0"
      class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 gap-3"
    >
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
          <span>{{ currentCountry.flag }}</span>
          <span>{{ locale === 'zh' ? currentCountry.nameZh : currentCountry.nameEn }}</span>
          <span class="text-slate-400 font-normal">({{ currentCountry.currency }})</span>
        </span>
        <span class="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
        <div class="flex items-center gap-1.5 w-full sm:w-auto">
          <label class="text-xs text-slate-500 dark:text-slate-400 shrink-0">
            {{ t('regions.customState') }}
          </label>
          <select
            :value="selectedState"
            @change="$emit('update:selectedState', ($event.target as HTMLSelectElement).value)"
            class="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-full sm:w-auto max-w-full"
          >
            <option value="">{{ t('regions.selectState') }}</option>
            <option
              v-for="st in currentCountry.popularStates"
              :key="st.code"
              :value="st.code"
            >
              {{ st.isTaxFree ? (locale === 'zh' ? '⚡️ [免税] ' : '⚡️ [Tax-Free] ') : '' }}{{ locale === 'zh' ? st.nameZh : st.nameEn }} ({{ st.code }})
            </option>
          </select>
        </div>
      </div>

      <!-- Quick Tax-Free States Buttons if US is selected -->
      <div
        v-if="currentCountry.code === 'US'"
        class="flex flex-wrap items-center gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60"
      >
        <span class="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 shrink-0">
          <Zap class="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>{{ locale === 'zh' ? '免税州直达:' : 'Tax-Free States:' }}</span>
        </span>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="tf in usTaxFreeStates"
            :key="tf.code"
            type="button"
            @click="selectTaxFreeState(tf.code)"
            :class="[
              'px-2 py-0.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer',
              selectedState === tf.code
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100'
            ]"
          >
            {{ tf.code }} ({{ locale === 'zh' ? tf.nameZh : tf.nameEn }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Globe2, Search, Zap } from 'lucide-vue-next';
import { COUNTRIES } from '../data/countries';
import type { CountryCode, Continent } from '../types/identity';
import { useI18n } from '../i18n';

const props = defineProps<{
  selectedCountryCode: CountryCode;
  selectedState?: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedCountryCode', code: CountryCode): void;
  (e: 'update:selectedState', state: string): void;
}>();

const { locale, t } = useI18n();

const activeContinent = ref<Continent>('all');
const searchQuery = ref('');

const usTaxFreeStates = [
  { code: 'DE', nameZh: '特拉华', nameEn: 'Delaware' },
  { code: 'OR', nameZh: '俄勒冈', nameEn: 'Oregon' },
  { code: 'NH', nameZh: '新罕布什尔', nameEn: 'New Hampshire' },
  { code: 'MT', nameZh: '蒙大拿', nameEn: 'Montana' },
  { code: 'AK', nameZh: '阿拉斯加', nameEn: 'Alaska' }
];

const continentTabs = computed(() => [
  { id: 'all' as Continent, label: t('continents.all') },
  { id: 'tax_free' as Continent, label: t('continents.tax_free') },
  { id: 'north_america' as Continent, label: t('continents.north_america') },
  { id: 'europe' as Continent, label: t('continents.europe') },
  { id: 'asia_pacific' as Continent, label: t('continents.asia_pacific') },
  { id: 'southeast_asia' as Continent, label: t('continents.southeast_asia') }
]);

const currentCountry = computed(() => {
  return COUNTRIES.find(c => c.code === props.selectedCountryCode) || COUNTRIES[0];
});

const filteredCountries = computed(() => {
  let list = COUNTRIES;

  // Continent filter
  if (activeContinent.value === 'tax_free') {
    list = list.filter(c => c.isTaxFreeZone || c.code === 'US' || c.popularStates.some(s => s.isTaxFree));
  } else if (activeContinent.value !== 'all') {
    list = list.filter(c => c.continent === activeContinent.value);
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      c =>
        c.code.toLowerCase().includes(q) ||
        c.nameZh.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.dialCode.includes(q)
    );
  }

  return list;
});

function selectCountry(code: CountryCode) {
  emit('update:selectedCountryCode', code);
  emit('update:selectedState', '');
}

function selectTaxFreeState(stateCode: string) {
  emit('update:selectedCountryCode', 'US');
  emit('update:selectedState', stateCode);
}
</script>

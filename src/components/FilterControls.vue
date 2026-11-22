<template>
  <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3">
    <!-- Mode Selection Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="p-1.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-xs flex items-center gap-1.5">
          <Compass class="w-3.5 h-3.5" />
          <span>{{ t('addressMode.title') }}</span>
        </span>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ t('addressMode.label') }}
        </span>
      </div>

      <!-- Mode Comparison Toggle -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <a href="/methodology.html" class="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm">{{ t('footer.methodology') }}</a>
        <button
          type="button"
          @click="showModeGuide = !showModeGuide"
          class="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
        >
          <HelpCircle class="w-3.5 h-3.5" />
          <span>{{ t('addressMode.modeComparison') }}</span>
          <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showModeGuide }" />
        </button>
      </div>
    </div>

    <!-- Compact 4 Address Mode Selection Cards (C / A / B / OSM) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
      <button
        v-for="item in modeComparisonItems"
        :key="item.mode"
        type="button"
        :disabled="!availability[item.mode]"
        :aria-disabled="!availability[item.mode]"
        :aria-pressed="currentMode === item.mode && availability[item.mode]"
        @click="availability[item.mode] && updateMode(item.mode)"
        :class="[
          'relative text-left p-2.5 sm:p-3 rounded-2xl border transition-all flex flex-col gap-1.5 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
          !availability[item.mode]
            ? 'opacity-60 cursor-not-allowed bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70'
            : currentMode === item.mode
              ? item.activeCardClass
              : item.idleCardClass
        ]"
      >
        <div class="flex items-start gap-2 min-w-0">
          <div
            :class="[
              'p-1 rounded-lg shrink-0 mt-0.5',
              !availability[item.mode]
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                : currentMode === item.mode
                  ? item.activeIconBg
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            ]"
          >
            <component :is="item.icon" class="w-3.5 h-3.5" />
          </div>
          <span
            class="text-xs font-bold tracking-tight leading-snug break-words min-w-0"
            :class="currentMode === item.mode && availability[item.mode] ? item.activeTitleColor : 'text-slate-800 dark:text-slate-200'"
          >
            {{ item.title }}
          </span>
        </div>

        <p
          class="text-[11px] leading-snug break-words"
          :class="currentMode === item.mode && availability[item.mode] ? item.activeSummaryColor : 'text-slate-500 dark:text-slate-400'"
        >
          {{ item.shortSummary }}
        </p>

        <div class="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-1 pt-0.5 min-w-0">
          <span class="text-[10px] leading-tight text-slate-500 dark:text-slate-400 tabular-nums break-words">
            {{ item.globalCoverage }}
          </span>
          <span
            v-if="currentMode === item.mode && availability[item.mode]"
            class="px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white shadow-xs shrink-0 leading-tight"
            :class="item.badgeBg"
          >
            {{ t('addressMode.active') }}
          </span>
          <span
            v-else-if="!availability[item.mode]"
            class="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 leading-tight break-words"
          >
            {{ t('addressMode.unavailableForFilter') }}
          </span>
        </div>
      </button>
    </div>

    <!-- Collapsible Comparison Guide (All 4 Modes) -->
    <div
      v-if="showModeGuide"
      class="p-3.5 sm:p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2.5 transition-all"
    >
      <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
        <Info class="w-4 h-4 text-primary-500 shrink-0" />
        <span>{{ t('addressMode.guideTitle') }}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        <div
          v-for="item in modeComparisonItems"
          :key="item.mode"
          class="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border space-y-1.5 transition-all"
          :class="currentMode === item.mode && availability[item.mode] ? item.activeBorder : 'border-slate-200/60 dark:border-slate-700/60'"
        >
          <div class="flex items-start justify-between gap-1.5">
            <span class="font-bold flex items-start gap-1 min-w-0 leading-snug break-words" :class="item.titleColor">
              <component :is="item.icon" class="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span class="break-words">{{ item.title }}</span>
            </span>
            <span
              v-if="currentMode === item.mode && availability[item.mode]"
              class="px-1.5 py-0.5 text-[9px] font-bold rounded-full text-white shrink-0 whitespace-nowrap mt-0.5"
              :class="item.badgeBg"
            >
              {{ t('addressMode.active') }}
            </span>
          </div>
          <dl class="space-y-1 text-[11px]">
            <div>
              <dt class="inline font-semibold text-slate-700 dark:text-slate-200">{{ t('addressMode.compLabelSource') }}：</dt>
              <dd class="inline">{{ item.source }}</dd>
            </div>
            <div>
              <dt class="inline font-semibold text-slate-700 dark:text-slate-200">{{ t('addressMode.compLabelInterp') }}：</dt>
              <dd class="inline">{{ item.interpolation }}</dd>
            </div>
            <div>
              <dt class="inline font-semibold text-slate-700 dark:text-slate-200">{{ t('addressMode.compLabelCoverage') }}：</dt>
              <dd class="inline">{{ item.coverage }}</dd>
            </div>
            <div>
              <dt class="inline font-semibold text-slate-700 dark:text-slate-200">{{ t('addressMode.compLabelTarget') }}：</dt>
              <dd class="inline">{{ item.target }}</dd>
            </div>
            <div>
              <dt class="inline font-semibold text-slate-700 dark:text-slate-200">{{ t('addressMode.compLabelNoMatch') }}：</dt>
              <dd class="inline">{{ item.noMatch }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Bottom Secondary Filters & Generate Button Bar -->
    <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
        <!-- Gender Filter -->
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            @click="updateGender('random')"
            :class="[
              'px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer',
              filters.gender === 'random'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ t('filter.genderAll') }}
          </button>
          <button
            type="button"
            @click="updateGender('male')"
            :class="[
              'px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer',
              filters.gender === 'male'
                ? 'bg-blue-500 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ t('filter.genderMale') }}
          </button>
          <button
            type="button"
            @click="updateGender('female')"
            :class="[
              'px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer',
              filters.gender === 'female'
                ? 'bg-rose-500 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ t('filter.genderFemale') }}
          </button>
        </div>

        <!-- Age Range Filter -->
        <div class="flex items-center gap-1.5">
          <label class="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            {{ t('filter.age') }}:
          </label>
          <select
            :value="filters.ageRange"
            @change="updateAge(($event.target as HTMLSelectElement).value as any)"
            class="text-base sm:text-xs font-medium bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
          >
            <option value="random">{{ t('filter.ageAll') }}</option>
            <option value="18-25">{{ t('filter.ageYouth') }}</option>
            <option value="26-35">{{ t('filter.ageAdult') }}</option>
            <option value="36-50">{{ t('filter.ageMiddle') }}</option>
            <option value="51-65">{{ t('filter.ageSenior') }}</option>
          </select>
        </div>

        <!-- Tax-Free Only Toggle -->
        <button
          type="button"
          @click="toggleTaxFreeOnly"
          :class="[
            'px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer',
            filters.isTaxFreeOnly
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-600'
          ]"
        >
          <Zap class="w-3.5 h-3.5" :class="{ 'fill-white': filters.isTaxFreeOnly, 'fill-amber-500 text-amber-500': !filters.isTaxFreeOnly }" />
          <span>{{ t('filter.taxFreeOnly') }}</span>
        </button>
      </div>

      <!-- Generate Trigger Button -->
      <div class="w-full lg:w-auto flex items-center justify-end">
        <button
          type="button"
          @click="hasAnyMode && $emit('generate')"
          :disabled="isGenerating || !hasAnyMode"
          class="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 via-teal-500 to-emerald-500 hover:from-primary-700 hover:to-emerald-600 shadow-md shadow-primary-500/20 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Sparkles class="w-4 h-4" :class="{ 'animate-spin': isGenerating }" />
          <span>{{ isGenerating ? t('filter.generating') : t('filter.generateBtn') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Sparkles,
  MapPin,
  Zap,
  Building2,
  Route,
  Home,
  Compass,
  HelpCircle,
  ChevronDown,
  Info
} from 'lucide-vue-next';
import type { FilterOptions, AddressMode } from '../types/identity';
import { COUNTRIES } from '../data/countries';
import { getAddressCoverageStats } from '../data/addresses';
import { useI18n } from '../i18n';

const props = defineProps<{
  filters: FilterOptions;
  isGenerating?: boolean;
  modeAvailability?: Record<AddressMode, boolean>;
}>();

const emit = defineEmits<{
  (e: 'update:filters', filters: FilterOptions): void;
  (e: 'generate'): void;
}>();

const { locale, t } = useI18n();

const showModeGuide = ref(false);

const currentMode = computed<AddressMode>(() => props.filters.addressMode || 'residential');
const availability = computed<Record<AddressMode, boolean>>(() => props.modeAvailability ?? {
  landmark: true,
  derivation: true,
  residential: true,
  sourced: true
});
const hasAnyMode = computed(() => Object.values(availability.value).some(Boolean));

const poolStats = getAddressCoverageStats();

const sourcedCountriesSummary = computed(() => {
  const counts = poolStats.sourcedCountryCounts;
  const countryLookup = new Map(COUNTRIES.map(c => [c.code, c]));
  return COUNTRIES
    .filter(c => (counts[c.code] || 0) > 0)
    .map(c => {
      const info = countryLookup.get(c.code);
      const label = locale.value === 'zh'
        ? (c.code === 'HK' ? '香港' : c.code === 'TW' ? '台湾' : (info?.nameZh || c.code))
        : c.code;
      return `${label} ${counts[c.code]}`;
    })
    .join(' · ');
});

const modeComparisonItems = computed(() => [
  {
    mode: 'landmark' as AddressMode,
    icon: Building2,
    title: t('addressMode.landmarkShort'),
    shortSummary: t('addressMode.landmarkCompactDesc'),
    globalCoverage: t('addressMode.landmarkGlobalCoverage', {
      countries: poolStats.landmarkCountriesCount,
      total: poolStats.totalCountries,
      count: poolStats.landmarkCount
    }),
    titleColor: 'text-blue-600 dark:text-blue-400',
    activeCardClass: 'cursor-pointer bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/80 shadow-xs ring-1 ring-blue-500/30',
    idleCardClass: 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700',
    activeIconBg: 'bg-blue-500 text-white',
    activeTitleColor: 'text-blue-950 dark:text-blue-100',
    activeSummaryColor: 'text-blue-800/80 dark:text-blue-200/70',
    activeBorder: 'border-blue-500/80 ring-1 ring-blue-500/30',
    badgeBg: 'bg-blue-500',
    source: t('addressMode.landmarkSource'),
    interpolation: t('addressMode.landmarkInterp'),
    coverage: t('addressMode.landmarkCoverage', { countries: poolStats.landmarkCountriesCount, count: poolStats.landmarkCount }),
    target: t('addressMode.landmarkTarget'),
    noMatch: t('addressMode.landmarkNoMatch')
  },
  {
    mode: 'derivation' as AddressMode,
    icon: Route,
    title: t('addressMode.derivationShort'),
    shortSummary: t('addressMode.derivationCompactDesc'),
    globalCoverage: t('addressMode.derivationGlobalCoverage', {
      countries: poolStats.derivationCountriesCount,
      total: poolStats.totalCountries,
      rules: poolStats.derivationRulesCount
    }),
    titleColor: 'text-emerald-600 dark:text-emerald-400',
    activeCardClass: 'cursor-pointer bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30',
    idleCardClass: 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700',
    activeIconBg: 'bg-emerald-500 text-white',
    activeTitleColor: 'text-emerald-950 dark:text-emerald-100',
    activeSummaryColor: 'text-emerald-800/80 dark:text-emerald-200/70',
    activeBorder: 'border-emerald-500/80 ring-1 ring-emerald-500/30',
    badgeBg: 'bg-emerald-500',
    source: t('addressMode.derivationSource'),
    interpolation: t('addressMode.derivationInterp'),
    coverage: t('addressMode.derivationCoverage', {
      countries: poolStats.derivationCountriesCount,
      rules: poolStats.derivationRulesCount,
      capacity: poolStats.derivationCapacity.toLocaleString()
    }),
    target: t('addressMode.derivationTarget'),
    noMatch: t('addressMode.derivationNoMatch')
  },
  {
    mode: 'residential' as AddressMode,
    icon: Home,
    title: t('addressMode.residentialShort'),
    shortSummary: t('addressMode.residentialCompactDesc'),
    globalCoverage: t('addressMode.residentialGlobalCoverage', {
      countries: poolStats.residentialCountriesCount,
      total: poolStats.totalCountries,
      count: poolStats.residentialCount
    }),
    titleColor: 'text-purple-600 dark:text-purple-400',
    activeCardClass: 'cursor-pointer bg-purple-50/70 dark:bg-purple-950/40 border-purple-500/80 shadow-xs ring-1 ring-purple-500/30',
    idleCardClass: 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700',
    activeIconBg: 'bg-purple-500 text-white',
    activeTitleColor: 'text-purple-950 dark:text-purple-100',
    activeSummaryColor: 'text-purple-800/80 dark:text-purple-200/70',
    activeBorder: 'border-purple-500/80 ring-1 ring-purple-500/30',
    badgeBg: 'bg-purple-500',
    source: t('addressMode.residentialSource'),
    interpolation: t('addressMode.residentialInterp'),
    coverage: t('addressMode.residentialCoverage', { countries: poolStats.residentialCountriesCount, count: poolStats.residentialCount }),
    target: t('addressMode.residentialTarget'),
    noMatch: t('addressMode.residentialNoMatch')
  },
  {
    mode: 'sourced' as AddressMode,
    icon: MapPin,
    title: t('addressMode.sourcedShort'),
    shortSummary: t('addressMode.sourcedCompactDesc'),
    globalCoverage: t('addressMode.sourcedGlobalCoverage', {
      countries: poolStats.sourcedCountriesCount,
      total: poolStats.totalCountries,
      count: poolStats.sourcedCount
    }),
    titleColor: 'text-amber-600 dark:text-amber-400',
    activeCardClass: 'cursor-pointer bg-amber-50/70 dark:bg-amber-950/40 border-amber-500/80 shadow-xs ring-1 ring-amber-500/30',
    idleCardClass: 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700',
    activeIconBg: 'bg-amber-500 text-white',
    activeTitleColor: 'text-amber-950 dark:text-amber-100',
    activeSummaryColor: 'text-amber-900/80 dark:text-amber-200/75',
    activeBorder: 'border-amber-500/80 ring-1 ring-amber-500/30',
    badgeBg: 'bg-amber-500',
    source: t('addressMode.sourcedSource'),
    interpolation: t('addressMode.sourcedInterp'),
    coverage: t('addressMode.sourcedCoverage', {
      countries: sourcedCountriesSummary.value,
      regions: poolStats.sourcedRegionCount,
      count: poolStats.sourcedCount
    }),
    target: t('addressMode.sourcedTarget'),
    noMatch: t('addressMode.sourcedNoMatch')
  }
]);

function updateMode(mode: AddressMode) {
  if (!availability.value[mode]) return;
  emit('update:filters', { ...props.filters, addressMode: mode });
  emit('generate');
}

function updateGender(gender: FilterOptions['gender']) {
  emit('update:filters', { ...props.filters, gender });
  emit('generate');
}

function updateAge(ageRange: FilterOptions['ageRange']) {
  emit('update:filters', { ...props.filters, ageRange });
  emit('generate');
}

function toggleTaxFreeOnly() {
  emit('update:filters', { ...props.filters, isTaxFreeOnly: !props.filters.isTaxFreeOnly });
  emit('generate');
}
</script>

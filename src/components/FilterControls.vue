<template>
  <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
    <!-- Mode Selection Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
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
        <a href="/methodology.html" class="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">{{ t('footer.methodology') }}</a>
        <button
          type="button"
          @click="showModeGuide = !showModeGuide"
          class="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto font-medium"
        >
          <HelpCircle class="w-3.5 h-3.5" />
          <span>{{ t('addressMode.modeComparison') }}</span>
          <ChevronDown class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showModeGuide }" />
        </button>
      </div>
    </div>

    <!-- 3 Distinct Address Mode Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      <!-- 1. 高精度真实地标种子库 (Curated Landmark Seeds) -->
      <button
        type="button"
        :disabled="!availability.landmark"
        :aria-disabled="!availability.landmark"
        @click="availability.landmark && updateMode('landmark')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group',
          !availability.landmark
            ? 'opacity-60 cursor-not-allowed bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70'
            : currentMode === 'landmark'
              ? 'cursor-pointer bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/80 shadow-xs ring-1 ring-blue-500/30'
              : 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
        ]"
      >
        <div class="flex items-start justify-between gap-1.5 sm:gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div
              :class="[
                'p-1.5 rounded-lg shrink-0',
                !availability.landmark
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  : currentMode === 'landmark' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <Building2 class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight truncate"
              :class="currentMode === 'landmark' && availability.landmark ? 'text-blue-950 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'"
            >
              <span class="sm:hidden">{{ t('addressMode.landmarkShort') }}</span>
              <span class="hidden sm:inline">{{ t('addressMode.landmark') }}</span>
            </span>
          </div>
          <span
            v-if="currentMode === 'landmark' && availability.landmark"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500 text-white shadow-xs shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.active') }}
          </span>
          <span
            v-else-if="!availability.landmark"
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.unavailableForFilter') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'landmark' && availability.landmark ? 'text-blue-800/80 dark:text-blue-200/70' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ availability.landmark ? t('addressMode.landmarkDesc') : t('addressMode.unavailableForFilter') }}
        </p>
      </button>

      <!-- 2. 方案A：真实街道门牌合法区间衍生 (Street Derivation) -->
      <button
        type="button"
        :disabled="!availability.derivation"
        :aria-disabled="!availability.derivation"
        @click="availability.derivation && updateMode('derivation')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group',
          !availability.derivation
            ? 'opacity-60 cursor-not-allowed bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70'
            : currentMode === 'derivation'
              ? 'cursor-pointer bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30'
              : 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
        ]"
      >
        <div class="flex items-start justify-between gap-1.5 sm:gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div
              :class="[
                'p-1.5 rounded-lg shrink-0',
                !availability.derivation
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  : currentMode === 'derivation' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <Route class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight truncate"
              :class="currentMode === 'derivation' && availability.derivation ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-200'"
            >
              <span class="sm:hidden">{{ t('addressMode.derivationShort') }}</span>
              <span class="hidden sm:inline">{{ t('addressMode.derivation') }}</span>
            </span>
          </div>
          <span
            v-if="currentMode === 'derivation' && availability.derivation"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white shadow-xs shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.active') }}
          </span>
          <span
            v-else-if="!availability.derivation"
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.unavailableForFilter') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'derivation' && availability.derivation ? 'text-emerald-800/80 dark:text-emerald-200/70' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ availability.derivation ? t('addressMode.derivationDesc') : t('addressMode.unavailableForFilter') }}
        </p>
      </button>

      <!-- 3. 方案B：全球真实住宅/居民独栋地址库 (Residential Pool) -->
      <button
        type="button"
        :disabled="!availability.residential"
        :aria-disabled="!availability.residential"
        @click="availability.residential && updateMode('residential')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group',
          !availability.residential
            ? 'opacity-60 cursor-not-allowed bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70'
            : currentMode === 'residential'
              ? 'cursor-pointer bg-purple-50/70 dark:bg-purple-950/40 border-purple-500/80 shadow-xs ring-1 ring-purple-500/30'
              : 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
        ]"
      >
        <div class="flex items-start justify-between gap-1.5 sm:gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div
              :class="[
                'p-1.5 rounded-lg shrink-0',
                !availability.residential
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  : currentMode === 'residential' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <Home class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight truncate"
              :class="currentMode === 'residential' && availability.residential ? 'text-purple-950 dark:text-purple-100' : 'text-slate-800 dark:text-slate-200'"
            >
              <span class="sm:hidden">{{ t('addressMode.residentialShort') }}</span>
              <span class="hidden sm:inline">{{ t('addressMode.residential') }}</span>
            </span>
          </div>
          <span
            v-if="currentMode === 'residential' && availability.residential"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500 text-white shadow-xs shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.active') }}
          </span>
          <span
            v-else-if="!availability.residential"
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.unavailableForFilter') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'residential' && availability.residential ? 'text-purple-800/80 dark:text-purple-200/70' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ availability.residential ? t('addressMode.residentialDesc') : t('addressMode.unavailableForFilter') }}
        </p>
      </button>
      <!-- 4. OSM 住宅建筑门牌 (OSM Sourced Building) -->
      <button
        type="button"
        :disabled="!availability.sourced"
        :aria-disabled="!availability.sourced"
        @click="availability.sourced && updateMode('sourced')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group',
          !availability.sourced
            ? 'opacity-60 cursor-not-allowed bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70'
            : currentMode === 'sourced'
              ? 'cursor-pointer bg-amber-50/70 dark:bg-amber-950/40 border-amber-500/80 shadow-xs ring-1 ring-amber-500/30'
              : 'cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
        ]"
      >
        <div class="flex items-start justify-between gap-1.5 sm:gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <div
              :class="[
                'p-1.5 rounded-lg shrink-0',
                !availability.sourced
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  : currentMode === 'sourced' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <MapPin class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight truncate"
              :class="currentMode === 'sourced' && availability.sourced ? 'text-amber-950 dark:text-amber-100' : 'text-slate-800 dark:text-slate-200'"
            >
              {{ t('addressMode.sourcedShort') }}
            </span>
          </div>
          <span
            v-if="currentMode === 'sourced' && availability.sourced"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white shadow-xs shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.active') }}
          </span>
          <span
            v-else-if="!availability.sourced"
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap mt-0.5"
          >
            {{ t('addressMode.unavailableForFilter') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'sourced' && availability.sourced ? 'text-amber-900/80 dark:text-amber-200/75' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ availability.sourced ? sourcedSummaryDesc : t('addressMode.unavailableForFilter') }}
        </p>
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
          <div class="flex items-center justify-between gap-1.5">
            <span class="font-bold flex items-center gap-1 min-w-0 truncate" :class="item.titleColor">
              <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" />
              <span class="truncate">{{ item.title }}</span>
            </span>
            <span
              v-if="currentMode === item.mode && availability[item.mode]"
              class="px-1.5 py-0.5 text-[9px] font-bold rounded-full text-white shrink-0 whitespace-nowrap"
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

const sourcedSummaryDesc = computed(() => {
  return `${t('addressMode.sourcedDesc')} (${sourcedCountriesSummary.value})`;
});

const modeComparisonItems = computed(() => [
  {
    mode: 'landmark' as AddressMode,
    icon: Building2,
    title: t('addressMode.landmarkShort'),
    titleColor: 'text-blue-600 dark:text-blue-400',
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
    titleColor: 'text-emerald-600 dark:text-emerald-400',
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
    titleColor: 'text-purple-600 dark:text-purple-400',
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
    titleColor: 'text-amber-600 dark:text-amber-400',
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

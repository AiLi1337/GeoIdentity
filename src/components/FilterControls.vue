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

    <!-- 3 Distinct Address Mode Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <!-- 1. 高精度真实地标种子库 (Curated Landmark Seeds) -->
      <button
        type="button"
        @click="updateMode('landmark')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
          currentMode === 'landmark'
            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/80 shadow-xs ring-1 ring-blue-500/30'
            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'p-1.5 rounded-lg',
                currentMode === 'landmark' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <Building2 class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight"
              :class="currentMode === 'landmark' ? 'text-blue-950 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'"
            >
              {{ t('addressMode.landmark') }}
            </span>
          </div>
          <span
            v-if="currentMode === 'landmark'"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500 text-white shadow-xs"
          >
            {{ t('addressMode.active') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'landmark' ? 'text-blue-800/80 dark:text-blue-200/70' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ t('addressMode.landmarkDesc') }}
        </p>
      </button>

      <!-- 2. 方案A：真实街道门牌合法区间衍生 (Street Derivation) -->
      <button
        type="button"
        @click="updateMode('derivation')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
          currentMode === 'derivation'
            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/30'
            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'p-1.5 rounded-lg',
                currentMode === 'derivation' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <Route class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight"
              :class="currentMode === 'derivation' ? 'text-emerald-950 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-200'"
            >
              {{ t('addressMode.derivation') }}
            </span>
          </div>
          <span
            v-if="currentMode === 'derivation'"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white shadow-xs"
          >
            {{ t('addressMode.active') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'derivation' ? 'text-emerald-800/80 dark:text-emerald-200/70' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ t('addressMode.derivationDesc') }}
        </p>
      </button>

      <!-- 3. 方案B：全球真实住宅/居民独栋地址库 (Residential Pool) -->
      <button
        type="button"
        @click="updateMode('residential')"
        :class="[
          'relative text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group',
          currentMode === 'residential'
            ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-500/80 shadow-xs ring-1 ring-purple-500/30'
            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'p-1.5 rounded-lg',
                currentMode === 'residential' ? 'bg-purple-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              ]"
            >
              <Home class="w-4 h-4" />
            </div>
            <span
              class="text-xs font-bold tracking-tight"
              :class="currentMode === 'residential' ? 'text-purple-950 dark:text-purple-100' : 'text-slate-800 dark:text-slate-200'"
            >
              {{ t('addressMode.residential') }}
            </span>
          </div>
          <span
            v-if="currentMode === 'residential'"
            class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500 text-white shadow-xs"
          >
            {{ t('addressMode.active') }}
          </span>
        </div>
        <p
          class="text-[11px] leading-relaxed"
          :class="currentMode === 'residential' ? 'text-purple-800/80 dark:text-purple-200/70' : 'text-slate-500 dark:text-slate-400'"
        >
          {{ t('addressMode.residentialDesc') }}
        </p>
      </button>
    </div>

    <!-- Collapsible Comparison Guide -->
    <div
      v-if="showModeGuide"
      class="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2.5 transition-all"
    >
      <div class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
        <Info class="w-4 h-4 text-primary-500" />
        <span>{{ t('addressMode.guideTitle') }}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        <div class="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span class="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Building2 class="w-3.5 h-3.5" />
            <span>{{ t('addressMode.landmarkShort') }}</span>
          </span>
          <p>{{ t('addressMode.landmarkTarget') }}</p>
        </div>
        <div class="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Route class="w-3.5 h-3.5" />
            <span>{{ t('addressMode.derivationShort') }}</span>
          </span>
          <p>{{ t('addressMode.derivationTarget') }}</p>
        </div>
        <div class="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
          <span class="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Home class="w-3.5 h-3.5" />
            <span>{{ t('addressMode.residentialShort') }}</span>
          </span>
          <p>{{ t('addressMode.residentialTarget') }}</p>
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
            class="text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
          @click="$emit('generate')"
          :disabled="isGenerating"
          class="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 via-teal-500 to-emerald-500 hover:from-primary-700 hover:to-emerald-600 shadow-md shadow-primary-500/20 active:scale-95 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
import { useI18n } from '../i18n';

const props = defineProps<{
  filters: FilterOptions;
  isGenerating?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:filters', filters: FilterOptions): void;
  (e: 'generate'): void;
}>();

const { t } = useI18n();

const showModeGuide = ref(false);

const currentMode = computed<AddressMode>(() => props.filters.addressMode || 'landmark');

function updateMode(mode: AddressMode) {
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

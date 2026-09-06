<template>
  <div class="min-h-screen flex flex-col selection:bg-primary-500 selection:text-white overflow-x-hidden w-full max-w-full">
    <!-- Navbar -->
    <Navbar
      :favorite-count="favoritesList.length"
      :current-view="currentView"
      @toggle-view="currentView = $event"
      @open-batch="isBatchModalOpen = true"
      @open-history="isHistoryDrawerOpen = true"
      @open-disclaimer="openDisclaimer('all')"
    />

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 min-w-0">
      <!-- Address Radar Monitor View -->
      <AddressMonitorDashboard
        v-if="currentView === 'monitor'"
        @back-to-generator="currentView = 'generator'"
        @jump-to-country="handleJumpToCountry"
      />

      <!-- Generator Main View -->
      <div v-show="currentView === 'generator'" class="space-y-6 sm:space-y-8">
        <!-- Generation Mode Switcher (Standard Region vs. IP-Based) -->
        <div class="flex items-center justify-between flex-wrap gap-2.5">
          <div class="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 w-full sm:w-auto">
            <button
              type="button"
              @click="activeGeneratorTab = 'standard'"
              class="flex-1 sm:flex-none justify-center px-2.5 sm:px-3.5 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
              :class="activeGeneratorTab === 'standard' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
              <Compass class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span class="hidden sm:inline">{{ t('ipGen.tabNormal') }}</span>
              <span class="sm:hidden">{{ locale === 'zh' ? '常规地区' : 'Standard' }}</span>
            </button>
            <button
              type="button"
              @click="activeGeneratorTab = 'ip'"
              class="flex-1 sm:flex-none justify-center px-2.5 sm:px-3.5 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
              :class="activeGeneratorTab === 'ip' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
              <Globe class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span class="hidden sm:inline">{{ t('ipGen.tabTitle') }}</span>
              <span class="sm:hidden">{{ locale === 'zh' ? '基于 IP' : 'By IP' }}</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/30 text-indigo-100 font-normal">NEW</span>
            </button>
          </div>

          <div v-if="activeGeneratorTab === 'ip'" class="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
            <span>{{ t('ipGen.tabDesc') }}</span>
          </div>
        </div>

        <!-- Tab 1: Standard Region Select & Filter -->
        <div v-show="activeGeneratorTab === 'standard'" class="space-y-6 sm:space-y-8">
          <RegionSelector
            :selected-country-code="selectedCountryCode"
            :selected-state="selectedState"
            @update:selected-country-code="handleCountryChange"
            @update:selected-state="handleStateChange"
          />

          <FilterControls
            :filters="filters"
            :is-generating="isGenerating"
            @update:filters="filters = $event"
            @generate="handleGenerate"
          />
        </div>

        <!-- Tab 2: IP Address Based Generator -->
        <div v-show="activeGeneratorTab === 'ip'">
          <IpAddressCard @identity-generated="handleIpIdentityGenerated" />
        </div>

        <!-- Current Identity Card Display -->
        <IdentityCard
          v-if="currentIdentity"
          :identity="currentIdentity"
          :is-fav="isCurrentFavorite"
          @copy-field="handleCopyFeedback"
          @toggle-favorite="handleToggleFav"
          @open-disclaimer="openDisclaimer('disclaimer')"
        />
      </div>

      <!-- Comprehensive Legal Disclaimer & Policy Footer -->
      <footer class="pt-8 pb-16 space-y-6 border-t border-slate-200/80 dark:border-slate-800/80">
        <!-- Prominent Legal Callout Card -->
        <div class="p-4 sm:p-7 rounded-3xl bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <ShieldAlert class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span>{{ t('footer.disclaimerBadge') }}</span>
                  <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 whitespace-nowrap bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {{ t('card.complianceSafetyBadge') }}
                  </span>
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ t('footer.disclaimerSubtitle') }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="openDisclaimer('all')"
              class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <Scale class="w-4 h-4" />
              <span>{{ t('footer.viewFullBtn') }}</span>
            </button>
          </div>

          <!-- 4 Pillars of Legal Compliance -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
            <!-- 1. Synthetic Data -->
            <div
              @click="openDisclaimer('disclaimer')"
              class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-all"
            >
              <div>
                <div class="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1.5">
                  <FileText class="w-4 h-4" />
                  <span>{{ t('footer.syntheticTitle') }}</span>
                </div>
                <p class="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ t('footer.syntheticDesc') }}
                </p>
              </div>
            </div>

            <!-- 2. Illegal Use Forbidden -->
            <div
              @click="openDisclaimer('terms')"
              class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between cursor-pointer hover:border-rose-400 transition-all"
            >
              <div>
                <div class="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1.5">
                  <AlertTriangle class="w-4 h-4" />
                  <span>{{ t('footer.illegalTitle') }}</span>
                </div>
                <p class="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ t('footer.illegalDesc') }}
                </p>
              </div>
            </div>

            <!-- 3. Financial Test Cards -->
            <div
              @click="openDisclaimer('finance')"
              class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-all"
            >
              <div>
                <div class="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                  <CreditCard class="w-4 h-4" />
                  <span>{{ t('footer.financeTitle') }}</span>
                </div>
                <p class="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ t('footer.financeDesc') }}
                </p>
              </div>
            </div>

            <!-- 4. Client-side Privacy & Ads -->
            <div
              @click="openDisclaimer('privacy')"
              class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between cursor-pointer hover:border-emerald-400 transition-all"
            >
              <div>
                <div class="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <ShieldCheck class="w-4 h-4" />
                  <span>{{ t('footer.privacyTitle') }}</span>
                </div>
                <p class="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ t('footer.privacyDesc') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footnote & Distinct Legal Anchors -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500 px-1">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{{ t('footer.cloudflareNotice') }}</span>
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 justify-center sm:justify-end">
            <a
              href="#disclaimer"
              @click.prevent="openDisclaimer('disclaimer')"
              class="hover:text-primary-600 dark:hover:text-primary-400 underline underline-offset-4 transition-colors cursor-pointer"
            >
              {{ t('footer.disclaimer') }}
            </a>
            <span>•</span>
            <a
              href="#terms"
              @click.prevent="openDisclaimer('terms')"
              class="hover:text-primary-600 dark:hover:text-primary-400 underline underline-offset-4 transition-colors cursor-pointer"
            >
              {{ t('footer.termsOfService') }}
            </a>
            <span>•</span>
            <a
              href="#privacy"
              @click.prevent="openDisclaimer('privacy')"
              class="hover:text-primary-600 dark:hover:text-primary-400 underline underline-offset-4 transition-colors cursor-pointer font-medium text-slate-600 dark:text-slate-300"
            >
              {{ t('footer.privacyPolicy') }}
            </a>
            <span>•</span>
            <a
              href="https://github.com/AiLi1337/GeoIdentity"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary-600 dark:hover:text-primary-400 underline underline-offset-4 transition-colors cursor-pointer font-medium"
            >
              GitHub 源码
            </a>
            <span>•</span>
            <span>{{ t('footer.copyright') }}</span>
          </div>
        </div>
      </footer>
    </main>

    <!-- Batch Generation Modal -->
    <BatchModal
      :is-open="isBatchModalOpen"
      :country-code="selectedCountryCode"
      :country-name="currentCountryName"
      :filters="filters"
      :selected-state="selectedState"
      @close="isBatchModalOpen = false"
    />

    <!-- History & Favorites Slide Drawer -->
    <HistoryDrawer
      :is-open="isHistoryDrawerOpen"
      :history-list="historyList"
      :favorites-list="favoritesList"
      @close="isHistoryDrawerOpen = false"
      @select-identity="handleSelectIdentity"
      @clear-history="handleClearHistory"
    />

    <!-- Legal Disclaimer Modal -->
    <DisclaimerModal
      :is-open="isDisclaimerModalOpen"
      :initial-tab="disclaimerActiveTab"
      @close="closeDisclaimer"
    />

    <!-- Cookie & Legal Disclaimer Consent Banner -->
    <CookieBanner @open-disclaimer="openDisclaimer('privacy')" />

    <!-- Toast Component -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CountryCode, GeneratedIdentity, FilterOptions, AddressMode } from './types/identity';
import { COUNTRIES } from './data/countries';
import { generateIdentity } from './services/identityGenerator';
import {
  getHistory,
  saveToHistory,
  clearHistory,
  getFavorites,
  toggleFavorite,
  isIdentityFavorite
} from './services/storageService';
import { useI18n } from './i18n';

import Navbar from './components/Navbar.vue';
import RegionSelector from './components/RegionSelector.vue';
import FilterControls from './components/FilterControls.vue';
import IdentityCard from './components/IdentityCard.vue';
import BatchModal from './components/BatchModal.vue';
import HistoryDrawer from './components/HistoryDrawer.vue';
import DisclaimerModal from './components/DisclaimerModal.vue';
import CookieBanner from './components/CookieBanner.vue';
import Toast from './components/Toast.vue';
import IpAddressCard from './components/IpAddressCard.vue';
import AddressMonitorDashboard from './components/AddressMonitor/AddressMonitorDashboard.vue';
import {
  ShieldAlert,
  Scale,
  FileText,
  AlertTriangle,
  CreditCard,
  ShieldCheck,
  Compass,
  Globe
} from 'lucide-vue-next';

const { locale, t } = useI18n();

const currentView = ref<'generator' | 'monitor'>('generator');
const activeGeneratorTab = ref<'standard' | 'ip'>('standard');
const selectedCountryCode = ref<CountryCode>('US');
const selectedState = ref<string>('');

const savedMode = (localStorage.getItem('geo_address_mode') as AddressMode) || 'residential';
const filters = ref<FilterOptions>({
  gender: 'random',
  ageRange: 'random',
  addressMode: savedMode
});

const currentIdentity = ref<GeneratedIdentity | null>(null);
const historyList = ref<GeneratedIdentity[]>([]);
const favoritesList = ref<GeneratedIdentity[]>([]);

const isBatchModalOpen = ref(false);
const isHistoryDrawerOpen = ref(false);
const isDisclaimerModalOpen = ref(false);
const disclaimerActiveTab = ref('all');
const isGenerating = ref(false);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);

const currentCountryName = computed(() => {
  const c = COUNTRIES.find(item => item.code === selectedCountryCode.value);
  return c ? (locale.value === 'zh' ? c.nameZh : c.nameEn) : 'Global';
});

const isCurrentFavorite = computed(() => {
  return currentIdentity.value ? isIdentityFavorite(currentIdentity.value.id) : false;
});

function openDisclaimer(tab = 'all') {
  disclaimerActiveTab.value = tab;
  isDisclaimerModalOpen.value = true;
  if (tab === 'privacy') {
    window.location.hash = 'privacy';
  } else if (tab === 'terms') {
    window.location.hash = 'terms';
  } else if (tab === 'finance') {
    window.location.hash = 'finance';
  } else if (tab === 'disclaimer') {
    window.location.hash = 'disclaimer';
  }
}

function closeDisclaimer() {
  isDisclaimerModalOpen.value = false;
  const h = window.location.hash.toLowerCase();
  if (h === '#privacy' || h === '#terms' || h === '#disclaimer' || h === '#finance') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

function handleHashChange() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#privacy') {
    disclaimerActiveTab.value = 'privacy';
    isDisclaimerModalOpen.value = true;
  } else if (hash === '#terms') {
    disclaimerActiveTab.value = 'terms';
    isDisclaimerModalOpen.value = true;
  } else if (hash === '#finance') {
    disclaimerActiveTab.value = 'finance';
    isDisclaimerModalOpen.value = true;
  } else if (hash === '#disclaimer') {
    disclaimerActiveTab.value = 'disclaimer';
    isDisclaimerModalOpen.value = true;
  }
}

function handleGenerate() {
  isGenerating.value = true;
  if (filters.value.addressMode) {
    try {
      localStorage.setItem('geo_address_mode', filters.value.addressMode);
    } catch (_e) {}
  }
  setTimeout(() => {
    const newId = generateIdentity(selectedCountryCode.value, {
      ...filters.value,
      state: selectedState.value || undefined
    });
    currentIdentity.value = newId;
    saveToHistory(newId);
    historyList.value = getHistory();
    isGenerating.value = false;
  }, 120);
}

function handleCountryChange(code: CountryCode) {
  selectedCountryCode.value = code;
  selectedState.value = '';
  filters.value.state = undefined;
  handleGenerate();
}

function handleStateChange(state: string) {
  selectedState.value = state;
  filters.value.state = state || undefined;
  handleGenerate();
}

function handleIpIdentityGenerated(identity: GeneratedIdentity) {
  currentIdentity.value = identity;
  selectedCountryCode.value = identity.countryCode;
  selectedState.value = identity.address.state;
  saveToHistory(identity);
  historyList.value = getHistory();
  if (toastRef.value) {
    toastRef.value.show(locale.value === 'zh' ? '已成功基于 IP 多数仲裁生成同城真实档案！' : 'Generated same-city identity from IP consensus!');
  }
}

function handleJumpToCountry(code: CountryCode) {
  selectedCountryCode.value = code;
  selectedState.value = '';
  filters.value.state = undefined;
  currentView.value = 'generator';
  handleGenerate();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const countryName = COUNTRIES.find(c => c.code === code)?.nameZh || code;
  if (toastRef.value) {
    toastRef.value.show(t('monitor.jumpSuccess', { name: countryName }));
  }
}

function handleToggleFav(identity: GeneratedIdentity) {
  const isNowFav = toggleFavorite(identity);
  favoritesList.value = getFavorites();
  if (toastRef.value) {
    toastRef.value.show(isNowFav ? t('card.favorite') : t('card.unfavorite'));
  }
}

function handleSelectIdentity(identity: GeneratedIdentity) {
  currentIdentity.value = identity;
  selectedCountryCode.value = identity.countryCode;
  selectedState.value = identity.address.state;
  if (toastRef.value) {
    toastRef.value.show(t('history.apply'));
  }
}

function handleClearHistory() {
  clearHistory();
  historyList.value = [];
  if (toastRef.value) {
    toastRef.value.show(t('history.cleared'));
  }
}

function handleCopyFeedback(_text: string, label: string) {
  if (toastRef.value) {
    toastRef.value.show(label);
  }
}

onMounted(() => {
  historyList.value = getHistory();
  favoritesList.value = getFavorites();

  // URL Hash deep link check
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

  // Load first identity
  if (historyList.value.length > 0) {
    currentIdentity.value = historyList.value[0];
    selectedCountryCode.value = currentIdentity.value.countryCode;
  } else {
    handleGenerate();
  }
});

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});
</script>

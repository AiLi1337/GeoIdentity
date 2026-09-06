<template>
  <div
    v-if="isOpen"
    @click.self="$emit('close')"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Scale class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{{ t('disclaimerModal.title') }}</span>
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {{ t('card.legalVersion') }}
              </span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ t('card.legalSubtitle') }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="t('disclaimerModal.closeLabel')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Quick Navigation Filter Tabs -->
      <div class="px-6 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 overflow-x-auto flex items-center gap-1.5 scrollbar-none text-xs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="[
            'px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer',
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="overflow-y-auto px-6 py-5 space-y-6 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        <!-- Prominent Red Alert Banner -->
        <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div class="space-y-1">
            <div class="font-bold text-rose-800 dark:text-rose-300 text-xs sm:text-sm">
              {{ t('disclaimerModal.criticalNotice') }}
            </div>
            <p class="text-rose-700 dark:text-rose-400 text-xs leading-relaxed">
              {{ t('disclaimerModal.summaryAlert') }}
            </p>
          </div>
        </div>

        <!-- Section 1: Nature of Data -->
        <div v-show="activeTab === 'all' || activeTab === 'disclaimer'" class="space-y-2">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{{ t('disclaimerModal.section1Title') }}</span>
          </h3>
          <div class="space-y-1.5 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
            <p>{{ t('disclaimerModal.section1P1') }}</p>
            <p>{{ t('disclaimerModal.section1P2') }}</p>
          </div>
        </div>

        <!-- Section 2: Prohibited Illegal Use -->
        <div v-show="activeTab === 'all' || activeTab === 'terms'" class="space-y-2">
          <h3 class="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>{{ t('disclaimerModal.section2Title') }}</span>
          </h3>
          <div class="space-y-2 pl-4 border-l-2 border-rose-200 dark:border-rose-900/60">
            <p>{{ t('disclaimerModal.section2P1') }}</p>
            <p class="font-semibold text-slate-800 dark:text-slate-200">{{ t('disclaimerModal.section2P2') }}</p>
            <ul class="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
              <li>{{ t('disclaimerModal.section2Item1') }}</li>
              <li>{{ t('disclaimerModal.section2Item2') }}</li>
              <li>{{ t('disclaimerModal.section2Item3') }}</li>
              <li>{{ t('disclaimerModal.section2Item4') }}</li>
              <li>{{ t('disclaimerModal.section2Item5') }}</li>
            </ul>
            <p class="font-medium text-rose-700 dark:text-rose-400">{{ t('disclaimerModal.section2P3') }}</p>
          </div>
        </div>

        <!-- Section 3: Financial Cards -->
        <div v-show="activeTab === 'all' || activeTab === 'finance'" class="space-y-2">
          <h3 class="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>{{ t('disclaimerModal.section3Title') }}</span>
          </h3>
          <div class="space-y-1.5 pl-4 border-l-2 border-teal-200 dark:border-teal-900/60">
            <p>{{ t('disclaimerModal.section3P1') }}</p>
            <p class="p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-medium">
              {{ t('disclaimerModal.section3P2') }}
            </p>
          </div>
        </div>

        <!-- Section 4: Public Geodata -->
        <div v-show="activeTab === 'all' || activeTab === 'disclaimer'" class="space-y-2">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>{{ t('disclaimerModal.section4Title') }}</span>
          </h3>
          <div class="space-y-1.5 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
            <p>{{ t('disclaimerModal.section4P1') }}</p>
            <p>{{ t('disclaimerModal.section4P2') }}</p>
          </div>
        </div>

        <!-- Section 5: Google AdSense & Cookies Compliance -->
        <div v-show="activeTab === 'all' || activeTab === 'privacy'" class="space-y-2">
          <h3 class="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{{ t('disclaimerModal.section5Title') }}</span>
          </h3>
          <div class="space-y-2.5 pl-4 border-l-2 border-amber-200 dark:border-amber-900/60">
            <p>{{ t('disclaimerModal.section5P1') }}</p>
            <p>{{ t('disclaimerModal.section5P2') }}</p>

            <!-- External Official Compliance Links for AdSense / GDPR / CCPA -->
            <div class="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-2">
              <div class="text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{{ locale === 'zh' ? 'Google 官方数据合规与广告设置指引' : 'Google Official Policy & Opt-Out Links' }}:</span>
              </div>
              <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li class="flex items-center gap-1.5">
                  <ExternalLink class="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:underline font-medium break-all"
                  >
                    {{ t('disclaimerModal.partnerSitesLinkText') }}
                  </a>
                </li>
                <li class="flex items-center gap-1.5">
                  <ExternalLink class="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:underline font-medium break-all"
                  >
                    {{ t('disclaimerModal.optOutGoogleText') }}
                  </a>
                </li>
                <li class="flex items-center gap-1.5">
                  <ExternalLink class="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:underline font-medium break-all"
                  >
                    {{ t('disclaimerModal.optOutAboutAdsText') }}
                  </a>
                </li>
                <li class="flex items-center gap-1.5">
                  <ExternalLink class="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:underline font-medium break-all"
                  >
                    {{ t('disclaimerModal.adsPolicyText') }}
                  </a>
                </li>
              </ul>
            </div>

            <p class="font-medium text-emerald-600 dark:text-emerald-400">{{ t('disclaimerModal.section5P4') }}</p>
          </div>
        </div>

        <!-- Section 6: Limitation of Liability -->
        <div v-show="activeTab === 'all' || activeTab === 'liability'" class="space-y-2">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>{{ t('disclaimerModal.section6Title') }}</span>
          </h3>
          <div class="space-y-1.5 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
            <p>{{ t('disclaimerModal.section6P1') }}</p>
            <p>{{ t('disclaimerModal.section6P2') }}</p>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <ShieldCheck class="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>{{ t('disclaimerModal.sandboxBadge') }}</span>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500 shadow-md transition-all cursor-pointer"
        >
          {{ t('disclaimerModal.closeBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Scale, X, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-vue-next';
import { useI18n } from '../i18n';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    initialTab?: string;
  }>(),
  {
    initialTab: 'all'
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { locale, t } = useI18n();

const activeTab = ref('all');

watch(
  () => props.initialTab,
  (tab) => {
    if (tab) activeTab.value = tab;
  }
);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
      if (props.initialTab) activeTab.value = props.initialTab;
    } else {
      document.body.style.overflow = '';
    }
  }
);

const tabs = computed(() => [
  { id: 'all', label: t('disclaimerModal.tabAll') },
  { id: 'disclaimer', label: t('disclaimerModal.tabDisclaimer') },
  { id: 'terms', label: t('disclaimerModal.tabTerms') },
  { id: 'finance', label: t('disclaimerModal.tabFinance') },
  { id: 'privacy', label: t('disclaimerModal.tabPrivacy') },
  { id: 'liability', label: t('disclaimerModal.tabLiability') }
]);

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', handleKeydown);
});
</script>

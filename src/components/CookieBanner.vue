<template>
  <div
    v-if="isVisible"
    class="fixed bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-6 max-w-5xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-300"
    role="region"
    aria-label="Cookie & Legal Disclaimer Consent Banner"
  >
    <div class="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-200/80 dark:border-slate-700/80 shadow-2xl shadow-slate-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex items-start gap-3.5">
        <div class="w-9 h-9 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20">
          <Cookie class="w-5 h-5" />
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {{ locale === 'zh' ? '合规使用声明与 Cookie 政策' : 'Compliance Notice & Cookie Policy' }}
            </span>
            <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 whitespace-nowrap bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {{ t('card.privacyComplianceBadge') }}
            </span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {{ t('cookieBanner.text') }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 w-full md:w-auto justify-end flex-shrink-0 pt-1 md:pt-0">
        <button
          type="button"
          @click="$emit('open-disclaimer')"
          class="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          {{ t('cookieBanner.learnMore') }}
        </button>

        <button
          type="button"
          @click="acceptConsent"
          class="px-4 py-2 text-xs font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 dark:bg-primary-600 dark:hover:bg-primary-500 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
        >
          <Check class="w-3.5 h-3.5" />
          <span>{{ t('cookieBanner.acceptBtn') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cookie, Check } from 'lucide-vue-next';
import { useI18n } from '../i18n';

defineEmits<{
  (e: 'open-disclaimer'): void;
}>();

const { locale, t } = useI18n();

const isVisible = ref(false);

const STORAGE_KEY = 'geo_cookie_consent';

onMounted(() => {
  const consented = localStorage.getItem(STORAGE_KEY);
  if (consented !== 'true') {
    isVisible.value = true;
  }
});

function acceptConsent() {
  localStorage.setItem(STORAGE_KEY, 'true');
  isVisible.value = false;
}
</script>

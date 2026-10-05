<template>
  <section aria-labelledby="data-method-heading" class="transition-colors">
    <div class="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm backdrop-blur-sm p-5 sm:p-7 md:p-8 space-y-6 transition-colors">
      
      <!-- 1. Header with Icon, Title, Badge & Quick Tier Tags -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="p-2.5 sm:p-3 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 shrink-0">
            <FileCheck2 class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 id="data-method-heading" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {{ t('proofNotice.heading') }}
              </h2>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <ShieldCheck class="w-3.5 h-3.5" />
                <span>{{ t('proofNotice.badge') }}</span>
              </span>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {{ t('proofNotice.subtitle') }}
            </p>
          </div>
        </div>

        <!-- Three Data Categories Quick Pill Badges -->
        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span class="px-2.5 py-1 text-[11px] font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            {{ t('proofNotice.tierOsm') }}
          </span>
          <span class="px-2.5 py-1 text-[11px] font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {{ t('proofNotice.tierBundled') }}
          </span>
          <span class="px-2.5 py-1 text-[11px] font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5 whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {{ t('proofNotice.tierInterpolated') }}
          </span>
        </div>
      </div>

      <!-- 2. Dual Comparison Grid: Can Prove vs Cannot Prove -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        <!-- Left Column: What it CAN Prove (Positive / Scope) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between space-y-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-emerald-200/60 dark:border-emerald-800/40">
              <div class="flex items-center gap-2">
                <div class="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 class="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  {{ t('proofNotice.canProveTitle') }}
                </h3>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                {{ t('proofNotice.canProveTag') }}
              </span>
            </div>

            <!-- List items -->
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Check class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.canProve1Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.canProve1Desc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Check class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.canProve2Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.canProve2Desc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Check class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.canProve3Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.canProve3Desc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 shrink-0">
                  <Check class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.canProve4Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.canProve4Desc') }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Real Example Box -->
          <div class="p-3 sm:p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs space-y-1.5">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                <MapPin class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{{ t('proofNotice.exampleCardTitle') }}</span>
              </div>
              <a
                href="https://www.openstreetmap.org/way/104186213"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 hover:underline"
              >
                <span>OSM Way 104186213</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ t('proofNotice.exampleCardDesc') }}
            </p>
          </div>
        </div>

        <!-- Right Column: What it CANNOT Prove (Warning / Boundaries) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 flex flex-col justify-between space-y-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-amber-800/40">
              <div class="flex items-center gap-2">
                <div class="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <XCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 class="text-sm font-bold text-amber-950 dark:text-amber-200">
                  {{ t('proofNotice.cannotProveTitle') }}
                </h3>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-100/90 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                {{ t('proofNotice.cannotProveTag') }}
              </span>
            </div>

            <!-- List items -->
            <ul class="space-y-3">
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <X class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.cannotProve1Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.cannotProve1Desc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <X class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.cannotProve2Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.cannotProve2Desc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <X class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.cannotProveDeliveryTitle') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.cannotProveDeliveryDesc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <X class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.cannotProve3Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.cannotProve3Desc') }}
                  </p>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span class="mt-0.5 p-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                  <X class="w-3 h-3" />
                </span>
                <div class="space-y-0.5">
                  <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {{ t('proofNotice.cannotProve4Title') }}
                  </div>
                  <p class="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {{ t('proofNotice.cannotProve4Desc') }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Boundary summary warning -->
          <div class="p-3 sm:p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-amber-200/80 dark:border-amber-800/60 shadow-xs flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p class="text-[11px] sm:text-xs leading-relaxed">
              {{ t('proofNotice.boundaryWarning') }}
            </p>
          </div>
        </div>

      </div>

      <!-- 3. Transparent Data Notice Banner -->
      <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div class="flex items-start sm:items-center gap-2.5">
          <Database class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 sm:mt-0" />
          <p class="text-[11px] sm:text-xs leading-relaxed">
            <span class="font-semibold text-slate-800 dark:text-slate-200">{{ t('proofNotice.syncTitle') }}: </span>
            {{ t('proofNotice.syncNotice') }}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0 self-start sm:self-auto px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-semibold">{{ t('proofNotice.staticBadge') }}</span>
        </div>
      </div>

      <!-- 4. Actionable Links / Buttons Footer -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div class="flex flex-wrap items-center gap-2.5">
          <a
            href="/methodology.html"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <BookOpen class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
            <span>{{ t('proofNotice.methodologyBtn') }}</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          </a>

          <a
            href="/privacy.html"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <ShieldCheck class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
            <span>{{ t('proofNotice.privacyBtn') }}</span>
            <ArrowUpRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          </a>
        </div>

        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300 transition-colors self-start sm:self-auto"
        >
          <span>{{ t('proofNotice.osmCopyright') }}</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '../i18n';
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Check,
  XCircle,
  X,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Database,
  BookOpen,
  ArrowUpRight
} from 'lucide-vue-next';

const { t } = useI18n();
</script>

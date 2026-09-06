<template>
  <div class="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
      <div class="flex items-center gap-2">
        <span class="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-1.5">
          <Globe class="w-3.5 h-3.5" />
          <span>{{ t('ipGen.title') }}</span>
        </span>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ t('ipGen.subtitle') }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          {{ t('ipGen.multiSourceBadge') }}
        </span>
      </div>
    </div>

    <!-- IP Input & Action Bar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Network class="w-4 h-4" />
        </div>
        <input
          type="text"
          v-model="ipInput"
          :placeholder="t('ipGen.inputPlaceholder')"
          @keydown.enter="handleSearch"
          class="w-full pl-10 pr-28 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
        />
        <!-- Quick fetch client IP button inside input -->
        <button
          type="button"
          @click="handleFetchClientIp"
          :disabled="isDetectingIp"
          class="absolute inset-y-1 right-1 px-2.5 flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          :title="t('ipGen.detectClientIpTitle')"
        >
          <Loader2 v-if="isDetectingIp" class="w-3.5 h-3.5 animate-spin" />
          <Crosshair v-else class="w-3.5 h-3.5" />
          <span>{{ t('ipGen.detectBtn') }}</span>
        </button>
      </div>

      <button
        type="button"
        @click="handleSearch"
        :disabled="isLoading"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <Sparkles v-else class="w-4 h-4 text-indigo-200" />
        <span>{{ isLoading ? t('ipGen.analyzing') : t('ipGen.analyzeBtn') }}</span>
      </button>
    </div>

    <!-- Consensus & Quorum Result Panel -->
    <div v-if="consensus" class="space-y-3 pt-1">
      <!-- Winner Banner -->
      <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-slate-50/80 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-slate-900/60 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
              {{ t('ipGen.consensusWinner') }}
            </span>
            <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              IP: {{ consensus.targetIp }}
            </span>
            <span v-if="consensus.isp" class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
              ({{ consensus.isp }})
            </span>
          </div>

          <div class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin class="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{{ consensus.winnerCity }}, {{ consensus.winnerRegion }}, {{ consensus.winnerCountry }}</span>
            <span v-if="consensus.winnerPostal" class="text-xs font-mono font-normal text-slate-500 dark:text-slate-400">
              ({{ consensus.winnerPostal }})
            </span>
          </div>

          <!-- Strategy Summary -->
          <div class="flex items-center gap-1.5 text-xs text-indigo-900/80 dark:text-indigo-200/90">
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span class="font-medium">
              {{ locale === 'zh' ? consensus.strategySummaryZh : consensus.strategySummaryEn }}
            </span>
          </div>
        </div>

        <!-- Consensus Stats -->
        <div class="flex items-center gap-3 self-end md:self-auto shrink-0">
          <div class="text-right">
            <div class="text-[10px] text-slate-500 dark:text-slate-400">
              {{ t('ipGen.confidence') }}
            </div>
            <div class="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {{ consensus.confidenceRate }}%
            </div>
            <div class="text-[10px] text-slate-400 dark:text-slate-500">
              {{ consensus.topCityVoteCount }}/{{ consensus.successQueries }} {{ t('ipGen.votesAgree') }}
            </div>
          </div>

          <button
            type="button"
            @click="showDetails = !showDetails"
            class="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
          >
            <span>{{ showDetails ? t('ipGen.hideDetails') : t('ipGen.viewDetails') }}</span>
            <ChevronDown class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': showDetails }" />
          </button>
        </div>
      </div>

      <!-- Collapsible Multi-source Comparison Grid -->
      <div v-if="showDetails" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        <div
          v-for="item in consensus.details"
          :key="item.source"
          class="p-3 rounded-2xl border transition-all"
          :class="[
            item.status === 'success'
              ? (item.city.toLowerCase() === consensus.winnerCity.toLowerCase()
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60 ring-1 ring-emerald-500/20'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80')
              : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 opacity-70'
          ]"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Server class="w-3.5 h-3.5 text-indigo-500" />
              {{ item.sourceName }}
            </span>
            <span
              class="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium"
              :class="item.status === 'success' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'"
            >
              {{ item.status === 'success' ? `${item.latencyMs}ms` : 'Timeout' }}
            </span>
          </div>

          <div v-if="item.status === 'success'" class="space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 dark:text-slate-500 text-[11px]">{{ t('ipGen.colCity') }}:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200 truncate">{{ item.city || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 dark:text-slate-500 text-[11px]">{{ t('ipGen.colRegion') }}:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300 truncate">{{ item.region || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 dark:text-slate-500 text-[11px]">{{ t('ipGen.colCountry') }}:</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">{{ item.countryCode }}</span>
            </div>
            <div v-if="item.postal" class="flex items-center justify-between">
              <span class="text-slate-400 dark:text-slate-500 text-[11px]">{{ t('ipGen.colZip') }}:</span>
              <span class="font-mono text-slate-600 dark:text-slate-400">{{ item.postal }}</span>
            </div>
          </div>
          <div v-else class="text-[11px] text-rose-500 dark:text-rose-400 py-1">
            {{ item.error || 'Request Timeout' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Globe,
  Network,
  Crosshair,
  Sparkles,
  Loader2,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Server
} from 'lucide-vue-next';
import type { IpConsensusResult } from '../types/ip';
import type { GeneratedIdentity } from '../types/identity';
import { detectClientIp, queryMultiSourceIp } from '../services/ipService';
import { resolveAddressFromIp } from '../services/ipAddressResolver';
import { generateIdentityFromAddress } from '../services/identityGenerator';
import { useI18n } from '../i18n';

const emit = defineEmits<{
  (e: 'identity-generated', identity: GeneratedIdentity, consensus: IpConsensusResult): void;
}>();

const { locale, t } = useI18n();

const ipInput = ref('');
const isDetectingIp = ref(false);
const isLoading = ref(false);
const showDetails = ref(false);
const consensus = ref<IpConsensusResult | null>(null);

async function handleFetchClientIp() {
  if (isDetectingIp.value) return;
  isDetectingIp.value = true;
  try {
    const detected = await detectClientIp();
    if (detected) {
      ipInput.value = detected;
    }
  } finally {
    isDetectingIp.value = false;
  }
}

async function handleSearch() {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await queryMultiSourceIp(ipInput.value);
    consensus.value = res;
    if (res.targetIp && !ipInput.value) {
      ipInput.value = res.targetIp;
    }
    
    // Resolve address matching this consensus
    const resolvedAddress = resolveAddressFromIp(res);
    
    // Generate complete identity
    const identity = generateIdentityFromAddress(resolvedAddress);
    
    emit('identity-generated', identity, res);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  // Pre-fill with detected IP quietly
  detectClientIp().then(ip => {
    if (ip && !ipInput.value) {
      ipInput.value = ip;
    }
  });
});
</script>

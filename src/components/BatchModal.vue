<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
  >
    <div
      class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
        <div class="flex items-center gap-2">
          <Layers class="w-5 h-5 text-primary-500" />
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ t('batch.modalTitle') }} - {{ countryName }}
          </h3>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Controls, Count & Mode Selector -->
      <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Count Selector -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
              {{ t('batch.countLabel') }}:
            </span>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                v-for="count in [5, 10, 20, 50]"
                :key="count"
                type="button"
                @click="selectedCount = count"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                  selectedCount === count
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                {{ count }}
              </button>
            </div>
          </div>

          <!-- Mode Picker -->
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-medium text-slate-600 dark:text-slate-300">
              {{ t('batch.modeLabel') }}:
            </span>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                @click="selectedMode = 'landmark'"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1',
                  selectedMode === 'landmark'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span>🏢 {{ t('addressMode.landmarkShort') }}</span>
              </button>
              <button
                type="button"
                @click="selectedMode = 'derivation'"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1',
                  selectedMode === 'derivation'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span>🛣️ {{ t('addressMode.derivationShort') }}</span>
              </button>
              <button
                type="button"
                @click="selectedMode = 'residential'"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1',
                  selectedMode === 'residential'
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                ]"
              >
                <span>🏡 {{ t('addressMode.residentialShort') }}</span>
              </button>
            </div>
          </div>

          <!-- Re-generate Button -->
          <button
            type="button"
            @click="generateBatch"
            class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            <span>{{ t('batch.regenerate') }}</span>
          </button>
        </div>

        <!-- Export Buttons -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleExportCSV"
            :disabled="batchList.length === 0"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download class="w-4 h-4" />
            <span>{{ t('batch.exportCSV') }}</span>
          </button>

          <button
            type="button"
            @click="handleExportJSON"
            :disabled="batchList.length === 0"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Code2 class="w-4 h-4" />
            <span>{{ t('batch.exportJSON') }}</span>
          </button>
        </div>
      </div>

      <!-- Preview Table -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="text-xs text-slate-500 mb-3 flex items-center justify-between">
          <span>{{ t('batch.totalGenerated', { count: batchList.length }) }}</span>
          <span class="text-[11px] text-slate-400">
            {{ t('batch.currentModeLabel') }}:
            <span class="font-semibold text-slate-700 dark:text-slate-300">
              {{ selectedMode === 'residential' ? t('addressMode.residentialShort') : selectedMode === 'derivation' ? t('addressMode.derivationShort') : t('addressMode.landmarkShort') }}
            </span>
          </span>
        </div>
        <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="p-3">{{ t('batch.tableIndex') }}</th>
                  <th class="p-3">{{ t('batch.tableMode') }}</th>
                  <th class="p-3">{{ t('batch.tableName') }}</th>
                  <th class="p-3">{{ t('batch.tableGenderAge') }}</th>
                  <th class="p-3">{{ t('batch.tableLine1') }}</th>
                  <th class="p-3">{{ t('batch.tableLine2') }}</th>
                  <th class="p-3">{{ t('batch.tableCityStateZip') }}</th>
                  <th class="p-3">{{ t('batch.tableTaxRate') }}</th>
                  <th class="p-3">{{ t('batch.tablePhone') }}</th>
                  <th class="p-3">{{ t('batch.tableDocument') }}</th>
                  <th class="p-3">{{ t('batch.tableCard') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr v-for="(item, idx) in batchList" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td class="p-3 font-mono text-slate-400">{{ idx + 1 }}</td>
                  <td class="p-3 whitespace-nowrap">
                    <span
                      class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      :class="[
                        item.address.addressMode === 'residential'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : item.address.addressMode === 'derivation'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      ]"
                    >
                      {{ item.address.addressMode === 'residential' ? (locale === 'zh' ? '方案B·住宅' : 'Scheme B: Res.') : item.address.addressMode === 'derivation' ? (locale === 'zh' ? '方案A·衍生' : 'Scheme A: Deriv.') : (locale === 'zh' ? '地标种子' : 'Landmark') }}
                    </span>
                  </td>
                  <td class="p-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {{ item.basic.localFullName || item.basic.fullName }}
                  </td>
                  <td class="p-3 whitespace-nowrap">
                    {{ item.basic.gender === 'male' ? (locale === 'zh' ? '男' : 'M') : (locale === 'zh' ? '女' : 'F') }} · {{ item.basic.age }}{{ locale === 'zh' ? '岁' : ' yrs' }}
                  </td>
                  <td class="p-3 max-w-[200px] truncate font-medium" :title="item.address.addressLine1 || item.address.street">
                    {{ item.address.addressLine1 || item.address.street }}
                  </td>
                  <td class="p-3 font-mono text-primary-600 dark:text-primary-400 whitespace-nowrap">
                    {{ item.address.addressLine2 || '-' }}
                  </td>
                  <td class="p-3 whitespace-nowrap">
                    {{ item.address.city }}, {{ item.address.state }} {{ item.address.postcode }}
                  </td>
                  <td class="p-3 whitespace-nowrap">
                    <span
                      v-if="item.address.isTaxFree"
                      class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    >
                      {{ locale === 'zh' ? '0.00% (免税)' : '0.00% (Tax-Free)' }}
                    </span>
                    <span v-else class="text-slate-400">
                      {{ getBatchTaxRate(item.address) }}
                    </span>
                  </td>
                  <td class="p-3 font-mono whitespace-nowrap">{{ item.contact.phoneFormatted }}</td>
                  <td class="p-3 font-mono text-purple-600 dark:text-purple-400 whitespace-nowrap">
                    {{ item.document.docNumber }}
                  </td>
                  <td class="p-3 font-mono text-slate-500 whitespace-nowrap">
                    {{ item.finance.cardFormatted.substring(0, 7) }}...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
          {{ t('batch.close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Layers, X, Download, Code2, RefreshCw } from 'lucide-vue-next';
import type { CountryCode, GeneratedIdentity, FilterOptions, AddressMode } from '../types/identity';
import { generateIdentity } from '../services/identityGenerator';
import { exportToCSV, exportToJSON } from '../services/exportService';
import { useI18n } from '../i18n';

const props = defineProps<{
  isOpen: boolean;
  countryCode: CountryCode;
  countryName: string;
  filters: FilterOptions;
  selectedState?: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const { locale, t } = useI18n();

function getBatchTaxRate(addr: any): string {
  if (locale.value === 'zh') {
    if (addr.isTaxFree || (addr.taxRate && addr.taxRate.includes('No Sales Tax'))) {
      return '0.00% (免消费税)';
    }
    if (addr.taxRate && addr.taxRate.includes('Standard Tax')) {
      return '标准消费税率';
    }
    return addr.taxRate || '0.00% (免消费税)';
  } else {
    if (addr.isTaxFree || (addr.taxRate && addr.taxRate.includes('免税'))) {
      return '0.00% (No Sales Tax)';
    }
    return addr.taxRate || '0.00% (No Sales Tax)';
  }
}

const selectedCount = ref(10);
const selectedMode = ref<AddressMode>(props.filters.addressMode || 'residential');
const batchList = ref<GeneratedIdentity[]>([]);

function generateBatch() {
  const result: GeneratedIdentity[] = [];
  const stateToUse = props.selectedState || props.filters.state || undefined;
  for (let i = 0; i < selectedCount.value; i++) {
    result.push(generateIdentity(props.countryCode, {
      ...props.filters,
      state: stateToUse,
      addressMode: selectedMode.value
    }));
  }
  batchList.value = result;
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.filters.addressMode) {
        selectedMode.value = props.filters.addressMode;
      }
      generateBatch();
    }
  }
);

watch([selectedCount, selectedMode], () => {
  if (props.isOpen) {
    generateBatch();
  }
});

function handleExportCSV() {
  exportToCSV(batchList.value, `identities_${props.countryCode}_${selectedMode.value}_${Date.now()}.csv`);
}

function handleExportJSON() {
  exportToJSON(batchList.value, `identities_${props.countryCode}_${selectedMode.value}_${Date.now()}.json`);
}
</script>

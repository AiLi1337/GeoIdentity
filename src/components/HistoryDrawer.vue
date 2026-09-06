<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs transition-opacity"
    ></div>

    <!-- Slide-over Drawer -->
    <div
      :class="[
        'fixed inset-y-0 right-0 z-50 w-full max-w-[88vw] sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col',
        isOpen ? 'translate-x-0 opacity-100 visible pointer-events-auto' : 'translate-x-full opacity-0 invisible pointer-events-none'
      ]"
    >
      <!-- Header -->
      <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
        <div class="flex items-center gap-2">
          <Clock class="w-5 h-5 text-primary-500" />
          <h3 class="font-bold text-slate-900 dark:text-white text-base">
            {{ t('history.drawerTitle') }}
          </h3>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Tabs (Recent vs Favorites) -->
      <div class="px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex gap-4">
          <button
            type="button"
            @click="activeTab = 'history'"
            :class="[
              'pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5',
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            ]"
          >
            <span>{{ t('history.tabHistory') }}</span>
            <span class="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800">
              {{ historyList.length }}
            </span>
          </button>

          <button
            type="button"
            @click="activeTab = 'favorites'"
            :class="[
              'pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5',
              activeTab === 'favorites'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            ]"
          >
            <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{{ t('history.tabFavorites') }}</span>
            <span class="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800">
              {{ favoritesList.length }}
            </span>
          </button>
        </div>

        <button
          v-if="activeTab === 'history' && historyList.length > 0"
          type="button"
          @click="$emit('clear-history')"
          class="text-xs text-rose-500 hover:text-rose-600 mb-3 hover:underline"
        >
          {{ t('history.clearAll') }}
        </button>
      </div>

      <!-- Item List -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <!-- History List -->
        <template v-if="activeTab === 'history'">
          <div
            v-if="historyList.length === 0"
            class="text-center py-16 text-slate-400 dark:text-slate-500 text-xs px-4"
          >
            <FolderOpen class="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>{{ t('history.emptyHistory') }}</p>
          </div>

          <div
            v-for="item in historyList"
            :key="item.id"
            @click="selectItem(item)"
            class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all group flex items-start justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <img
                :src="item.basic.avatar"
                :alt="item.basic.fullName"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 object-cover"
              />
              <div>
                <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{{ item.basic.localFullName || item.basic.fullName }}</span>
                  <span class="text-xs">{{ getFlag(item.countryCode) }}</span>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {{ item.address.street }}, {{ item.address.city }}
                </div>
              </div>
            </div>

            <span class="text-[10px] text-primary-600 dark:text-primary-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {{ t('history.apply') }} →
            </span>
          </div>
        </template>

        <!-- Favorites List -->
        <template v-else>
          <div
            v-if="favoritesList.length === 0"
            class="text-center py-16 text-slate-400 dark:text-slate-500 text-xs px-4"
          >
            <Star class="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
            <p>{{ t('history.emptyFavorites') }}</p>
          </div>

          <div
            v-for="item in favoritesList"
            :key="item.id"
            @click="selectItem(item)"
            class="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20 hover:border-amber-400 cursor-pointer shadow-xs hover:shadow-md transition-all group flex items-start justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <img
                :src="item.basic.avatar"
                :alt="item.basic.fullName"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 object-cover"
              />
              <div>
                <div class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{{ item.basic.localFullName || item.basic.fullName }}</span>
                  <span class="text-xs">{{ getFlag(item.countryCode) }}</span>
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {{ item.address.street }}, {{ item.address.city }}
                </div>
              </div>
            </div>

            <span class="text-[10px] text-amber-600 dark:text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {{ t('history.apply') }} →
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Clock, X, Star, FolderOpen } from 'lucide-vue-next';
import type { CountryCode, GeneratedIdentity } from '../types/identity';
import { COUNTRIES } from '../data/countries';
import { useI18n } from '../i18n';

defineProps<{
  isOpen: boolean;
  historyList: GeneratedIdentity[];
  favoritesList: GeneratedIdentity[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select-identity', item: GeneratedIdentity): void;
  (e: 'clear-history'): void;
}>();

const { t } = useI18n();

const activeTab = ref<'history' | 'favorites'>('history');

function getFlag(code: CountryCode): string {
  const found = COUNTRIES.find(c => c.code === code);
  return found ? found.flag : '🌐';
}

function selectItem(item: GeneratedIdentity) {
  emit('select-identity', item);
  emit('close');
}
</script>

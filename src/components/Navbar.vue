<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Brand Logo & Title -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20 shrink-0">
          <MapPin class="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="font-bold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-primary-800 to-primary-600 dark:from-white dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent truncate">
              {{ t('app.title') }}
            </span>
            <span class="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full shrink-0">
              {{ t('card.realPhysicalBadge') }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 hidden lg:block truncate">
            {{ t('app.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Desktop Action Buttons (sm and larger) -->
      <div class="hidden sm:flex items-center gap-2 lg:gap-3">
        <!-- Address Radar / Monitor Trigger -->
        <button
          type="button"
          @click="$emit('toggle-view', currentView === 'generator' ? 'monitor' : 'generator')"
          class="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
          :class="currentView === 'monitor'
            ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-md shadow-primary-500/25 ring-2 ring-primary-400'
            : 'text-slate-800 dark:text-slate-100 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800'"
          :title="t('monitor.navTitle')"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Globe class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span class="font-bold">{{ currentView === 'monitor' ? t('monitor.backToGenerator') : t('monitor.navTitle') }}</span>
          <span class="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-medium">
            21国·日更
          </span>
        </button>

        <!-- Batch Modal Trigger -->
        <button
          type="button"
          @click="$emit('open-batch')"
          class="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          :title="t('nav.batch')"
        >
          <Layers class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span class="hidden md:inline">{{ t('nav.batch') }}</span>
        </button>

        <!-- History & Favorites Drawer Trigger -->
        <button
          type="button"
          @click="$emit('open-history')"
          class="relative inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          :title="t('nav.history')"
        >
          <Bookmark class="w-4 h-4 text-amber-500" />
          <span class="hidden md:inline">{{ t('nav.history') }}</span>
          <span
            v-if="favoriteCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold"
          >
            {{ favoriteCount }}
          </span>
        </button>

        <!-- Disclaimer Modal Trigger -->
        <button
          type="button"
          @click="$emit('open-disclaimer')"
          class="inline-flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-lg text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 transition-all cursor-pointer"
          :title="t('nav.disclaimer')"
        >
          <ShieldAlert class="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span class="hidden md:inline">{{ t('nav.disclaimer') }}</span>
        </button>

        <!-- Language Switcher -->
        <button
          type="button"
          @click="toggleLang"
          class="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
          :title="locale === 'zh' ? 'Switch to English' : '切换为简体中文'"
        >
          <Languages class="w-4 h-4 text-slate-500" />
          <span class="font-semibold">{{ locale === 'zh' ? 'EN' : '中' }}</span>
        </button>

        <!-- Theme Switcher (Dark / Light) -->
        <button
          type="button"
          @click="toggleTheme"
          class="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          :title="isDark ? t('nav.themeLight') : t('nav.themeDark')"
        >
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-600" />
        </button>

        <!-- GitHub Repository Link -->
        <a
          href="https://github.com/AiLi1337/GeoIdentity"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          :title="locale === 'zh' ? '在 GitHub 查看开源项目与 Star 支持' : 'View on GitHub (Star)'"
        >
          <Github class="w-4 h-4" />
          <span class="hidden xl:inline text-xs font-semibold">GitHub</span>
        </a>
      </div>

      <!-- Mobile Action Buttons (< sm: max 4 compact touch controls, zero horizontal overflow) -->
      <div class="flex sm:hidden items-center gap-1 shrink-0">
        <!-- Address Radar / Generator Toggle (Compact) -->
        <button
          type="button"
          @click="$emit('toggle-view', currentView === 'generator' ? 'monitor' : 'generator')"
          class="relative inline-flex items-center gap-1 px-2 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
          :class="currentView === 'monitor'
            ? 'bg-gradient-to-r from-primary-600 to-teal-600 text-white shadow-xs'
            : 'text-slate-800 dark:text-slate-100 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800'"
        >
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <Globe class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span class="text-[11px]">{{ currentView === 'monitor' ? (locale === 'zh' ? '返回' : 'Back') : (locale === 'zh' ? '监控' : 'Radar') }}</span>
        </button>

        <!-- History & Favorites Trigger (Compact) -->
        <button
          type="button"
          @click="$emit('open-history')"
          class="relative p-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
          :title="t('nav.history')"
        >
          <Bookmark class="w-4 h-4 text-amber-500" />
          <span
            v-if="favoriteCount > 0"
            class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold"
          >
            {{ favoriteCount > 9 ? '9+' : favoriteCount }}
          </span>
        </button>

        <!-- Theme Toggle (Compact) -->
        <button
          type="button"
          @click="toggleTheme"
          class="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-600" />
        </button>

        <!-- Mobile More Menu Trigger -->
        <div class="relative" ref="mobileMenuRef">
          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            :class="{ 'ring-2 ring-primary-500/40 bg-slate-200 dark:bg-slate-700': isMobileMenuOpen }"
            aria-label="More Options"
          >
            <MoreVertical class="w-4 h-4" />
          </button>

          <!-- Mobile Dropdown Menu -->
          <div
            v-if="isMobileMenuOpen"
            class="absolute right-0 top-11 z-50 w-48 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <!-- 1. 批量生成 -->
            <button
              type="button"
              @click="handleMobileAction('batch')"
              class="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Layers class="w-4 h-4 text-primary-500" />
              <span>{{ t('nav.batch') }}</span>
            </button>

            <!-- 2. 语言切换 -->
            <button
              type="button"
              @click="handleMobileAction('lang')"
              class="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Languages class="w-4 h-4 text-indigo-500" />
              <span>{{ locale === 'zh' ? 'English (EN)' : '简体中文 (ZH)' }}</span>
            </button>

            <!-- 3. 免责声明 -->
            <button
              type="button"
              @click="handleMobileAction('disclaimer')"
              class="w-full px-3.5 py-2 text-left text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <ShieldAlert class="w-4 h-4 text-amber-500" />
              <span>{{ t('nav.disclaimer') }}</span>
            </button>

            <div class="my-1 border-t border-slate-100 dark:border-slate-800"></div>

            <!-- 4. GitHub 开源链接 -->
            <a
              href="https://github.com/AiLi1337/GeoIdentity"
              target="_blank"
              rel="noopener noreferrer"
              @click="isMobileMenuOpen = false"
              class="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Github class="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>GitHub 开源主页</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  MapPin,
  Layers,
  Bookmark,
  Languages,
  Sun,
  Moon,
  ShieldAlert,
  Globe,
  Github,
  MoreVertical
} from 'lucide-vue-next';
import { useI18n } from '../i18n';

defineProps<{
  favoriteCount: number;
  currentView?: 'generator' | 'monitor';
}>();

const emit = defineEmits<{
  (e: 'open-batch'): void;
  (e: 'open-history'): void;
  (e: 'open-disclaimer'): void;
  (e: 'toggle-view', view: 'generator' | 'monitor'): void;
}>();

const { locale, setLocale, t } = useI18n();

const isDark = ref(false);
const isMobileMenuOpen = ref(false);
const mobileMenuRef = ref<HTMLElement | null>(null);

function toggleLang() {
  setLocale(locale.value === 'zh' ? 'en' : 'zh');
}

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

function handleMobileAction(action: 'batch' | 'lang' | 'disclaimer') {
  isMobileMenuOpen.value = false;
  if (action === 'batch') {
    emit('open-batch');
  } else if (action === 'lang') {
    toggleLang();
  } else if (action === 'disclaimer') {
    emit('open-disclaimer');
  }
}

function handleClickOutside(event: MouseEvent) {
  if (mobileMenuRef.value && !mobileMenuRef.value.contains(event.target as Node)) {
    isMobileMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

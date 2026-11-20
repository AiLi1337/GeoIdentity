<template>
  <div class="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 overflow-hidden shadow-2xl">
    <!-- Ambient Background Grid & Glow -->
    <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Map Header / Legend -->
    <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-primary-500/20 text-primary-400 border border-primary-500/30">
          <Globe class="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span>{{ t('monitor.mapTitle') }}</span>
            <span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              {{ t('monitor.mapSnapshot') }}
            </span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ t('monitor.mapHint') }}
          </p>
        </div>
      </div>

      <!-- Legend & Selection indicator -->
      <div class="flex items-center flex-wrap gap-2.5 text-xs">
        <div class="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-medium">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{{ t('monitor.mapLegendActive') }}</span>
        </div>

        <button
          v-if="selectedCountryCode"
          @click="$emit('select-country', '')"
          class="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer text-xs"
        >
          <X class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ t('monitor.clearSelection') }}</span>
        </button>
      </div>
    </div>

    <!-- Quick Continent & Country Filter Chips -->
    <div class="relative z-10 py-3 border-b border-slate-800/60 flex flex-col gap-2">
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <!-- All Countries Chip -->
        <button
          @click="$emit('select-country', '')"
          :class="[
            'px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 border',
            !selectedCountryCode
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
          ]"
        >
          <Globe class="w-3.5 h-3.5" aria-hidden="true" />
          <span>{{ isZh ? `全部 ${countryPins.length} 国` : `All ${countryPins.length} Countries` }}</span>
        </button>

        <span class="text-slate-700">|</span>

        <!-- Country Pills -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="pin in countryPins"
            :key="pin.code"
            @click="$emit('select-country', selectedCountryCode === pin.code ? '' : pin.code)"
            @mouseenter="hoveredCode = pin.code"
            @mouseleave="hoveredCode = null"
            :class="[
              'px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 border',
              selectedCountryCode === pin.code
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                : hoveredCode === pin.code
                  ? 'bg-slate-700 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-800'
            ]"
          >
            <span><CountryFlag :code="pin.code" :label="isZh ? pin.nameZh : pin.nameEn" decorative size="xs" /></span>
            <span>{{ isZh ? pin.nameZh : pin.code }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2D High-Precision World Map SVG Canvas -->
    <div
      ref="mapContainerRef"
      class="relative w-full aspect-[2/1] min-h-[320px] sm:min-h-[440px] max-h-[580px] my-2 select-none"
    >
      <svg
        viewBox="0 0 1000 500"
        class="w-full h-full drop-shadow-md overflow-hidden rounded-xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Defs & Filters -->
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#0f1c34" />
            <stop offset="60%" stop-color="#0a1120" />
            <stop offset="100%" stop-color="#070b14" />
          </radialGradient>

          <radialGradient id="pinHaloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#34d399" stop-opacity="0.6" />
            <stop offset="50%" stop-color="#10b981" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#059669" stop-opacity="0" />
          </radialGradient>

          <radialGradient id="selectedHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#34d399" stop-opacity="0.7" />
            <stop offset="60%" stop-color="#10b981" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
          </radialGradient>

          <filter id="countryGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#34d399" flood-opacity="0.6" />
          </filter>

          <filter id="markerGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#10b981" flood-opacity="0.8" />
          </filter>
        </defs>

        <!-- Ocean Background Rect -->
        <rect x="0" y="0" width="1000" height="500" rx="12" fill="url(#oceanGlow)" />

        <!-- 30° Curved Spherical Graticule Grid Lines -->
        <path
          :d="worldGraticulePath"
          fill="none"
          stroke="#1e293b"
          stroke-width="0.75"
          stroke-dasharray="2,4"
          opacity="0.55"
        />

        <!-- High-Precision Natural Earth World Landmass -->
        <path
          :d="worldLandPath"
          fill="#152033"
          stroke="#2a3b55"
          stroke-width="0.8"
          stroke-linejoin="round"
          opacity="0.95"
        />

        <!-- Supported 21 Countries Geographic Territory Overlays -->
        <g>
          <template v-for="pin in countryPins" :key="pin.code">
            <path
              v-if="countryVectorPaths[pin.code]"
              :d="countryVectorPaths[pin.code]"
              :fill="(selectedCountryCode === pin.code || hoveredCode === pin.code) ? '#10b981' : '#059669'"
              :fill-opacity="selectedCountryCode === pin.code ? 0.45 : (hoveredCode === pin.code ? 0.35 : 0.15)"
              :stroke="(selectedCountryCode === pin.code || hoveredCode === pin.code) ? '#34d399' : '#10b981'"
              :stroke-width="selectedCountryCode === pin.code ? 1.6 : (hoveredCode === pin.code ? 1.3 : 0.75)"
              :filter="(selectedCountryCode === pin.code || hoveredCode === pin.code) ? 'url(#countryGlow)' : undefined"
              class="transition-colors duration-150 cursor-pointer"
              @mouseenter="handlePinHover(pin)"
              @mouseleave="handlePinLeave"
              @click="$emit('select-country', selectedCountryCode === pin.code ? '' : pin.code)"
            />
          </template>
        </g>

        <!-- Intercontinental Network Topology Arcs -->
        <g stroke="#06b6d4" stroke-width="0.7" stroke-dasharray="3,5" opacity="0.3" fill="none">
          <path d="M 257,160 Q 375,100 495,115" /> <!-- New York to London -->
          <path d="M 495,115 Q 630,170 777,279" /> <!-- London to Singapore -->
          <path d="M 777,279 Q 815,240 846,171" /> <!-- Singapore to Tokyo -->
          <path d="M 846,171 Q 870,270 846,361" /> <!-- Tokyo to Sydney -->
          <path d="M 257,160 Q 550,5 846,171" />   <!-- US to Japan transpacific -->
        </g>

        <!-- Interactive Precision Pins for all 21 Countries -->
        <g v-for="pin in countryPins" :key="pin.code">
          <!-- Static Ambient Halo -->
          <circle
            :cx="pin.x"
            :cy="pin.y"
            :r="selectedCountryCode === pin.code ? 14 : (hoveredCode === pin.code ? 11 : 7)"
            :fill="selectedCountryCode === pin.code ? 'url(#selectedHalo)' : 'url(#pinHaloGlow)'"
            class="pointer-events-none transition-all duration-150"
          />

          <!-- Selected Focus Dashed Orbit Ring -->
          <circle
            v-if="selectedCountryCode === pin.code"
            :cx="pin.x"
            :cy="pin.y"
            r="11"
            fill="none"
            stroke="#34d399"
            stroke-width="1.5"
            stroke-dasharray="3,2"
            class="pointer-events-none"
          />

          <!-- Core Dot -->
          <circle
            :cx="pin.x"
            :cy="pin.y"
            :r="selectedCountryCode === pin.code ? 5.5 : (hoveredCode === pin.code ? 5 : 3.8)"
            :fill="selectedCountryCode === pin.code ? '#a7f3d0' : (hoveredCode === pin.code ? '#34d399' : '#10b981')"
            :stroke="selectedCountryCode === pin.code ? '#047857' : '#064e3b'"
            stroke-width="1.2"
            filter="url(#markerGlow)"
            class="pointer-events-none transition-all duration-150"
          />

          <!-- Country Code Tag Pill (always visible on major hubs or when active/hovered) -->
          <g
            v-if="isProminentPin(pin.code) || hoveredCode === pin.code || selectedCountryCode === pin.code"
            class="pointer-events-none transition-opacity duration-150"
          >
            <rect
              :x="pin.x - 12"
              :y="pin.y - 17"
              width="24"
              height="11"
              rx="3"
              :fill="selectedCountryCode === pin.code ? '#059669' : (hoveredCode === pin.code ? '#0f172a' : '#0a101d')"
              :stroke="selectedCountryCode === pin.code ? '#6ee7b7' : (hoveredCode === pin.code ? '#34d399' : '#334155')"
              stroke-width="0.8"
              opacity="0.95"
            />
            <text
              :x="pin.x"
              :y="pin.y - 9"
              text-anchor="middle"
              :fill="selectedCountryCode === pin.code ? '#ffffff' : (hoveredCode === pin.code ? '#34d399' : '#cbd5e1')"
              font-size="7"
              font-weight="bold"
              font-family="ui-monospace, monospace"
            >
              {{ pin.code }}
            </text>
          </g>

          <!-- Completely Independent, Static Transparent Hitbox Circle (No jitter, 100% reliable clicks) -->
          <circle
            :cx="pin.x"
            :cy="pin.y"
            r="14"
            fill="transparent"
            class="cursor-pointer"
            @mouseenter="handlePinHover(pin)"
            @mouseleave="handlePinLeave"
            @click="$emit('select-country', selectedCountryCode === pin.code ? '' : pin.code)"
          />
        </g>
      </svg>

      <!-- Floating Hover Tooltip Card (Safe offset, pointer-events-none) -->
      <div
        v-if="activeTooltipPin"
        class="absolute z-30 pointer-events-none transition-all duration-150 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-xl shadow-2xl p-3 text-xs w-64 -translate-x-1/2 -translate-y-full"
        :style="{
          left: `${tooltipPos.x}px`,
          top: `${tooltipPos.y}px`
        }"
      >
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <CountryFlag :code="activeTooltipPin.code" :label="isZh ? activeTooltipPin.nameZh : activeTooltipPin.nameEn" decorative size="md" />
            <div>
              <div class="font-bold text-slate-100 flex items-center gap-1.5">
                <span>{{ isZh ? activeTooltipPin.nameZh : activeTooltipPin.nameEn }}</span>
                <span class="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">{{ activeTooltipPin.code }}</span>
              </div>
              <div class="text-[10px] text-slate-400 font-mono">
                {{ t(`continents.${activeTooltipPin.continent}`) }} · {{ isZh ? (activeTooltipPin.isTaxFree ? '免税特区' : '标准税区') : (activeTooltipPin.isTaxFree ? 'Tax-Free' : 'Standard') }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-1.5 text-[11px]">
          <div class="flex justify-between items-center text-slate-300">
            <span class="flex items-center gap-1">🏢 {{ t('monitor.buildingAddresses') }}:</span>
            <span class="font-bold text-amber-400">{{ activeTooltipPin.landmarkCount }} 处</span>
          </div>
          <div class="flex justify-between items-center text-slate-300">
            <span class="flex items-center gap-1">🏡 方案B居民住宅:</span>
            <span class="font-bold text-emerald-400">{{ activeTooltipPin.schemeBCount }} 处</span>
          </div>
          <div class="flex justify-between items-center text-slate-300">
            <span class="flex items-center gap-1">🛣️ 方案A街道衍生:</span>
            <span class="font-mono text-cyan-400 font-bold">{{ activeTooltipPin.schemeACapacity.toLocaleString() }} 门牌</span>
          </div>
          <div class="pt-1.5 mt-1 border-t border-slate-800 flex justify-between items-center font-bold text-white">
            <span>内置样本点位:</span>
            <span class="text-emerald-300">{{ activeTooltipPin.landmarkCount + activeTooltipPin.schemeBCount }} 处</span>
          </div>
        </div>

        <div class="mt-2 text-[10px] text-center text-primary-400 bg-primary-950/40 py-1 rounded border border-primary-900/50">
          点击直接聚焦此国地址明细
        </div>
      </div>
    </div>

    <!-- Map Footer Quick Metrics Strip -->
    <div class="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center">
      <div class="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
        <div class="text-[11px] text-slate-400">已部署国家/地区</div>
        <div class="text-base font-bold text-emerald-400 font-mono">{{ countryPins.length }} / {{ metadata.totalCountries }}</div>
      </div>
      <div class="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
        <div class="text-[11px] text-slate-400">{{ t('monitor.buildingAddresses') }}</div>
        <div class="text-base font-bold text-amber-400 font-mono">{{ totalLandmarks }} 处</div>
      </div>
      <div class="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
        <div class="text-[11px] text-slate-400">内置住宅样本</div>
        <div class="text-base font-bold text-emerald-300 font-mono">{{ totalResidential }} 处</div>
      </div>
      <div class="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
        <div class="text-[11px] text-slate-400">方案A插值容量</div>
        <div class="text-base font-bold text-cyan-400 font-mono">{{ totalDerivable.toLocaleString() }}+</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Globe, X } from 'lucide-vue-next';
import CountryFlag from '../CountryFlag.vue';
import { useI18n } from '../../i18n';
import { COUNTRIES } from '../../data/countries';
import metadata from '../../data/addresses/metadata.json';
import { worldLandPath, worldGraticulePath, countryVectorPaths, pinCoordinates } from '../../data/addresses/worldMapData';
import type { CountryCode, CountryInfo } from '../../types/identity';

defineProps<{
  selectedCountryCode?: CountryCode | '';
}>();

defineEmits<{
  (e: 'select-country', code: CountryCode | ''): void;
}>();

const { t, locale } = useI18n();
const isZh = computed(() => locale.value === 'zh');

interface CountryPin {
  code: CountryCode;
  x: number;
  y: number;
  nameZh: string;
  nameEn: string;
  continent: CountryInfo['continent'];
  isTaxFree: boolean;
  landmarkCount: number;
  schemeBCount: number;
  schemeACapacity: number;
}

const breakdown = metadata.countryBreakdown as Record<string, any>;

// Prominent pins that have enough space to show their code label permanently
function isProminentPin(code: string): boolean {
  return ['US', 'CA', 'GB', 'JP', 'AU', 'NZ'].includes(code);
}

const countryPins = computed<CountryPin[]>(() =>
  COUNTRIES.flatMap(country => {
    const coord = pinCoordinates[country.code];
    if (!coord) return [];
    const stats = breakdown[country.code];
    return [{
      code: country.code,
      x: coord.x,
      y: coord.y,
      nameZh: country.nameZh,
      nameEn: country.nameEn,
      continent: country.continent,
      isTaxFree: Boolean(country.isTaxFreeZone),
      landmarkCount: stats?.landmarkCount ?? 0,
      schemeBCount: stats?.schemeBResidentialCount ?? 0,
      schemeACapacity: stats?.schemeACapacity ?? 0
    }];
  })
);

const totalLandmarks = computed(() => metadata.stats.totalPhysicalLandmarks);
const totalResidential = computed(() => metadata.stats.totalSchemeBResidential);
const totalDerivable = computed(() => metadata.stats.totalSchemeACapacity);

// Hover & Tooltip logic with boundary protection
const mapContainerRef = ref<HTMLElement | null>(null);
const hoveredCode = ref<string | null>(null);

const activeTooltipPin = computed(() => {
  if (!hoveredCode.value) return null;
  return countryPins.value.find(p => p.code === hoveredCode.value) || null;
});

const tooltipPos = computed(() => {
  if (!activeTooltipPin.value || !mapContainerRef.value) return { x: 0, y: 0 };
  const rect = mapContainerRef.value.getBoundingClientRect();
  const scaleX = rect.width / 1000;
  const scaleY = rect.height / 500;

  // Safe clamping to keep tooltip inside map viewport
  const rawX = activeTooltipPin.value.x * scaleX;
  const rawY = activeTooltipPin.value.y * scaleY;
  const clampedX = Math.max(140, Math.min(rect.width - 140, rawX));
  const clampedY = Math.max(30, rawY - 22);

  return { x: clampedX, y: clampedY };
});

function handlePinHover(pin: CountryPin) {
  hoveredCode.value = pin.code;
}

function handlePinLeave() {
  hoveredCode.value = null;
}
</script>

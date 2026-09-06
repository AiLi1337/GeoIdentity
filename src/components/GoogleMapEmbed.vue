<template>
  <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
    <!-- Map Header -->
    <div class="p-3 sm:px-4 sm:py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
      <!-- Title & Anti-leak status -->
      <div class="flex items-center gap-2 shrink-0">
        <div
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :class="[
            provider === 'google'
              ? (isGoogleConfirmed ? 'bg-amber-500' : 'bg-amber-500 animate-pulse')
              : 'bg-emerald-500 animate-pulse'
          ]"
        ></div>
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {{ providerTitle }}
        </span>

        <!-- Status Badge -->
        <span
          class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border transition-colors"
          :class="[
            provider === 'google'
              ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
              : 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
          ]"
        >
          <ShieldAlert v-if="provider === 'google'" class="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <ShieldCheck v-else class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          {{ currentBadgeText }}
        </span>
      </div>

      <!-- Controls Row: Provider Switcher & Action Links -->
      <div class="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-between xl:justify-end">
        <!-- Map Provider Switcher -->
        <div class="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            @click="setProvider('osm')"
            :class="[
              'px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1',
              provider === 'osm'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            :title="t('card.osmTooltip')"
          >
            <ShieldCheck class="w-3 h-3 text-emerald-500" />
            <span>{{ t('card.mapOsm') }}</span>
          </button>

          <button
            type="button"
            @click="setProvider('bing')"
            :class="[
              'px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1',
              provider === 'bing'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            :title="t('card.bingTooltip')"
          >
            <span>{{ t('card.mapBing') }}</span>
          </button>

          <button
            type="button"
            @click="setProvider('google')"
            :class="[
              'px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1',
              provider === 'google'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            :title="t('card.googleTooltip')"
          >
            <ShieldAlert class="w-3 h-3 text-amber-500" />
            <span>{{ t('card.mapGoogle') }}</span>
          </button>
        </div>

        <!-- Bing Map Layer Switcher (Road vs Satellite Hybrid) -->
        <div v-if="provider === 'bing'" class="inline-flex items-center p-0.5 bg-slate-200/90 dark:bg-slate-800 rounded-lg text-xs font-medium border border-slate-300/60 dark:border-slate-700 shadow-2xs">
          <button
            type="button"
            @click="bingMapStyle = 'r'"
            :class="[
              'px-2 py-0.5 rounded-md transition-all cursor-pointer text-[11px]',
              bingMapStyle === 'r'
                ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            :title="t('card.bingRoad')"
          >
            🗺️ {{ t('card.bingRoad') }}
          </button>
          <button
            type="button"
            @click="bingMapStyle = 'h'"
            :class="[
              'px-2 py-0.5 rounded-md transition-all cursor-pointer text-[11px] flex items-center gap-1',
              bingMapStyle === 'h'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            :title="t('card.bingSatelliteBtn')"
          >
            <span>🛰️</span>
            <span>{{ t('card.bingSatelliteBtn') }}</span>
          </button>
        </div>

      <!-- Action Links -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <!-- Direct open link (Protected) -->
        <button
          type="button"
          @click="handleOpenDirect"
          class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors cursor-pointer"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>{{ currentDirectLabel }}</span>
        </button>

        <!-- Satellite Link (Protected / Provider-Aware) -->
        <button
          type="button"
          @click="handleOpenSatellite"
          class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          :title="provider === 'google' ? t('card.googleSatellite') : t('card.bingSatellite')"
        >
          <Layers class="w-3.5 h-3.5" />
          <span>{{ t('card.openSatellite') }}</span>
        </button>

        <!-- Re-lock Google Maps Button (When loaded) -->
        <button
          v-if="provider === 'google' && isGoogleConfirmed"
          type="button"
          @click="relockGoogle"
          class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors cursor-pointer"
          :title="t('card.googleRelockBtn')"
        >
          <Lock class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ t('card.googleRelockBtn') }}</span>
        </button>

        <!-- Google API Key Config Toggle (Only when google selected) -->
        <button
          v-if="provider === 'google'"
          type="button"
          @click="showKeyConfig = !showKeyConfig"
          class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          :title="t('card.googleEnterKey')"
        >
          <Key class="w-3.5 h-3.5" />
          <span class="hidden md:inline">{{ googleApiKey ? 'API Key ✓' : t('card.googleEnterKey') }}</span>
        </button>
      </div>
    </div>
  </div>

    <!-- Optional Google API Key input drawer -->
    <div v-if="provider === 'google' && showKeyConfig" class="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
      <div class="flex-1 min-w-[200px] flex items-center gap-2">
        <Key class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <input
          v-model="inputKey"
          type="text"
          :placeholder="t('card.googleKeyPlaceholder')"
          class="w-full text-xs px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500 font-mono"
        />
      </div>
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          @click="saveKey"
          class="px-2.5 py-1 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors cursor-pointer"
        >
          {{ t('card.googleSaveKey') }}
        </button>
        <button
          v-if="googleApiKey"
          type="button"
          @click="clearKey"
          class="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
        >
          {{ t('card.googleClearKey') }}
        </button>
        <button
          type="button"
          @click="showKeyConfig = false"
          class="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Map Body Area -->
    <div class="relative w-full bg-slate-100 dark:bg-slate-950">
      <!-- 1. Active Iframe View for OSM or Bing -->
      <div v-if="provider !== 'google'" class="h-72 sm:h-80 w-full relative">
        <iframe
          :key="`${provider}-${bingMapStyle}-${address.lat}-${address.lng}`"
          :src="embedUrl"
          class="w-full h-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="geolocation 'none'; camera 'none'; microphone 'none'"
          :title="`${provider} Address Location`"
        ></iframe>

        <!-- Coordinates Badge -->
        <div class="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-sm pointer-events-none">
          <MapPin class="w-3 h-3 text-red-500" />
          <span>{{ address.lat.toFixed(4) }}, {{ address.lng.toFixed(4) }}</span>
        </div>

        <!-- Watermark Badge -->
        <div class="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded shadow-sm flex items-center gap-1 pointer-events-none">
          <ShieldCheck class="w-3 h-3 text-emerald-400" />
          <span>{{ currentBadgeText }}</span>
        </div>
      </div>

      <!-- 2. Google Maps: Anti-Geo-Shift Safety Interception View (When NOT confirmed) -->
      <div
        v-else-if="!isGoogleConfirmed"
        class="w-full min-h-[22rem] p-5 sm:p-7 flex flex-col items-center justify-center text-center bg-gradient-to-b from-amber-500/10 via-slate-50 to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-950 border-t border-b border-amber-200/40 dark:border-amber-900/40"
      >
        <div class="relative mb-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner border border-amber-300 dark:border-amber-800">
            <ShieldAlert class="w-6 h-6 animate-pulse text-amber-600 dark:text-amber-400" />
          </div>
          <span class="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">!</span>
          </span>
        </div>

        <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
          {{ t('card.googleBlockedTitle') }}
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-400 max-w-lg mb-4 leading-relaxed">
          {{ t('card.googleBlockedSubtitle') }}
        </p>

        <!-- Risk details summary card -->
        <div class="w-full max-w-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-amber-200/90 dark:border-amber-800/70 rounded-xl p-3.5 mb-4.5 shadow-xs text-left">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
            <AlertTriangle class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>{{ t('card.googleWhatIsShift') }}</span>
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {{ t('card.googleShiftDesc') }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div class="flex items-center gap-1.5 text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
              <span class="text-xs">🛑</span>
              <span class="truncate">{{ t('card.googleShiftRisk1') }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
              <span class="text-xs">🛑</span>
              <span class="truncate">{{ t('card.googleShiftRisk2') }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
              <span class="text-xs">🛑</span>
              <span class="truncate">{{ t('card.googleShiftRisk3') }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
              <span class="text-xs">🛑</span>
              <span class="truncate">{{ t('card.googleShiftRisk4') }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 mb-2.5">
          <!-- Confirm Load Google Maps Button -->
          <button
            type="button"
            @click="confirmLoadGoogle"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-sm shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Unlock class="w-3.5 h-3.5" />
            <span>{{ t('card.googleConfirmLoadBtn') }}</span>
          </button>

          <!-- Switch to OSM Safe Button (Recommended) -->
          <button
            type="button"
            @click="setProvider('osm')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>{{ t('card.googleStaySafeOsmBtn') }}</span>
          </button>

          <!-- Switch to Bing Button -->
          <button
            type="button"
            @click="setProvider('bing')"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            <span>{{ t('card.googleSwitchBingBtn') }}</span>
          </button>
        </div>

        <!-- Secondary guide & key links -->
        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <button
            type="button"
            @click="showGuide = !showGuide"
            class="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <Info class="w-3.5 h-3.5" />
            <span>{{ showGuide ? t('card.googleGuideClose') : t('card.googleGuideToggle') }}</span>
          </button>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <button
            type="button"
            @click="showKeyConfig = true"
            class="inline-flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <Key class="w-3.5 h-3.5" />
            <span>{{ googleApiKey ? 'API Key ✓' : t('card.googleEnterKey') }}</span>
          </button>
        </div>
      </div>

      <!-- 3. Google Maps Active Iframe (When confirmed - Works with or without API Key!) -->
      <div v-else class="h-72 sm:h-80 w-full relative">
        <iframe
          :key="`google-${address.lat}-${address.lng}-${googleApiKey}`"
          :src="embedUrl"
          class="w-full h-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="geolocation 'none'; camera 'none'; microphone 'none'"
          title="Google Maps Address Location"
        ></iframe>

        <!-- Coordinates Badge -->
        <div class="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-sm pointer-events-none">
          <MapPin class="w-3 h-3 text-red-500" />
          <span>{{ address.lat.toFixed(4) }}, {{ address.lng.toFixed(4) }}</span>
        </div>

        <!-- Watermark Badge & Quick Relock -->
        <div class="absolute bottom-2 right-2 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md shadow-sm flex items-center gap-2">
          <ShieldAlert class="w-3 h-3 text-amber-400" />
          <span class="text-amber-300 font-medium">{{ currentBadgeText }}</span>
          <span class="text-slate-500">|</span>
          <button
            type="button"
            @click="relockGoogle"
            class="text-slate-300 hover:text-white underline cursor-pointer"
            :title="t('card.googleRelockBtn')"
          >
            {{ t('card.googleRelockBtn') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Security & Status Info Banner -->
    <div
      class="px-4 py-2 border-t text-xs flex flex-wrap items-center justify-between gap-2"
      :class="[
        provider === 'google'
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
          : provider === 'osm'
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300'
      ]"
    >
      <div class="flex items-center gap-1.5">
        <ShieldCheck v-if="provider === 'osm'" class="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
        <ShieldAlert v-else-if="provider === 'google'" class="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <Info v-else class="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
        <span>{{ currentBannerTip }}</span>
      </div>

      <div class="flex items-center gap-3 ml-auto">
        <!-- Auto-relock switch when Google is active -->
        <label
          v-if="provider === 'google' && isGoogleConfirmed"
          class="flex items-center gap-1 cursor-pointer select-none text-[11px] text-amber-800 dark:text-amber-200"
          :title="t('card.autoRelockTip')"
        >
          <input
            type="checkbox"
            v-model="autoRelockOnAddressChange"
            class="rounded border-amber-300 dark:border-amber-700 text-amber-600 focus:ring-amber-500"
          />
          <span>{{ t('card.autoRelockTip') }}</span>
        </label>

        <button
          type="button"
          @click="showGuide = !showGuide"
          class="underline font-semibold hover:opacity-80 flex-shrink-0 cursor-pointer flex items-center gap-0.5"
        >
          <span>{{ showGuide ? t('card.googleGuideClose') : t('card.googleGuideToggle') }}</span>
          <ChevronUp v-if="showGuide" class="w-3 h-3" />
          <ChevronDown v-else class="w-3 h-3" />
        </button>

        <button
          v-if="provider === 'google'"
          type="button"
          @click="setProvider('osm')"
          class="underline font-semibold hover:opacity-80 flex-shrink-0 cursor-pointer"
        >
          {{ t('card.switchToOsm') }}
        </button>
      </div>
    </div>

    <!-- Expandable Anti-Geo-Shift Knowledge & Best Practice Guide -->
    <div
      v-if="showGuide"
      class="p-4 sm:p-5 bg-slate-50/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 transition-all"
    >
      <div class="flex items-center justify-between gap-2 mb-3.5">
        <div class="flex items-center gap-2">
          <ShieldAlert class="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {{ t('card.googleGuideToggle') }}
          </h4>
        </div>
        <button
          type="button"
          @click="showGuide = false"
          class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          ✕ {{ t('card.googleGuideClose') }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-600 dark:text-slate-300">
        <!-- Section 1 -->
        <div class="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <h5 class="font-bold text-slate-900 dark:text-slate-100 mb-1.5 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {{ t('card.googleGuideSection1Title') }}
          </h5>
          <p class="whitespace-pre-line leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
            {{ t('card.googleGuideSection1Content') }}
          </p>
        </div>

        <!-- Section 2 -->
        <div class="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <h5 class="font-bold text-slate-900 dark:text-slate-100 mb-1.5 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {{ t('card.googleGuideSection2Title') }}
          </h5>
          <p class="whitespace-pre-line leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
            {{ t('card.googleGuideSection2Content') }}
          </p>
        </div>

        <!-- Section 3 -->
        <div class="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <h5 class="font-bold text-slate-900 dark:text-slate-100 mb-1.5 text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {{ t('card.googleGuideSection3Title') }}
          </h5>
          <p class="whitespace-pre-line leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
            {{ t('card.googleGuideSection3Content') }}
          </p>
        </div>

        <!-- Section 4 -->
        <div class="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <h5 class="font-bold text-slate-900 dark:text-slate-100 mb-1.5 text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {{ t('card.googleGuideSection4Title') }}
          </h5>
          <p class="whitespace-pre-line leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
            {{ t('card.googleGuideSection4Content') }}
          </p>
        </div>
      </div>
    </div>

    <!-- External Navigation Anti-Geo-Shift Warning Modal -->
    <Teleport to="body">
      <div
        v-if="showExtModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        @click.self="cancelExternalNavigation"
      >
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-900/60 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
          <!-- Modal Header -->
          <div class="px-5 py-4 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200/70 dark:border-amber-900/60 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                <AlertTriangle class="w-4 h-4" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">
                {{ t('card.googleModalTitle') }}
              </h3>
            </div>
            <button
              type="button"
              @click="cancelExternalNavigation"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
            <p class="leading-relaxed">
              {{ t('card.googleModalDesc') }}
            </p>

            <div class="space-y-2 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3">
              <div class="flex items-start gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 class="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{{ t('card.googleModalCheck1') }}</span>
              </div>
              <div class="flex items-start gap-2 text-rose-700 dark:text-rose-300 font-medium">
                <AlertTriangle class="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{{ t('card.googleModalCheck2') }}</span>
              </div>
              <div class="flex items-start gap-2 text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 class="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{{ t('card.googleModalCheck3') }}</span>
              </div>
            </div>

            <!-- Target URL preview & Copy Link Button -->
            <div class="flex items-center gap-2">
              <div class="flex-1 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate select-all">
                {{ pendingExtUrl }}
              </div>
              <button
                type="button"
                @click="copyExtLink"
                class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                :title="t('card.copyLinkAndIncognito')"
              >
                <Check v-if="copiedExtLink" class="w-3.5 h-3.5 text-emerald-500" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedExtLink ? t('card.linkCopied') : t('card.copyLinkAndIncognito') }}</span>
              </button>
            </div>

            <!-- Remember Choice -->
            <label class="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                v-model="rememberSkipModal"
                class="rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500"
              />
              <span>{{ t('card.googleModalRemember') }}</span>
            </label>
          </div>

          <!-- Modal Footer -->
          <div class="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              @click="cancelExternalNavigation"
              class="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {{ t('card.googleModalCancel') }}
            </button>
            <button
              type="button"
              @click="confirmExternalNavigation"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink class="w-3.5 h-3.5" />
              <span>{{ t('card.googleModalConfirm') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import {
  ExternalLink,
  Layers,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-vue-next';
import type { RealAddress } from '../types/identity';
import { useI18n } from '../i18n';

type MapProvider = 'osm' | 'google' | 'bing';

const props = defineProps<{
  address: RealAddress;
}>();

const { locale, t } = useI18n();

// Initialize provider from localStorage.
// SAFETY FIRST: Never auto-open Google Maps on initial load / reload.
// If user previously selected Google, safely default to 'osm'.
const savedProvider = localStorage.getItem('geo_map_provider') as MapProvider;
const provider = ref<MapProvider>(
  savedProvider === 'osm' || savedProvider === 'bing'
    ? savedProvider
    : 'osm'
);

// Bing Maps layer style: 'r' = Road view, 'h' = Aerial satellite hybrid
const bingMapStyle = ref<'r' | 'h'>('r');

// Safety state: Google Maps requires manual user confirmation before loading / network connection
const isGoogleConfirmed = ref(false);

// Auto re-lock toggle: automatically re-arm protection when a new address is generated
const autoRelockOnAddressChange = ref(true);

watch(
  () => [props.address.lat, props.address.lng, props.address.street],
  () => {
    // When generating a new address, automatically re-arm anti-shift lock to prevent silent requests
    if (autoRelockOnAddressChange.value && provider.value === 'google') {
      isGoogleConfirmed.value = false;
    }
  }
);

function setProvider(p: MapProvider) {
  provider.value = p;
  // Save provider choice to localStorage, but only persist safe options or explicit Google
  localStorage.setItem('geo_map_provider', p);
  // When switching providers, reset Google confirmation so returning requires conscious confirmation
  if (p !== 'google') {
    isGoogleConfirmed.value = false;
  }
}

function confirmLoadGoogle() {
  isGoogleConfirmed.value = true;
}

function relockGoogle() {
  isGoogleConfirmed.value = false;
}

// Educational guide collapsible state
const showGuide = ref(false);

// External navigation warning modal
const showExtModal = ref(false);
const pendingExtUrl = ref('');
const rememberSkipModal = ref(false);
const copiedExtLink = ref(false);

async function copyExtLink() {
  if (!pendingExtUrl.value) return;
  try {
    await navigator.clipboard.writeText(pendingExtUrl.value);
    copiedExtLink.value = true;
    setTimeout(() => {
      copiedExtLink.value = false;
    }, 2500);
  } catch {
    // fallback
  }
}

function openExternalLink(url: string, isGoogleLink: boolean = false) {
  if (!isGoogleLink) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  if (sessionStorage.getItem('skip_google_warn') === 'true') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  pendingExtUrl.value = url;
  showExtModal.value = true;
}

function handleOpenDirect() {
  if (provider.value === 'google') {
    openExternalLink(currentDirectUrl.value, true);
  } else {
    openExternalLink(currentDirectUrl.value, false);
  }
}

function handleOpenSatellite() {
  if (provider.value === 'google') {
    openExternalLink(satelliteUrl.value, true);
  } else {
    // OpenStreetMap & Bing use Bing Satellite directly (100% safe, no proxy, zero Google IP geo-shift risk)
    openExternalLink(satelliteUrl.value, false);
  }
}

function confirmExternalNavigation() {
  if (rememberSkipModal.value) {
    sessionStorage.setItem('skip_google_warn', 'true');
  }
  if (pendingExtUrl.value) {
    window.open(pendingExtUrl.value, '_blank', 'noopener,noreferrer');
  }
  showExtModal.value = false;
}

function cancelExternalNavigation() {
  showExtModal.value = false;
  pendingExtUrl.value = '';
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showExtModal.value) {
    cancelExternalNavigation();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});

// Google Maps API Key handling
const googleApiKey = ref(localStorage.getItem('geo_google_maps_api_key') || '');
const inputKey = ref(googleApiKey.value);
const showKeyConfig = ref(false);

function saveKey() {
  const trimmed = inputKey.value.trim();
  googleApiKey.value = trimmed;
  if (trimmed) {
    localStorage.setItem('geo_google_maps_api_key', trimmed);
  } else {
    localStorage.removeItem('geo_google_maps_api_key');
  }
  showKeyConfig.value = false;
}

function clearKey() {
  inputKey.value = '';
  googleApiKey.value = '';
  localStorage.removeItem('geo_google_maps_api_key');
  showKeyConfig.value = false;
}

// Provider title display localized
const providerTitle = computed(() => {
  if (provider.value === 'osm') return t('card.osmTitle');
  if (provider.value === 'bing') return t('card.bingTitle');
  return t('card.googleTitle');
});

// Watermark badge text localized
const currentBadgeText = computed(() => {
  if (provider.value === 'osm') return t('card.osmBadge');
  if (provider.value === 'bing') {
    return bingMapStyle.value === 'h'
      ? t('card.bingSatelliteBadge')
      : t('card.bingBadge');
  }
  if (provider.value === 'google') {
    return isGoogleConfirmed.value ? t('card.googleBadgeActive') : t('card.googleBadge');
  }
  return t('card.antiLeakBadge');
});

// Bottom banner tip text localized
const currentBannerTip = computed(() => {
  if (provider.value === 'osm') return t('card.osmSafeBanner');
  if (provider.value === 'bing') {
    return bingMapStyle.value === 'h'
      ? t('card.bingSatelliteBanner')
      : t('card.bingSafeBanner');
  }
  if (provider.value === 'google') {
    return isGoogleConfirmed.value ? t('card.googleLoadedBanner') : t('card.mapAntiLeakTip');
  }
  return t('card.mapAntiLeakTip');
});

// Full Address search query
const fullAddressQuery = computed(() => {
  return `${props.address.street}, ${props.address.city}, ${props.address.stateFull || props.address.state} ${props.address.postcode}, ${props.address.country}`;
});

// Dynamic Embed URL based on active provider
const embedUrl = computed(() => {
  const lat = props.address.lat;
  const lng = props.address.lng;

  if (provider.value === 'osm') {
    const deltaLng = 0.008;
    const deltaLat = 0.005;
    const minLng = (lng - deltaLng).toFixed(6);
    const minLat = (lat - deltaLat).toFixed(6);
    const maxLng = (lng + deltaLng).toFixed(6);
    const maxLat = (lat + deltaLat).toFixed(6);
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  }

  if (provider.value === 'bing') {
    const zoom = bingMapStyle.value === 'h' ? 17 : 16;
    return `https://www.bing.com/maps/embed?h=280&w=600&cp=${lat}~${lng}&lvl=${zoom}&typ=d&sty=${bingMapStyle.value}&pp=${lat}~${lng}`;
  }

  // Google Maps (only when user confirmed)
  if (provider.value === 'google' && isGoogleConfirmed.value) {
    if (googleApiKey.value) {
      return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleApiKey.value)}&q=${lat},${lng}`;
    }
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=${locale.value === 'zh' ? 'zh-CN' : 'en'}&z=15&output=embed`;
  }

  return '';
});

// Direct open link label
const currentDirectLabel = computed(() => {
  if (provider.value === 'osm') return t('card.viewOnOsm');
  if (provider.value === 'bing') return t('card.viewOnBing');
  return t('card.viewOnGoogleMaps');
});

// Direct open link URL
const currentDirectUrl = computed(() => {
  const lat = props.address.lat;
  const lng = props.address.lng;

  if (provider.value === 'osm') {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  }

  if (provider.value === 'bing') {
    const label = encodeURIComponent(props.address.street || 'Address');
    return `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=16&sty=${bingMapStyle.value}&pp=${lat}~${lng}&sp=point.${lat}_${lng}_${label}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressQuery.value)}`;
});

// Satellite view direct URL
const satelliteUrl = computed(() => {
  if (provider.value === 'bing' || provider.value === 'osm') {
    // Safe Bing Satellite (100% accessible, zero Google IP geo-shift risk)
    const label = encodeURIComponent(props.address.street || 'Target Address');
    return `https://www.bing.com/maps?cp=${props.address.lat}~${props.address.lng}&lvl=17&sty=h&pp=${props.address.lat}~${props.address.lng}&sp=point.${props.address.lat}_${props.address.lng}_${label}`;
  }
  // Google Satellite View (Proxy required)
  return `https://www.google.com/maps/@${props.address.lat},${props.address.lng},17z/data=!3m1!1e3`;
});
</script>

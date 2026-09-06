<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-200">
    <!-- Top Identity Hero Header -->
    <div class="p-4 sm:p-8 bg-gradient-to-b from-slate-50/90 to-white dark:from-slate-800/40 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <!-- Left: Avatar and Names -->
        <div class="flex items-center gap-3.5 sm:gap-5 min-w-0 w-full sm:w-auto">
          <div class="relative group shrink-0">
            <img
              :src="identity.basic.avatar"
              :alt="identity.basic.fullName"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-50 dark:bg-primary-950/60 p-1 border-2 border-primary-500/20 dark:border-primary-500/30 object-cover shadow-md shadow-primary-500/10"
            />
            <span
              :class="[
                'absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-full text-white shadow-sm ring-2 ring-white dark:ring-slate-900',
                identity.basic.gender === 'male' ? 'bg-blue-500' : 'bg-rose-500'
              ]"
              :title="identity.basic.gender === 'male' ? labels.genderMale : labels.genderFemale"
            >
              {{ displayGenderBadge }}
            </span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 class="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
                {{ displayFullName }}
              </h1>
              
              <!-- Phonetic, Latin or Native transcription if exists -->
              <span
                v-if="displaySubName"
                class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400"
              >
                ({{ displaySubName }})
              </span>

              <!-- Country Flag Tag -->
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span>{{ countryFlag }}</span>
                <span>{{ displayCountryName }}</span>
              </span>

              <!-- Tax Free Tag if applicable -->
              <span
                v-if="identity.address.isTaxFree"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse"
              >
                <Zap class="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{{ displayTaxRate }}</span>
              </span>

              <!-- Synthetic Test Profile Badge -->
              <button
                type="button"
                @click="$emit('open-disclaimer')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                :title="t('card.syntheticBadgeTip')"
              >
                <ShieldCheck class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{{ t('card.syntheticBadge') }}</span>
              </button>
            </div>

            <!-- Meta Badges -->
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
              <span class="px-2 py-0.5 text-[11px] sm:text-xs rounded-lg bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-medium">
                {{ identity.basic.age }} {{ labels.ageUnit }} ({{ identity.basic.birthDate }})
              </span>
              <span class="px-2 py-0.5 text-[11px] sm:text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {{ identity.basic.zodiacSign }}
              </span>
              <span class="px-2 py-0.5 text-[11px] sm:text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {{ identity.basic.bloodType }}
              </span>
              <!-- Timezone & Local Time -->
              <span class="px-2 py-0.5 text-[11px] sm:text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                <Clock class="w-3 h-3 text-slate-400" />
                <span>{{ identity.address.timezoneCode || 'UTC' }} · {{ currentTimeStr }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Actions (Card Language Switcher & Copy All Profile & Favorite) -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
          <!-- Card Profile Language Segmented Switcher -->
          <div class="inline-flex items-center justify-center p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-semibold shadow-xs">
            <button
              type="button"
              @click="cardLang = 'zh'"
              :class="[
                'flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none text-center',
                cardLang === 'zh'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
              :title="t('card.langZhTip')"
            >
              {{ t('card.langZh') }}
            </button>
            <button
              type="button"
              @click="cardLang = 'en'"
              :class="[
                'flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none text-center',
                cardLang === 'en'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
              :title="t('card.langEnTip')"
            >
              {{ t('card.langEn') }}
            </button>
            <button
              type="button"
              @click="cardLang = 'local'"
              :class="[
                'flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none flex items-center justify-center gap-1 text-center',
                cardLang === 'local'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
              :title="`${t('card.langLocalTip')} (${localMeta?.langLabel || ''})`"
            >
              <span>{{ localLangButtonText }}</span>
            </button>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              @click="handleCopyAll"
              class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Check v-if="copiedAll" class="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copiedAll ? t('card.copiedAll') : t('card.copyAll') }}</span>
            </button>

            <button
              type="button"
              @click="handleToggleFav"
              :class="[
                'p-2.5 rounded-xl border transition-all cursor-pointer shrink-0',
                isFav
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
              ]"
              :title="isFav ? t('card.unfavorite') : t('card.favorite')"
            >
              <Star class="w-5 h-5" :class="{ 'fill-amber-400 text-amber-400': isFav }" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Sections Grid -->
    <div class="p-4 sm:p-8 space-y-6 sm:space-y-8">
      <!-- Section 1: Real Address on Google Maps -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <MapPin class="w-4 h-4" />
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ labels.addressTitle }}
            </h3>
            <span
              v-if="identity.address.isTaxFree"
              class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            >
              {{ labels.taxFreeTag }}
            </span>
          </div>
          <button
            type="button"
            @click="copyField(fullAddressString, 'address')"
            class="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-medium"
          >
            <Copy class="w-3 h-3" />
            <span>{{ t('card.copyAll') }}</span>
          </button>
        </div>

        <!-- Address Mode Info Banner -->
        <div
          class="mb-4 px-4 py-2.5 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs"
          :class="[
            identity.address.addressMode === 'residential'
              ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200/80 dark:border-purple-800/50 text-purple-900 dark:text-purple-200'
              : identity.address.addressMode === 'derivation'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/50 text-blue-900 dark:text-blue-200'
          ]"
        >
          <div class="flex items-center gap-2 font-semibold">
            <component :is="modeIcon" class="w-4 h-4 shrink-0" />
            <span>{{ modeBadgeText }}</span>
            <span class="text-[11px] font-normal opacity-85 hidden sm:inline">
              · {{ localizedRuleSummary }}
            </span>
          </div>
          <span
            class="text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide"
            :class="[
              identity.address.addressMode === 'residential'
                ? 'bg-purple-200/80 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200'
                : identity.address.addressMode === 'derivation'
                  ? 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                  : 'bg-blue-200/80 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200'
            ]"
          >
            {{ localizedAvsTier }}
          </span>
        </div>

        <!-- Address Cards 4-Column Grid (Line 1, Line 2, City/State, Postcode) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <!-- Street Address (Line 1) -->
          <div
            @click="copyField(identity.address.addressLine1 || identity.address.street, 'street')"
            class="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer transition-all hover:shadow-sm"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
              <span>{{ labels.street }}</span>
              <Check v-if="copiedKey === 'street'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
              {{ identity.address.addressLine1 || identity.address.street }}
            </div>
          </div>

          <!-- Unit / Suite (Line 2) -->
          <div
            @click="copyField(identity.address.addressLine2 || '', 'suite')"
            class="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer transition-all hover:shadow-sm"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
              <span>{{ labels.addressLine2 }}</span>
              <Check v-if="copiedKey === 'suite'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </div>
            <div class="text-sm font-semibold text-primary-600 dark:text-primary-400 font-mono">
              {{ identity.address.addressLine2 || 'N/A' }}
            </div>
          </div>

          <!-- City & State -->
          <div
            @click="copyField(`${identity.address.city}, ${identity.address.stateFull || identity.address.state}`, 'city')"
            class="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer transition-all hover:shadow-sm"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
              <span>{{ labels.cityState }}</span>
              <Check v-if="copiedKey === 'city'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {{ identity.address.city }}, {{ identity.address.stateFull || identity.address.state }}
            </div>
          </div>

          <!-- Postcode & Country -->
          <div
            @click="copyField(identity.address.postcode, 'postcode')"
            class="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer transition-all hover:shadow-sm"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
              <span>{{ labels.postcode }}</span>
              <Check v-if="copiedKey === 'postcode'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {{ identity.address.postcode }}
            </div>
          </div>
        </div>

        <!-- Dedicated eCommerce / Forwarder Standard Format Card -->
        <div class="mb-4 p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <PackageCheck class="w-4 h-4" />
              <span>{{ identity.address.addressMode === 'residential' ? labels.residentialTitle : labels.forwarderTitle }}</span>
            </div>
            <div class="text-xs font-mono text-slate-600 dark:text-slate-400 line-clamp-1">
              {{ displayFullName }} · {{ identity.address.addressLine1 || identity.address.street }}{{ identity.address.addressLine2 ? ` · ${identity.address.addressLine2}` : '' }} · {{ identity.address.city }}, {{ identity.address.state }} {{ identity.address.postcode }}
            </div>
          </div>
          <button
            type="button"
            @click="copyField(forwarderShippingText, 'forwarder')"
            class="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Check v-if="copiedKey === 'forwarder'" class="w-3.5 h-3.5" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ copiedKey === 'forwarder' ? t('card.copiedField') : labels.copyForwarder }}</span>
          </button>
        </div>

        <!-- Google Maps Live Embed Viewer -->
        <GoogleMapEmbed :address="identity.address" />
      </div>

      <!-- Section 2: Contact & Document Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Contact Details -->
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center gap-2 mb-3">
              <div class="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Phone class="w-4 h-4" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">
                {{ labels.contactTitle }}
              </h3>
            </div>

            <!-- Phone -->
            <div
              @click="copyField(identity.contact.phoneFormatted, 'phone')"
              class="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div>
                <div class="text-xs text-slate-400 dark:text-slate-500">{{ labels.phone }}</div>
                <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {{ identity.contact.phoneFormatted }}
                </div>
              </div>
              <Check v-if="copiedKey === 'phone'" class="w-4 h-4 text-emerald-500" />
              <Copy v-else class="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </div>

            <!-- Email -->
            <div
              @click="copyField(identity.contact.email, 'email')"
              class="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div class="min-w-0 flex-1 mr-2">
                <div class="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                  <span>{{ labels.email }}</span>
                  <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/50">
                    {{ labels.emailNotice }}
                  </span>
                </div>
                <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">
                  {{ identity.contact.email }}
                </div>
              </div>
              <Check v-if="copiedKey === 'email'" class="w-4 h-4 text-emerald-500 shrink-0" />
              <Copy v-else class="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity shrink-0" />
            </div>

            <!-- Username -->
            <div
              @click="copyField(identity.contact.username, 'username')"
              class="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div class="min-w-0 flex-1 mr-2">
                <div class="text-xs text-slate-400 dark:text-slate-500">{{ labels.username }}</div>
                <div class="text-sm font-mono font-medium text-slate-700 dark:text-slate-300 break-all">
                  {{ identity.contact.username }}
                </div>
              </div>
              <Check v-if="copiedKey === 'username'" class="w-4 h-4 text-emerald-500 shrink-0" />
              <Copy v-else class="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity shrink-0" />
            </div>
          </div>

          <!-- Email / Contact Disclaimer Tip -->
          <div class="mt-3 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-1.5">
            <Info class="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <span>{{ labels.emailTip }}</span>
          </div>
        </div>

        <!-- Compliance Document / Tax ID -->
        <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <FileText class="w-4 h-4" />
              </div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">
                {{ labels.docTitle }}
              </h3>
            </div>

            <div
              @click="copyField(identity.document.docNumber, 'docNumber')"
              class="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:border-purple-400 transition-all mb-3"
            >
              <div class="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                <span class="font-medium">{{ displayDocTypeName }}</span>
                <Check v-if="copiedKey === 'docNumber'" class="w-4 h-4 text-emerald-500" />
                <Copy v-else class="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
              </div>
              <div class="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                {{ identity.document.docNumber }}
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="text-xs text-slate-500 dark:text-slate-400 bg-purple-50/50 dark:bg-purple-950/30 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/40">
              ℹ️ {{ identity.document.description }}
            </div>
            <div class="text-[11px] text-slate-400 dark:text-slate-500 px-1">
              * {{ labels.docNotice }}
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Occupation & Higher Education -->
      <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Briefcase class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">
            {{ labels.occupationTitle }}
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <!-- Company -->
          <div
            @click="copyField(identity.occupation.company, 'company')"
            class="group p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 mb-0.5">
              <span>{{ labels.company }}</span>
              <Check v-if="copiedKey === 'company'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400" />
            </div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {{ identity.occupation.company }}
            </div>
          </div>

          <!-- Title -->
          <div
            @click="copyField(identity.occupation.title, 'title')"
            class="group p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 mb-0.5">
              <span>{{ labels.title }}</span>
              <Check v-if="copiedKey === 'title'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400" />
            </div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {{ identity.occupation.title }}
            </div>
          </div>

          <!-- University -->
          <div
            @click="copyField(identity.occupation.university, 'university')"
            class="group p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 mb-0.5">
              <span>{{ labels.university }}</span>
              <Check v-if="copiedKey === 'university'" class="w-3.5 h-3.5 text-emerald-500" />
              <Copy v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400" />
            </div>
            <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {{ identity.occupation.university }}
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Finance Virtual Card (Luhn Validated) -->
      <div class="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-xl relative overflow-hidden">
        <!-- Ambient Card Graphic -->
        <div class="absolute -top-12 right-0 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <CreditCard class="w-5 h-5 text-teal-400" />
              <span class="text-sm font-bold tracking-wide text-slate-200">
                {{ labels.financeTitle }}
              </span>
            </div>
            <span class="px-2.5 py-0.5 text-xs font-bold rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {{ identity.finance.cardType }}
            </span>
          </div>

          <!-- Card Number -->
          <div
            @click="copyField(identity.finance.cardNumber, 'cardNumber')"
            class="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
          >
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{{ labels.cardNumber }}</span>
              <Check v-if="copiedKey === 'cardNumber'" class="w-4 h-4 text-emerald-400" />
              <Copy v-else class="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-300 transition-opacity" />
            </div>
            <div class="text-lg sm:text-2xl font-mono font-bold tracking-wider sm:tracking-widest text-teal-300 break-all">
              {{ identity.finance.cardFormatted }}
            </div>
          </div>

          <!-- Bottom Row: Expiry, CVV, Bank -->
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <div
              @click="copyField(`${identity.finance.expMonth}/${identity.finance.expYear}`, 'exp')"
              class="group p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
            >
              <div class="text-[11px] text-slate-400">{{ labels.expDate }}</div>
              <div class="text-sm font-mono font-bold text-slate-200">
                {{ identity.finance.expMonth }} / {{ identity.finance.expYear }}
              </div>
            </div>

            <div
              @click="copyField(identity.finance.cvv, 'cvv')"
              class="group p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
            >
              <div class="text-[11px] text-slate-400">{{ labels.cvv }}</div>
              <div class="text-sm font-mono font-bold text-slate-200">
                {{ identity.finance.cvv }}
              </div>
            </div>

            <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">
              <div class="text-[11px] text-slate-400">{{ labels.bank }}</div>
              <div class="text-sm font-medium text-slate-200 truncate">
                {{ identity.finance.bankName }}
              </div>
            </div>
          </div>

          <!-- Card Compliance / Safety Notice -->
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/30 text-[11px] text-teal-200">
            <ShieldAlert class="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span class="leading-tight">{{ labels.financeNotice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  MapPin,
  Phone,
  FileText,
  Briefcase,
  CreditCard,
  Copy,
  Check,
  Star,
  Zap,
  Clock,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Route,
  Home,
  Info
} from 'lucide-vue-next';
import type { GeneratedIdentity, CardLanguage } from '../types/identity';
import { COUNTRIES } from '../data/countries';
import { COUNTRY_LOCAL_META } from '../data/names';
import { getCardLabels, formatForwarderShippingText } from '../data/cardLabels';
import GoogleMapEmbed from './GoogleMapEmbed.vue';
import { useI18n } from '../i18n';
import { formatFullIdentityText } from '../services/exportService';

const props = defineProps<{
  identity: GeneratedIdentity;
  isFav?: boolean;
}>();

const emit = defineEmits<{
  (e: 'copy-field', text: string, label: string): void;
  (e: 'toggle-favorite', identity: GeneratedIdentity): void;
  (e: 'open-disclaimer'): void;
}>();

const { locale, t } = useI18n();

// 3-segment card profile display language ('zh' | 'en' | 'local')
const cardLang = ref<CardLanguage>(locale.value === 'en' ? 'en' : 'zh');

watch(locale, (newLoc) => {
  cardLang.value = newLoc === 'en' ? 'en' : 'zh';
});

const localMeta = computed(() => COUNTRY_LOCAL_META[props.identity.countryCode]);

const labels = computed(() => {
  return getCardLabels(props.identity.countryCode, cardLang.value, locale.value);
});

const localLangButtonText = computed(() => {
  return localMeta.value?.langLabel || t('card.langLocal');
});

const displayGenderBadge = computed(() => {
  if (cardLang.value === 'zh') {
    return props.identity.basic.gender === 'male' ? '男' : '女';
  }
  return props.identity.basic.gender === 'male' ? 'M' : 'F';
});

const displayFullName = computed(() => {
  const i = props.identity;
  if (cardLang.value === 'zh') {
    return i.basic.zhFullName || i.basic.localFullName || i.basic.fullName;
  }
  if (cardLang.value === 'local') {
    return i.basic.localFullName || i.basic.fullName;
  }
  return i.basic.fullName;
});

const displaySubName = computed(() => {
  const i = props.identity;
  const main = displayFullName.value;
  if (cardLang.value === 'zh') {
    if (i.basic.zhFullName && i.basic.fullName !== main) {
      return i.basic.fullName;
    }
    return i.basic.phoneticName || (i.basic.fullName !== main ? i.basic.fullName : '');
  }
  if (cardLang.value === 'en') {
    if (i.basic.localFullName && i.basic.localFullName !== i.basic.fullName) {
      return i.basic.localFullName;
    }
    return '';
  }
  // cardLang === 'local'
  if (i.countryCode === 'JP') {
    return i.basic.phoneticName || (i.basic.fullName !== main ? i.basic.fullName : '');
  }
  if (i.countryCode === 'KR') {
    return i.basic.fullName;
  }
  if (i.countryCode === 'HK' || i.countryCode === 'TW') {
    return i.basic.fullName;
  }
  if (i.basic.fullName !== main) {
    return i.basic.fullName;
  }
  return '';
});

const displayCountryName = computed(() => {
  if (cardLang.value === 'zh') {
    return props.identity.countryName;
  }
  if (cardLang.value === 'local') {
    return localMeta.value?.countryLocalName || props.identity.address.country;
  }
  return props.identity.address.country;
});

const displayDocTypeName = computed(() => {
  if (cardLang.value === 'zh') {
    return props.identity.document.typeNameZh;
  }
  if (cardLang.value === 'local') {
    return props.identity.document.typeNameLocal || props.identity.document.typeName;
  }
  return props.identity.document.typeName;
});

const copiedKey = ref<string | null>(null);
const copiedAll = ref(false);

const modeIcon = computed(() => {
  const mode = props.identity.address.addressMode;
  if (mode === 'derivation') return Route;
  if (mode === 'residential') return Home;
  return Building2;
});

const modeBadgeText = computed(() => {
  const mode = props.identity.address.addressMode;
  if (mode === 'derivation') return t('addressMode.derivationBadge');
  if (mode === 'residential') return t('addressMode.residentialBadge');
  return t('addressMode.landmarkBadge');
});

const displayTaxRate = computed(() => {
  const raw = props.identity.address.taxRate;
  const isTaxFree = props.identity.address.isTaxFree;
  if (locale.value === 'zh') {
    if (isTaxFree || (raw && raw.includes('No Sales Tax'))) {
      return '0.00% (免消费税)';
    }
    if (raw && raw.includes('Standard Tax')) {
      return '标准消费税率';
    }
    return raw || '0.00% (免消费税)';
  } else {
    if (isTaxFree || (raw && raw.includes('免税'))) {
      return '0.00% (No Sales Tax)';
    }
    if (raw && raw.includes('标准')) {
      return 'Standard Tax';
    }
    return raw || '0.00% (No Sales Tax)';
  }
});

const localizedAvsTier = computed(() => {
  const mode = props.identity.address.addressMode;
  const rawTier = props.identity.address.derivationMeta?.avsTier;
  if (locale.value === 'zh') {
    if (rawTier === 'Residential AVS Pass' || mode === 'residential') return '住宅 AVS 认证 (买家自用)';
    if (rawTier === 'Commercial / Freight' || mode === 'landmark') return '真实商厦 · 商业转运';
    if (rawTier === 'Unique Synthetic AVS' || mode === 'derivation') return '市政合法门牌 · 独一无二';
    return rawTier || '100% 真实实体建筑';
  } else {
    if (rawTier === 'Residential AVS Pass' || mode === 'residential') return 'Residential AVS Pass';
    if (rawTier === 'Commercial / Freight' || mode === 'landmark') return 'Commercial / Freight';
    if (rawTier === 'Unique Synthetic AVS' || mode === 'derivation') return 'Unique Synthetic AVS';
    return rawTier || '100% Real Physical';
  }
});

const localizedRuleSummary = computed(() => {
  const meta = props.identity.address.derivationMeta;
  const mode = props.identity.address.addressMode;
  if (locale.value === 'zh') {
    return meta?.ruleSummary || (mode === 'residential' ? '真实居民独栋/住宅 · 纯天然居民房' : (mode === 'derivation' ? '真实街道门牌合法区间衍生 · GIS插值' : '真实商厦物理地标 · 100% 实体'));
  } else {
    if (meta?.ruleSummaryEn) return meta.ruleSummaryEn;
    if (mode === 'residential') return 'Single Family Home / Residence · Authentic Residential';
    if (mode === 'derivation') return 'Valid Street House Range · Linear GIS Interpolation';
    return 'Physical Commercial Landmark · 100% Real';
  }
});

const countryFlag = computed(() => {
  const c = COUNTRIES.find(item => item.code === props.identity.countryCode);
  return c ? c.flag : '🌐';
});

const fullAddressString = computed(() => {
  const a = props.identity.address;
  const line2 = a.addressLine2 ? ` ${a.addressLine2},` : '';
  return `${a.addressLine1 || a.street},${line2} ${a.city}, ${a.stateFull || a.state} ${a.postcode}, ${a.country}`;
});

const forwarderShippingText = computed(() => {
  return formatForwarderShippingText(
    props.identity,
    cardLang.value,
    displayFullName.value,
    displayCountryName.value
  );
});

const currentTimeStr = computed(() => {
  try {
    const tz = props.identity.address.timezone;
    if (tz && tz.includes('/')) {
      const iana = tz.split(' ')[0];
      return new Intl.DateTimeFormat('zh-CN', {
        timeZone: iana,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
    }
  } catch (_e) {}
  return new Date().toLocaleTimeString();
});

function fallbackCopy(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    console.warn('Fallback copy failed', e);
  }
  document.body.removeChild(textArea);
}

async function copyField(text: string, key: string) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
  } catch (_e) {
    fallbackCopy(text);
  }
  copiedKey.value = key;
  emit('copy-field', text, t('card.copiedField'));
  setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = null;
  }, 1800);
}

async function handleCopyAll() {
  const text = formatFullIdentityText(props.identity, cardLang.value);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
  } catch (_e) {
    fallbackCopy(text);
  }
  copiedAll.value = true;
  emit('copy-field', text, t('card.copiedAll'));
  setTimeout(() => {
    copiedAll.value = false;
  }, 2000);
}

function handleToggleFav() {
  emit('toggle-favorite', props.identity);
}
</script>

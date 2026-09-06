import type { CountryCode, RealAddress, AddressMode } from '../../types/identity';
import { US_ADDRESSES } from './us';
import { GB_ADDRESSES } from './gb';
import { JP_ADDRESSES } from './jp';
import { CA_ADDRESSES } from './ca';
import { AU_ADDRESSES } from './au';
import { DE_ADDRESSES } from './de';
import { FR_ADDRESSES } from './fr';
import { HK_ADDRESSES } from './hk';
import { TW_ADDRESSES } from './tw';
import { SG_ADDRESSES } from './sg';
import { EXTENDED_ADDRESSES } from './extended';
import { getDerivationRule, deriveStreetAddress, matchesState } from './schemes/derivationRules';
import { getResidentialAddress, RESIDENTIAL_ADDRESSES } from './schemes/residentialAddresses';

export const ADDRESS_MAP: Record<CountryCode, RealAddress[]> = {
  US: US_ADDRESSES,
  GB: GB_ADDRESSES,
  JP: JP_ADDRESSES,
  CA: CA_ADDRESSES,
  AU: AU_ADDRESSES,
  DE: DE_ADDRESSES,
  FR: FR_ADDRESSES,
  HK: HK_ADDRESSES,
  TW: TW_ADDRESSES,
  SG: SG_ADDRESSES,
  KR: EXTENDED_ADDRESSES.KR || [],
  CH: EXTENDED_ADDRESSES.CH || [],
  LU: EXTENDED_ADDRESSES.LU || [],
  IE: EXTENDED_ADDRESSES.IE || [],
  IT: EXTENDED_ADDRESSES.IT || [],
  ES: EXTENDED_ADDRESSES.ES || [],
  NL: EXTENDED_ADDRESSES.NL || [],
  MY: EXTENDED_ADDRESSES.MY || [],
  TH: EXTENDED_ADDRESSES.TH || [],
  VN: EXTENDED_ADDRESSES.VN || [],
  PH: EXTENDED_ADDRESSES.PH || []
};

function enrichLandmarkAddress(raw: RealAddress): RealAddress {
  return {
    ...raw,
    addressMode: 'landmark',
    buildingType: 'commercial',
    derivationMeta: {
      mode: 'landmark',
      modeLabelZh: '高精度真实地标种子库',
      modeLabelEn: 'Curated Real Landmark Seeds',
      ruleSummary: '真实实体商厦/名企总部/核心地标 · 100% 物理真实',
      interpolated: false,
      buildingType: 'commercial',
      avsTier: 'Commercial / Freight'
    }
  };
}

export function getRandomAddress(
  countryCode: CountryCode,
  stateCode?: string,
  isTaxFreeOnly?: boolean,
  mode: AddressMode = 'residential'
): RealAddress {
  const countryLandmarkList = (ADDRESS_MAP[countryCode] && ADDRESS_MAP[countryCode].length > 0)
    ? ADDRESS_MAP[countryCode]
    : ADDRESS_MAP.US;

  // Mode 2: 方案A (真实街道门牌合法区间衍生)
  if (mode === 'derivation') {
    const rule = getDerivationRule(countryCode, stateCode, isTaxFreeOnly);
    if (rule) {
      return deriveStreetAddress(rule);
    }
    // If state-specific rule was requested but not found in Scheme A:
    // First preserve state isolation: check if that specific state has a genuine residential home
    if (stateCode) {
      const stateRes = getResidentialAddress(countryCode, stateCode, isTaxFreeOnly);
      if (stateRes) {
        return stateRes;
      }
    }
    // If stateCode was not specified or no state match exists, try a country-level derivation corridor
    const countryFallbackRule = getDerivationRule(countryCode, undefined, isTaxFreeOnly);
    if (countryFallbackRule) {
      return deriveStreetAddress(countryFallbackRule);
    }
    const countryRes = getResidentialAddress(countryCode, undefined, isTaxFreeOnly);
    if (countryRes) {
      return countryRes;
    }
    const globalRes = getResidentialAddress('US', undefined, false) || RESIDENTIAL_ADDRESSES[0];
    return globalRes;
  }

  // Mode 3: 方案B (全球真实住宅/居民独栋地址库)
  if (mode === 'residential') {
    const resAddr = getResidentialAddress(countryCode, stateCode, isTaxFreeOnly);
    if (resAddr) {
      return resAddr;
    }
    // Fallback within country: strictly prioritize other residential addresses in that country
    const countryFallbackRes = getResidentialAddress(countryCode, undefined, isTaxFreeOnly)
      || (isTaxFreeOnly ? getResidentialAddress(countryCode, undefined, false) : null);
    if (countryFallbackRes) {
      return countryFallbackRes;
    }
    // Global residential fallback to guarantee residential property, never commercial
    const globalFallbackRes = getResidentialAddress('US', undefined, false)
      || RESIDENTIAL_ADDRESSES[0];
    return globalFallbackRes;
  }

  // Mode 1: 高精度真实地标种子库 (or graceful fallback)
  let candidates = countryLandmarkList;

  if (stateCode) {
    const filtered = countryLandmarkList.filter(a => matchesState(a.state, a.stateFull, stateCode));
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }

  if (isTaxFreeOnly) {
    const taxFreeList = candidates.filter(a => a.isTaxFree);
    if (taxFreeList.length > 0) {
      candidates = taxFreeList;
    }
  }

  if (candidates.length === 0) {
    candidates = countryLandmarkList.length > 0 ? countryLandmarkList : ADDRESS_MAP.US;
  }

  const index = Math.floor(Math.random() * candidates.length);
  return enrichLandmarkAddress(candidates[index] || candidates[0] || ADDRESS_MAP.US[0]);
}

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

function initResidentialSeedList(list: RealAddress[]): RealAddress[] {
  return list.map(addr => ({
    ...addr,
    buildingType: 'residential' as const
  }));
}

export const ADDRESS_MAP: Record<CountryCode, RealAddress[]> = {
  US: initResidentialSeedList(US_ADDRESSES),
  GB: initResidentialSeedList(GB_ADDRESSES),
  JP: initResidentialSeedList(JP_ADDRESSES),
  CA: initResidentialSeedList(CA_ADDRESSES),
  AU: initResidentialSeedList(AU_ADDRESSES),
  DE: initResidentialSeedList(DE_ADDRESSES),
  FR: initResidentialSeedList(FR_ADDRESSES),
  HK: initResidentialSeedList(HK_ADDRESSES),
  TW: initResidentialSeedList(TW_ADDRESSES),
  SG: initResidentialSeedList(SG_ADDRESSES),
  KR: initResidentialSeedList(EXTENDED_ADDRESSES.KR || []),
  CH: initResidentialSeedList(EXTENDED_ADDRESSES.CH || []),
  LU: initResidentialSeedList(EXTENDED_ADDRESSES.LU || []),
  IE: initResidentialSeedList(EXTENDED_ADDRESSES.IE || []),
  IT: initResidentialSeedList(EXTENDED_ADDRESSES.IT || []),
  ES: initResidentialSeedList(EXTENDED_ADDRESSES.ES || []),
  NL: initResidentialSeedList(EXTENDED_ADDRESSES.NL || []),
  MY: initResidentialSeedList(EXTENDED_ADDRESSES.MY || []),
  TH: initResidentialSeedList(EXTENDED_ADDRESSES.TH || []),
  VN: initResidentialSeedList(EXTENDED_ADDRESSES.VN || []),
  PH: initResidentialSeedList(EXTENDED_ADDRESSES.PH || [])
};

function enrichLandmarkAddress(raw: RealAddress): RealAddress {
  return {
    ...raw,
    addressMode: 'landmark',
    buildingType: 'residential',
    derivationMeta: {
      mode: 'landmark',
      modeLabelZh: '方案C·真实都会公寓 (100% 真实住宅)',
      modeLabelEn: 'Scheme C (Residential Condos)',
      ruleSummary: '真实都会高层公寓/优质名苑社区 · 100% 物理真实居住',
      interpolated: false,
      buildingType: 'residential',
      avsTier: 'Residential Condominium / Apartment'
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

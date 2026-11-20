import type { CountryCode, RealAddress, AddressMode } from '../../types/identity';
import { COUNTRIES } from '../countries';
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
import { STREET_DERIVATION_RULES, getDerivationRule, deriveStreetAddress, matchesState } from './schemes/derivationRules';
import { getResidentialAddress, RESIDENTIAL_ADDRESSES } from './schemes/residentialAddresses';
import osmApartments from './osmApartments.json';

type OsmApartment = Pick<RealAddress, 'street' | 'city' | 'state' | 'postcode' | 'lat' | 'lng'> & {
  id: string;
  building?: string;
  countryCode?: CountryCode;
  stateFull?: string;
};

interface OsmRegionMeta {
  country: string;
  stateFull: string;
  isTaxFree: boolean;
  taxRate: string;
  timezone: string;
  timezoneCode: string;
}

const US_STATE_META: Record<string, Omit<OsmRegionMeta, 'country'>> = {
  DE: { stateFull: 'Delaware', isTaxFree: true, taxRate: '0.00% (No Sales Tax)', timezone: 'America/New_York (EST/EDT)', timezoneCode: 'EST' },
  OR: { stateFull: 'Oregon', isTaxFree: true, taxRate: '0.00% (No Sales Tax)', timezone: 'America/Los_Angeles (PST/PDT)', timezoneCode: 'PST' },
  NH: { stateFull: 'New Hampshire', isTaxFree: true, taxRate: '0.00% (No Sales Tax)', timezone: 'America/New_York (EST/EDT)', timezoneCode: 'EST' },
  MT: { stateFull: 'Montana', isTaxFree: true, taxRate: '0.00% (No Sales Tax)', timezone: 'America/Denver (MST/MDT)', timezoneCode: 'MST' },
  AK: { stateFull: 'Alaska', isTaxFree: true, taxRate: '0.00% (No Sales Tax)', timezone: 'America/Anchorage (AKST)', timezoneCode: 'AKST' },
  WA: { stateFull: 'Washington', isTaxFree: false, taxRate: '10.25%', timezone: 'America/Los_Angeles (PST/PDT)', timezoneCode: 'PST' },
  NY: { stateFull: 'New York', isTaxFree: false, taxRate: '8.875%', timezone: 'America/New_York (EST/EDT)', timezoneCode: 'EST' },
  IL: { stateFull: 'Illinois', isTaxFree: false, taxRate: '10.25%', timezone: 'America/Chicago (CST/CDT)', timezoneCode: 'CST' },
  CA: { stateFull: 'California', isTaxFree: false, taxRate: '8.625%', timezone: 'America/Los_Angeles (PST/PDT)', timezoneCode: 'PST' },
  TX: { stateFull: 'Texas', isTaxFree: false, taxRate: '8.25%', timezone: 'America/Chicago (CST/CDT)', timezoneCode: 'CST' }
};

const HK_DISTRICT_FULL: Record<string, string> = {
  CW: '中西區 (Central & Western)',
  WC: '灣仔區 (Wan Chai)',
  YTM: '油尖旺區 (Yau Tsim Mong)',
  KC: '九龍城區 (Kowloon City)',
  ST: '沙田區 (Sha Tin)',
  IS: '離島區 (Islands)',
  EA: '東區 (Eastern)',
  KT: '觀塘區 (Kwun Tong)'
};

const TW_CITY_FULL: Record<string, string> = {
  TPE: '台北市 (Taipei City)',
  NTP: '新北市 (New Taipei City)',
  TXG: '台中市 (Taichung City)',
  KHH: '高雄市 (Kaohsiung City)',
  HSZ: '新竹市 (Hsinchu City)',
  TYN: '桃園市 (Taoyuan City)',
  TNN: '台南市 (Tainan City)'
};

function resolveOsmMeta(a: OsmApartment): OsmRegionMeta & { countryCode: CountryCode } {
  const countryCode: CountryCode = a.countryCode || 'US';
  const countryInfo = COUNTRIES.find(c => c.code === countryCode);
  const country = countryCode === 'HK' ? 'Hong Kong' : countryCode === 'TW' ? 'Taiwan' : (countryInfo?.nameEn || 'United States');

  if (countryCode === 'US') {
    const meta = US_STATE_META[a.state] || {
      stateFull: a.stateFull || a.state,
      isTaxFree: false,
      taxRate: 'Standard Tax',
      timezone: 'America/New_York (EST/EDT)',
      timezoneCode: 'EST'
    };
    return { ...meta, country, countryCode };
  }

  if (countryCode === 'HK') {
    return {
      country,
      countryCode,
      stateFull: a.stateFull || HK_DISTRICT_FULL[a.state] || a.state,
      isTaxFree: true,
      taxRate: '0.00% (No Sales Tax)',
      timezone: 'Asia/Hong_Kong (HKT)',
      timezoneCode: 'HKT'
    };
  }

  if (countryCode === 'TW') {
    return {
      country,
      countryCode,
      stateFull: a.stateFull || TW_CITY_FULL[a.state] || a.state,
      isTaxFree: false,
      taxRate: '5.00% (營業稅)',
      timezone: 'Asia/Taipei (CST)',
      timezoneCode: 'CST'
    };
  }

  const stInfo = countryInfo?.popularStates.find(s => s.code === a.state);
  const isTaxFree = Boolean(stInfo?.isTaxFree || countryInfo?.isTaxFreeZone);
  return {
    country,
    countryCode,
    stateFull: a.stateFull || stInfo?.nameEn || a.state,
    isTaxFree,
    taxRate: isTaxFree ? '0.00% (No Sales Tax)' : 'Standard Tax',
    timezone: 'UTC+0',
    timezoneCode: 'UTC'
  };
}

export const OSM_APARTMENTS: RealAddress[] = (osmApartments as OsmApartment[]).map(a => {
  const meta = resolveOsmMeta(a);
  return {
    street: a.street,
    city: a.city,
    state: a.state,
    postcode: a.postcode,
    lat: a.lat,
    lng: a.lng,
    stateFull: meta.stateFull,
    country: meta.country,
    countryCode: meta.countryCode,
    isTaxFree: meta.isTaxFree,
    taxRate: meta.taxRate,
    timezone: meta.timezone,
    timezoneCode: meta.timezoneCode,
    source: 'OpenStreetMap',
    sourceId: a.id,
    sourceBuildingType: a.building || 'apartments'
  };
});

function osmForCountry(code: CountryCode): RealAddress[] {
  return OSM_APARTMENTS.filter(a => a.countryCode === code);
}

function initResidentialSeedList(list: RealAddress[]): RealAddress[] {
  return list.map(addr => ({
    ...addr,
    buildingType: 'residential' as const
  }));
}

export const ADDRESS_MAP: Record<CountryCode, RealAddress[]> = {
  US: initResidentialSeedList([...US_ADDRESSES, ...osmForCountry('US')]),
  GB: initResidentialSeedList([...GB_ADDRESSES, ...osmForCountry('GB')]),
  JP: initResidentialSeedList([...JP_ADDRESSES, ...osmForCountry('JP')]),
  CA: initResidentialSeedList([...CA_ADDRESSES, ...osmForCountry('CA')]),
  AU: initResidentialSeedList([...AU_ADDRESSES, ...osmForCountry('AU')]),
  DE: initResidentialSeedList([...DE_ADDRESSES, ...osmForCountry('DE')]),
  FR: initResidentialSeedList([...FR_ADDRESSES, ...osmForCountry('FR')]),
  HK: initResidentialSeedList([...HK_ADDRESSES, ...osmForCountry('HK')]),
  TW: initResidentialSeedList([...TW_ADDRESSES, ...osmForCountry('TW')]),
  SG: initResidentialSeedList([...SG_ADDRESSES, ...osmForCountry('SG')]),
  KR: initResidentialSeedList([...(EXTENDED_ADDRESSES.KR || []), ...osmForCountry('KR')]),
  CH: initResidentialSeedList([...(EXTENDED_ADDRESSES.CH || []), ...osmForCountry('CH')]),
  LU: initResidentialSeedList([...(EXTENDED_ADDRESSES.LU || []), ...osmForCountry('LU')]),
  IE: initResidentialSeedList([...(EXTENDED_ADDRESSES.IE || []), ...osmForCountry('IE')]),
  IT: initResidentialSeedList([...(EXTENDED_ADDRESSES.IT || []), ...osmForCountry('IT')]),
  ES: initResidentialSeedList([...(EXTENDED_ADDRESSES.ES || []), ...osmForCountry('ES')]),
  NL: initResidentialSeedList([...(EXTENDED_ADDRESSES.NL || []), ...osmForCountry('NL')]),
  MY: initResidentialSeedList([...(EXTENDED_ADDRESSES.MY || []), ...osmForCountry('MY')]),
  TH: initResidentialSeedList([...(EXTENDED_ADDRESSES.TH || []), ...osmForCountry('TH')]),
  VN: initResidentialSeedList([...(EXTENDED_ADDRESSES.VN || []), ...osmForCountry('VN')]),
  PH: initResidentialSeedList([...(EXTENDED_ADDRESSES.PH || []), ...osmForCountry('PH')])
};

export function getAddressCoverageStats() {
  const sourcedByCountry = new Map<CountryCode, number>();
  const sourcedRegions = new Set<string>();
  for (const a of OSM_APARTMENTS) {
    sourcedByCountry.set(a.countryCode, (sourcedByCountry.get(a.countryCode) || 0) + 1);
    sourcedRegions.add(`${a.countryCode}:${a.state}`);
  }
  const landmarkCount = Object.values(ADDRESS_MAP).reduce((sum, list) => sum + list.length, 0);
  const derivationCapacity = STREET_DERIVATION_RULES.reduce((sum, r) => sum + Math.abs(r.maxNumber - r.minNumber) + 1, 0);
  return {
    sourcedCount: OSM_APARTMENTS.length,
    sourcedCountries: [...sourcedByCountry.keys()],
    sourcedCountryCounts: Object.fromEntries(sourcedByCountry),
    sourcedRegionCount: sourcedRegions.size,
    landmarkCount,
    derivationRulesCount: STREET_DERIVATION_RULES.length,
    derivationCapacity,
    residentialCount: RESIDENTIAL_ADDRESSES.length,
    totalCountries: COUNTRIES.length
  };
}

function enrichLandmarkAddress(raw: RealAddress): RealAddress {
  const fromOsm = raw.source === 'OpenStreetMap';
  return {
    ...raw,
    addressMode: 'landmark',
    buildingType: 'residential',
    derivationMeta: {
      mode: 'landmark',
      modeLabelZh: fromOsm ? '方案C·OSM 住宅建筑门牌' : '方案C·都会公寓',
      modeLabelEn: fromOsm ? 'Scheme C (OSM Residential Building)' : 'Scheme C (Residential Condos)',
      ruleSummary: fromOsm ? 'OpenStreetMap 公开住宅建筑门牌，未验证住户或 AVS' : '已有公寓地址样本，未验证住户或 AVS',
      ruleSummaryEn: fromOsm ? 'Public OSM residential building address; no unit, delivery or AVS verification' : undefined,
      interpolated: false,
      buildingType: 'residential',
      avsTier: fromOsm ? 'Residential Building (AVS unverified)' : 'Residential Condominium / Apartment'
    }
  };
}

export function getSourcedAddress(
  countryCode: CountryCode,
  stateCode?: string,
  city?: string,
  isTaxFreeOnly?: boolean
): RealAddress {
  let candidates = OSM_APARTMENTS.filter(a => a.countryCode === countryCode &&
    (!stateCode || matchesState(a.state, a.stateFull, stateCode)) &&
    (!city || a.city.toLowerCase() === city.trim().toLowerCase()));
  if (isTaxFreeOnly) {
    candidates = candidates.filter(a => a.isTaxFree);
  }
  if (candidates.length === 0) {
    throw new Error(`No sourced address for ${countryCode}${stateCode ? `/${stateCode}` : ''}${city ? `/${city}` : ''}${isTaxFreeOnly ? ' in a tax-free region' : ''}`);
  }
  const raw = candidates[Math.floor(Math.random() * candidates.length)];
  return {
    ...raw,
    addressMode: 'sourced',
    buildingType: 'residential',
    derivationMeta: {
      mode: 'sourced',
      modeLabelZh: 'OpenStreetMap 可核对建筑门牌',
      modeLabelEn: 'OpenStreetMap Sourced Building Address',
      ruleSummary: '公开建筑门牌，房号、收件与 AVS 未核验',
      ruleSummaryEn: 'Public building address; unit, delivery and AVS unverified',
      interpolated: false,
      buildingType: 'residential',
      avsTier: 'Residential Building (AVS unverified)'
    }
  };
}

export function getRandomAddress(
  countryCode: CountryCode,
  stateCode?: string,
  isTaxFreeOnly?: boolean,
  mode: AddressMode = 'residential'
): RealAddress {
  if (mode === 'sourced') {
    return getSourcedAddress(countryCode, stateCode, undefined, isTaxFreeOnly);
  }

  // Mode 2: 方案A (真实街道门牌合法区间衍生)
  if (mode === 'derivation') {
    const rule = getDerivationRule(countryCode, stateCode, isTaxFreeOnly);
    if (rule) {
      return deriveStreetAddress(rule);
    }
    throw new Error(`No matching address for ${countryCode}${stateCode ? `/${stateCode}` : ''} in ${mode} mode`);
  }

  // Mode 3: 方案B (全球真实住宅/居民独栋地址库)
  if (mode === 'residential') {
    const resAddr = getResidentialAddress(countryCode, stateCode, isTaxFreeOnly);
    if (resAddr) {
      return resAddr;
    }
    throw new Error(`No matching address for ${countryCode}${stateCode ? `/${stateCode}` : ''} in ${mode} mode`);
  }

  // Mode 1: 方案C (建筑地址样本)
  let candidates = ADDRESS_MAP[countryCode] || [];

  if (stateCode) {
    candidates = candidates.filter(a => matchesState(a.state, a.stateFull, stateCode));
  }

  if (isTaxFreeOnly) {
    candidates = candidates.filter(a => a.isTaxFree);
  }

  if (candidates.length === 0) {
    throw new Error(`No matching address for ${countryCode}${stateCode ? `/${stateCode}` : ''} in ${mode} mode`);
  }

  const index = Math.floor(Math.random() * candidates.length);
  return enrichLandmarkAddress(candidates[index]);
}

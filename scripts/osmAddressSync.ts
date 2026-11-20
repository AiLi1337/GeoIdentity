import { US_ADDRESSES } from '../src/data/addresses/us';
import { HK_ADDRESSES } from '../src/data/addresses/hk';
import { TW_ADDRESSES } from '../src/data/addresses/tw';
import {
  COUNTRIES_WITH_OPTIONAL_MISSING_OSM_POSTCODE,
  isValidCountryPostcode,
  type OsmPostcodeStatus
} from '../src/data/addresses/postcodeRules';
import type { CountryCode } from '../src/types/identity';

export interface OsmApartment {
  id: string;
  building: 'apartments' | 'residential' | 'house' | 'detached' | 'semidetached_house' | 'terrace';
  street: string;
  city: string;
  state: string;
  postcode: string;
  postcodeStatus?: OsmPostcodeStatus;
  countryCode?: CountryCode;
  lat: number;
  lng: number;
}

export interface OsmSyncArea {
  countryCode: CountryCode;
  city: string;
  state: string;
  bbox: string;
  buildings: string;
  requireCityTag?: boolean;
  postcodeFormat?: 'us5' | 'tw3to6' | 'none' | 'country';
  allowMissingPostcode?: boolean;
}

interface OsmElement {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

type OsmFetcher = (url: string, options: { headers: Record<string, string>; signal: AbortSignal }) => Promise<{
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
}>;

export class OsmQueryUnavailableError extends Error {
  constructor(city: string, cause: unknown) {
    super(`OpenStreetMap query for ${city} failed`, { cause });
  }
}

export const AREAS: readonly OsmSyncArea[] = [
  { countryCode: 'US', city: 'Wilmington', state: 'DE', bbox: '39.73,-75.57,39.76,-75.53', buildings: 'apartments', requireCityTag: true, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Portland', state: 'OR', bbox: '45.515,-122.69,45.53,-122.675', buildings: 'apartments', requireCityTag: true, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Portland', state: 'OR', bbox: '45.512,-122.694,45.514,-122.692', buildings: 'apartments|residential|house|detached|semidetached_house|terrace', requireCityTag: true, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Seattle', state: 'WA', bbox: '47.616,-122.326,47.625,-122.314', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Brooklyn', state: 'NY', bbox: '40.669,-73.984,40.678,-73.972', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Chicago', state: 'IL', bbox: '41.919,-87.656,41.929,-87.644', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'San Francisco', state: 'CA', bbox: '37.758,-122.438,37.767,-122.426', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Manchester', state: 'NH', bbox: '42.989,-71.460,43.000,-71.446', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'us5' },
  { countryCode: 'HK', city: '中西區 (Central & Western)', state: 'CW', bbox: '22.280,114.136,22.288,114.152', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'none' },
  { countryCode: 'HK', city: '灣仔區 (Wan Chai)', state: 'WC', bbox: '22.270,114.171,22.280,114.185', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'none' },
  { countryCode: 'HK', city: '油尖旺區 (Yau Tsim Mong)', state: 'YTM', bbox: '22.312,114.162,22.323,114.174', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'none' },
  { countryCode: 'HK', city: '九龍城區 (Kowloon City)', state: 'KC', bbox: '22.318,114.176,22.331,114.189', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'none' },
  { countryCode: 'HK', city: '沙田區 (Sha Tin)', state: 'ST', bbox: '22.377,114.185,22.390,114.202', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'none' },
  { countryCode: 'TW', city: "大安區 (Da'an Dist)", state: 'TPE', bbox: '25.024,121.531,25.031,121.539', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'TW', city: '信義區 (Xinyi Dist)', state: 'TPE', bbox: '25.029,121.564,25.039,121.578', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'TW', city: '中山區 (Zhongshan Dist)', state: 'TPE', bbox: '25.055,121.529,25.061,121.538', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'TW', city: '板橋區 (Banqiao Dist)', state: 'NTP', bbox: '25.006,121.458,25.017,121.472', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'TW', city: '西屯區 (Xitun Dist)', state: 'TXG', bbox: '24.154,120.635,24.167,120.652', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'TW', city: '鼓山區 (Gushan Dist)', state: 'KHH', bbox: '22.654,120.286,22.668,120.302', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'TW', city: '東區 (East Dist)', state: 'HSZ', bbox: '24.782,121.008,24.794,121.022', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' },
  { countryCode: 'NZ', city: 'Auckland', state: 'AUK', bbox: '-36.860,174.737,-36.852,174.745', buildings: 'apartments|residential|house|detached', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'NZ', city: 'Wellington', state: 'WGN', bbox: '-41.298,174.781,-41.290,174.789', buildings: 'apartments|residential|house|detached', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'PT', city: 'Lisboa', state: '11', bbox: '38.715,-9.167,38.723,-9.159', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'PT', city: 'Porto', state: '13', bbox: '41.153,-8.621,41.161,-8.613', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'BE', city: 'Bruxelles', state: 'BRU', bbox: '50.829,4.354,50.837,4.362', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'BE', city: 'Antwerpen', state: 'VAN', bbox: '51.192,4.427,51.200,4.435', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'AT', city: 'Wien', state: '9', bbox: '48.198,16.345,48.206,16.353', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'AT', city: 'Graz', state: '6', bbox: '47.057,15.442,47.065,15.450', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'SE', city: 'Stockholm', state: 'AB', bbox: '59.311,18.066,59.319,18.074', buildings: 'apartments|residential|house|detached', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'SE', city: 'Goteborg', state: 'O', bbox: '57.690,11.918,57.698,11.926', buildings: 'apartments|residential|house|detached', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: true },
  { countryCode: 'FI', city: 'Helsinki', state: '18', bbox: '60.179,24.946,60.187,24.954', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'FI', city: 'Tampere', state: '11', bbox: '61.496,23.790,61.504,23.798', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'PL', city: 'Warszawa', state: '14', bbox: '52.220,21.011,52.228,21.019', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'PL', city: 'Krakow', state: '12', bbox: '50.048,19.941,50.056,19.949', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'HU', city: 'Budapest', state: 'BU', bbox: '47.513,19.049,47.521,19.057', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false },
  { countryCode: 'HU', city: 'Szeged', state: 'CS', bbox: '46.248,20.145,46.256,20.153', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'country', allowMissingPostcode: false }
];

const key = (countryCode: string, street: string, city: string, state: string) =>
  `${countryCode}|${street}|${city}|${state}`.toLowerCase().replace(/\s+/g, '');

const STREET_BEFORE_HN_COUNTRIES = new Set<CountryCode>(['PT', 'BE', 'AT', 'SE', 'FI', 'PL', 'HU']);

function validSyncPostcode(postcode: string, area: OsmSyncArea): { valid: boolean; postcodeStatus?: OsmPostcodeStatus } {
  if (area.postcodeFormat === 'none') return { valid: true };
  if (!postcode) {
    if (area.allowMissingPostcode && COUNTRIES_WITH_OPTIONAL_MISSING_OSM_POSTCODE.has(area.countryCode)) {
      return { valid: true, postcodeStatus: 'missing-original-tag' };
    }
    return { valid: false };
  }
  return { valid: isValidCountryPostcode(area.countryCode, postcode, { source: 'OpenStreetMap' }) };
}

function hasNonResidentialUse(tags: Record<string, string> | undefined): boolean {
  return /^(hotel|motel|hostel|guest_house)$/.test(tags?.tourism?.trim().toLowerCase() || '') ||
    tags?.amenity?.trim().toLowerCase() === 'bank';
}

// The OSM object must itself be tagged as a residential building with a street address.
export async function syncOsmApartments(
  fetcher: OsmFetcher = fetch,
  areas: readonly OsmSyncArea[] = AREAS
): Promise<OsmApartment[]> {
  const result: OsmApartment[] = [];
  const ids = new Set<string>();
  const addresses = new Set([
    ...US_ADDRESSES.map(a => key('US', a.street, a.city, a.state)),
    ...HK_ADDRESSES.map(a => key('HK', a.street, a.city, a.state)),
    ...TW_ADDRESSES.map(a => key('TW', a.street, a.city, a.state))
  ]);

  for (const area of areas) {
    const beforeArea = result.length;
    const buildingFilter = area.buildings === 'apartments'
      ? '["building"="apartments"]'
      : `["building"~"^(${area.buildings})$"]`;
    const postcodeFilter = (area.postcodeFormat === 'none' || area.allowMissingPostcode) ? '' : '["addr:postcode"]';
    const query = `[out:json][timeout:25];way${buildingFilter}["addr:housenumber"]["addr:street"]${postcodeFilter}(${area.bbox});out center 80;`;
    let body: { elements?: OsmElement[] } | undefined;
    let lastError: unknown;
    for (const endpoint of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
      let response: Awaited<ReturnType<OsmFetcher>>;
      try {
        response = await fetcher(`${endpoint}?data=${encodeURIComponent(query)}`, {
          headers: { 'User-Agent': 'GeoIdentity/1.0 (https://github.com/AiLi1337/GeoIdentity)' },
          signal: AbortSignal.timeout(45000)
        });
      } catch (error) {
        lastError = error;
        continue;
      }
      if (!response.ok) {
        if (response.status && response.status >= 400 && response.status < 500 && response.status !== 406 && response.status !== 429) {
          throw new Error(`OpenStreetMap query for ${area.city} returned HTTP ${response.status}`);
        }
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      body = await response.json() as { elements?: OsmElement[] };
      break;
    }
    if (!body) throw new OsmQueryUnavailableError(area.city, lastError);
    if (!Array.isArray(body?.elements)) throw new Error(`Invalid OpenStreetMap response for ${area.city}`);

    for (const element of body.elements) {
      const tags = element.tags;
      const lat = element.lat ?? element.center?.lat;
      const lng = element.lon ?? element.center?.lon;
      const rawCity = tags?.['addr:city']?.trim() || '';
      const rawPostcode = tags?.['addr:postcode']?.trim() || '';
      const postcodeCheck = validSyncPostcode(rawPostcode, area);
      if (!area.buildings.split('|').includes(tags?.building || '') ||
          hasNonResidentialUse(tags) ||
          (tags?.['addr:country'] && tags['addr:country'].trim().toUpperCase() !== area.countryCode) ||
          (area.requireCityTag !== false && rawCity.toLowerCase() !== area.city.toLowerCase()) ||
          (area.countryCode === 'US' && tags?.['addr:state'] && tags['addr:state'].trim().toUpperCase() !== area.state) ||
          !/^\d+[A-Za-z]?$/.test(tags?.['addr:housenumber']?.trim() || '') ||
          !tags?.['addr:street']?.trim() ||
          !postcodeCheck.valid ||
          !Number.isFinite(lat) || !Number.isFinite(lng) ||
          Math.abs(lat!) > 90 || Math.abs(lng!) > 180 ||
          element.type !== 'way' || !element.center ||
          !Number.isSafeInteger(element.id)) continue;

      const id = `${element.type}/${element.id}`;
      const hn = tags['addr:housenumber'].trim();
      const st = tags['addr:street'].trim();
      const street = area.countryCode === 'TW'
        ? `${st}${hn}號`
        : STREET_BEFORE_HN_COUNTRIES.has(area.countryCode)
          ? `${st} ${hn}`
          : `${hn} ${st}`;
      const city = (area.countryCode === 'HK' || area.countryCode === 'TW') ? area.city : (rawCity || area.city);
      const postcode = area.postcodeFormat === 'none' ? '' : rawPostcode;
      const addressKey = key(area.countryCode, street, city, area.state);
      if (ids.has(id) || addresses.has(addressKey)) continue;
      ids.add(id);
      addresses.add(addressKey);
      const entry: OsmApartment = {
        id,
        building: tags.building as OsmApartment['building'],
        street,
        city,
        state: area.state,
        postcode,
        ...(postcodeCheck.postcodeStatus ? { postcodeStatus: postcodeCheck.postcodeStatus } : {}),
        lat: lat!,
        lng: lng!
      };
      if (area.countryCode !== 'US') entry.countryCode = area.countryCode;
      else if (area.state !== 'DE' && area.state !== 'OR') entry.countryCode = 'US';
      result.push(entry);
    }
    if (result.length === beforeArea) throw new Error(`OpenStreetMap returned no valid residential building addresses for ${area.city}`);
  }
  return result.sort((a, b) => a.id.localeCompare(b.id));
}

export async function syncOsmApartmentsIfAvailable(
  fetcher?: OsmFetcher,
  areas?: readonly OsmSyncArea[]
): Promise<OsmApartment[] | null> {
  try {
    return await syncOsmApartments(fetcher, areas);
  } catch (error) {
    if (error instanceof OsmQueryUnavailableError) return null;
    throw error;
  }
}

export function assertOsmSnapshotContinuity(
  previous: Pick<OsmApartment, 'id' | 'state' | 'countryCode'>[],
  next: Pick<OsmApartment, 'id' | 'state' | 'countryCode'>[]
): void {
  const nextByScope = new Map<string, Set<string>>();
  const seenIds = new Set<string>();
  const previousIdScopes = new Map<string, string>();
  for (const address of previous) {
    previousIdScopes.set(address.id, `${address.countryCode || 'US'}:${address.state}`);
  }
  for (const address of next) {
    if (seenIds.has(address.id)) {
      throw new Error(`Duplicate OpenStreetMap object ${address.id} in the next snapshot`);
    }
    seenIds.add(address.id);
    const scope = `${address.countryCode || 'US'}:${address.state}`;
    const previousScope = previousIdScopes.get(address.id);
    if (previousScope && previousScope !== scope) {
      throw new Error(`OpenStreetMap object ${address.id} moved from ${previousScope} to ${scope}`);
    }
    const ids = nextByScope.get(scope) || new Set<string>();
    ids.add(address.id);
    nextByScope.set(scope, ids);
  }

  const previousByScope = new Map<string, string[]>();
  for (const address of previous) {
    const scope = `${address.countryCode || 'US'}:${address.state}`;
    const ids = previousByScope.get(scope) || [];
    ids.push(address.id);
    previousByScope.set(scope, ids);
  }
  for (const [scope, ids] of previousByScope) {
    const scopedNextIds = nextByScope.get(scope) || new Set<string>();
    const retained = ids.filter(id => scopedNextIds.has(id)).length;
    const maxMissing = Math.floor(ids.length * 0.1);
    if (ids.length - retained > maxMissing) {
      throw new Error(`Incomplete OpenStreetMap snapshot for ${scope}: retained ${retained}/${ids.length} existing buildings`);
    }
  }
}

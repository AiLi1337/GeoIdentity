import assert from 'node:assert/strict';
import { getAddressCoverageStats, getRandomAddress, getSourcedAddress, OSM_APARTMENTS } from '../src/data/addresses';
import { isValidCountryPostcode } from '../src/data/addresses/postcodeRules';
import { HK_ADDRESSES } from '../src/data/addresses/hk';
import { TW_ADDRESSES } from '../src/data/addresses/tw';
import { JP_ADDRESSES } from '../src/data/addresses/jp';
import { FR_ADDRESSES } from '../src/data/addresses/fr';
import { generateIdentity, generateIdentityFromAddress } from '../src/services/identityGenerator';
import { buildCSVContent } from '../src/services/exportService';
import { formatTaxRate } from '../src/services/taxRateDisplay';
import type { CountryCode } from '../src/types/identity';
import metadata from '../src/data/addresses/metadata.json';

assert(OSM_APARTMENTS.length > 0, 'the sourced address pool must not be empty');
const detached = OSM_APARTMENTS.find(a => a.sourceBuildingType === 'detached');
assert(detached?.sourceId, 'a mapped detached home must have an OSM object link');
assert.equal(detached.addressMode, undefined);
const detachedIdentity = generateIdentityFromAddress(getSourcedAddress('US', 'OR', 'Portland'));
assert.equal(detachedIdentity.address.source, 'OpenStreetMap');
assert.equal(detachedIdentity.address.addressLine2, undefined);
const mappedHomeIdentity = generateIdentityFromAddress(detached);
assert.equal(mappedHomeIdentity.address.sourceBuildingType, 'detached');
assert.equal(mappedHomeIdentity.address.addressLine2, undefined, 'a mapped house does not invent a unit');
assert.match(buildCSVContent([mappedHomeIdentity]), /OSM-sourced building/);
assert(buildCSVContent([mappedHomeIdentity]).includes(`https://www.openstreetmap.org/${detached.sourceId}`));
assert.equal(OSM_APARTMENTS.length, new Set(OSM_APARTMENTS.map(a => a.sourceId)).size, 'OSM objects are unique');
for (let i = 0; i < 100; i++) {
  const identity = generateIdentity('US', { addressMode: 'sourced', state: 'DE' });
  assert.equal(identity.address.countryCode, 'US');
  assert.equal(identity.address.state, 'DE');
  assert.equal(identity.address.source, 'OpenStreetMap');
  assert.match(identity.address.sourceId || '', /^(node|way|relation)\/\d+$/);
  assert.equal(identity.address.addressLine2, undefined, 'a building address has no proven unit');
}
assert(OSM_APARTMENTS.length >= 242, `expected >= 242 sourced records across 11 countries, got ${OSM_APARTMENTS.length}`);
assert.equal(OSM_APARTMENTS.length, metadata.stats.totalOsmBuildings, 'published source count matches the actual pool');
const coverageStats = getAddressCoverageStats();
assert.equal(coverageStats.totalCountries, 29, 'global country catalog covers 29 countries');
assert.equal(coverageStats.derivationCountriesCount, 21, 'Scheme A derivation remains accurately reported as 21 countries');
assert.equal(coverageStats.residentialCountriesCount, 21, 'Scheme B residential remains accurately reported as 21 countries');
assert.equal(coverageStats.landmarkCountriesCount, 29, 'Scheme C landmarks cover all 29 countries');
assert.equal(coverageStats.sourcedCountriesCount, 11, 'OSM sourced pool covers 11 countries');

for (const newCountry of ['NZ', 'PT', 'BE', 'AT', 'SE', 'FI', 'PL', 'HU'] as CountryCode[]) {
  const list = OSM_APARTMENTS.filter(a => a.countryCode === newCountry);
  assert.equal(list.length, 8, `${newCountry} has 8 sourced OSM entries`);
  assert.equal(new Set(list.map(a => a.state)).size, 2, `${newCountry} sourced entries cover 2 regions`);
  for (const addr of list) {
    assert(isValidCountryPostcode(newCountry, addr.postcode, { source: 'OpenStreetMap', postcodeStatus: addr.postcodeStatus }),
      `${newCountry} ${addr.sourceId} postcode "${addr.postcode}" satisfies country validation`);
    assert(addr.timezone && addr.timezone !== 'UTC+0', `${newCountry} ${addr.sourceId} has local IANA timezone`);
  }
}
assert.equal(
  OSM_APARTMENTS.filter(a => a.postcodeStatus === 'missing-original-tag').length,
  22,
  'all 22 verified missing-postcode OSM buildings preserve empty string with explicit evidence'
);
assert.equal(
  OSM_APARTMENTS.find(a => a.sourceId === 'way/135082963')?.postcode,
  '414 57',
  'Swedish postcode keeps original spacing'
);
assert.equal(
  OSM_APARTMENTS.find(a => a.sourceId === 'way/512528656')?.city,
  'Berchem',
  'Belgian Antwerpen-area building preserves original addr:city "Berchem"'
);
assert.equal(OSM_APARTMENTS.filter(a => a.countryCode === 'US').length, 137, 'US retains all 137 OSM records');
const hkSourced = OSM_APARTMENTS.filter(a => a.countryCode === 'HK');
assert.equal(hkSourced.length, 19, `HK sourced addresses retain 19 entries, got ${hkSourced.length}`);
assert(new Set(hkSourced.map(a => a.state)).size >= 3, 'HK sourced addresses cover >= 3 districts');
assert(hkSourced.every(a => a.postcode === ''), 'HK sourced addresses keep empty postcode');
const twSourced = OSM_APARTMENTS.filter(a => a.countryCode === 'TW');
assert.equal(twSourced.length, 22, `TW sourced addresses retain 22 entries, got ${twSourced.length}`);
assert(new Set(twSourced.map(a => a.state)).size >= 3, 'TW sourced addresses cover >= 3 cities');
assert(twSourced.every(a => /^\d{3}(\d{2,3})?$/.test(a.postcode)), 'TW sourced addresses have valid Taiwan postcodes');
assert(HK_ADDRESSES.every(a => a.timezone?.startsWith('Asia/Hong_Kong')), 'HK landmarks carry a usable IANA timezone');
assert(TW_ADDRESSES.every(a => a.timezone?.startsWith('Asia/Taipei')), 'TW landmarks carry a usable IANA timezone');
assert(JP_ADDRESSES.every(a => a.timezone?.startsWith('Asia/Tokyo')), 'JP landmarks carry a usable IANA timezone');
assert(FR_ADDRESSES.every(a => a.timezone?.startsWith('Europe/Paris')), 'FR landmarks carry a usable IANA timezone');

// Sourced tax-free filter must filter valid candidates before sampling (never random-fail on US when DE/OR/NH exist)
for (let i = 0; i < 100; i++) {
  const tfUs = generateIdentity('US', { addressMode: 'sourced', isTaxFreeOnly: true });
  assert.equal(tfUs.address.countryCode, 'US');
  assert.equal(tfUs.address.isTaxFree, true);
  assert(['DE', 'OR', 'NH', 'MT', 'AK'].includes(tfUs.address.state), `Unexpected non-tax-free US state ${tfUs.address.state}`);
  const hkId = generateIdentity('HK', { addressMode: 'sourced', isTaxFreeOnly: true });
  assert.equal(hkId.address.countryCode, 'HK');
  assert.equal(hkId.address.postcode, '');
  assert.equal(hkId.address.addressLine2, undefined);
}
assert.throws(() => getRandomAddress('TW', undefined, true, 'sourced'), /no sourced address/i);
assert.throws(() => getRandomAddress('US', 'WA', true, 'sourced'), /no sourced address/i);
assert.throws(() => getRandomAddress('US', 'WY', false, 'sourced'), /no sourced address/i);
assert.throws(() => getRandomAddress('GB', undefined, false, 'sourced'), /no sourced address/i);
for (const mode of ['derivation', 'residential', 'landmark'] as const) {
  assert.throws(
    () => getRandomAddress('CH', 'BE', true, mode),
    /no matching address/i,
    `CH/BE tax-free filtering is consistent in ${mode} mode`
  );
}
assert.equal(formatTaxRate('5.00% GST (No Provincial Sales Tax)', true, 'zh'), '5.00% GST (No Provincial Sales Tax)');
assert.equal(formatTaxRate('0.00% (No Sales Tax)', true, 'en'), '0.00% (No Sales Tax)');
assert.equal(formatTaxRate('Tax Favored Zone', true, 'en'), 'Tax Favored Zone');
assert.throws(() => getSourcedAddress('US', 'DE', 'Denver'), /no sourced address/i);
assert.equal(getSourcedAddress('US', 'Oregon', 'Portland').state, 'OR');
assert(OSM_APARTMENTS.every(a => !!a.sourceId && !!a.sourceBuildingType && Number.isFinite(a.lat) && Number.isFinite(a.lng)));
assert.throws(() => generateIdentity('US', { addressMode: 'sourced', state: 'MT' }), /no sourced address/i);
console.log('Sourced addresses never fall back, filter tax-free before sampling, and cover US/HK/TW cleanly');

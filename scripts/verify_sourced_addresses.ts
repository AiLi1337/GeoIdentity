import assert from 'node:assert/strict';
import { getRandomAddress, getSourcedAddress, OSM_APARTMENTS } from '../src/data/addresses';
import { HK_ADDRESSES } from '../src/data/addresses/hk';
import { TW_ADDRESSES } from '../src/data/addresses/tw';
import { JP_ADDRESSES } from '../src/data/addresses/jp';
import { FR_ADDRESSES } from '../src/data/addresses/fr';
import { generateIdentity, generateIdentityFromAddress } from '../src/services/identityGenerator';
import { buildCSVContent } from '../src/services/exportService';
import { formatTaxRate } from '../src/services/taxRateDisplay';

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
assert.equal(OSM_APARTMENTS.length, 180, `expected exactly 180 OSM apartments, got ${OSM_APARTMENTS.length}`);
const usSourcedCities = new Set(OSM_APARTMENTS.filter(a => a.countryCode === 'US').map(a => a.city));
assert(usSourcedCities.size >= 5, `US sourced addresses should cover >= 5 cities, got ${usSourcedCities.size}`);
const hkSourced = OSM_APARTMENTS.filter(a => a.countryCode === 'HK');
assert(hkSourced.length >= 12, `HK sourced addresses should have >= 12 entries, got ${hkSourced.length}`);
assert(new Set(hkSourced.map(a => a.state)).size >= 3, 'HK sourced addresses cover >= 3 districts');
assert(hkSourced.every(a => a.postcode === ''), 'HK sourced addresses keep empty postcode');
const twSourced = OSM_APARTMENTS.filter(a => a.countryCode === 'TW');
assert(twSourced.length >= 12, `TW sourced addresses should have >= 12 entries, got ${twSourced.length}`);
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

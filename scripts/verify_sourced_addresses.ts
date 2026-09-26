import assert from 'node:assert/strict';
import { getRandomAddress, getSourcedAddress, OSM_APARTMENTS } from '../src/data/addresses';
import { generateIdentity, generateIdentityFromAddress } from '../src/services/identityGenerator';
import { buildCSVContent } from '../src/services/exportService';

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
assert.throws(() => getRandomAddress('US', 'CA', false, 'sourced'), /no sourced address/i);
assert.throws(() => getRandomAddress('GB', undefined, false, 'sourced'), /no sourced address/i);
assert.throws(() => getSourcedAddress('US', 'DE', 'Denver'), /no sourced address/i);
assert.equal(getSourcedAddress('US', 'Oregon', 'Portland').state, 'OR');
assert(OSM_APARTMENTS.every(a => !!a.sourceId && !!a.sourceBuildingType));
assert.throws(() => generateIdentity('US', { addressMode: 'sourced', state: 'NH' }), /no sourced address/i);
console.log('Sourced addresses never fall back or invent apartment units');

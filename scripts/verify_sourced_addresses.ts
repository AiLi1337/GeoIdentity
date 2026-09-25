import assert from 'node:assert/strict';
import { getRandomAddress, getSourcedAddress, OSM_APARTMENTS } from '../src/data/addresses';
import { generateIdentity } from '../src/services/identityGenerator';

assert(OSM_APARTMENTS.length > 0, 'the sourced address pool must not be empty');
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
assert.throws(() => generateIdentity('US', { addressMode: 'sourced', state: 'NH' }), /no sourced address/i);
console.log('Sourced addresses never fall back or invent apartment units');

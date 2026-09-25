import assert from 'node:assert/strict';
import { syncOsmApartments } from './osmAddressSync';

const valid = (id: number, tags: Record<string, string> = {}) => ({
  type: 'way', id, center: { lat: 39.7448, lon: -75.5477 },
  tags: {
    building: 'apartments', 'addr:housenumber': '902',
    'addr:street': 'North Market Street', 'addr:city': 'Wilmington',
    'addr:state': 'DE', 'addr:postcode': '19801', ...tags
  }
});

const fetchOk = async (url: string) => ({
  ok: true,
  json: async () => ({ elements: url.includes('45.515')
    ? [valid(6, { 'addr:city': 'Portland', 'addr:state': 'OR', 'addr:postcode': '97205' })]
    : [valid(2), valid(2), valid(3, { 'addr:postcode': '' }),
      valid(4, { building: 'retail' }), valid(5, { 'addr:city': 'Elsewhere' })] })
});

const result = await syncOsmApartments(fetchOk);
assert.equal(result.length, 2);
assert.equal(result[0].id, 'way/2');
assert.equal(result[0].street, '902 North Market Street');
assert.equal(result[1].state, 'OR');
assert.deepEqual(await syncOsmApartments(fetchOk), result);
assert.deepEqual(await syncOsmApartments(async (url) => {
  if (url.startsWith('https://overpass-api.de/')) return { ok: false, status: 504, json: async () => ({}) };
  return fetchOk(url);
}), result, 'a transient 504 should use the second Overpass endpoint');

await assert.rejects(
  syncOsmApartments(async () => { throw new Error('network unavailable'); }),
  /OpenStreetMap query for Wilmington failed/
);
await assert.rejects(syncOsmApartments(async () => ({ ok: true, json: async () => ({ elements: [] }) })),
  /no valid apartment addresses for Wilmington/);
console.log('Address sync validation, deduplication and failure handling passed');

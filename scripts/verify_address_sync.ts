import assert from 'node:assert/strict';
import { syncOsmApartments, syncOsmApartmentsIfAvailable } from './osmAddressSync';

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
  json: async () => ({ elements: url.includes('45.512')
    ? [valid(7, { building: 'detached', 'addr:housenumber': '1441', 'addr:street': 'Southwest College Street', 'addr:city': 'Portland', 'addr:state': '', 'addr:postcode': '97201' }),
      valid(8, { building: 'retail', 'addr:city': 'Portland', 'addr:postcode': '97201' }),
      valid(9, { building: 'house', 'addr:city': 'Portland', 'addr:state': 'WA', 'addr:postcode': '97201' }),
      { ...valid(10, { building: 'house', 'addr:city': 'Portland', 'addr:state': 'OR', 'addr:postcode': '97201' }), type: 'node' }]
    : url.includes('45.515')
    ? [valid(6, { 'addr:city': 'Portland', 'addr:state': 'OR', 'addr:postcode': '97205' })]
    : [valid(2), valid(2), valid(3, { 'addr:postcode': '' }),
      valid(4, { building: 'retail' }), valid(5, { 'addr:city': 'Elsewhere' })] })
});

const result = await syncOsmApartments(fetchOk);
assert.equal(result.length, 3);
assert.equal(result[0].id, 'way/2');
assert.equal(result[0].street, '902 North Market Street');
assert.equal(result[1].state, 'OR');
assert.equal(result[2].building, 'detached');
assert.equal(result[2].state, 'OR');
assert.equal(result[2].street, '1441 Southwest College Street');
assert.deepEqual(await syncOsmApartments(fetchOk), result);
assert.deepEqual(await syncOsmApartments(async (url) => {
  if (url.startsWith('https://overpass-api.de/')) return { ok: false, status: 504, json: async () => ({}) };
  return fetchOk(url);
}), result, 'a transient 504 should use the second Overpass endpoint');

await assert.rejects(
  syncOsmApartments(async () => { throw new Error('network unavailable'); }),
  /OpenStreetMap query for Wilmington failed/
);
assert.equal(await syncOsmApartmentsIfAvailable(async () => { throw new Error('network unavailable'); }), null,
  'an upstream outage skips this run without publishing a new snapshot');
assert.equal(await syncOsmApartmentsIfAvailable(async () => ({ ok: false, status: 406, json: async () => ({}) })), null,
  'HTTP 406 from both endpoints preserves the existing snapshot');
await assert.rejects(syncOsmApartmentsIfAvailable(async () => ({ ok: true, json: async () => ({ elements: 'invalid' }) })),
  /Invalid OpenStreetMap response/, 'malformed data must still fail the run');
await assert.rejects(syncOsmApartmentsIfAvailable(async () => ({ ok: true, json: async () => { throw new SyntaxError('invalid JSON'); } })),
  /invalid JSON/, 'an HTTP 200 with malformed JSON must fail the run');
await assert.rejects(syncOsmApartmentsIfAvailable(async () => ({ ok: false, status: 400, json: async () => ({}) })),
  /HTTP 400/, 'a malformed query must fail rather than silently skip');
await assert.rejects(syncOsmApartments(async () => ({ ok: true, json: async () => ({ elements: [] }) })),
  /no valid residential building addresses for Wilmington/);
console.log('Address sync validation, deduplication and failure handling passed');

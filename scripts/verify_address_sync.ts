import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { AREAS, syncOsmApartments, syncOsmApartmentsIfAvailable, assertOsmSnapshotContinuity, type OsmSyncArea } from './osmAddressSync';
import { buildRefreshedMetadata, computeAddressMetadataStats, writeJsonFilesAtomically } from './dailySyncAddresses';
import currentSnapshot from '../src/data/addresses/osmApartments.json';
import currentMetadata from '../src/data/addresses/metadata.json';

const valid = (id: number, tags: Record<string, string> = {}, lat = 39.7448, lon = -75.5477) => ({
  type: 'way', id, center: { lat, lon },
  tags: {
    building: 'apartments', 'addr:housenumber': '902',
    'addr:street': 'North Market Street', 'addr:city': 'Wilmington',
    'addr:state': 'DE', 'addr:postcode': '19801', ...tags
  }
});

const testAreas: OsmSyncArea[] = [
  { countryCode: 'US', city: 'Wilmington', state: 'DE', bbox: '39.73,-75.57,39.76,-75.53', buildings: 'apartments', requireCityTag: true, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Portland', state: 'OR', bbox: '45.515,-122.69,45.53,-122.675', buildings: 'apartments', requireCityTag: true, postcodeFormat: 'us5' },
  { countryCode: 'US', city: 'Portland', state: 'OR', bbox: '45.512,-122.694,45.514,-122.692', buildings: 'apartments|residential|house|detached|semidetached_house|terrace', requireCityTag: true, postcodeFormat: 'us5' },
  { countryCode: 'HK', city: '中西區 (Central & Western)', state: 'CW', bbox: '22.280,114.136,22.288,114.152', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'none' },
  { countryCode: 'TW', city: "大安區 (Da'an Dist)", state: 'TPE', bbox: '25.024,121.531,25.031,121.539', buildings: 'apartments|residential|house', requireCityTag: false, postcodeFormat: 'tw3to6' }
];

const fetchOk = async (url: string) => ({
  ok: true,
  json: async () => ({ elements: url.includes('45.512')
    ? [valid(7, { building: 'detached', 'addr:housenumber': '1441', 'addr:street': 'Southwest College Street', 'addr:city': 'Portland', 'addr:state': '', 'addr:postcode': '97201' }, 45.513, -122.693),
      valid(8, { building: 'retail', 'addr:city': 'Portland', 'addr:postcode': '97201' }, 45.513, -122.693),
      valid(9, { building: 'house', 'addr:city': 'Portland', 'addr:state': 'WA', 'addr:postcode': '97201' }, 45.513, -122.693),
      { ...valid(10, { building: 'house', 'addr:city': 'Portland', 'addr:state': 'OR', 'addr:postcode': '97201' }, 45.513, -122.693), type: 'node' }]
    : url.includes('45.515')
    ? [valid(6, { 'addr:city': 'Portland', 'addr:state': 'OR', 'addr:postcode': '97205' }, 45.522, -122.685)]
    : url.includes('22.280')
    ? [valid(11, { building: 'apartments', 'addr:housenumber': '88', 'addr:street': '般咸道 Bonham Road', 'addr:city': '', 'addr:state': '', 'addr:postcode': '' }, 22.284, 114.140)]
    : url.includes('25.024')
    ? [valid(12, { building: 'house', 'addr:housenumber': '4', 'addr:street': '和平東路二段76巷', 'addr:city': '臺北市', 'addr:state': '', 'addr:postcode': '106' }, 25.025, 121.535)]
    : [valid(2), valid(2), valid(3, { 'addr:postcode': '' }),
      valid(4, { building: 'retail' }), valid(5, { 'addr:city': 'Elsewhere' })] })
});

const result = await syncOsmApartments(fetchOk, testAreas);
assert.throws(() => assertOsmSnapshotContinuity(currentSnapshot as any, result),
  /Incomplete OpenStreetMap snapshot/, 'a partial but valid Overpass response cannot replace the current snapshot');
const oregonSnapshot = currentSnapshot.filter((address: any) => (address.countryCode || 'US') === 'US' && address.state === 'OR');
const oregonWithOneRetired = currentSnapshot.filter((address: any) => address.id !== oregonSnapshot[0].id);
assert.doesNotThrow(() => assertOsmSnapshotContinuity(currentSnapshot as any, oregonWithOneRetired as any),
  'a large scope may tolerate one retired OSM object');

// Country+state continuity isolation: dropping HK:CW > 10% fails even if US is intact
const hkCwSnapshot = currentSnapshot.filter((a: any) => a.countryCode === 'HK' && a.state === 'CW');
assert(hkCwSnapshot.length >= 2, 'HK:CW exists in current snapshot');
const withoutHkCw = currentSnapshot.filter((a: any) => !(a.countryCode === 'HK' && a.state === 'CW'));
assert.throws(() => assertOsmSnapshotContinuity(currentSnapshot as any, withoutHkCw as any),
  /Incomplete OpenStreetMap snapshot for HK:CW/, 'continuity guard isolates country+state for non-US regions');

const hszSnapshot = currentSnapshot.filter((address: any) => address.countryCode === 'TW' && address.state === 'HSZ');
const withoutOneHsz = currentSnapshot.filter((address: any) => address.id !== hszSnapshot[0].id);
assert.throws(() => assertOsmSnapshotContinuity(currentSnapshot as any, withoutOneHsz as any),
  /Incomplete OpenStreetMap snapshot for TW:HSZ/, 'a small scope cannot silently lose half its records');

const excessiveLoss = Math.floor(oregonSnapshot.length * 0.1) + 1;
const snapshotWithLoss = currentSnapshot.filter((address: any) => !((address.countryCode || 'US') === 'US' && address.state === 'OR')).concat(
  oregonSnapshot.slice(excessiveLoss)
);
assert.throws(() => assertOsmSnapshotContinuity(currentSnapshot as any, snapshotWithLoss as any),
  /Incomplete OpenStreetMap snapshot for US:OR/, 'a drop above ten percent in one country+state requires review');

// Moving more than the allowed loss into another scope must still fail. A global retained-ID set would miss this.
const migratedIds = new Set(oregonSnapshot.slice(0, excessiveLoss).map((address: any) => address.id));
const crossScopeMigration = currentSnapshot.map((address: any) =>
  migratedIds.has(address.id) ? { ...address, state: 'WA' } : address
);
assert.throws(() => assertOsmSnapshotContinuity(currentSnapshot as any, crossScopeMigration as any),
  /moved from US:OR to US:WA/, 'continuity rejects objects migrating between country+state scopes');

assert.equal(result.length, 5);
assert.equal(result[0].id, 'way/11');
assert.equal(result[0].countryCode, 'HK');
assert.equal(result[0].postcode, '');
assert.equal(result[1].id, 'way/12');
assert.equal(result[1].countryCode, 'TW');
assert.equal(result[1].street, '和平東路二段76巷4號');
assert.equal(result[2].id, 'way/2');
assert.equal(result[2].street, '902 North Market Street');
assert.equal(result[3].state, 'OR');
assert.equal(result[4].building, 'detached');
assert.equal(result[4].state, 'OR');
assert.equal(result[4].street, '1441 Southwest College Street');

// Overpass bbox filtering selects ways that intersect an area; a building center can remain just outside it.
const outsideCenterArea: OsmSyncArea[] = [
  { countryCode: 'US', city: 'Wilmington', state: 'DE', bbox: '39.73,-75.57,39.76,-75.53', buildings: 'apartments', requireCityTag: true, postcodeFormat: 'us5' }
];
const outsideCenterResult = await syncOsmApartments(
  async () => ({ ok: true, json: async () => ({ elements: [valid(21, {}, 39.729, -75.571)] }) }),
  outsideCenterArea
);
assert.equal(outsideCenterResult.length, 1, 'a way chosen by bbox may have an outside center and must not be discarded');
const invalidCoordinateResult = await syncOsmApartments(
  async () => ({ ok: true, json: async () => ({ elements: [valid(22), valid(23, {}, 91, 200)] }) }),
  outsideCenterArea
);
assert.equal(invalidCoordinateResult.length, 1, 'global coordinates outside latitude/longitude bounds are rejected');
assert.equal(invalidCoordinateResult[0].id, 'way/22');

assert.deepEqual(await syncOsmApartments(fetchOk, testAreas), result);
assert.deepEqual(await syncOsmApartments(async (url, opts) => {
  if (url.startsWith('https://overpass-api.de/')) return { ok: false, status: 504, json: async () => ({}) };
  return fetchOk(url);
}, testAreas), result, 'a transient 504 should use the second Overpass endpoint');

// A stale published log is reconciled instead of preserving contradictory metadata.
const prevMeta = {
  version: 'v2026.09.26.22',
  lastUpdated: '2026-09-26T02:44:08.191Z',
  lastUpdatedFormattedZh: '2026-09-26 02:44:08 (UTC)',
  lastUpdatedFormattedEn: '2026-09-26 02:44:08 UTC',
  syncLogs: [{ timestamp: '2026-09-26T02:44:08.191Z', action: 'DAILY_AUTOMATED_SYNC', status: 'SUCCESS', message: 'kept' }]
};
const offlineRefreshed = buildRefreshedMetadata(currentSnapshot as any, prevMeta, false, new Date('2026-11-20T00:00:00Z'));
assert.equal(offlineRefreshed.lastUpdated, prevMeta.lastUpdated, 'statistics reconciliation must preserve the actual OSM fetch timestamp');
assert.equal(offlineRefreshed.metadataUpdatedAt, '2026-11-20T00:00:00.000Z', 'metadata reconciliation has its own timestamp');
assert.equal(offlineRefreshed.stats.totalOsmBuildings, currentSnapshot.length);
assert.equal(offlineRefreshed.syncLogs.at(-1)?.action, 'SNAPSHOT_STATISTICS_RECONCILED');
assert.match(offlineRefreshed.syncLogs.at(-1)?.message || '', /OpenStreetMap 快照/);

const alreadyReconciled = buildRefreshedMetadata(currentSnapshot as any, offlineRefreshed, false, new Date('2026-11-21T00:00:00Z'));
assert.equal(alreadyReconciled.lastUpdated, offlineRefreshed.lastUpdated, 'consistent metadata keeps its last publication timestamp');
assert.equal(alreadyReconciled.metadataUpdatedAt, offlineRefreshed.metadataUpdatedAt, 'consistent metadata keeps its reconciliation timestamp');
assert.equal(alreadyReconciled.syncLogs.length, offlineRefreshed.syncLogs.length, 'consistent metadata does not append duplicate logs');

const currentReconciled = buildRefreshedMetadata(currentSnapshot as any, currentMetadata as any, false, new Date('2026-11-20T03:00:00Z'));
assert.equal(currentReconciled.stats.totalOsmBuildings, 180);
assert.equal(currentReconciled.lastUpdated, currentMetadata.lastUpdated, 'published metadata preserves the OSM fetch timestamp');
assert.equal(currentReconciled.metadataUpdatedAt, currentMetadata.metadataUpdatedAt, 'published metadata preserves its reconciliation timestamp');
assert.match(currentReconciled.syncLogs.at(-1)?.message || '', /OpenStreetMap[^。]*180 处/);

const invalidHkSnapshot = [
  ...(currentSnapshot as any[]),
  { ...(currentSnapshot as any[]).find(address => address.countryCode === 'HK'), id: 'way/999077', postcode: '999077' }
];
assert.equal(computeAddressMetadataStats(invalidHkSnapshot as any).coordinateErrors, 1,
  'Hong Kong must keep an empty postcode rather than exempting any non-empty value');
assert.throws(
  () => buildRefreshedMetadata(invalidHkSnapshot as any, currentMetadata as any, false, new Date('2026-11-20T03:00:00Z')),
  /invalid address records/,
  'metadata publication refuses a Hong Kong fake postcode'
);

const scopes = new Set(AREAS.map(area => `${area.countryCode}:${area.state}`));
for (const address of currentSnapshot as any[]) {
  const scope = `${address.countryCode || 'US'}:${address.state}`;
  assert(scopes.has(scope), `snapshot scope ${scope} has an AREA configuration`);
  const matchingArea = AREAS.find(area =>
    `${area.countryCode}:${area.state}` === scope &&
    area.buildings.split('|').includes(address.building)
  );
  assert(matchingArea,
    `snapshot building type ${address.building} remains accepted for ${scope}`);
}

// A two-file publication must roll both files back if the second rename fails.
const atomicDir = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-address-atomic-'));
const firstPath = path.join(atomicDir, 'first.json');
const secondPath = path.join(atomicDir, 'second.json');
try {
  fs.writeFileSync(firstPath, '{"old":1}\n');
  fs.writeFileSync(secondPath, '{"old":2}\n');
  writeJsonFilesAtomically([
    { path: firstPath, contents: '{"new":1}\n' },
    { path: secondPath, contents: '{"new":2}\n' }
  ]);
  assert.equal(fs.readFileSync(firstPath, 'utf-8'), '{"new":1}\n');
  assert.equal(fs.readFileSync(secondPath, 'utf-8'), '{"new":2}\n');

  fs.writeFileSync(firstPath, '{"stable":1}\n');
  fs.writeFileSync(secondPath, '{"stable":2}\n');
  let renameCalls = 0;
  assert.throws(() => writeJsonFilesAtomically([
    { path: firstPath, contents: '{"changed":1}\n' },
    { path: secondPath, contents: '{"changed":2}\n' }
  ], {
    existsSync: fs.existsSync,
    writeFileSync: (filePath, contents) => fs.writeFileSync(filePath, contents, 'utf-8'),
    copyFileSync: fs.copyFileSync,
    renameSync: (sourcePath, targetPath) => {
      renameCalls++;
      if (renameCalls === 2) throw new Error('simulated second-file failure');
      fs.renameSync(sourcePath, targetPath);
    },
    unlinkSync: fs.unlinkSync
  }), /simulated second-file failure/);
  assert.equal(fs.readFileSync(firstPath, 'utf-8'), '{"stable":1}\n', 'failed pair publication restores the first file');
  assert.equal(fs.readFileSync(secondPath, 'utf-8'), '{"stable":2}\n', 'failed pair publication leaves the second file unchanged');
  assert.equal(fs.readdirSync(atomicDir).filter(name => /\.(tmp|bak)-/.test(name)).length, 0);
} finally {
  fs.rmSync(atomicDir, { recursive: true, force: true });
}

await assert.rejects(
  syncOsmApartments(async () => { throw new Error('network unavailable'); }, testAreas),
  /OpenStreetMap query for Wilmington failed/
);
assert.equal(await syncOsmApartmentsIfAvailable(async () => { throw new Error('network unavailable'); }, testAreas), null,
  'an upstream outage skips this run without publishing a new snapshot');
assert.equal(await syncOsmApartmentsIfAvailable(async () => ({ ok: false, status: 406, json: async () => ({}) }), testAreas), null,
  'HTTP 406 from both endpoints preserves the existing snapshot');
await assert.rejects(syncOsmApartmentsIfAvailable(async () => ({ ok: true, json: async () => ({ elements: 'invalid' }) }), testAreas),
  /Invalid OpenStreetMap response/, 'malformed data must still fail the run');
await assert.rejects(syncOsmApartmentsIfAvailable(async () => ({ ok: true, json: async () => { throw new SyntaxError('invalid JSON'); } }), testAreas),
  /invalid JSON/, 'an HTTP 200 with malformed JSON must fail the run');
await assert.rejects(syncOsmApartmentsIfAvailable(async () => ({ ok: false, status: 400, json: async () => ({}) }), testAreas),
  /HTTP 400/, 'a malformed query must fail rather than silently skip');
await assert.rejects(syncOsmApartments(async () => ({ ok: true, json: async () => ({ elements: [] }) }), testAreas),
  /no valid residential building addresses for Wilmington/);
console.log('Address sync validation, multi-country continuity, offline metadata refresh, and failure handling passed');

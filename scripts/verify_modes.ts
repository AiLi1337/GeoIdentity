import { generateIdentity, generateIdentityFromAddress } from '../src/services/identityGenerator';
import { getRandomAddress, ADDRESS_MAP } from '../src/data/addresses';
import { STREET_DERIVATION_RULES, deriveStreetAddress, getDerivationRule, matchesState } from '../src/data/addresses/schemes/derivationRules';
import { RESIDENTIAL_ADDRESSES, getResidentialAddress } from '../src/data/addresses/schemes/residentialAddresses';
import { formatFullIdentityText, buildCSVContent } from '../src/services/exportService';
import { resolveAddressFromIp } from '../src/services/ipAddressResolver';
import type { CountryCode, AddressMode } from '../src/types/identity';
import type { IpConsensusResult } from '../src/types/ip';

let assertionCount = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`❌ Assertion #${assertionCount} failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ [${assertionCount}] ${message}`);
}

console.log('================================================================');
console.log('🚀 Starting Comprehensive Rigorous Address Mode Verification Suite');
console.log('================================================================');

// -----------------------------------------------------------------------------
// 1. Mode 1: Scheme C (Residential Condominiums & Apartments) Verification
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Mode 1: Scheme C (Residential Condominiums & Apartments) ---');
const landmarkUS = generateIdentity('US', { gender: 'random', ageRange: 'random', addressMode: 'landmark' });
assert(landmarkUS.address.addressMode === 'landmark', 'Landmark (Scheme C) address mode is set');
assert(landmarkUS.address.buildingType === 'residential', 'Landmark (Scheme C) building type is strictly residential');
assert(!!landmarkUS.address.street, 'Landmark address has street');
assert(!!landmarkUS.address.lat && !!landmarkUS.address.lng, 'Landmark address has lat/lng');
assert(landmarkUS.address.derivationMeta?.avsTier === 'Residential Condominium / Apartment', 'Landmark AVS tier is Residential Condominium / Apartment');

// -----------------------------------------------------------------------------
// 2. Mode 2: Scheme A (Street Derivation) Verification
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Mode 2: Scheme A (Street House Number Range Derivation) ---');
const supportedDerivationCountries: CountryCode[] = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'HK', 'TW', 'SG'];
for (const cc of supportedDerivationCountries) {
  const derived = generateIdentity(cc, { gender: 'random', ageRange: 'random', addressMode: 'derivation' });
  assert(derived.address.addressMode === 'derivation', `Country ${cc} derived addressMode is derivation`);
  assert(derived.address.derivationMeta?.interpolated === true, `Country ${cc} is marked as interpolated`);
  assert(!!derived.address.derivationMeta?.houseNumberRange, `Country ${cc} has houseNumberRange`);
  assert(typeof derived.address.lat === 'number' && !isNaN(derived.address.lat), `Country ${cc} has valid numeric lat: ${derived.address.lat}`);
  assert(typeof derived.address.lng === 'number' && !isNaN(derived.address.lng), `Country ${cc} has valid numeric lng: ${derived.address.lng}`);
  console.log(`   [${cc}] ${derived.address.street}, ${derived.address.city}, ${derived.address.state} (${derived.address.lat}, ${derived.address.lng}) -> Range: ${derived.address.derivationMeta?.houseNumberRange}`);
}

// Check mathematical boundary for all STREET_DERIVATION_RULES
console.log('\n--- Testing all street rules mathematical bounds and interpolation ---');
for (const rule of STREET_DERIVATION_RULES) {
  for (let trial = 0; trial < 10; trial++) {
    const addr = deriveStreetAddress(rule);
    assert(!!addr.street, `Rule ${rule.id} generated street: ${addr.street}`);
    const minLat = Math.min(rule.startCoord.lat, rule.endCoord.lat) - 0.01;
    const maxLat = Math.max(rule.startCoord.lat, rule.endCoord.lat) + 0.01;
    const minLng = Math.min(rule.startCoord.lng, rule.endCoord.lng) - 0.01;
    const maxLng = Math.max(rule.startCoord.lng, rule.endCoord.lng) + 0.01;
    assert(addr.lat >= minLat && addr.lat <= maxLat, `Rule ${rule.id} trial ${trial} lat ${addr.lat} is within corridor [${minLat}, ${maxLat}]`);
    assert(addr.lng >= minLng && addr.lng <= maxLng, `Rule ${rule.id} trial ${trial} lng ${addr.lng} is within corridor [${minLng}, ${maxLng}]`);
  }
}

// Delaware tightened corridor regression tests
console.log('\n--- Testing Delaware Tightened Inhabited Corridors (DE Limestone, Kirkwood, Pulaski) ---');
const limestoneRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-de-limestone')!;
assert(limestoneRule.minNumber === 4200, 'Limestone minNumber tightened to 4200');
assert(limestoneRule.maxNumber === 5350, 'Limestone maxNumber tightened to 5350');
assert(limestoneRule.startCoord.lat === 39.7379 && limestoneRule.startCoord.lng === -75.6859, 'Limestone startCoord matches Arundel residential area');
assert(limestoneRule.endCoord.lat === 39.7455 && limestoneRule.endCoord.lng === -75.6980, 'Limestone endCoord matches Pike Creek shopping center');

for (let i = 0; i < 20; i++) {
  const addr = deriveStreetAddress(limestoneRule);
  const match = addr.street.match(/^(\d+)/);
  const num = match ? parseInt(match[1], 10) : 0;
  assert(num >= 4200 && num <= 5350, `Limestone address #${num} is within [4200, 5350] (never #2706 in uninhabited ravine)`);
  assert(addr.lat >= 39.735 && addr.lat <= 39.748, `Limestone address #${num} lat ${addr.lat} is on inhabited corridor`);
  assert(addr.lng >= -75.700 && addr.lng <= -75.684, `Limestone address #${num} lng ${addr.lng} is on inhabited corridor`);
}

const kirkwoodRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-de-kirkwood')!;
assert(kirkwoodRule.minNumber === 3600, 'Kirkwood minNumber tightened to 3600');
assert(kirkwoodRule.maxNumber === 4800, 'Kirkwood maxNumber tightened to 4800');
assert(kirkwoodRule.startCoord.lat === 39.7345 && kirkwoodRule.startCoord.lng === -75.6359, 'Kirkwood startCoord matches #3600 Wilmington Prices Corner');
assert(kirkwoodRule.endCoord.lat === 39.7219 && kirkwoodRule.endCoord.lng === -75.6615, 'Kirkwood endCoord matches #4800 Wilmington Meadowood');

for (let i = 0; i < 20; i++) {
  const addr = deriveStreetAddress(kirkwoodRule);
  const match = addr.street.match(/^(\d+)/);
  const num = match ? parseInt(match[1], 10) : 0;
  assert(num >= 3600 && num <= 4800, `Kirkwood address #${num} is within [3600, 4800]`);
  assert(addr.lat >= 39.720 && addr.lat <= 39.736, `Kirkwood address #${num} lat ${addr.lat} is in Wilmington 19808 corridor`);
  assert(addr.lng >= -75.664 && addr.lng <= -75.634, `Kirkwood address #${num} lng ${addr.lng} is in Wilmington 19808 corridor`);
}

const pulaskiRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-de-pulaski')!;
assert(pulaskiRule.minNumber === 1100, 'Pulaski minNumber tightened to 1100');
assert(pulaskiRule.maxNumber === 1700, 'Pulaski maxNumber tightened to 1700');
assert(pulaskiRule.startCoord.lat === 39.6328 && pulaskiRule.startCoord.lng === -75.6598, 'Pulaski startCoord matches #1100 Bear Wawa');
assert(pulaskiRule.endCoord.lat === 39.6186 && pulaskiRule.endCoord.lng === -75.6946, 'Pulaski endCoord matches #1700 Bear');

for (let i = 0; i < 20; i++) {
  const addr = deriveStreetAddress(pulaskiRule);
  const match = addr.street.match(/^(\d+)/);
  const num = match ? parseInt(match[1], 10) : 0;
  assert(num >= 1100 && num <= 1700, `Pulaski address #${num} is within [1100, 1700]`);
  assert(addr.lat >= 39.617 && addr.lat <= 39.635, `Pulaski address #${num} lat ${addr.lat} is in Bear 19701 corridor`);
  assert(addr.lng >= -75.696 && addr.lng <= -75.658, `Pulaski address #${num} lng ${addr.lng} is in Bear 19701 corridor`);
}

const capitolRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-de-capitol')!;
assert(capitolRule.minNumber === 200, 'Capitol minNumber is 200');
assert(capitolRule.maxNumber === 1950, 'Capitol maxNumber tightened to 1950 (eliminating phantom numbers beyond Newark)');
assert(capitolRule.startCoord.lat === 39.6893 && capitolRule.startCoord.lng === -75.7328, 'Capitol startCoord matches #200 Newark');
assert(capitolRule.endCoord.lat === 39.7009 && capitolRule.endCoord.lng === -75.6996, 'Capitol endCoord matches #1950 Newark');

for (let i = 0; i < 20; i++) {
  const addr = deriveStreetAddress(capitolRule);
  const match = addr.street.match(/^(\d+)/);
  const num = match ? parseInt(match[1], 10) : 0;
  assert(num >= 200 && num <= 1950, `Capitol address #${num} is within [200, 1950]`);
  assert(addr.lat >= 39.688 && addr.lat <= 39.703, `Capitol address #${num} lat ${addr.lat} is in Newark 19711 corridor`);
  assert(addr.lng >= -75.735 && addr.lng <= -75.698, `Capitol address #${num} lng ${addr.lng} is in Newark 19711 corridor`);
}

const concordRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-de-concord')!;
assert(concordRule.minNumber === 1800, 'Concord minNumber is 1800');
assert(concordRule.maxNumber === 4750, 'Concord maxNumber tightened to 4750 (never crossing into Pennsylvania)');
assert(concordRule.startCoord.lat === 39.7856 && concordRule.startCoord.lng === -75.5461, 'Concord startCoord matches #1800 Wilmington');
assert(concordRule.endCoord.lat === 39.8255 && concordRule.endCoord.lng === -75.5450, 'Concord endCoord matches #4750 Wilmington Concord Mall');

// -----------------------------------------------------------------------------
// 3. Mode 3: Scheme B (Residential Pool) Verification
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing Mode 3: Scheme B (Residential Pool) ---');
for (const cc of ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'HK', 'TW', 'SG'] as CountryCode[]) {
  const res = generateIdentity(cc, { gender: 'random', ageRange: 'random', addressMode: 'residential' });
  assert(res.address.addressMode === 'residential', `Residential mode set for ${cc}`);
  assert(res.address.buildingType === 'residential', `Residential buildingType is residential for ${cc}`);
  assert(!!res.address.derivationMeta?.avsTier, `AVS tier present for ${cc}: ${res.address.derivationMeta?.avsTier}`);
  console.log(`   [${cc}] ${res.address.street}, ${res.address.city} -> AVS: ${res.address.derivationMeta?.avsTier}`);
}

// -----------------------------------------------------------------------------
// 4. State Preservation & Coverage Tests for Scheme A and Scheme B
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing State Isolation & Preservation Across Key Regions ---');
const stateTestCases: { country: CountryCode; state: string; expectedStateMatches: string[] }[] = [
  // US states
  { country: 'US', state: 'IL', expectedStateMatches: ['IL', 'ILLINOIS'] },
  { country: 'US', state: 'NJ', expectedStateMatches: ['NJ', 'NEW JERSEY'] },
  { country: 'US', state: 'NV', expectedStateMatches: ['NV', 'NEVADA'] },
  { country: 'US', state: 'MA', expectedStateMatches: ['MA', 'MASSACHUSETTS'] },
  { country: 'US', state: 'CA', expectedStateMatches: ['CA', 'CALIFORNIA'] },
  { country: 'US', state: 'NY', expectedStateMatches: ['NY', 'NEW YORK'] },
  { country: 'US', state: 'TX', expectedStateMatches: ['TX', 'TEXAS'] },
  { country: 'US', state: 'DE', expectedStateMatches: ['DE', 'DELAWARE'] },
  { country: 'US', state: 'OR', expectedStateMatches: ['OR', 'OREGON'] },
  // Canada provinces
  { country: 'CA', state: 'QC', expectedStateMatches: ['QC', 'QUEBEC', 'QUÉBEC'] },
  { country: 'CA', state: 'AB', expectedStateMatches: ['AB', 'ALBERTA'] },
  { country: 'CA', state: 'ON', expectedStateMatches: ['ON', 'ONTARIO'] },
  { country: 'CA', state: 'BC', expectedStateMatches: ['BC', 'BRITISH COLUMBIA'] },
  // UK regions
  { country: 'GB', state: 'ENG-LDN', expectedStateMatches: ['ENG-LDN', 'LONDON'] },
  { country: 'GB', state: 'ENG-MAN', expectedStateMatches: ['ENG-MAN', 'MANCHESTER', 'GREATER MANCHESTER'] },
  { country: 'GB', state: 'ENG-BIR', expectedStateMatches: ['ENG-BIR', 'BIRMINGHAM', 'WEST MIDLANDS'] },
  // Germany states
  { country: 'DE', state: 'BE', expectedStateMatches: ['BE', 'BERLIN'] },
  { country: 'DE', state: 'NW', expectedStateMatches: ['NW', 'NORDRHEIN-WESTFALEN', 'NORTH RHINE-WESTPHALIA'] },
  // Japan prefectures
  { country: 'JP', state: '27', expectedStateMatches: ['27', 'OSAKA', '大阪府'] },
  { country: 'JP', state: '13', expectedStateMatches: ['13', 'TOKYO', '東京都'] },
  // Hong Kong & Taiwan & Singapore
  { country: 'HK', state: 'ST', expectedStateMatches: ['ST', 'SHA TIN', 'NT'] },
  { country: 'HK', state: 'CW', expectedStateMatches: ['CW', 'CENTRAL', 'CENTRAL AND WESTERN'] },
  { country: 'TW', state: 'TPE', expectedStateMatches: ['TPE', 'TAIPEI', '台北市'] },
  { country: 'TW', state: 'NTP', expectedStateMatches: ['NTP', 'NEW TAIPEI', '新北市'] },
  { country: 'SG', state: 'CR', expectedStateMatches: ['CR', 'CENTRAL REGION', 'CENTRAL'] }
];

for (const tc of stateTestCases) {
  // Test Scheme A (derivation)
  const a = generateIdentity(tc.country, { state: tc.state, addressMode: 'derivation' });
  const actualA = (a.address.state || '').toUpperCase();
  const actualAFull = (a.address.stateFull || '').toUpperCase();
  const matchA = tc.expectedStateMatches.some(e => actualA.includes(e) || actualAFull.includes(e));
  assert(matchA, `Scheme A for ${tc.country} state ${tc.state} matched expected (${actualA} / ${actualAFull})`);

  // Test Scheme B (residential)
  const b = generateIdentity(tc.country, { state: tc.state, addressMode: 'residential' });
  const actualB = (b.address.state || '').toUpperCase();
  const actualBFull = (b.address.stateFull || '').toUpperCase();
  const matchB = tc.expectedStateMatches.some(e => actualB.includes(e) || actualBFull.includes(e));
  assert(matchB, `Scheme B for ${tc.country} state ${tc.state} matched expected (${actualB} / ${actualBFull})`);
}

// -----------------------------------------------------------------------------
// 5. Strict Query Isolation (No Cross-State Leakage)
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Strict Query Isolation (Negative Tests) ---');
// When requesting a non-existent state, the raw query functions MUST return null, NOT random other states
const ruleBogus = getDerivationRule('US', 'NON_EXISTENT_STATE_XYZ');
assert(ruleBogus === null, 'getDerivationRule returns null for non-existent US state');

const resBogus = getResidentialAddress('US', 'NON_EXISTENT_STATE_XYZ');
assert(resBogus === null, 'getResidentialAddress returns null for non-existent US state');

// When requesting a country without derivation rules, must return null
const nonExistentRule = getDerivationRule('BR' as CountryCode);
assert(nonExistentRule === null, 'getDerivationRule returns null for country without derivation rules (BR)');

const nonExistentCountryRes = getResidentialAddress('BR' as CountryCode);
assert(nonExistentCountryRes === null, 'getResidentialAddress returns null for country without residential pool (BR)');

// -----------------------------------------------------------------------------
// 6. Tax-Free States Verification across all 3 modes
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Tax-Free States across all 3 modes ---');
for (const mode of ['landmark', 'derivation', 'residential'] as AddressMode[]) {
  const de = generateIdentity('US', { gender: 'random', ageRange: 'random', state: 'DE', addressMode: mode });
  assert(de.address.isTaxFree === true, `DE in mode ${mode} is marked tax-free`);
  assert(de.address.state.toUpperCase() === 'DE', `DE state matches in mode ${mode}`);

  const or = generateIdentity('US', { gender: 'random', ageRange: 'random', state: 'OR', addressMode: mode });
  assert(or.address.isTaxFree === true, `OR in mode ${mode} is marked tax-free`);
  assert(or.address.state.toUpperCase() === 'OR', `OR state matches in mode ${mode}`);
}

// -----------------------------------------------------------------------------
// 7. Fallback & Derivation Edge Cases
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Fallback & Derivation edge cases ---');
// Country with derivation rules (KR) requesting derivation mode
const krDerived = generateIdentity('KR', { gender: 'random', ageRange: 'random', addressMode: 'derivation' });
assert(!!krDerived.address.street, 'KR produces valid street address');
assert(!!krDerived.address.city, 'KR has valid city');
assert(krDerived.address.addressMode === 'derivation', 'KR addressMode is derivation');

// Rare state filter in Scheme A that doesn't have custom corridor
const wyDerived = generateIdentity('US', { gender: 'random', ageRange: 'random', state: 'WY', addressMode: 'derivation' });
assert(!!wyDerived.address.street, 'WY fallback produces valid address without throwing');

// -----------------------------------------------------------------------------
// 8. Batch Generation Simulation Verification
// -----------------------------------------------------------------------------
console.log('\n--- 8. Testing Batch Generation Simulation ---');
// Test batch generation with state filter and derivation mode
const batchCount = 15;
const ilBatch = Array.from({ length: batchCount }, () =>
  generateIdentity('US', { state: 'IL', addressMode: 'derivation' })
);
for (let i = 0; i < batchCount; i++) {
  assert(ilBatch[i].address.state === 'IL', `Batch item ${i} state is strictly preserved as IL`);
  assert(ilBatch[i].address.addressMode === 'derivation', `Batch item ${i} addressMode is derivation`);
}

// Test batch generation with state filter and residential mode
const qcBatch = Array.from({ length: batchCount }, () =>
  generateIdentity('CA', { state: 'QC', addressMode: 'residential' })
);
for (let i = 0; i < batchCount; i++) {
  assert(qcBatch[i].address.state === 'QC', `Batch item ${i} state is strictly preserved as QC`);
  assert(qcBatch[i].address.addressMode === 'residential', `Batch item ${i} addressMode is residential`);
  assert(qcBatch[i].address.buildingType === 'residential', `Batch item ${i} buildingType is residential`);
}

// -----------------------------------------------------------------------------
// 9. Text & CSV Export Verification
// -----------------------------------------------------------------------------
console.log('\n--- 9. Testing Export Text & CSV contains mode info & formatting ---');
const zhText = formatFullIdentityText(landmarkUS, 'zh');
assert(zhText.includes('地址方案模式：'), 'Chinese text export includes address mode');
assert(zhText.includes('AVS 风控评级：'), 'Chinese text export includes AVS tier');

const enText = formatFullIdentityText(landmarkUS, 'en');
assert(enText.includes('Address Scheme Mode:'), 'English text export includes address mode');
assert(enText.includes('AVS Verification Tier:'), 'English text export includes AVS tier');

// Verify Residential single family export does not contain dirty line 2
const sampleRes = generateIdentity('US', { state: 'DE', addressMode: 'residential' });
const resZh = formatFullIdentityText(sampleRes, 'zh');
assert(!resZh.includes('Suite 100'), 'Residential export has no spurious Suite 100');

// Verify CSV content builder
const mixedIdentities = [landmarkUS, ilBatch[0], qcBatch[0], sampleRes];
const csvOutput = buildCSVContent(mixedIdentities);
assert(csvOutput.startsWith('\uFEFF'), 'CSV output starts with UTF-8 BOM');
assert(csvOutput.includes('"Address Mode"'), 'CSV header includes Address Mode');
assert(csvOutput.includes('"AVS / Building Tier"'), 'CSV header includes AVS / Building Tier');
assert(csvOutput.includes('Scheme C') || csvOutput.includes('Curated Real Landmark Seeds') || csvOutput.includes('Curated Landmark Seed'), 'CSV row includes Scheme C / Landmark mode label');
assert(csvOutput.includes('Residential Street') || csvOutput.includes('Scheme A: Street Range Derivation') || csvOutput.includes('Scheme A: Street Derivation'), 'CSV row includes Derivation mode label');
assert(csvOutput.includes('Scheme B: Real Residential Address'), 'CSV row includes Residential mode label');
assert(csvOutput.includes('Residential Single Family') || csvOutput.includes('Residential Condominium'), 'CSV row includes Residential AVS Tier');

// -----------------------------------------------------------------------------
// 10. Normal Setback Algorithm Off-Road Verification (True Metric Projection)
// -----------------------------------------------------------------------------
console.log('\n--- 10. Testing Normal Setback Algorithm (True Ground Distance Metric Projection) ---');
for (const rule of STREET_DERIVATION_RULES.slice(0, 15)) {
  const addr = deriveStreetAddress(rule);
  const midLat = (rule.startCoord.lat + rule.endCoord.lat) / 2;
  const cosLat = Math.cos((midLat * Math.PI) / 180);
  const METERS_PER_DEG_LAT = 111139;
  const METERS_PER_DEG_LNG = 111139 * cosLat;

  const dNorth = (rule.endCoord.lat - rule.startCoord.lat) * METERS_PER_DEG_LAT;
  const dEast = (rule.endCoord.lng - rule.startCoord.lng) * METERS_PER_DEG_LNG;
  const lenMeters = Math.hypot(dNorth, dEast) || 1;
  const uNormalNorth = -dEast / lenMeters;
  const uNormalEast = dNorth / lenMeters;

  // Calculate perpendicular distance in true physical meters
  const vNorth = (addr.lat - rule.startCoord.lat) * METERS_PER_DEG_LAT;
  const vEast = (addr.lng - rule.startCoord.lng) * METERS_PER_DEG_LNG;
  const trueGroundPerpMeters = Math.abs(vNorth * uNormalNorth + vEast * uNormalEast);

  assert(trueGroundPerpMeters >= 16.0, `Address along ${rule.streetName} (${rule.city}, lat ${rule.startCoord.lat.toFixed(2)}) has true ground setback of ${trueGroundPerpMeters.toFixed(1)}m from centerline (off-road on building parcel)`);
}

// Special check for high-latitude Anchorage, Alaska (Old Seward Hwy at lat 61.16°)
const akRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-ak-seward');
if (akRule) {
  const akAddr = deriveStreetAddress(akRule);
  const cosAk = Math.cos((akAddr.lat * Math.PI) / 180);
  const dNorth = (akRule.endCoord.lat - akRule.startCoord.lat) * 111139;
  const dEast = (akRule.endCoord.lng - akRule.startCoord.lng) * (111139 * cosAk);
  const lenAk = Math.hypot(dNorth, dEast);
  const uNormN = -dEast / lenAk;
  const uNormE = dNorth / lenAk;
  const vN = (akAddr.lat - akRule.startCoord.lat) * 111139;
  const vE = (akAddr.lng - akRule.startCoord.lng) * (111139 * cosAk);
  const akMeters = Math.abs(vN * uNormN + vE * uNormE);
  assert(akMeters >= 16.0, `High-latitude Alaska Anchorage ground setback is ${akMeters.toFixed(1)}m (>= 16m), fully clearing multi-lane highway asphalt`);
}

// -----------------------------------------------------------------------------
// 11. IP Address Resolution Verification (Strict Residential Priority)
// -----------------------------------------------------------------------------
console.log('\n--- 11. Testing IP Address Resolution (No Monuments / Public Squares / Commercial Skyscraper Traps) ---');
// Test Hong Kong IP (Wan Chai district)
const hkWanChaiConsensus: IpConsensusResult = {
  targetIp: '203.0.113.1',
  winnerCountry: 'Hong Kong',
  winnerCountryCode: 'HK',
  winnerCity: 'Wan Chai',
  winnerRegion: 'Hong Kong Island',
  confidenceRate: 98,
  topCityVoteCount: 5,
  successQueries: 5,
  isp: 'HKBN'
};
const resolvedHkWanChai = resolveAddressFromIp(hkWanChaiConsensus);
assert(resolvedHkWanChai.countryCode === 'HK', 'HK IP resolved to HK country code');
assert(resolvedHkWanChai.buildingType === 'residential', 'HK Wan Chai IP resolved to residential, NOT commercial skyscraper');
assert(!resolvedHkWanChai.street.includes('ICC') && !resolvedHkWanChai.street.includes('办公大楼'), 'HK Wan Chai IP did NOT assign commercial office tower');
console.log(`   [HK Wan Chai]: ${resolvedHkWanChai.street}, ${resolvedHkWanChai.city} -> ${hkWanChaiConsensus.matchedStrategy}`);

// Test Taiwan IP (Taipei Xinyi district)
const twXinyiConsensus: IpConsensusResult = {
  targetIp: '203.0.113.2',
  winnerCountry: 'Taiwan',
  winnerCountryCode: 'TW',
  winnerCity: 'Xinyi',
  winnerRegion: 'Taipei City',
  confidenceRate: 95,
  topCityVoteCount: 4,
  successQueries: 4,
  isp: 'Chunghwa Telecom'
};
const resolvedTwXinyi = resolveAddressFromIp(twXinyiConsensus);
assert(resolvedTwXinyi.countryCode === 'TW', 'TW Xinyi IP resolved to TW country code');
assert(resolvedTwXinyi.buildingType === 'residential', 'TW Xinyi IP resolved to residential, NOT Taipei 101');
assert(!resolvedTwXinyi.street.includes('101大楼'), 'TW Xinyi IP did NOT assign Taipei 101');
console.log(`   [TW Xinyi]: ${resolvedTwXinyi.street}, ${resolvedTwXinyi.city} -> ${twXinyiConsensus.matchedStrategy}`);

// Test Australia IP (Melbourne)
const auMelConsensus: IpConsensusResult = {
  targetIp: '203.0.113.3',
  winnerCountry: 'Australia',
  winnerCountryCode: 'AU',
  winnerCity: 'Melbourne',
  winnerRegion: 'Victoria',
  confidenceRate: 95,
  topCityVoteCount: 4,
  successQueries: 4,
  isp: 'Telstra'
};
const resolvedAuMel = resolveAddressFromIp(auMelConsensus);
assert(resolvedAuMel.countryCode === 'AU', 'AU Melbourne IP resolved to AU country code');
assert(resolvedAuMel.buildingType === 'residential', 'AU Melbourne IP resolved to residential, NOT 120 Collins St');
assert(!resolvedAuMel.street.includes('120 Collins'), 'AU Melbourne IP did NOT assign 120 Collins Street commercial tower');
console.log(`   [AU Melbourne]: ${resolvedAuMel.street}, ${resolvedAuMel.city} -> ${auMelConsensus.matchedStrategy}`);

// -----------------------------------------------------------------------------
// 12. Default Mode Verification (First Visit / Zero-Config Generation)
// -----------------------------------------------------------------------------
console.log('\n--- 12. Testing Default Mode Generation (First Visit Defaults to Residential Home) ---');
const defaultGen = generateIdentity('US');
assert(defaultGen.address.addressMode === 'residential', 'Default address mode is residential');
assert(defaultGen.address.buildingType === 'residential', 'Default building type is residential');
assert(!defaultGen.address.street.includes('Suite 100'), 'Default address has no commercial Suite 100');
console.log(`   [Default US Identity]: ${defaultGen.basic.fullName} living at ${defaultGen.address.street}, ${defaultGen.address.city} (${defaultGen.address.derivationMeta?.modeLabelZh})`);

// -----------------------------------------------------------------------------
// 13. High-Precision Residential Reality & Anti-Pollution Regression Suite
// -----------------------------------------------------------------------------
console.log('\n--- 13. Testing High-Precision Residential Reality & Anti-Pollution Regression ---');

// 13.1 Hong Kong Seaview Crescent & Waterloo Rd district
const hkSeaview = RESIDENTIAL_ADDRESSES.find(a => a.street === '8 Tung Chung Waterfront Rd');
assert(!!hkSeaview, 'Found 8 Tung Chung Waterfront Rd in residential addresses');
assert(hkSeaview!.lat === 22.2926 && hkSeaview!.lng === 113.9434, 'HK Seaview Crescent coords land squarely on residential towers (22.2926, 113.9434), NOT in park lawn');

const hkWaterloo = RESIDENTIAL_ADDRESSES.find(a => a.street === '42 Waterloo Rd');
assert(!!hkWaterloo && hkWaterloo.state === 'YTM', '42 Waterloo Rd district code is correctly YTM (Yau Tsim Mong)');

// 13.2 Rail track, station, and casino corridor bounds
const njWashRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-nj-washington')!;
assert(njWashRule.endCoord.lat <= 40.7300, `us-nj-washington endCoord lat ${njWashRule.endCoord.lat} <= 40.7300 (NOT on Hoboken Terminal rail yard)`);
assert(njWashRule.maxNumber <= 480, `us-nj-washington maxNumber ${njWashRule.maxNumber} <= 480 (terminates south of 18th St)`);

const chZurichRule = STREET_DERIVATION_RULES.find(r => r.id === 'ch-zurich-bahnhofstrasse')!;
assert(chZurichRule.maxNumber <= 80 && chZurichRule.endCoord.lat <= 47.3740, 'ch-zurich-bahnhofstrasse stays clear of Zürich HB railway terminal');

const luLiberteRule = STREET_DERIVATION_RULES.find(r => r.id === 'lu-luxembourg-liberte')!;
assert(luLiberteRule.minNumber >= 40 && luLiberteRule.startCoord.lat >= 49.6035, 'lu-luxembourg-liberte stays clear of Place de la Gare central station square');

const nvVegasRule = STREET_DERIVATION_RULES.find(r => r.id === 'us-nv-lasvegas')!;
assert(nvVegasRule.streetName === 'S Maryland Pkwy', 'us-nv-lasvegas replaced with livable residential street S Maryland Pkwy (never casino resort)');

// 13.3 generateIdentityFromAddress NEVER produces Ste or Suite for residential addresses
for (let i = 0; i < 100; i++) {
  const sampleAddr = RESIDENTIAL_ADDRESSES[i % RESIDENTIAL_ADDRESSES.length];
  const idFromAddr = generateIdentityFromAddress(sampleAddr);
  const l2 = idFromAddr.address.addressLine2 || '';
  assert(!/\bSte\b/i.test(l2) && !/\bSuite\b/i.test(l2), `generateIdentityFromAddress for residential addressLine2 "${l2}" NEVER produces Ste or Suite (sample ${sampleAddr.street})`);
}

// 13.4 getRandomAddress with residential mode NEVER returns commercial buildingType
const allSupportedCountries: CountryCode[] = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'HK', 'TW', 'SG', 'KR', 'MY', 'TH', 'VN', 'PH'];
for (const cc of allSupportedCountries) {
  for (let t = 0; t < 5; t++) {
    const resAddr = getRandomAddress(cc, undefined, false, 'residential');
    assert(resAddr.buildingType === 'residential', `getRandomAddress(${cc}, residential) buildingType is strictly residential`);
    assert(resAddr.addressMode === 'residential', `getRandomAddress(${cc}, residential) addressMode is residential`);
  }
  // Test with invalid state to ensure fallback strictly preserves residential
  const fallbackRes = getRandomAddress(cc, 'BOGUS_STATE_CODE_XYZ', false, 'residential');
  assert(fallbackRes.buildingType === 'residential', `getRandomAddress(${cc}, bogus state, residential) fallback strictly preserves residential (never commercial)`);

  // Test derivation mode with invalid state to ensure fallback never returns commercial landmarks
  const derivFallback = getRandomAddress(cc, 'BOGUS_STATE_CODE_XYZ', false, 'derivation');
  assert(derivFallback.buildingType !== 'commercial', `getRandomAddress(${cc}, bogus state, derivation) never falls back to commercial landmark`);
}

// 13.5 IP Resolution Reality & Residential Livability Guarantee
const sampleIpConsensuses: IpConsensusResult[] = [
  {
    targetIp: '202.64.12.1',
    winnerCountryCode: 'HK',
    winnerCountry: 'Hong Kong',
    winnerRegion: 'Islands',
    winnerCity: 'Hong Kong',
    confidenceRate: 100,
    topCityVoteCount: 4,
    successQueries: 4,
    details: []
  },
  {
    targetIp: '69.143.12.1',
    winnerCountryCode: 'US',
    winnerCountry: 'United States',
    winnerRegion: 'NJ',
    winnerCity: 'Jersey City',
    confidenceRate: 100,
    topCityVoteCount: 4,
    successQueries: 4,
    details: []
  },
  {
    targetIp: '178.197.224.1',
    winnerCountryCode: 'CH',
    winnerCountry: 'Switzerland',
    winnerRegion: 'ZH',
    winnerCity: 'Zürich',
    confidenceRate: 100,
    topCityVoteCount: 4,
    successQueries: 4,
    details: []
  },
  {
    targetIp: '158.64.1.1',
    winnerCountryCode: 'LU',
    winnerCountry: 'Luxembourg',
    winnerRegion: 'LU',
    winnerCity: 'Luxembourg',
    confidenceRate: 100,
    topCityVoteCount: 4,
    successQueries: 4,
    details: []
  },
  {
    targetIp: '70.168.1.1',
    winnerCountryCode: 'US',
    winnerCountry: 'United States',
    winnerRegion: 'NV',
    winnerCity: 'Las Vegas',
    confidenceRate: 100,
    topCityVoteCount: 4,
    successQueries: 4,
    details: []
  },
  {
    targetIp: '99.99.99.99',
    winnerCountryCode: 'US',
    winnerCountry: 'United States',
    winnerRegion: 'UnknownState',
    winnerCity: 'UnknownTown',
    confidenceRate: 50,
    topCityVoteCount: 2,
    successQueries: 4,
    details: []
  },
  {
    targetIp: '1.2.3.4',
    winnerCountryCode: 'ZZ' as any,
    winnerCountry: 'Nowhere',
    winnerRegion: 'Nowhere',
    winnerCity: 'Nowhere',
    confidenceRate: 25,
    topCityVoteCount: 1,
    successQueries: 4,
    details: []
  }
];

for (const consensus of sampleIpConsensuses) {
  for (let i = 0; i < 20; i++) {
    const resolved = resolveAddressFromIp(consensus);
    assert(resolved.buildingType === 'residential', `resolveAddressFromIp(${consensus.winnerCity || consensus.winnerCountryCode}) buildingType is strictly residential`);
    assert(resolved.addressMode === 'residential', `resolveAddressFromIp(${consensus.winnerCity || consensus.winnerCountryCode}) addressMode is residential`);

    // Verify coordinates do not land in known unlivable zones
    if (resolved.street.includes('Tung Chung Waterfront')) {
      assert(resolved.lat === 22.2926 && resolved.lng === 113.9434, 'HK Seaview Crescent lands on residential towers, NOT in park');
    }
    if (resolved.street.includes('Washington Blvd')) {
      assert(resolved.lat <= 40.7300, 'Jersey City Washington Blvd does not enter rail tracks');
    }
    if (resolved.street.includes('Bahnhofstrasse')) {
      assert(resolved.lat <= 47.3740, 'Zurich Bahnhofstrasse does not enter HB terminal');
    }
    if (resolved.street.includes('Avenue de la Liberté')) {
      assert(resolved.lat >= 49.6035, 'Luxembourg Liberte does not enter station square');
    }
    if (resolved.city === 'Las Vegas') {
      assert(!resolved.street.includes('Las Vegas Blvd'), 'Las Vegas never generates casino strip corridor');
    }

    // Full identity generation from resolved IP address
    const identity = generateIdentityFromAddress(resolved);
    const l2 = identity.address.addressLine2 || '';
    assert(!/\bSte\b/i.test(l2) && !/\bSuite\b/i.test(l2), `Identity from IP resolved addressLine2 "${l2}" NEVER contains Ste or Suite`);
    assert(!/\bSte\b/i.test(identity.address.addressLine1 || '') && !/\bSuite\b/i.test(identity.address.addressLine1 || ''), 'Identity from IP resolved addressLine1 NEVER contains Ste or Suite');
    assert(identity.address.buildingType === 'residential', 'Identity from IP resolved buildingType is residential');
  }
}

// 13.6 Sanitization of pre-existing Ste/Suite on residential inputs
const pollutedResidential: any = {
  ...RESIDENTIAL_ADDRESSES[0],
  addressLine2: 'Suite 400'
};
const cleanedId = generateIdentityFromAddress(pollutedResidential);
assert(!/\bSuite\b/i.test(cleanedId.address.addressLine2 || ''), 'generateIdentityFromAddress cleans pre-existing Suite 400 from residential address');

// -----------------------------------------------------------------------------
// 14. Universal 100% Livability & Zero-Commercial Global Audit
// -----------------------------------------------------------------------------
console.log('\n--- 14. Universal 100% Livability & Anti-Unlivable Ground Truth Audit ---');

// 14.1 Every seed address across all countries in ADDRESS_MAP must be strictly residential
const unlivableKeywords = [
  'station', 'shinkansen', 'terminal', 'airport', 'cenotaph', 'memorial', 'cathedral', 'duomo',
  'palace', '10 Downing', 'Elysée', 'Champs-Élysées', '1 Infinite Loop', '1355 Market',
  '350 5th Ave', '111 8th Ave', '400 9th Ave', '233 S Wacker', 'Taipei 101', 'Marina Bay Sands',
  'Petronas', 'Bitexco', 'IFC', 'ICC'
];

let totalSeedAddresses = 0;
for (const [countryKey, list] of Object.entries(ADDRESS_MAP)) {
  for (const addr of list) {
    totalSeedAddresses++;
    assert(addr.buildingType === 'residential', `[${countryKey}] Seed address "${addr.street}" buildingType is strictly residential`);
    for (const kw of unlivableKeywords) {
      assert(!addr.street.toLowerCase().includes(kw.toLowerCase()), `[${countryKey}] Seed address "${addr.street}" does not contain unlivable keyword "${kw}"`);
    }
  }
}
console.log(`   Audited all ${totalSeedAddresses} seed addresses in ADDRESS_MAP across 21 countries: 100% verified residential condos/apartments!`);

// 14.2 High-volume multi-mode stress test: 150 random identities across all modes & countries
const modesToTest: AddressMode[] = ['landmark', 'derivation', 'residential'];
const countriesToTest: CountryCode[] = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'HK', 'TW', 'SG', 'KR', 'CH', 'LU', 'IE', 'IT', 'ES', 'NL', 'MY', 'TH', 'VN', 'PH'];

for (let i = 0; i < 150; i++) {
  const chosenCountry = countriesToTest[i % countriesToTest.length];
  const chosenMode = modesToTest[i % modesToTest.length];
  const identity = generateIdentity(chosenCountry, { addressMode: chosenMode });

  // Absolute requirement: 100% residential buildingType
  assert(identity.address.buildingType === 'residential', `Identity trial #${i} (${chosenCountry}, mode: ${chosenMode}) buildingType is strictly residential`);

  // Absolute requirement: zero commercial suite pollution
  const l1 = identity.address.addressLine1 || identity.address.street;
  const l2 = identity.address.addressLine2 || '';
  assert(!/\b(Ste|Suite|Box\s*#)\b/i.test(l2), `Trial #${i} addressLine2 "${l2}" does not contain Ste/Suite/Box #`);
  assert(!/\b(Ste|Suite|Box\s*#)\b/i.test(l1), `Trial #${i} addressLine1 "${l1}" does not contain Ste/Suite/Box #`);

  // Coordinates must be valid numbers
  assert(typeof identity.address.lat === 'number' && !isNaN(identity.address.lat), `Trial #${i} has valid lat: ${identity.address.lat}`);
  assert(typeof identity.address.lng === 'number' && !isNaN(identity.address.lng), `Trial #${i} has valid lng: ${identity.address.lng}`);
}
console.log('   Stress-tested 150 identities across all 3 modes and 21 countries: 100% residential, 0% Ste/Suite pollution!');

console.log('\n================================================================');
console.log(`🎉 SUCCESS: All ${assertionCount} assertions passed cleanly!`);
console.log('================================================================');

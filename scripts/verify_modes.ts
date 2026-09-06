import { generateIdentity } from '../src/services/identityGenerator';
import { getRandomAddress } from '../src/data/addresses';
import { STREET_DERIVATION_RULES, deriveStreetAddress, getDerivationRule, matchesState } from '../src/data/addresses/schemes/derivationRules';
import { RESIDENTIAL_ADDRESSES, getResidentialAddress } from '../src/data/addresses/schemes/residentialAddresses';
import { formatFullIdentityText, buildCSVContent } from '../src/services/exportService';
import type { CountryCode, AddressMode } from '../src/types/identity';

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
// 1. Mode 1: Landmark Seeds Verification
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Mode 1: Landmark Seeds ---');
const landmarkUS = generateIdentity('US', { gender: 'random', ageRange: 'random', addressMode: 'landmark' });
assert(landmarkUS.address.addressMode === 'landmark', 'Landmark address mode is set');
assert(landmarkUS.address.buildingType === 'commercial', 'Landmark building type is commercial');
assert(!!landmarkUS.address.street, 'Landmark address has street');
assert(!!landmarkUS.address.lat && !!landmarkUS.address.lng, 'Landmark address has lat/lng');
assert(landmarkUS.address.derivationMeta?.avsTier === 'Commercial / Freight', 'Landmark AVS tier is Commercial');

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
assert(csvOutput.includes('Curated Real Landmark Seeds') || csvOutput.includes('Curated Landmark Seed'), 'CSV row includes Landmark mode label');
assert(csvOutput.includes('Scheme A: Street Range Derivation') || csvOutput.includes('Scheme A: Street Derivation'), 'CSV row includes Derivation mode label');
assert(csvOutput.includes('Scheme B: Real Residential Address'), 'CSV row includes Residential mode label');
assert(csvOutput.includes('Residential Single Family') || csvOutput.includes('Residential Detached House'), 'CSV row includes Residential AVS Tier');


console.log('\n================================================================');
console.log(`🎉 SUCCESS: All ${assertionCount} assertions passed cleanly!`);
console.log('================================================================');

import { queryMultiSourceIp } from '../src/services/ipService';
import { resolveAddressFromIp } from '../src/services/ipAddressResolver';
import { generateIdentityFromAddress } from '../src/services/identityGenerator';
import type { IpConsensusResult } from '../src/types/ip';

async function runTests() {
  console.log('--- 1. Testing Multi-Source IP Resolution for 104.28.194.5 ---');
  const consensus = await queryMultiSourceIp('104.28.194.5');
  console.log('Target IP:', consensus.targetIp);
  console.log('Winner City:', consensus.winnerCity);
  console.log('Winner Region:', consensus.winnerRegion);
  console.log('Winner Country:', consensus.winnerCountry, `(${consensus.winnerCountryCode})`);
  console.log('Confidence Rate:', consensus.confidenceRate + '%');
  console.log('Total Queries:', consensus.totalQueries, 'Successful:', consensus.successQueries);
  console.log('City Votes:', JSON.stringify(consensus.cityVotes));
  
  if (consensus.successQueries === 0) {
    throw new Error('Expected at least 1 API to succeed');
  }
  if (!consensus.winnerCity) {
    throw new Error('Expected winnerCity to be resolved');
  }
  console.log('✅ Multi-source consensus test passed.');

  console.log('\n--- 2. Testing Same-City Address Resolution (Track 1 / Track 2) ---');
  const address = resolveAddressFromIp(consensus);
  console.log('Street:', address.street);
  console.log('City:', address.city);
  console.log('State:', address.state);
  console.log('Postcode:', address.postcode);
  console.log('Matched Strategy:', consensus.matchedStrategy);
  console.log('Strategy Summary Zh:', consensus.strategySummaryZh);

  if (address.city.toLowerCase() !== consensus.winnerCity.toLowerCase()) {
    throw new Error(`Address city ${address.city} does not match consensus city ${consensus.winnerCity}`);
  }
  console.log('✅ Same-city address resolution test passed.');

  console.log('\n--- 3. Testing Full Identity Generation from Resolved Address ---');
  const identity = generateIdentityFromAddress(address);
  console.log('Generated Name:', identity.basic.fullName);
  console.log('Generated Phone:', identity.contact.phoneFormatted);
  console.log('Generated Email:', identity.contact.email);
  console.log('Generated Address Line 1:', identity.address.addressLine1);
  console.log('Generated City/State/ZIP:', `${identity.address.city}, ${identity.address.state} ${identity.address.postcode}`);

  if (identity.address.city !== address.city) {
    throw new Error('Identity address city mismatch');
  }
  if (!identity.contact.email.includes('@')) {
    throw new Error('Invalid email generated');
  }
  if (!identity.basic.avatar.startsWith('https://api.dicebear.com/')) {
    throw new Error('Avatar not properly generated');
  }
  console.log('✅ Full identity generation test passed.');

  console.log('\n--- 4. Testing Exact City Landmark Matching (Los Angeles, CA) ---');
  const mockLaConsensus: IpConsensusResult = {
    targetIp: '1.2.3.4',
    isClientDetected: false,
    winnerCountry: 'United States',
    winnerCountryCode: 'US',
    winnerRegion: 'California',
    winnerCity: 'Los Angeles',
    winnerPostal: '90012',
    winnerLat: 34.0522,
    winnerLng: -118.2437,
    totalQueries: 4,
    successQueries: 4,
    cityVotes: { 'Los Angeles': 4 },
    topCityVoteCount: 4,
    confidenceRate: 100,
    details: []
  };
  const laAddress = resolveAddressFromIp(mockLaConsensus);
  console.log('LA Matched Strategy:', mockLaConsensus.matchedStrategy);
  console.log('LA Matched Landmark:', laAddress.street, laAddress.city);
  if (mockLaConsensus.matchedStrategy !== 'exact_city_residential') {
    throw new Error(`Expected exact_city_residential for Los Angeles, got ${mockLaConsensus.matchedStrategy}`);
  }
  console.log('✅ Exact city residential test passed.');

  console.log('\n--- 5. Testing Tax-Free State Municipal Derivation (Wilmington, DE) ---');
  const mockDeConsensus: IpConsensusResult = {
    targetIp: '5.6.7.8',
    isClientDetected: false,
    winnerCountry: 'United States',
    winnerCountryCode: 'US',
    winnerRegion: 'Delaware',
    winnerCity: 'Wilmington',
    winnerPostal: '19801',
    winnerLat: 39.7447,
    winnerLng: -75.5484,
    totalQueries: 4,
    successQueries: 4,
    cityVotes: { 'Wilmington': 4 },
    topCityVoteCount: 4,
    confidenceRate: 100,
    details: []
  };
  const deAddress = resolveAddressFromIp(mockDeConsensus);
  console.log('DE Address:', deAddress.street, deAddress.city, deAddress.state, deAddress.postcode);
  console.log('DE Tax Rate:', deAddress.taxRate, 'IsTaxFree:', deAddress.isTaxFree);
  if (!deAddress.isTaxFree) {
    throw new Error('Expected Delaware to be identified as tax-free');
  }
  console.log('✅ Tax-free state municipal derivation test passed.');

  console.log('\n🎉 ALL IP ADDRESS GENERATOR VERIFICATION TESTS PASSED CLEANLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

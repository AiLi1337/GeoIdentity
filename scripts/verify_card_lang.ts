import { generateIdentity } from '../src/services/identityGenerator';
import { formatFullIdentityText } from '../src/services/exportService';
import { COUNTRY_LOCAL_META } from '../src/data/names';
import type { CountryCode } from '../src/types/identity';

const testCountries: CountryCode[] = ['US', 'JP', 'KR', 'DE', 'FR', 'HK', 'TW', 'GB'];

console.log('=== 1. Validating COUNTRY_LOCAL_META ===');
for (const code of testCountries) {
  const meta = COUNTRY_LOCAL_META[code];
  if (!meta) throw new Error(`Missing meta for ${code}`);
  console.log(`[${code}] Native Label: ${meta.langLabel}, Country: ${meta.countryLocalName}`);
}

console.log('\n=== 2. Validating Generated Identity Multi-language Names ===');
for (const code of testCountries) {
  const id = generateIdentity(code);
  console.log(`[${code}] FullName: "${id.basic.fullName}"`);
  console.log(`     zhFullName: "${id.basic.zhFullName || 'N/A'}"`);
  console.log(`     localFullName: "${id.basic.localFullName || 'N/A'}"`);
  console.log(`     phoneticName: "${id.basic.phoneticName || 'N/A'}"`);
  console.log(`     documentLocal: "${id.document.typeNameLocal || 'N/A'}"`);
}

console.log('\n=== 3. Validating formatFullIdentityText for JP, KR, DE ===');
const jpId = generateIdentity('JP');
const jpLocalText = formatFullIdentityText(jpId, 'local');
if (!jpLocalText.includes('個人基本情報 (日本国内公的フォーマット)') || !jpLocalText.includes('〒')) {
  throw new Error('JP local format missing expected Japanese headings or postal code');
}
console.log('✓ JP local format verified successfully.');

const krId = generateIdentity('KR');
const krLocalText = formatFullIdentityText(krId, 'local');
if (!krLocalText.includes('기본 인적사항 (대한민국 표준)') || !krLocalText.includes('성명')) {
  throw new Error('KR local format missing expected Korean headings');
}
console.log('✓ KR local format verified successfully.');

const deId = generateIdentity('DE');
const deLocalText = formatFullIdentityText(deId, 'local');
if (!deLocalText.includes('Grunddaten zur Person') || !deLocalText.includes('Wohnadresse')) {
  throw new Error('DE local format missing expected German headings');
}
console.log('✓ DE local format verified successfully.');

const usId = generateIdentity('US');
const usZhText = formatFullIdentityText(usId, 'zh');
if (!usZhText.includes('=== 个人基本资料 ===')) {
  throw new Error('US zh format missing Chinese header');
}
console.log('✓ US zh format verified successfully.');

const usEnText = formatFullIdentityText(usId, 'en');
if (!usEnText.includes('=== Basic Information ===')) {
  throw new Error('US en format missing English header');
}
console.log('✓ US en format verified successfully.');

console.log('\nAll card language verification checks passed with flying colors! 🚀');

import { buildRealisticAvatar } from '../src/services/avatarService';
import { generateIdentity } from '../src/services/identityGenerator';

console.log('--- 1. Testing Female Young (22yo) ---');
const fYoung = buildRealisticAvatar('Alice Smith', 'female', 22, 'US');
console.log('fYoung URL:', fYoung);
if (!fYoung.includes('facialHairProbability=0')) throw new Error('Female must have 0 beard prob');
if (fYoung.includes('e8e1e1')) throw new Error('Young female must not have silver hair');
if (!fYoung.includes('straight01') && !fYoung.includes('bob')) throw new Error('Must have female hair');

console.log('--- 2. Testing Female Senior (65yo) ---');
const fSenior = buildRealisticAvatar('Mary Johnson', 'female', 65, 'US');
if (!fSenior.includes('facialHairProbability=0')) throw new Error('Female senior must have 0 beard prob');
if (!fSenior.includes('e8e1e1')) throw new Error('Senior female must allow silver hair');

console.log('--- 3. Testing Male Young (20yo) ---');
const mYoung = buildRealisticAvatar('Bob Taylor', 'male', 20, 'US');
if (mYoung.includes('e8e1e1')) throw new Error('Young male must not have silver hair');
if (!mYoung.includes('facialHairProbability=10')) throw new Error('Young male should have low beard prob');

console.log('--- 4. Testing Male Senior (62yo) ---');
const mSenior = buildRealisticAvatar('George Clark', 'male', 62, 'US');
if (!mSenior.includes('e8e1e1')) throw new Error('Senior male must allow silver hair');
if (!mSenior.includes('facialHairProbability=45')) throw new Error('Senior male should have senior beard prob');

console.log('--- 5. Testing Generation of 100 Identities ---');
for (let i = 0; i < 100; i++) {
  const g = i % 2 === 0 ? 'female' : 'male';
  const ageRange = i < 25 ? 'youth' : (i < 50 ? 'adult' : (i < 75 ? 'middle' : 'senior'));
  const id = generateIdentity('US', { gender: g as any, ageRange: ageRange as any });
  
  if (id.basic.gender === 'female') {
    if (!id.basic.avatar.includes('facialHairProbability=0')) {
      throw new Error(`Female identity ${id.basic.fullName} has non-zero facial hair probability!`);
    }
    if (id.basic.age < 40 && id.basic.avatar.includes('e8e1e1')) {
      throw new Error(`Young female identity ${id.basic.fullName} (${id.basic.age}yo) has silver hair!`);
    }
  }
}

console.log('🎉 ALL AVATAR TESTS PASSED CLEANLY!');

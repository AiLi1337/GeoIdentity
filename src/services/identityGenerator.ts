import type {
  CountryCode,
  Gender,
  GeneratedIdentity,
  FilterOptions,
  RealAddress
} from '../types/identity';
import { COUNTRIES } from '../data/countries';
import { getRandomAddress } from '../data/addresses';
import { getRandomName } from '../data/names';
import {
  BLOOD_TYPES,
  ZODIAC_SIGNS,
  EDUCATION_DEGREES,
  OCCUPATIONS_BY_INDUSTRY,
  UNIVERSITIES_BY_COUNTRY,
  COMPANIES_BY_COUNTRY
} from '../data/common/occupations';
import { generateFinanceInfo } from './luhnValidator';
import { generateDocument } from './documentGenerator';
import { buildRealisticAvatar } from './avatarService';

function generateRandomPhone(countryCode: CountryCode): { phone: string; formatted: string } {
  switch (countryCode) {
    case 'US':
    case 'CA': {
      const area = Math.floor(201 + Math.random() * 700);
      const mid = Math.floor(100 + Math.random() * 899);
      const line = Math.floor(1000 + Math.random() * 9000);
      return {
        phone: `+1${area}${mid}${line}`,
        formatted: `+1 (${area}) ${mid}-${line}`
      };
    }
    case 'GB': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+447${line}`,
        formatted: `+44 7${line.toString().substring(0, 3)} ${line.toString().substring(3)}`
      };
    }
    case 'JP': {
      const prefix = ['90', '80', '70'][Math.floor(Math.random() * 3)];
      const part1 = Math.floor(1000 + Math.random() * 9000);
      const part2 = Math.floor(1000 + Math.random() * 9000);
      return {
        phone: `+81${prefix}${part1}${part2}`,
        formatted: `+81 ${prefix}-${part1}-${part2}`
      };
    }
    case 'AU': {
      const mid = Math.floor(10 + Math.random() * 89);
      const part1 = Math.floor(100 + Math.random() * 900);
      const part2 = Math.floor(100 + Math.random() * 900);
      return {
        phone: `+614${mid}${part1}${part2}`,
        formatted: `+61 4${mid} ${part1} ${part2}`
      };
    }
    case 'DE': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+49151${line}`,
        formatted: `+49 151 ${line.toString().substring(0, 4)} ${line.toString().substring(4)}`
      };
    }
    case 'FR': {
      const p1 = Math.floor(10 + Math.random() * 89);
      const p2 = Math.floor(10 + Math.random() * 89);
      const p3 = Math.floor(10 + Math.random() * 89);
      const p4 = Math.floor(10 + Math.random() * 89);
      return {
        phone: `+336${p1}${p2}${p3}${p4}`,
        formatted: `+33 6 ${p1} ${p2} ${p3} ${p4}`
      };
    }
    case 'HK': {
      const prefix = ['9', '6', '5'][Math.floor(Math.random() * 3)];
      const line = Math.floor(1000000 + Math.random() * 9000000);
      return {
        phone: `+852${prefix}${line}`,
        formatted: `+852 ${prefix}${line.toString().substring(0, 3)} ${line.toString().substring(3)}`
      };
    }
    case 'TW': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+8869${line}`,
        formatted: `+886 9${line.toString().substring(0, 2)} ${line.toString().substring(2, 5)} ${line.toString().substring(5)}`
      };
    }
    case 'SG': {
      const prefix = ['8', '9'][Math.floor(Math.random() * 2)];
      const line = Math.floor(1000000 + Math.random() * 9000000);
      return {
        phone: `+65${prefix}${line}`,
        formatted: `+65 ${prefix}${line.toString().substring(0, 3)} ${line.toString().substring(3)}`
      };
    }
    case 'KR': {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      return {
        phone: `+8210${p1}${p2}`,
        formatted: `+82 10-${p1}-${p2}`
      };
    }
    case 'CH': {
      const p1 = Math.floor(100 + Math.random() * 900);
      const p2 = Math.floor(10 + Math.random() * 90);
      const p3 = Math.floor(10 + Math.random() * 90);
      return {
        phone: `+4179${p1}${p2}${p3}`,
        formatted: `+41 79 ${p1} ${p2} ${p3}`
      };
    }
    case 'LU': {
      const line = Math.floor(100000 + Math.random() * 900000);
      return {
        phone: `+352621${line}`,
        formatted: `+352 621 ${line.toString().substring(0, 3)} ${line.toString().substring(3)}`
      };
    }
    case 'IE': {
      const line = Math.floor(1000000 + Math.random() * 9000000);
      return {
        phone: `+35387${line}`,
        formatted: `+353 87 ${line.toString().substring(0, 3)} ${line.toString().substring(3)}`
      };
    }
    case 'IT': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+3933${line}`,
        formatted: `+39 33${line.toString().substring(0, 1)} ${line.toString().substring(1, 4)} ${line.toString().substring(4)}`
      };
    }
    case 'ES': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+346${line}`,
        formatted: `+34 6${line.toString().substring(0, 2)} ${line.toString().substring(2, 4)} ${line.toString().substring(4, 6)} ${line.toString().substring(6)}`
      };
    }
    case 'NL': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+316${line}`,
        formatted: `+31 6 ${line.toString().substring(0, 4)} ${line.toString().substring(4)}`
      };
    }
    case 'MY': {
      const line = Math.floor(1000000 + Math.random() * 9000000);
      return {
        phone: `+6012${line}`,
        formatted: `+60 12-${line.toString().substring(0, 3)} ${line.toString().substring(3)}`
      };
    }
    case 'TH': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+668${line}`,
        formatted: `+66 8${line.toString().substring(0, 1)} ${line.toString().substring(1, 4)} ${line.toString().substring(4)}`
      };
    }
    case 'VN': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+849${line}`,
        formatted: `+84 9${line.toString().substring(0, 2)} ${line.toString().substring(2, 5)} ${line.toString().substring(5)}`
      };
    }
    case 'PH': {
      const line = Math.floor(10000000 + Math.random() * 90000000);
      return {
        phone: `+639${line}`,
        formatted: `+63 9${line.toString().substring(0, 2)} ${line.toString().substring(2, 5)} ${line.toString().substring(5)}`
      };
    }
  }
}

function generateResidentialAddressLine2(countryCode: CountryCode): string {
  // 75% standalone single-family homes without line 2, 25% residential apt/unit
  if (Math.random() >= 0.25) {
    return '';
  }

  if (countryCode === 'HK') {
    const hkFloors = [3, 5, 8, 12, 16, 21, 28, 32];
    const floor = hkFloors[Math.floor(Math.random() * hkFloors.length)];
    const flatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)];
    const hkUnits = [
      `Flat ${flatLetter}, ${floor}/F`,
      `Rm ${floor}0${Math.floor(1 + Math.random() * 8)}`
    ];
    return hkUnits[Math.floor(Math.random() * hkUnits.length)];
  }

  // US, CA, and other countries: Apt XXX or Unit X
  const resUnits = [
    `Apt ${Math.floor(1 + Math.random() * 20)}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}`,
    `Unit ${Math.floor(1 + Math.random() * 12)}`,
    `Apt ${Math.floor(101 + Math.random() * 300)}`
  ];
  return resUnits[Math.floor(Math.random() * resUnits.length)];
}

export function generateIdentity(countryCode: CountryCode, options?: FilterOptions): GeneratedIdentity {
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  // Gender
  let gender: Gender = Math.random() > 0.5 ? 'male' : 'female';
  if (options?.gender && options.gender !== 'random') {
    gender = options.gender;
  }

  // Age & Birth date
  let age = Math.floor(22 + Math.random() * 40); // default 22-62
  if (options?.ageRange && options.ageRange !== 'random') {
    const [min, max] = options.ageRange.split('-').map(Number);
    age = Math.floor(min + Math.random() * (max - min + 1));
  }
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const birthMonth = Math.floor(1 + Math.random() * 12);
  const birthDay = Math.floor(1 + Math.random() * 28);
  const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

  // Names
  const nameData = getRandomName(countryCode, gender);

  // Email & Username
  const cleanFirst = nameData.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = nameData.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const numSuffix = Math.floor(10 + Math.random() * 90);
  const emailDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'proton.me'];
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const username = `${cleanFirst}.${cleanLast}${numSuffix}`;
  const email = `${cleanFirst}.${cleanLast}${numSuffix}@${domain}`;

  // Phone
  const phoneObj = generateRandomPhone(countryCode);

  // Address
  const rawAddress = getRandomAddress(
    countryCode,
    options?.state,
    options?.isTaxFreeOnly,
    options?.addressMode
  );

  let addressLine2 = '';
  if (rawAddress.addressMode === 'residential' || rawAddress.buildingType === 'residential') {
    addressLine2 = generateResidentialAddressLine2(countryCode);
  } else if (rawAddress.addressMode === 'derivation') {
    // Scheme A: 60% with suite/unit, 40% clean street
    if (Math.random() < 0.6) {
      const suiteTypes = [
        `Ste ${Math.floor(100 + Math.random() * 899)}`,
        `Suite ${Math.floor(100 + Math.random() * 899)}`,
        `Unit ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${Math.floor(10 + Math.random() * 90)}`,
        `Apt ${Math.floor(1 + Math.random() * 40)}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
        `Box #${Math.floor(1000 + Math.random() * 9000)}`
      ];
      addressLine2 = suiteTypes[Math.floor(Math.random() * suiteTypes.length)];
    }
  } else {
    const suiteTypes = [
      `Ste ${Math.floor(100 + Math.random() * 899)}`,
      `Suite ${Math.floor(100 + Math.random() * 899)}`,
      `Unit ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${Math.floor(10 + Math.random() * 90)}`,
      `Apt ${Math.floor(1 + Math.random() * 40)}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
      `Box #${Math.floor(1000 + Math.random() * 9000)}`
    ];
    addressLine2 = suiteTypes[Math.floor(Math.random() * suiteTypes.length)];
  }

  const address: typeof rawAddress = {
    ...rawAddress,
    addressLine1: rawAddress.street,
    addressLine2: addressLine2 || undefined,
    taxRate: rawAddress.taxRate || (rawAddress.isTaxFree ? '0.00% (No Sales Tax)' : 'Standard Tax'),
    isTaxFree: Boolean(rawAddress.isTaxFree || country.isTaxFreeZone),
    timezone: rawAddress.timezone || 'UTC+0',
    timezoneCode: rawAddress.timezoneCode || 'UTC'
  };

  // Document
  const document = generateDocument(countryCode, gender, birthYear);

  // Occupation & Education
  const industryGroup = OCCUPATIONS_BY_INDUSTRY[Math.floor(Math.random() * OCCUPATIONS_BY_INDUSTRY.length)];
  const title = industryGroup.titles[Math.floor(Math.random() * industryGroup.titles.length)];
  const companyPool = COMPANIES_BY_COUNTRY[countryCode] || COMPANIES_BY_COUNTRY.US;
  const company = companyPool[Math.floor(Math.random() * companyPool.length)];
  const uniPool = UNIVERSITIES_BY_COUNTRY[countryCode] || UNIVERSITIES_BY_COUNTRY.US;
  const university = uniPool[Math.floor(Math.random() * uniPool.length)];
  const degree = EDUCATION_DEGREES[Math.floor(Math.random() * EDUCATION_DEGREES.length)];

  // Finance Card
  const finance = generateFinanceInfo(countryCode);

  // Blood type & Zodiac
  const bloodType = BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)];
  const zodiacSign = ZODIAC_SIGNS[birthMonth - 1];

  // SVG Avatar via DiceBear (Avataaars style, tailored by gender, age & cultural background)
  const avatar = buildRealisticAvatar(nameData.fullName, gender, age, countryCode);

  return {
    id: `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
    countryCode,
    countryName: country.nameZh,
    basic: {
      firstName: nameData.firstName,
      lastName: nameData.lastName,
      fullName: nameData.fullName,
      localFullName: nameData.localFullName,
      phoneticName: nameData.phoneticName,
      zhFullName: nameData.zhFullName,
      gender,
      age,
      birthDate,
      avatar,
      bloodType,
      zodiacSign
    },
    address,
    contact: {
      phone: phoneObj.phone,
      phoneFormatted: phoneObj.formatted,
      email,
      username
    },
    document,
    occupation: {
      company,
      title,
      industry: industryGroup.industry,
      educationDegree: degree,
      university,
      website: `https://www.${company.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 12)}.com`
    },
    finance,
    isFavorite: false
  };
}

export function generateIdentityFromAddress(
  customAddress: RealAddress,
  options?: Partial<FilterOptions>
): GeneratedIdentity {
  const countryCode = customAddress.countryCode;
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  let gender: Gender = 'male';
  if (options?.gender === 'random' || !options?.gender) {
    gender = Math.random() < 0.5 ? 'male' : 'female';
  } else {
    gender = options.gender;
  }

  let minAge = 18;
  let maxAge = 65;
  if (options?.ageRange === '18-25') { minAge = 18; maxAge = 25; }
  else if (options?.ageRange === '26-35') { minAge = 26; maxAge = 35; }
  else if (options?.ageRange === '36-50') { minAge = 36; maxAge = 50; }
  else if (options?.ageRange === '51-65') { minAge = 51; maxAge = 65; }

  const age = Math.floor(minAge + Math.random() * (maxAge - minAge + 1));
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const birthMonth = Math.floor(1 + Math.random() * 12);
  const birthDay = Math.floor(1 + Math.random() * 28);
  const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;

  const nameData = getRandomName(countryCode, gender);

  const cleanFirst = nameData.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = nameData.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const numSuffix = Math.floor(10 + Math.random() * 90);
  const emailDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'proton.me'];
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const username = `${cleanFirst}.${cleanLast}${numSuffix}`;
  const email = `${cleanFirst}.${cleanLast}${numSuffix}@${domain}`;

  const phoneObj = generateRandomPhone(countryCode);

  let addressLine2 = customAddress.addressLine2 || '';
  const isResidential = customAddress.addressMode === 'residential'
    || customAddress.buildingType === 'residential'
    || customAddress.buildingType === 'derived';

  // Residential addresses must NEVER contain commercial Ste or Suite
  if (isResidential && /\b(Ste|Suite)\b/i.test(addressLine2)) {
    addressLine2 = '';
  }

  if (!addressLine2) {
    if (isResidential) {
      addressLine2 = generateResidentialAddressLine2(countryCode);
    } else if (Math.random() < 0.4) {
      const suiteTypes = [
        `Ste ${Math.floor(100 + Math.random() * 899)}`,
        `Suite ${Math.floor(100 + Math.random() * 899)}`,
        `Unit ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${Math.floor(10 + Math.random() * 90)}`
      ];
      addressLine2 = suiteTypes[Math.floor(Math.random() * suiteTypes.length)];
    }
  }

  const address: RealAddress = {
    ...customAddress,
    addressLine1: customAddress.addressLine1 || customAddress.street,
    addressLine2: addressLine2 || undefined,
    taxRate: customAddress.taxRate || (customAddress.isTaxFree ? '0.00% (No Sales Tax)' : 'Standard Tax'),
    isTaxFree: Boolean(customAddress.isTaxFree || country.isTaxFreeZone),
    timezone: customAddress.timezone || 'UTC+0',
    timezoneCode: customAddress.timezoneCode || 'UTC'
  };

  const document = generateDocument(countryCode, gender, birthYear);

  const industryGroup = OCCUPATIONS_BY_INDUSTRY[Math.floor(Math.random() * OCCUPATIONS_BY_INDUSTRY.length)];
  const title = industryGroup.titles[Math.floor(Math.random() * industryGroup.titles.length)];
  const companyPool = COMPANIES_BY_COUNTRY[countryCode as CountryCode] || COMPANIES_BY_COUNTRY.US;
  const company = companyPool[Math.floor(Math.random() * companyPool.length)];
  const uniPool = UNIVERSITIES_BY_COUNTRY[countryCode as CountryCode] || UNIVERSITIES_BY_COUNTRY.US;
  const university = uniPool[Math.floor(Math.random() * uniPool.length)];
  const degree = EDUCATION_DEGREES[Math.floor(Math.random() * EDUCATION_DEGREES.length)];

  const finance = generateFinanceInfo(countryCode);
  const bloodType = BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)];
  const zodiacSign = ZODIAC_SIGNS[birthMonth - 1];
  const avatar = buildRealisticAvatar(nameData.fullName, gender, age, countryCode);

  return {
    id: `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
    countryCode,
    countryName: country.nameZh,
    basic: {
      firstName: nameData.firstName,
      lastName: nameData.lastName,
      fullName: nameData.fullName,
      localFullName: nameData.localFullName,
      phoneticName: nameData.phoneticName,
      zhFullName: nameData.zhFullName,
      gender,
      age,
      birthDate,
      avatar,
      bloodType,
      zodiacSign
    },
    address,
    contact: {
      phone: phoneObj.phone,
      phoneFormatted: phoneObj.formatted,
      email,
      username
    },
    document,
    occupation: {
      company,
      title,
      industry: industryGroup.industry,
      educationDegree: degree,
      university,
      website: `https://www.${company.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 12)}.com`
    },
    finance,
    isFavorite: false
  };
}


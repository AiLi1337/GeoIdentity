import type { CountryCode, RealAddress, StreetDerivationRule } from '../../../types/identity';

export function matchesState(ruleState: string, ruleStateFull: string | undefined, targetState: string): boolean {
  if (!targetState) return true;
  const t = targetState.trim().toLowerCase();
  const s = ruleState.trim().toLowerCase();
  if (s === t) return true;
  if (ruleStateFull && ruleStateFull.trim().toLowerCase() === t) return true;

  // UK aliases: ENG-LDN <-> London, ENG-MAN <-> Manchester, ENG-BIR <-> Birmingham
  if ((t === 'eng-ldn' || t === 'london') && (s === 'london' || s === 'eng-ldn')) return true;
  if ((t === 'eng-man' || t === 'manchester' || t === 'greater manchester') && (s === 'greater manchester' || s === 'eng-man' || s === 'manchester')) return true;
  if ((t === 'eng-bir' || t === 'birmingham' || t === 'west midlands') && (s === 'west midlands' || s === 'eng-bir' || s === 'birmingham')) return true;

  // Hong Kong: ST <-> Sha Tin / NT, CW <-> Central
  if ((t === 'st' || t === 'sha tin') && (s === 'st' || s === 'nt' || s === 'sha tin')) return true;
  if ((t === 'cw' || t === 'central') && (s === 'cw' || s === 'central')) return true;

  // Singapore: CR <-> Central Region
  if ((t === 'cr' || t === 'central') && (s === 'cr' || s === 'central')) return true;

  return false;
}

export function deriveStreetAddress(rule: StreetDerivationRule): RealAddress {
  let min = Math.min(rule.minNumber, rule.maxNumber);
  let max = Math.max(rule.minNumber, rule.maxNumber);
  if (min === max) max = min + 100;

  // Generate house number respecting parity if specified
  let houseNumber: number;
  const parity = rule.parity || 'all';

  if (parity === 'even') {
    const evenMin = min % 2 === 0 ? min : min + 1;
    const evenMax = max % 2 === 0 ? max : max - 1;
    const count = Math.max(1, Math.floor((evenMax - evenMin) / 2) + 1);
    houseNumber = evenMin + Math.floor(Math.random() * count) * 2;
  } else if (parity === 'odd') {
    const oddMin = min % 2 !== 0 ? min : min + 1;
    const oddMax = max % 2 !== 0 ? max : max - 1;
    const count = Math.max(1, Math.floor((oddMax - oddMin) / 2) + 1);
    houseNumber = oddMin + Math.floor(Math.random() * count) * 2;
  } else {
    houseNumber = Math.floor(min + Math.random() * (max - min + 1));
  }

  // Calculate linear GIS coordinate interpolation
  const fraction = Math.max(0, Math.min(1, (houseNumber - min) / (max - min)));
  
  // Tiny perpendicular/random offset (approx. +/- 2 to 4 meters) along the corridor
  const latJitter = (Math.random() - 0.5) * 0.00008;
  const lngJitter = (Math.random() - 0.5) * 0.00008;
  
  const lat = Number((rule.startCoord.lat + fraction * (rule.endCoord.lat - rule.startCoord.lat) + latJitter).toFixed(6));
  const lng = Number((rule.startCoord.lng + fraction * (rule.endCoord.lng - rule.startCoord.lng) + lngJitter).toFixed(6));

  // Format street address string based on country conventions
  let streetText = `${houseNumber} ${rule.streetName}`;
  if (rule.countryCode === 'JP') {
    // For Japan: e.g. "渋谷区神南1丁目" + `${houseNumber % 20 + 1}-${houseNumber % 15 + 1}`
    const banchi = (houseNumber % 28) + 1;
    const go = (houseNumber % 19) + 1;
    streetText = `${rule.streetName} ${banchi}-${go}`;
  } else if (['DE', 'IT', 'ES', 'NL', 'CH', 'LU', 'KR'].includes(rule.countryCode)) {
    streetText = `${rule.streetName} ${houseNumber}`;
  } else if (['FR', 'IE', 'TH', 'VN', 'PH'].includes(rule.countryCode)) {
    streetText = `${houseNumber} ${rule.streetName}`;
  } else if (rule.countryCode === 'TW') {
    streetText = `${rule.streetName}${houseNumber}號`;
  } else if (rule.countryCode === 'MY') {
    streetText = `No. ${houseNumber}, ${rule.streetName}`;
  }

  return {
    street: streetText,
    addressLine1: streetText,
    city: rule.city,
    state: rule.state,
    stateFull: rule.stateFull,
    postcode: rule.postcode,
    country: rule.country,
    countryCode: rule.countryCode,
    lat,
    lng,
    isTaxFree: Boolean(rule.isTaxFree),
    taxRate: rule.taxRate || (rule.isTaxFree ? '0.00% (No Sales Tax)' : 'Standard Tax'),
    timezone: rule.timezone,
    timezoneCode: rule.timezoneCode,
    addressMode: 'derivation',
    buildingType: 'derived',
    derivationMeta: {
      mode: 'derivation',
      modeLabelZh: '方案A·真实街道门牌衍生',
      modeLabelEn: 'Scheme A: Street Range Derivation',
      baseStreet: rule.streetName,
      houseNumberRange: `#${min} - #${max}`,
      ruleSummary: `${rule.streetName} (#${min} - #${max}) GIS 航向线性插值`,
      interpolated: true,
      buildingType: 'derived',
      avsTier: 'GIS Derived Street'
    }
  };
}

export const STREET_DERIVATION_RULES: StreetDerivationRule[] = [
  // ==========================================
  // 1. 美国 (US) - 5大免税州 (DE, OR, MT, NH, AK)
  // ==========================================

  // --- 特拉华州 (DE) ---
  {
    id: 'us-de-kirkwood',
    streetName: 'Kirkwood Hwy',
    minNumber: 1200,
    maxNumber: 5100,
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19808',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 39.7381, lng: -75.6325 },
    endCoord: { lat: 39.7095, lng: -75.7288 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'us-de-concord',
    streetName: 'Concord Pike',
    minNumber: 1800,
    maxNumber: 5200,
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19803',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 39.7820, lng: -75.5460 },
    endCoord: { lat: 39.8320, lng: -75.5420 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'us-de-capitol',
    streetName: 'Capitol Trl',
    minNumber: 200,
    maxNumber: 2600,
    city: 'Newark',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19711',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 39.6920, lng: -75.7250 },
    endCoord: { lat: 39.7180, lng: -75.6880 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'us-de-pulaski',
    streetName: 'Pulaski Hwy',
    minNumber: 700,
    maxNumber: 3800,
    city: 'Bear',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19701',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 39.6380, lng: -75.6850 },
    endCoord: { lat: 39.6050, lng: -75.7680 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'us-de-limestone',
    streetName: 'Limestone Rd',
    minNumber: 2000,
    maxNumber: 5400,
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19808',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 39.7350, lng: -75.6880 },
    endCoord: { lat: 39.7890, lng: -75.6980 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // --- 俄勒冈州 (OR) ---
  {
    id: 'us-or-hawthorne',
    streetName: 'SE Hawthorne Blvd',
    minNumber: 1100,
    maxNumber: 4900,
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97214',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 45.5121, lng: -122.6540 },
    endCoord: { lat: 45.5122, lng: -122.6120 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'us-or-division',
    streetName: 'SE Division St',
    minNumber: 1500,
    maxNumber: 6200,
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97202',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 45.5048, lng: -122.6500 },
    endCoord: { lat: 45.5049, lng: -122.5980 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'us-or-beaverton',
    streetName: 'SW Beaverton Hillsdale Hwy',
    minNumber: 3200,
    maxNumber: 8800,
    city: 'Beaverton',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97005',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 45.4870, lng: -122.7520 },
    endCoord: { lat: 45.4860, lng: -122.8150 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'us-or-broadway',
    streetName: 'NE Broadway St',
    minNumber: 1200,
    maxNumber: 3800,
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97232',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 45.5350, lng: -122.6520 },
    endCoord: { lat: 45.5352, lng: -122.6240 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'us-or-baseline',
    streetName: 'E Main St',
    minNumber: 400,
    maxNumber: 2800,
    city: 'Hillsboro',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97123',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 45.5220, lng: -122.9820 },
    endCoord: { lat: 45.5218, lng: -122.9460 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // --- 蒙大拿州 (MT) ---
  {
    id: 'us-mt-grand',
    streetName: 'Grand Ave',
    minNumber: 1100,
    maxNumber: 3400,
    city: 'Billings',
    state: 'MT',
    stateFull: 'Montana',
    postcode: '59102',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 45.7820, lng: -108.5350 },
    endCoord: { lat: 45.7680, lng: -108.5980 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Denver (MST/MDT)',
    timezoneCode: 'MST'
  },
  {
    id: 'us-mt-reserve',
    streetName: 'N Reserve St',
    minNumber: 1500,
    maxNumber: 3900,
    city: 'Missoula',
    state: 'MT',
    stateFull: 'Montana',
    postcode: '59808',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 46.8850, lng: -114.0450 },
    endCoord: { lat: 46.9240, lng: -114.0480 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Denver (MST/MDT)',
    timezoneCode: 'MST'
  },

  // --- 新罕布什尔州 (NH) ---
  {
    id: 'us-nh-willow',
    streetName: 'S Willow St',
    minNumber: 500,
    maxNumber: 1900,
    city: 'Manchester',
    state: 'NH',
    stateFull: 'New Hampshire',
    postcode: '03103',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 42.9780, lng: -71.4420 },
    endCoord: { lat: 42.9350, lng: -71.4380 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'us-nh-amherst',
    streetName: 'Amherst St',
    minNumber: 200,
    maxNumber: 680,
    city: 'Nashua',
    state: 'NH',
    stateFull: 'New Hampshire',
    postcode: '03063',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 42.7750, lng: -71.4850 },
    endCoord: { lat: 42.8020, lng: -71.5580 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // --- 阿拉斯加州 (AK) ---
  {
    id: 'us-ak-seward',
    streetName: 'Old Seward Hwy',
    minNumber: 3200,
    maxNumber: 7800,
    city: 'Anchorage',
    state: 'AK',
    stateFull: 'Alaska',
    postcode: '99503',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 61.1920, lng: -149.8680 },
    endCoord: { lat: 61.1480, lng: -149.8660 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Anchorage (AKST)',
    timezoneCode: 'AKST'
  },

  // ==========================================
  // 美国主要高频州 (CA, TX, FL, NY, WA, IL, etc.)
  // ==========================================

  // --- 加利福尼亚州 (CA) ---
  {
    id: 'us-ca-wilshire',
    streetName: 'Wilshire Blvd',
    minNumber: 3200,
    maxNumber: 11200,
    city: 'Los Angeles',
    state: 'CA',
    stateFull: 'California',
    postcode: '90010',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 34.0618, lng: -118.2980 },
    endCoord: { lat: 34.0540, lng: -118.4480 },
    isTaxFree: false,
    taxRate: '9.50%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'us-ca-elcamino',
    streetName: 'El Camino Real',
    minNumber: 1400,
    maxNumber: 4800,
    city: 'Santa Clara',
    state: 'CA',
    stateFull: 'California',
    postcode: '95050',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 37.3520, lng: -121.9540 },
    endCoord: { lat: 37.3680, lng: -122.0250 },
    isTaxFree: false,
    taxRate: '9.125%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'us-ca-market',
    streetName: 'Market St',
    minNumber: 500,
    maxNumber: 1700,
    city: 'San Francisco',
    state: 'CA',
    stateFull: 'California',
    postcode: '94103',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 37.7900, lng: -122.4000 },
    endCoord: { lat: 37.7730, lng: -122.4200 },
    isTaxFree: false,
    taxRate: '8.625%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // --- 德克萨斯州 (TX) ---
  {
    id: 'us-tx-westheimer',
    streetName: 'Westheimer Rd',
    minNumber: 2600,
    maxNumber: 9900,
    city: 'Houston',
    state: 'TX',
    stateFull: 'Texas',
    postcode: '77057',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 29.7420, lng: -95.4200 },
    endCoord: { lat: 29.7380, lng: -95.5500 },
    isTaxFree: false,
    taxRate: '8.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },
  {
    id: 'us-tx-lamar',
    streetName: 'S Lamar Blvd',
    minNumber: 1100,
    maxNumber: 4200,
    city: 'Austin',
    state: 'TX',
    stateFull: 'Texas',
    postcode: '78704',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 30.2580, lng: -97.7610 },
    endCoord: { lat: 30.2310, lng: -97.7910 },
    isTaxFree: false,
    taxRate: '8.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },

  // --- 佛罗里达州 (FL) ---
  {
    id: 'us-fl-biscayne',
    streetName: 'Biscayne Blvd',
    minNumber: 1500,
    maxNumber: 7900,
    city: 'Miami',
    state: 'FL',
    stateFull: 'Florida',
    postcode: '33132',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 25.7900, lng: -80.1890 },
    endCoord: { lat: 25.8480, lng: -80.1870 },
    isTaxFree: false,
    taxRate: '7.00%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // --- 纽约州 (NY) ---
  {
    id: 'us-ny-broadway',
    streetName: 'Broadway',
    minNumber: 520,
    maxNumber: 2850,
    city: 'New York',
    state: 'NY',
    stateFull: 'New York',
    postcode: '10012',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 40.7240, lng: -73.9970 },
    endCoord: { lat: 40.7950, lng: -73.9720 },
    isTaxFree: false,
    taxRate: '8.875%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // --- 华盛顿州 (WA) ---
  {
    id: 'us-wa-bellevue',
    streetName: 'Bellevue Way NE',
    minNumber: 400,
    maxNumber: 2400,
    city: 'Bellevue',
    state: 'WA',
    stateFull: 'Washington',
    postcode: '98004',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 47.6140, lng: -122.2010 },
    endCoord: { lat: 47.6320, lng: -122.2020 },
    isTaxFree: false,
    taxRate: '10.10%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // --- 伊利诺伊州 (IL) ---
  {
    id: 'us-il-michigan',
    streetName: 'N Michigan Ave',
    minNumber: 100,
    maxNumber: 980,
    city: 'Chicago',
    state: 'IL',
    stateFull: 'Illinois',
    postcode: '60611',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 41.8885, lng: -87.6245 },
    endCoord: { lat: 41.9005, lng: -87.6240 },
    isTaxFree: false,
    taxRate: '10.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },

  // --- 新泽西州 (NJ) ---
  {
    id: 'us-nj-washington',
    streetName: 'Washington Blvd',
    minNumber: 110,
    maxNumber: 560,
    city: 'Jersey City',
    state: 'NJ',
    stateFull: 'New Jersey',
    postcode: '07310',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 40.7240, lng: -74.0340 },
    endCoord: { lat: 40.7350, lng: -74.0320 },
    isTaxFree: false,
    taxRate: '6.625%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // --- 内华达州 (NV) ---
  {
    id: 'us-nv-lasvegas',
    streetName: 'S Las Vegas Blvd',
    minNumber: 2900,
    maxNumber: 3950,
    city: 'Las Vegas',
    state: 'NV',
    stateFull: 'Nevada',
    postcode: '89109',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 36.1200, lng: -115.1720 },
    endCoord: { lat: 36.1410, lng: -115.1610 },
    isTaxFree: false,
    taxRate: '8.375%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // --- 马萨诸塞州 (MA) ---
  {
    id: 'us-ma-boylston',
    streetName: 'Boylston St',
    minNumber: 500,
    maxNumber: 950,
    city: 'Boston',
    state: 'MA',
    stateFull: 'Massachusetts',
    postcode: '02116',
    country: 'United States',
    countryCode: 'US',
    startCoord: { lat: 42.3490, lng: -71.0820 },
    endCoord: { lat: 42.3520, lng: -71.0700 },
    isTaxFree: false,
    taxRate: '6.25%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // ==========================================
  // 英国 (GB)
  // ==========================================
  {
    id: 'gb-london-kingsrd',
    streetName: "King's Rd",
    minNumber: 40,
    maxNumber: 430,
    city: 'London',
    state: 'ENG-LDN',
    stateFull: 'Greater London',
    postcode: 'SW3 4ND',
    country: 'United Kingdom',
    countryCode: 'GB',
    startCoord: { lat: 51.4910, lng: -0.1600 },
    endCoord: { lat: 51.4820, lng: -0.1810 },
    taxRate: '20% VAT',
    timezone: 'Europe/London (GMT/BST)',
    timezoneCode: 'GMT'
  },
  {
    id: 'gb-manchester-oxford',
    streetName: 'Oxford Rd',
    minNumber: 60,
    maxNumber: 480,
    city: 'Manchester',
    state: 'ENG-MAN',
    stateFull: 'Greater Manchester',
    postcode: 'M13 9PL',
    country: 'United Kingdom',
    countryCode: 'GB',
    startCoord: { lat: 53.4720, lng: -2.2380 },
    endCoord: { lat: 53.4560, lng: -2.2270 },
    taxRate: '20% VAT',
    timezone: 'Europe/London (GMT/BST)',
    timezoneCode: 'GMT'
  },
  {
    id: 'gb-birmingham-colmore',
    streetName: 'Colmore Row',
    minNumber: 10,
    maxNumber: 130,
    city: 'Birmingham',
    state: 'ENG-BIR',
    stateFull: 'West Midlands',
    postcode: 'B3 2QD',
    country: 'United Kingdom',
    countryCode: 'GB',
    startCoord: { lat: 52.4820, lng: -1.9010 },
    endCoord: { lat: 52.4800, lng: -1.8960 },
    taxRate: '20% VAT',
    timezone: 'Europe/London (GMT/BST)',
    timezoneCode: 'GMT'
  },

  // ==========================================
  // 加拿大 (CA)
  // ==========================================
  {
    id: 'ca-toronto-yonge',
    streetName: 'Yonge St',
    minNumber: 450,
    maxNumber: 3400,
    city: 'Toronto',
    state: 'ON',
    stateFull: 'Ontario',
    postcode: 'M4Y 1Z9',
    country: 'Canada',
    countryCode: 'CA',
    startCoord: { lat: 43.6620, lng: -79.3850 },
    endCoord: { lat: 43.7180, lng: -79.4000 },
    taxRate: '13% HST',
    timezone: 'America/Toronto (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'ca-vancouver-robson',
    streetName: 'Robson St',
    minNumber: 520,
    maxNumber: 1750,
    city: 'Vancouver',
    state: 'BC',
    stateFull: 'British Columbia',
    postcode: 'V6E 1B5',
    country: 'Canada',
    countryCode: 'CA',
    startCoord: { lat: 49.2800, lng: -123.1180 },
    endCoord: { lat: 49.2910, lng: -123.1360 },
    taxRate: '12% GST/PST',
    timezone: 'America/Vancouver (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    id: 'ca-montreal-ste-catherine',
    streetName: 'Rue Sainte-Catherine O',
    minNumber: 1000,
    maxNumber: 2250,
    city: 'Montréal',
    state: 'QC',
    stateFull: 'Quebec',
    postcode: 'H3B 1H4',
    country: 'Canada',
    countryCode: 'CA',
    startCoord: { lat: 45.4980, lng: -73.5750 },
    endCoord: { lat: 45.5030, lng: -73.5680 },
    taxRate: '14.975% GST/QST',
    timezone: 'America/Toronto (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    id: 'ca-calgary-8th-ave',
    streetName: '8 Ave SW',
    minNumber: 400,
    maxNumber: 1150,
    city: 'Calgary',
    state: 'AB',
    stateFull: 'Alberta',
    postcode: 'T2P 1G1',
    country: 'Canada',
    countryCode: 'CA',
    startCoord: { lat: 51.0450, lng: -114.0750 },
    endCoord: { lat: 51.0460, lng: -114.0620 },
    isTaxFree: true,
    taxRate: '5.00% GST (No Provincial Sales Tax)',
    timezone: 'America/Edmonton (MST/MDT)',
    timezoneCode: 'MST'
  },

  // ==========================================
  // 澳大利亚 (AU)
  // ==========================================
  {
    id: 'au-sydney-george',
    streetName: 'George St',
    minNumber: 120,
    maxNumber: 780,
    city: 'Sydney',
    state: 'NSW',
    stateFull: 'New South Wales',
    postcode: '2000',
    country: 'Australia',
    countryCode: 'AU',
    startCoord: { lat: -33.8610, lng: 151.2080 },
    endCoord: { lat: -33.8820, lng: 151.2050 },
    taxRate: '10% GST',
    timezone: 'Australia/Sydney (AEST/AEDT)',
    timezoneCode: 'AEST'
  },
  {
    id: 'au-melbourne-chapel',
    streetName: 'Chapel St',
    minNumber: 100,
    maxNumber: 620,
    city: 'South Yarra',
    state: 'VIC',
    stateFull: 'Victoria',
    postcode: '3141',
    country: 'Australia',
    countryCode: 'AU',
    startCoord: { lat: -37.8380, lng: 144.9930 },
    endCoord: { lat: -37.8590, lng: 144.9920 },
    taxRate: '10% GST',
    timezone: 'Australia/Melbourne (AEST/AEDT)',
    timezoneCode: 'AEST'
  },

  // ==========================================
  // 德国 (DE)
  // ==========================================
  {
    id: 'de-berlin-friedrich',
    streetName: 'Friedrichstraße',
    minNumber: 45,
    maxNumber: 215,
    city: 'Berlin',
    state: 'BE',
    stateFull: 'Berlin',
    postcode: '10117',
    country: 'Germany',
    countryCode: 'DE',
    startCoord: { lat: 52.5120, lng: 13.3880 },
    endCoord: { lat: 52.5280, lng: 13.3880 },
    taxRate: '19% MwSt',
    timezone: 'Europe/Berlin (CET)',
    timezoneCode: 'CET'
  },
  {
    id: 'de-munich-leopold',
    streetName: 'Leopoldstraße',
    minNumber: 20,
    maxNumber: 180,
    city: 'München',
    state: 'BY',
    stateFull: 'Bayern',
    postcode: '80802',
    country: 'Germany',
    countryCode: 'DE',
    startCoord: { lat: 48.1560, lng: 11.5850 },
    endCoord: { lat: 48.1780, lng: 11.5880 },
    taxRate: '19% MwSt',
    timezone: 'Europe/Berlin (CET)',
    timezoneCode: 'CET'
  },
  {
    id: 'de-dusseldorf-koenigsallee',
    streetName: 'Königsallee',
    minNumber: 12,
    maxNumber: 106,
    city: 'Düsseldorf',
    state: 'NW',
    stateFull: 'Nordrhein-Westfalen',
    postcode: '40212',
    country: 'Germany',
    countryCode: 'DE',
    startCoord: { lat: 51.2220, lng: 6.7780 },
    endCoord: { lat: 51.2260, lng: 6.7790 },
    taxRate: '19% MwSt',
    timezone: 'Europe/Berlin (CET)',
    timezoneCode: 'CET'
  },
  {
    id: 'de-frankfurt-zeil',
    streetName: 'Zeil',
    minNumber: 42,
    maxNumber: 128,
    city: 'Frankfurt am Main',
    state: 'HE',
    stateFull: 'Hessen',
    postcode: '60313',
    country: 'Germany',
    countryCode: 'DE',
    startCoord: { lat: 50.1140, lng: 8.6820 },
    endCoord: { lat: 50.1150, lng: 8.6910 },
    taxRate: '19% MwSt',
    timezone: 'Europe/Berlin (CET)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 法国 (FR)
  // ==========================================
  {
    id: 'fr-paris-stgermain',
    streetName: 'Boulevard Saint-Germain',
    minNumber: 35,
    maxNumber: 260,
    city: 'Paris',
    state: 'IDF',
    stateFull: 'Île-de-France',
    postcode: '75005',
    country: 'France',
    countryCode: 'FR',
    startCoord: { lat: 48.8500, lng: 2.3550 },
    endCoord: { lat: 48.8580, lng: 2.3250 },
    taxRate: '20% TVA',
    timezone: 'Europe/Paris (CET)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 日本 (JP) - 街区门牌衍生
  // ==========================================
  {
    id: 'jp-tokyo-jinnan',
    streetName: '東京都渋谷区神南1丁目',
    minNumber: 1,
    maxNumber: 23,
    city: '渋谷区 (Shibuya-ku)',
    state: '13',
    stateFull: '東京都 (Tokyo)',
    postcode: '150-0041',
    country: 'Japan',
    countryCode: 'JP',
    startCoord: { lat: 35.6620, lng: 139.7010 },
    endCoord: { lat: 35.6660, lng: 139.6990 },
    taxRate: '10% 消費税',
    timezone: 'Asia/Tokyo (JST)',
    timezoneCode: 'JST'
  },
  {
    id: 'jp-tokyo-roppongi',
    streetName: '東京都港区六本木6丁目',
    minNumber: 1,
    maxNumber: 15,
    city: '港区 (Minato-ku)',
    state: '13',
    stateFull: '東京都 (Tokyo)',
    postcode: '106-0032',
    country: 'Japan',
    countryCode: 'JP',
    startCoord: { lat: 35.6600, lng: 139.7300 },
    endCoord: { lat: 35.6630, lng: 139.7270 },
    taxRate: '10% 消費税',
    timezone: 'Asia/Tokyo (JST)',
    timezoneCode: 'JST'
  },
  {
    id: 'jp-osaka-minamisenba',
    streetName: '中央区南船場3丁目',
    minNumber: 1,
    maxNumber: 12,
    city: '大阪市 (Osaka-shi)',
    state: '27',
    stateFull: '大阪府 (Osaka)',
    postcode: '542-0081',
    country: 'Japan',
    countryCode: 'JP',
    startCoord: { lat: 34.6750, lng: 135.5000 },
    endCoord: { lat: 34.6790, lng: 135.5010 },
    taxRate: '10% 消費税',
    timezone: 'Asia/Tokyo (JST)',
    timezoneCode: 'JST'
  },

  // ==========================================
  // 中国台湾 (TW) - 街道门牌衍生
  // ==========================================
  {
    id: 'tw-taipei-zhongxiao',
    streetName: '大安區忠孝東路四段',
    minNumber: 45,
    maxNumber: 310,
    city: '大安區 (Da\'an Dist)',
    state: 'TPE',
    stateFull: '台北市 (Taipei City)',
    postcode: '106',
    country: 'Taiwan',
    countryCode: 'TW',
    startCoord: { lat: 25.0415, lng: 121.5450 },
    endCoord: { lat: 25.0420, lng: 121.5560 },
    taxRate: '5% 營業稅',
    timezone: 'Asia/Taipei (CST)',
    timezoneCode: 'CST'
  },

  // ==========================================
  // 中国香港 (HK) - 免税街道门牌衍生
  // ==========================================
  {
    id: 'hk-central-queensrd',
    streetName: "Queen's Road Central",
    minNumber: 40,
    maxNumber: 290,
    city: '中西區 (Central)',
    state: 'CW',
    stateFull: '中西區 (Central & Western)',
    postcode: '999077',
    country: 'Hong Kong',
    countryCode: 'HK',
    startCoord: { lat: 22.2820, lng: 114.1540 },
    endCoord: { lat: 22.2850, lng: 114.1580 },
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'Asia/Hong_Kong (HKT)',
    timezoneCode: 'HKT'
  },

  // ==========================================
  // 新加坡 (SG) - 核心商业区街道衍生
  // ==========================================
  {
    id: 'sg-orchard-road',
    streetName: 'Orchard Rd',
    minNumber: 100,
    maxNumber: 430,
    city: 'Singapore',
    state: 'CR',
    stateFull: 'Central Region',
    postcode: '238865',
    country: 'Singapore',
    countryCode: 'SG',
    startCoord: { lat: 1.3020, lng: 103.8340 },
    endCoord: { lat: 1.3050, lng: 103.8410 },
    taxRate: '9% GST',
    timezone: 'Asia/Singapore (SGT)',
    timezoneCode: 'SGT'
  },

  // ==========================================
  // 意大利 (IT) - 核心大道合法门牌衍生
  // ==========================================
  {
    id: 'it-milano-buenosaires',
    streetName: 'Corso Buenos Aires',
    minNumber: 1,
    maxNumber: 95,
    city: 'Milano',
    state: 'LOM',
    stateFull: 'Lombardia',
    postcode: '20124',
    country: 'Italy',
    countryCode: 'IT',
    startCoord: { lat: 45.4785, lng: 9.2085 },
    endCoord: { lat: 45.4865, lng: 9.2155 },
    taxRate: '22% IVA',
    timezone: 'Europe/Rome (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'it-roma-viadelcorso',
    streetName: 'Via del Corso',
    minNumber: 12,
    maxNumber: 518,
    city: 'Roma',
    state: 'LAZ',
    stateFull: 'Lazio',
    postcode: '00186',
    country: 'Italy',
    countryCode: 'IT',
    startCoord: { lat: 41.9015, lng: 12.4802 },
    endCoord: { lat: 41.9105, lng: 12.4765 },
    taxRate: '22% IVA',
    timezone: 'Europe/Rome (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'it-firenze-calzaiuoli',
    streetName: 'Via dei Calzaiuoli',
    minNumber: 5,
    maxNumber: 110,
    city: 'Firenze',
    state: 'TOS',
    stateFull: 'Toscana',
    postcode: '50122',
    country: 'Italy',
    countryCode: 'IT',
    startCoord: { lat: 43.7712, lng: 11.2552 },
    endCoord: { lat: 43.7698, lng: 11.2558 },
    taxRate: '22% IVA',
    timezone: 'Europe/Rome (CET/CEST)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 西班牙 (ES) - 核心大道合法门牌衍生
  // ==========================================
  {
    id: 'es-madrid-granvia',
    streetName: 'Gran Vía',
    minNumber: 1,
    maxNumber: 82,
    city: 'Madrid',
    state: 'MD',
    stateFull: 'Comunidad de Madrid',
    postcode: '28013',
    country: 'Spain',
    countryCode: 'ES',
    startCoord: { lat: 40.4198, lng: -3.7012 },
    endCoord: { lat: 40.4235, lng: -3.7105 },
    taxRate: '21% IVA',
    timezone: 'Europe/Madrid (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'es-barcelona-gracia',
    streetName: 'Passeig de Gràcia',
    minNumber: 10,
    maxNumber: 135,
    city: 'Barcelona',
    state: 'CT',
    stateFull: 'Catalunya',
    postcode: '08007',
    country: 'Spain',
    countryCode: 'ES',
    startCoord: { lat: 41.3892, lng: 2.1685 },
    endCoord: { lat: 41.3985, lng: 2.1595 },
    taxRate: '21% IVA',
    timezone: 'Europe/Madrid (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'es-valencia-colon',
    streetName: 'Carrer de Colón',
    minNumber: 2,
    maxNumber: 78,
    city: 'Valencia',
    state: 'VC',
    stateFull: 'Comunitat Valenciana',
    postcode: '46004',
    country: 'Spain',
    countryCode: 'ES',
    startCoord: { lat: 39.4685, lng: -0.3742 },
    endCoord: { lat: 39.4715, lng: -0.3685 },
    taxRate: '21% IVA',
    timezone: 'Europe/Madrid (CET/CEST)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 荷兰 (NL) - 运河走廊与商业大街合法门牌衍生
  // ==========================================
  {
    id: 'nl-amsterdam-keizersgracht',
    streetName: 'Keizersgracht',
    minNumber: 100,
    maxNumber: 750,
    city: 'Amsterdam',
    state: 'NH',
    stateFull: 'Noord-Holland',
    postcode: '1016',
    country: 'Netherlands',
    countryCode: 'NL',
    startCoord: { lat: 52.3685, lng: 4.8825 },
    endCoord: { lat: 52.3785, lng: 4.8915 },
    taxRate: '21% BTW',
    timezone: 'Europe/Amsterdam (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'nl-rotterdam-coolsingel',
    streetName: 'Coolsingel',
    minNumber: 10,
    maxNumber: 145,
    city: 'Rotterdam',
    state: 'ZH',
    stateFull: 'Zuid-Holland',
    postcode: '3012',
    country: 'Netherlands',
    countryCode: 'NL',
    startCoord: { lat: 51.9215, lng: 4.4785 },
    endCoord: { lat: 51.9255, lng: 4.4812 },
    taxRate: '21% BTW',
    timezone: 'Europe/Amsterdam (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'nl-denhaag-spuistraat',
    streetName: 'Spuistraat',
    minNumber: 5,
    maxNumber: 95,
    city: 'Den Haag',
    state: 'ZH',
    stateFull: 'Zuid-Holland',
    postcode: '2511',
    country: 'Netherlands',
    countryCode: 'NL',
    startCoord: { lat: 52.0765, lng: 4.3125 },
    endCoord: { lat: 52.0792, lng: 4.3165 },
    taxRate: '21% BTW',
    timezone: 'Europe/Amsterdam (CET/CEST)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 瑞士 (CH) - 免税/低税金融大街合法门牌衍生
  // ==========================================
  {
    id: 'ch-zurich-bahnhofstrasse',
    streetName: 'Bahnhofstrasse',
    minNumber: 1,
    maxNumber: 110,
    city: 'Zürich',
    state: 'ZH',
    stateFull: 'Zürich',
    postcode: '8001',
    country: 'Switzerland',
    countryCode: 'CH',
    startCoord: { lat: 47.3675, lng: 8.5398 },
    endCoord: { lat: 47.3775, lng: 8.5405 },
    isTaxFree: true,
    taxRate: '8.1% (低税特区)',
    timezone: 'Europe/Zurich (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'ch-geneva-ruedurhone',
    streetName: 'Rue du Rhône',
    minNumber: 10,
    maxNumber: 120,
    city: 'Genève',
    state: 'GE',
    stateFull: 'Genève',
    postcode: '1204',
    country: 'Switzerland',
    countryCode: 'CH',
    startCoord: { lat: 46.2045, lng: 6.1485 },
    endCoord: { lat: 46.2052, lng: 6.1542 },
    isTaxFree: true,
    taxRate: '8.1% (低税特区)',
    timezone: 'Europe/Zurich (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'ch-basel-freiestrasse',
    streetName: 'Freie Strasse',
    minNumber: 15,
    maxNumber: 105,
    city: 'Basel',
    state: 'BS',
    stateFull: 'Basel-Stadt',
    postcode: '4001',
    country: 'Switzerland',
    countryCode: 'CH',
    startCoord: { lat: 47.5552, lng: 7.5912 },
    endCoord: { lat: 47.5585, lng: 7.5885 },
    isTaxFree: true,
    taxRate: '8.1% (低税特区)',
    timezone: 'Europe/Zurich (CET/CEST)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 卢森堡 (LU) - 欧洲低税金融大公国核心大道
  // ==========================================
  {
    id: 'lu-luxembourg-grandrue',
    streetName: 'Grand-Rue',
    minNumber: 5,
    maxNumber: 95,
    city: 'Luxembourg',
    state: 'LU',
    stateFull: 'Luxembourg',
    postcode: '1661',
    country: 'Luxembourg',
    countryCode: 'LU',
    startCoord: { lat: 49.6115, lng: 6.1285 },
    endCoord: { lat: 49.6125, lng: 6.1342 },
    isTaxFree: true,
    taxRate: '17% (欧洲低增值税)',
    timezone: 'Europe/Luxembourg (CET/CEST)',
    timezoneCode: 'CET'
  },
  {
    id: 'lu-luxembourg-liberte',
    streetName: 'Avenue de la Liberté',
    minNumber: 20,
    maxNumber: 140,
    city: 'Luxembourg',
    state: 'LU',
    stateFull: 'Luxembourg',
    postcode: '1930',
    country: 'Luxembourg',
    countryCode: 'LU',
    startCoord: { lat: 49.6015, lng: 6.1305 },
    endCoord: { lat: 49.6085, lng: 6.1325 },
    isTaxFree: true,
    taxRate: '17% (欧洲低增值税)',
    timezone: 'Europe/Luxembourg (CET/CEST)',
    timezoneCode: 'CET'
  },

  // ==========================================
  // 爱尔兰 (IE) - 欧洲低税科技中心主轴街道
  // ==========================================
  {
    id: 'ie-dublin-oconnell',
    streetName: "O'Connell St",
    minNumber: 10,
    maxNumber: 88,
    city: 'Dublin',
    state: 'D',
    stateFull: 'Dublin',
    postcode: 'D01',
    country: 'Ireland',
    countryCode: 'IE',
    startCoord: { lat: 53.3485, lng: -6.2605 },
    endCoord: { lat: 53.3535, lng: -6.2615 },
    isTaxFree: true,
    taxRate: '12.5% (企业低税特区)',
    timezone: 'Europe/Dublin (GMT/IST)',
    timezoneCode: 'GMT'
  },
  {
    id: 'ie-cork-stpatrick',
    streetName: "St Patrick's St",
    minNumber: 15,
    maxNumber: 125,
    city: 'Cork',
    state: 'C',
    stateFull: 'Cork',
    postcode: 'T12',
    country: 'Ireland',
    countryCode: 'IE',
    startCoord: { lat: 51.8985, lng: -8.4725 },
    endCoord: { lat: 51.9005, lng: -8.4685 },
    isTaxFree: true,
    taxRate: '12.5% (企业低税特区)',
    timezone: 'Europe/Dublin (GMT/IST)',
    timezoneCode: 'GMT'
  },

  // ==========================================
  // 韩国 (KR) - 首尔核心CBD与科技谷走廊
  // ==========================================
  {
    id: 'kr-seoul-teheran',
    streetName: 'Teheran-ro',
    minNumber: 100,
    maxNumber: 530,
    city: 'Seoul',
    state: '11',
    stateFull: 'Seoul',
    postcode: '06164',
    country: 'South Korea',
    countryCode: 'KR',
    startCoord: { lat: 37.4985, lng: 127.0285 },
    endCoord: { lat: 37.5085, lng: 127.0615 },
    taxRate: '10% VAT',
    timezone: 'Asia/Seoul (KST)',
    timezoneCode: 'KST'
  },
  {
    id: 'kr-seoul-gangnamdaero',
    streetName: 'Gangnam-daero',
    minNumber: 200,
    maxNumber: 620,
    city: 'Seoul',
    state: '11',
    stateFull: 'Seoul',
    postcode: '06038',
    country: 'South Korea',
    countryCode: 'KR',
    startCoord: { lat: 37.4925, lng: 127.0265 },
    endCoord: { lat: 37.5145, lng: 127.0215 },
    taxRate: '10% VAT',
    timezone: 'Asia/Seoul (KST)',
    timezoneCode: 'KST'
  },
  {
    id: 'kr-seoul-jongro',
    streetName: 'Jong-ro',
    minNumber: 50,
    maxNumber: 450,
    city: 'Seoul',
    state: '11',
    stateFull: 'Seoul',
    postcode: '03138',
    country: 'South Korea',
    countryCode: 'KR',
    startCoord: { lat: 37.5705, lng: 126.9835 },
    endCoord: { lat: 37.5725, lng: 127.0125 },
    taxRate: '10% VAT',
    timezone: 'Asia/Seoul (KST)',
    timezoneCode: 'KST'
  },

  // ==========================================
  // 马来西亚 (MY) - 吉隆坡与雪兰莪核心大道
  // ==========================================
  {
    id: 'my-kl-bukitbintang',
    streetName: 'Jalan Bukit Bintang',
    minNumber: 20,
    maxNumber: 180,
    city: 'Kuala Lumpur',
    state: 'KUL',
    stateFull: 'Kuala Lumpur',
    postcode: '55100',
    country: 'Malaysia',
    countryCode: 'MY',
    startCoord: { lat: 3.1465, lng: 101.7105 },
    endCoord: { lat: 3.1495, lng: 101.7165 },
    taxRate: '0% (SST Specific)',
    timezone: 'Asia/Kuala_Lumpur (MYT)',
    timezoneCode: 'MYT'
  },
  {
    id: 'my-pj-universiti',
    streetName: 'Jalan Universiti',
    minNumber: 10,
    maxNumber: 125,
    city: 'Petaling Jaya',
    state: 'SGR',
    stateFull: 'Selangor',
    postcode: '46200',
    country: 'Malaysia',
    countryCode: 'MY',
    startCoord: { lat: 3.1185, lng: 101.6485 },
    endCoord: { lat: 3.1245, lng: 101.6545 },
    taxRate: '0% (SST Specific)',
    timezone: 'Asia/Kuala_Lumpur (MYT)',
    timezoneCode: 'MYT'
  },

  // ==========================================
  // 泰国 (TH) - 曼谷核心素坤逸与是隆走廊
  // ==========================================
  {
    id: 'th-bangkok-sukhumvit',
    streetName: 'Sukhumvit Rd',
    minNumber: 100,
    maxNumber: 950,
    city: 'Bangkok',
    state: '10',
    stateFull: 'Bangkok',
    postcode: '10110',
    country: 'Thailand',
    countryCode: 'TH',
    startCoord: { lat: 13.7385, lng: 100.5585 },
    endCoord: { lat: 13.7215, lng: 100.5845 },
    taxRate: '7% VAT',
    timezone: 'Asia/Bangkok (ICT)',
    timezoneCode: 'ICT'
  },
  {
    id: 'th-bangkok-silom',
    streetName: 'Silom Rd',
    minNumber: 20,
    maxNumber: 350,
    city: 'Bangkok',
    state: '10',
    stateFull: 'Bangkok',
    postcode: '10500',
    country: 'Thailand',
    countryCode: 'TH',
    startCoord: { lat: 13.7245, lng: 100.5285 },
    endCoord: { lat: 13.7295, lng: 100.5365 },
    taxRate: '7% VAT',
    timezone: 'Asia/Bangkok (ICT)',
    timezoneCode: 'ICT'
  },

  // ==========================================
  // 越南 (VN) - 胡志明与河内商业主轴
  // ==========================================
  {
    id: 'vn-hcm-nguyenhue',
    streetName: 'Nguyen Hue Blvd',
    minNumber: 10,
    maxNumber: 165,
    city: 'Ho Chi Minh City',
    state: 'SG',
    stateFull: 'Ho Chi Minh City',
    postcode: '700000',
    country: 'Vietnam',
    countryCode: 'VN',
    startCoord: { lat: 10.7725, lng: 106.7025 },
    endCoord: { lat: 10.7765, lng: 106.7065 },
    taxRate: '10% VAT',
    timezone: 'Asia/Ho_Chi_Minh (ICT)',
    timezoneCode: 'ICT'
  },
  {
    id: 'vn-hanoi-trangtien',
    streetName: 'Trang Tien St',
    minNumber: 12,
    maxNumber: 98,
    city: 'Hanoi',
    state: 'HN',
    stateFull: 'Hanoi',
    postcode: '100000',
    country: 'Vietnam',
    countryCode: 'VN',
    startCoord: { lat: 21.0245, lng: 105.8545 },
    endCoord: { lat: 21.0265, lng: 105.8595 },
    taxRate: '10% VAT',
    timezone: 'Asia/Ho_Chi_Minh (ICT)',
    timezoneCode: 'ICT'
  },

  // ==========================================
  // 菲律宾 (PH) - 马卡蒂CBD与奎松走廊
  // ==========================================
  {
    id: 'ph-makati-ayala',
    streetName: 'Ayala Ave',
    minNumber: 100,
    maxNumber: 680,
    city: 'Makati',
    state: '00',
    stateFull: 'National Capital Region',
    postcode: '1226',
    country: 'Philippines',
    countryCode: 'PH',
    startCoord: { lat: 14.5515, lng: 121.0185 },
    endCoord: { lat: 14.5585, lng: 121.0265 },
    taxRate: '12% VAT',
    timezone: 'Asia/Manila (PHT)',
    timezoneCode: 'PHT'
  },
  {
    id: 'ph-quezon-katipunan',
    streetName: 'Katipunan Ave',
    minNumber: 50,
    maxNumber: 380,
    city: 'Quezon City',
    state: '00',
    stateFull: 'National Capital Region',
    postcode: '1108',
    country: 'Philippines',
    countryCode: 'PH',
    startCoord: { lat: 14.6415, lng: 121.0745 },
    endCoord: { lat: 14.6525, lng: 121.0765 },
    taxRate: '12% VAT',
    timezone: 'Asia/Manila (PHT)',
    timezoneCode: 'PHT'
  }
];

export function getDerivationRule(countryCode: CountryCode, stateCode?: string, isTaxFreeOnly?: boolean): StreetDerivationRule | null {
  let candidates = STREET_DERIVATION_RULES.filter(r => r.countryCode === countryCode);
  if (candidates.length === 0) return null;

  if (stateCode) {
    const matchedState = candidates.filter(r => matchesState(r.state, r.stateFull, stateCode));
    if (matchedState.length === 0) {
      return null;
    }
    candidates = matchedState;
  }

  if (isTaxFreeOnly) {
    const taxFree = candidates.filter(r => r.isTaxFree);
    if (taxFree.length === 0) {
      return null;
    }
    candidates = taxFree;
  }

  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx] || null;
}

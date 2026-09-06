import type { RealAddress } from '../../types/identity';

export const US_ADDRESSES: RealAddress[] = [
  // --- 5大免税州 (No Sales Tax States) ---

  // 1. 特拉华州 (Delaware - DE) - 著名免税州住宅名邸
  {
    street: '115 S Market St, Apt 804',
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19801',
    country: 'United States',
    countryCode: 'US',
    lat: 39.7348,
    lng: -75.5492,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '1208 N Washington St, Apt 3B',
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19801',
    country: 'United States',
    countryCode: 'US',
    lat: 39.7495,
    lng: -75.5518,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '280 E Main St, Apt 215',
    city: 'Newark',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19711',
    country: 'United States',
    countryCode: 'US',
    lat: 39.6842,
    lng: -75.7420,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '100 Rockland Falls Rd, Apt 12',
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19803',
    country: 'United States',
    countryCode: 'US',
    lat: 39.7820,
    lng: -75.5780,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 2. 俄勒冈州 (Oregon - OR) - 西海岸免税州品质公寓
  {
    street: '311 NW 12th Ave, Apt 702',
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97209',
    country: 'United States',
    countryCode: 'US',
    lat: 45.5255,
    lng: -122.6835,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '3550 S Bond Ave, Apt 1402',
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97239',
    country: 'United States',
    countryCode: 'US',
    lat: 45.4982,
    lng: -122.6705,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '12695 SW Crescent St, Apt 412',
    city: 'Beaverton',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97005',
    country: 'United States',
    countryCode: 'US',
    lat: 45.4880,
    lng: -122.8070,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '6450 NE Brighton St, Apt 204',
    city: 'Hillsboro',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97124',
    country: 'United States',
    countryCode: 'US',
    lat: 45.5342,
    lng: -122.9150,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // 3. 蒙大拿州 (Montana - MT) - 免税州优质住宅
  {
    street: '1205 Rimrock Rd, Apt 4',
    city: 'Billings',
    state: 'MT',
    stateFull: 'Montana',
    postcode: '59102',
    country: 'United States',
    countryCode: 'US',
    lat: 45.7950,
    lng: -108.5380,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Denver (MST/MDT)',
    timezoneCode: 'MST'
  },
  {
    street: '2335 Poly Dr, Apt 102',
    city: 'Billings',
    state: 'MT',
    stateFull: 'Montana',
    postcode: '59102',
    country: 'United States',
    countryCode: 'US',
    lat: 45.8010,
    lng: -108.5520,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Denver (MST/MDT)',
    timezoneCode: 'MST'
  },

  // 4. 新罕布什尔州 (New Hampshire - NH) - 免税州精品公寓
  {
    street: '20 Queen City Ave, Apt 304',
    city: 'Manchester',
    state: 'NH',
    stateFull: 'New Hampshire',
    postcode: '03101',
    country: 'United States',
    countryCode: 'US',
    lat: 42.9785,
    lng: -71.4645,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '250 Commercial St, Apt 410',
    city: 'Manchester',
    state: 'NH',
    stateFull: 'New Hampshire',
    postcode: '03101',
    country: 'United States',
    countryCode: 'US',
    lat: 42.9940,
    lng: -71.4680,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 5. 阿拉斯加州 (Alaska - AK) - 免税州海湾公寓
  {
    street: '2800 W 32nd Ave, Apt 2B',
    city: 'Anchorage',
    state: 'AK',
    stateFull: 'Alaska',
    postcode: '99517',
    country: 'United States',
    countryCode: 'US',
    lat: 61.1925,
    lng: -149.9320,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Anchorage (AKST)',
    timezoneCode: 'AKST'
  },

  // --- 常用都会与品质住宅区 ---

  // 加利福尼亚州 (CA) - 都会名邸公寓
  {
    street: '1 W Century Dr, Apt 18A',
    city: 'Los Angeles',
    state: 'CA',
    stateFull: 'California',
    postcode: '90067',
    country: 'United States',
    countryCode: 'US',
    lat: 34.0570,
    lng: -118.4180,
    isTaxFree: false,
    taxRate: '9.50%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '201 Folsom St, Apt 22B',
    city: 'San Francisco',
    state: 'CA',
    stateFull: 'California',
    postcode: '94105',
    country: 'United States',
    countryCode: 'US',
    lat: 37.7895,
    lng: -122.3920,
    isTaxFree: false,
    taxRate: '8.63%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '20688 Stevens Creek Blvd, Apt 305',
    city: 'Cupertino',
    state: 'CA',
    stateFull: 'California',
    postcode: '95014',
    country: 'United States',
    countryCode: 'US',
    lat: 37.3228,
    lng: -122.0360,
    isTaxFree: false,
    taxRate: '9.13%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // 纽约州 (NY) - 曼哈顿高层公寓
  {
    street: '322 W 57th St, Apt 26D',
    city: 'New York',
    state: 'NY',
    stateFull: 'New York',
    postcode: '10019',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7675,
    lng: -73.9840,
    isTaxFree: false,
    taxRate: '8.875%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '151 W 21st St, Apt 8A',
    city: 'New York',
    state: 'NY',
    stateFull: 'New York',
    postcode: '10011',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7425,
    lng: -73.9960,
    isTaxFree: false,
    taxRate: '8.875%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 德克萨斯州 (TX) - 都会住宅名邸
  {
    street: '200 Congress Ave, Apt 24C',
    city: 'Austin',
    state: 'TX',
    stateFull: 'Texas',
    postcode: '78701',
    country: 'United States',
    countryCode: 'US',
    lat: 30.2642,
    lng: -97.7440,
    isTaxFree: false,
    taxRate: '8.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },
  {
    street: '1400 McKinney St, Apt 15B',
    city: 'Houston',
    state: 'TX',
    stateFull: 'Texas',
    postcode: '77010',
    country: 'United States',
    countryCode: 'US',
    lat: 29.7540,
    lng: -95.3585,
    isTaxFree: false,
    taxRate: '8.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },

  // 佛罗里达州 (FL) - 迈阿密海湾公寓
  {
    street: '1451 Brickell Ave, Apt 3201',
    city: 'Miami',
    state: 'FL',
    stateFull: 'Florida',
    postcode: '33131',
    country: 'United States',
    countryCode: 'US',
    lat: 25.7595,
    lng: -80.1925,
    isTaxFree: false,
    taxRate: '7.00%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 华盛顿州 (WA) - 西雅图都会公寓
  {
    street: '588 Bell St, Apt 1908',
    city: 'Seattle',
    state: 'WA',
    stateFull: 'Washington',
    postcode: '98121',
    country: 'United States',
    countryCode: 'US',
    lat: 47.6165,
    lng: -122.3420,
    isTaxFree: false,
    taxRate: '10.25%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // 伊利诺伊州 (IL) - 芝加哥千禧公园景致公寓
  {
    street: '60 E Monroe St, Apt 35A',
    city: 'Chicago',
    state: 'IL',
    stateFull: 'Illinois',
    postcode: '60603',
    country: 'United States',
    countryCode: 'US',
    lat: 41.8810,
    lng: -87.6255,
    isTaxFree: false,
    taxRate: '10.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },

  // 新泽西州 (NJ) - 哈德逊河畔景观公寓
  {
    street: '77 Hudson St, Apt 28A',
    city: 'Jersey City',
    state: 'NJ',
    stateFull: 'New Jersey',
    postcode: '07302',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7155,
    lng: -74.0340,
    isTaxFree: false,
    taxRate: '6.625%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 马萨诸塞州 (MA) - 波士顿后湾精品公寓
  {
    street: '400 Stuart St, Apt 16B',
    city: 'Boston',
    state: 'MA',
    stateFull: 'Massachusetts',
    postcode: '02116',
    country: 'United States',
    countryCode: 'US',
    lat: 42.3490,
    lng: -71.0735,
    isTaxFree: false,
    taxRate: '6.25%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 内华达州 (NV) - 拉斯维加斯都会公寓
  {
    street: '150 Las Vegas Blvd N, Apt 1204',
    city: 'Las Vegas',
    state: 'NV',
    stateFull: 'Nevada',
    postcode: '89101',
    country: 'United States',
    countryCode: 'US',
    lat: 36.1705,
    lng: -115.1415,
    isTaxFree: false,
    taxRate: '8.375%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  }
];

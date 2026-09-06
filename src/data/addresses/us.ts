import type { RealAddress } from '../../types/identity';

export const US_ADDRESSES: RealAddress[] = [
  // --- 5大免税州 (No Sales Tax States) ---

  // 1. 特拉华州 (Delaware - DE) - 著名免税州 & 转运仓重镇
  {
    street: '1201 N Market St, Suite 1400',
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19801',
    country: 'United States',
    countryCode: 'US',
    lat: 39.7458,
    lng: -75.5484,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '1007 N Orange St, 4th Floor',
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19801',
    country: 'United States',
    countryCode: 'US',
    lat: 39.7461,
    lng: -75.5492,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '200 Continental Dr, Suite 401',
    city: 'Newark',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19713',
    country: 'United States',
    countryCode: 'US',
    lat: 39.6738,
    lng: -75.7196,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '1521 Concord Pike, Suite 301',
    city: 'Wilmington',
    state: 'DE',
    stateFull: 'Delaware',
    postcode: '19803',
    country: 'United States',
    countryCode: 'US',
    lat: 39.7758,
    lng: -75.5492,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 2. 俄勒冈州 (Oregon - OR) - 西海岸免税州 & 核心转运仓
  {
    street: '1120 NW Couch St, Suite 600',
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97209',
    country: 'United States',
    countryCode: 'US',
    lat: 45.5235,
    lng: -122.6828,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '15350 SW Sequoia Pkwy, Suite 300',
    city: 'Portland',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97224',
    country: 'United States',
    countryCode: 'US',
    lat: 45.4091,
    lng: -122.7663,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '9450 SW Gemini Dr, Suite 8920',
    city: 'Beaverton',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97008',
    country: 'United States',
    countryCode: 'US',
    lat: 45.4526,
    lng: -122.7844,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '2501 NE Century Blvd',
    city: 'Hillsboro',
    state: 'OR',
    stateFull: 'Oregon',
    postcode: '97124',
    country: 'United States',
    countryCode: 'US',
    lat: 45.5412,
    lng: -122.9238,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // 3. 蒙大拿州 (Montana - MT) - 免税州
  {
    street: '2822 3rd Ave N, Suite 200',
    city: 'Billings',
    state: 'MT',
    stateFull: 'Montana',
    postcode: '59101',
    country: 'United States',
    countryCode: 'US',
    lat: 45.7838,
    lng: -108.5039,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Denver (MST/MDT)',
    timezoneCode: 'MST'
  },
  {
    street: '100 N 27th St, Suite 500',
    city: 'Billings',
    state: 'MT',
    stateFull: 'Montana',
    postcode: '59101',
    country: 'United States',
    countryCode: 'US',
    lat: 45.7845,
    lng: -108.5065,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Denver (MST/MDT)',
    timezoneCode: 'MST'
  },

  // 4. 新罕布什尔州 (New Hampshire - NH) - 免税州
  {
    street: '1000 Elm St, Suite 1200',
    city: 'Manchester',
    state: 'NH',
    stateFull: 'New Hampshire',
    postcode: '03101',
    country: 'United States',
    countryCode: 'US',
    lat: 42.9922,
    lng: -71.4639,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '40 Stark St',
    city: 'Manchester',
    state: 'NH',
    stateFull: 'New Hampshire',
    postcode: '03101',
    country: 'United States',
    countryCode: 'US',
    lat: 42.9961,
    lng: -71.4632,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 5. 阿拉斯加州 (Alaska - AK) - 免税州
  {
    street: '3800 Centerpoint Dr, Suite 100',
    city: 'Anchorage',
    state: 'AK',
    stateFull: 'Alaska',
    postcode: '99503',
    country: 'United States',
    countryCode: 'US',
    lat: 61.1872,
    lng: -149.8887,
    isTaxFree: true,
    taxRate: '0.00% (No Sales Tax)',
    timezone: 'America/Anchorage (AKST)',
    timezoneCode: 'AKST'
  },

  // --- 常用都会与商业州 ---

  // 加利福尼亚州 (CA)
  {
    street: '10880 Wilshire Blvd, Suite 1101',
    city: 'Los Angeles',
    state: 'CA',
    stateFull: 'California',
    postcode: '90024',
    country: 'United States',
    countryCode: 'US',
    lat: 34.0583,
    lng: -118.4419,
    isTaxFree: false,
    taxRate: '9.50%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '1355 Market St, Suite 900',
    city: 'San Francisco',
    state: 'CA',
    stateFull: 'California',
    postcode: '94103',
    country: 'United States',
    countryCode: 'US',
    lat: 37.7766,
    lng: -122.4170,
    isTaxFree: false,
    taxRate: '8.63%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },
  {
    street: '1 Infinite Loop',
    city: 'Cupertino',
    state: 'CA',
    stateFull: 'California',
    postcode: '95014',
    country: 'United States',
    countryCode: 'US',
    lat: 37.3318,
    lng: -122.0312,
    isTaxFree: false,
    taxRate: '9.13%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // 纽约州 (NY)
  {
    street: '350 5th Ave',
    city: 'New York',
    state: 'NY',
    stateFull: 'New York',
    postcode: '10118',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7484,
    lng: -73.9857,
    isTaxFree: false,
    taxRate: '8.875%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },
  {
    street: '111 8th Ave',
    city: 'New York',
    state: 'NY',
    stateFull: 'New York',
    postcode: '10011',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7410,
    lng: -74.0025,
    isTaxFree: false,
    taxRate: '8.875%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 德克萨斯州 (TX)
  {
    street: '500 W 2nd St, Suite 1900',
    city: 'Austin',
    state: 'TX',
    stateFull: 'Texas',
    postcode: '78701',
    country: 'United States',
    countryCode: 'US',
    lat: 30.2662,
    lng: -97.7487,
    isTaxFree: false,
    taxRate: '8.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },
  {
    street: '1000 Louisiana St, Suite 4000',
    city: 'Houston',
    state: 'TX',
    stateFull: 'Texas',
    postcode: '77002',
    country: 'United States',
    countryCode: 'US',
    lat: 29.7564,
    lng: -95.3686,
    isTaxFree: false,
    taxRate: '8.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },

  // 佛罗里达州 (FL)
  {
    street: '600 Brickell Ave, Suite 1900',
    city: 'Miami',
    state: 'FL',
    stateFull: 'Florida',
    postcode: '33131',
    country: 'United States',
    countryCode: 'US',
    lat: 25.7675,
    lng: -80.1915,
    isTaxFree: false,
    taxRate: '7.00%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 华盛顿州 (WA)
  {
    street: '400 9th Ave N',
    city: 'Seattle',
    state: 'WA',
    stateFull: 'Washington',
    postcode: '98109',
    country: 'United States',
    countryCode: 'US',
    lat: 47.6225,
    lng: -122.3385,
    isTaxFree: false,
    taxRate: '10.25%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  },

  // 伊利诺伊州 (IL)
  {
    street: '233 S Wacker Dr',
    city: 'Chicago',
    state: 'IL',
    stateFull: 'Illinois',
    postcode: '60606',
    country: 'United States',
    countryCode: 'US',
    lat: 41.8789,
    lng: -87.6359,
    isTaxFree: false,
    taxRate: '10.25%',
    timezone: 'America/Chicago (CST/CDT)',
    timezoneCode: 'CST'
  },

  // 新泽西州 (NJ)
  {
    street: '101 Hudson St, Suite 2100',
    city: 'Jersey City',
    state: 'NJ',
    stateFull: 'New Jersey',
    postcode: '07302',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7169,
    lng: -74.0337,
    isTaxFree: false,
    taxRate: '6.625%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 马萨诸塞州 (MA)
  {
    street: '500 Boylston St, Suite 1200',
    city: 'Boston',
    state: 'MA',
    stateFull: 'Massachusetts',
    postcode: '02116',
    country: 'United States',
    countryCode: 'US',
    lat: 42.3508,
    lng: -71.0722,
    isTaxFree: false,
    taxRate: '6.25%',
    timezone: 'America/New_York (EST/EDT)',
    timezoneCode: 'EST'
  },

  // 内华达州 (NV) - 拉斯维加斯金融商业中心
  {
    street: '300 S 4th St, Suite 1400',
    city: 'Las Vegas',
    state: 'NV',
    stateFull: 'Nevada',
    postcode: '89101',
    country: 'United States',
    countryCode: 'US',
    lat: 36.1668,
    lng: -115.1435,
    isTaxFree: false,
    taxRate: '8.375%',
    timezone: 'America/Los_Angeles (PST/PDT)',
    timezoneCode: 'PST'
  }
];

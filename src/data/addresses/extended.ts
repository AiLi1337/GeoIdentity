import type { RealAddress } from '../../types/identity';

export const EXTENDED_ADDRESSES: Record<string, RealAddress[]> = {
  // --- 韩国 (KR) ---
  KR: [
    {
      street: '서초구 반포대로 275 래미안 원베일리 (Raemian One Bailey, 275 Banpo-daero, Seocho-gu)',
      city: '서초구 (Seocho-gu)',
      state: '11',
      stateFull: '서울특별시 (Seoul)',
      postcode: '06544',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 37.5055,
      lng: 127.0055,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    },
    {
      street: '강남구 압구정로 201 현대아파트 (Hyundai Apartments, 201 Apgujeong-ro, Gangnam-gu)',
      city: '강남구 (Gangnam-gu)',
      state: '11',
      stateFull: '서울특별시 (Seoul)',
      postcode: '06001',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 37.5315,
      lng: 127.0295,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    },
    {
      street: '해운대구 마린시티2로 33 해운대 두산위브더제니스 (Haeundae Doosan We\'ve The Zenith, 33 Marine city 2-ro)',
      city: '해운대구 (Haeundae-gu)',
      state: '26',
      stateFull: '부산광역시 (Busan)',
      postcode: '48119',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 35.1575,
      lng: 129.1455,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    },
    {
      street: '분당구 백현로 97 판교 푸르지오 그랑블 (Pangyo Prugio Grandble, 97 Baekhyeon-ro, Bundang-gu)',
      city: '성남시 분당구 (Seongnam-si)',
      state: '41',
      stateFull: '경기도 (Gyeonggi-do)',
      postcode: '13524',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 37.3915,
      lng: 127.1145,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    }
  ],

  // --- 瑞士 (CH) - 低税/免税特区 ---
  CH: [
    {
      street: 'Chamerstrasse 44, Apt 3A',
      city: 'Zug',
      state: 'ZG',
      stateFull: 'Zug (Tax Haven / Crypto Valley)',
      postcode: '6300',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 47.1720,
      lng: 8.5080,
      isTaxFree: true,
      taxRate: 'Low Tax Haven (7.7% VAT)',
      timezone: 'Europe/Zurich (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Seestrasse 112, Apt 4B',
      city: 'Zürich',
      state: 'ZH',
      stateFull: 'Zurich',
      postcode: '8002',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 47.3615,
      lng: 8.5325,
      timezone: 'Europe/Zurich (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Route de Malagnou 28, Apt 5',
      city: 'Genève',
      state: 'GE',
      stateFull: 'Geneva',
      postcode: '1208',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 46.1975,
      lng: 6.1610,
      timezone: 'Europe/Zurich (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 卢森堡 (LU) - 欧洲低税特区 ---
  LU: [
    {
      street: '18 Rue Tony Neuman, Apt 4',
      city: 'Luxembourg',
      state: 'LU-LU',
      stateFull: 'Luxembourg City',
      postcode: '2241',
      country: 'Luxembourg',
      countryCode: 'LU',
      lat: 49.6240,
      lng: 6.1215,
      isTaxFree: true,
      taxRate: 'Tax Favored Zone',
      timezone: 'Europe/Luxembourg (CET)',
      timezoneCode: 'CET'
    },
    {
      street: '25 Boulevard de la Pétrusse, Apt 8',
      city: 'Luxembourg',
      state: 'LU-LU',
      stateFull: 'Luxembourg City',
      postcode: '2320',
      country: 'Luxembourg',
      countryCode: 'LU',
      lat: 49.6055,
      lng: 6.1310,
      isTaxFree: true,
      taxRate: 'Tax Favored Zone',
      timezone: 'Europe/Luxembourg (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 爱尔兰 (IE) - 欧洲科技与低税枢纽 ---
  IE: [
    {
      street: 'The Gasworks, South Lotts Rd, Apt 124',
      city: 'Dublin',
      state: 'D',
      stateFull: 'Dublin',
      postcode: 'D04 W2R8',
      country: 'Ireland',
      countryCode: 'IE',
      lat: 53.3395,
      lng: -6.2345,
      isTaxFree: true,
      taxRate: 'Tech Hub Low Corporate Tax',
      timezone: 'Europe/Dublin (GMT/IST)',
      timezoneCode: 'GMT'
    },
    {
      street: 'Elysian Tower, Eglinton St, Apt 804',
      city: 'Cork',
      state: 'C',
      stateFull: 'Cork',
      postcode: 'T12 D65X',
      country: 'Ireland',
      countryCode: 'IE',
      lat: 51.8965,
      lng: -8.4635,
      timezone: 'Europe/Dublin (GMT/IST)',
      timezoneCode: 'GMT'
    }
  ],

  // --- 意大利 (IT) ---
  IT: [
    {
      street: 'Bosco Verticale, Via Gaetano de Castillia 11, Apt 14A',
      city: 'Milano',
      state: 'LOM',
      stateFull: 'Lombardy',
      postcode: '20124',
      country: 'Italy',
      countryCode: 'IT',
      lat: 45.4858,
      lng: 9.1905,
      timezone: 'Europe/Rome (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Via dei Condotti 61, Apt 5',
      city: 'Roma',
      state: 'LAZ',
      stateFull: 'Lazio',
      postcode: '00187',
      country: 'Italy',
      countryCode: 'IT',
      lat: 41.9055,
      lng: 12.4815,
      timezone: 'Europe/Rome (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Viale Antonio Gramsci 18, Apt 6',
      city: 'Firenze',
      state: 'TOS',
      stateFull: 'Tuscany',
      postcode: '50121',
      country: 'Italy',
      countryCode: 'IT',
      lat: 43.7745,
      lng: 11.2705,
      timezone: 'Europe/Rome (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 西班牙 (ES) ---
  ES: [
    {
      street: 'Calle de Serrano 84, Apt 4B',
      city: 'Madrid',
      state: 'MD',
      stateFull: 'Community of Madrid',
      postcode: '28006',
      country: 'Spain',
      countryCode: 'ES',
      lat: 40.4315,
      lng: -3.6875,
      timezone: 'Europe/Madrid (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Passeig de Garcia Fària 75, Apt 12A',
      city: 'Barcelona',
      state: 'CT',
      stateFull: 'Catalonia',
      postcode: '08019',
      country: 'Spain',
      countryCode: 'ES',
      lat: 41.4045,
      lng: 2.2115,
      timezone: 'Europe/Madrid (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 荷兰 (NL) ---
  NL: [
    {
      street: 'Symphony Residences, Gustav Mahlerplein 115, Apt 14B',
      city: 'Amsterdam',
      state: 'NH',
      stateFull: 'North Holland',
      postcode: '1082 MS',
      country: 'Netherlands',
      countryCode: 'NL',
      lat: 52.3360,
      lng: 4.8720,
      timezone: 'Europe/Amsterdam (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'De Rotterdam, Wilhelminakade 177, Apt 2604',
      city: 'Rotterdam',
      state: 'ZH',
      stateFull: 'South Holland',
      postcode: '3072 AP',
      country: 'Netherlands',
      countryCode: 'NL',
      lat: 51.9075,
      lng: 4.4895,
      timezone: 'Europe/Amsterdam (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 马来西亚 (MY) ---
  MY: [
    {
      street: 'The Troika, 19 Persiaran KLCC, Apt B-16-2',
      city: 'Kuala Lumpur',
      state: 'KUL',
      stateFull: 'Federal Territory of Kuala Lumpur',
      postcode: '50450',
      country: 'Malaysia',
      countryCode: 'MY',
      lat: 3.1585,
      lng: 101.7165,
      timezone: 'Asia/Kuala_Lumpur (MYT)',
      timezoneCode: 'MYT'
    },
    {
      street: 'Five Stones, Jalan SS 2/72, Apt A-12-01',
      city: 'Petaling Jaya',
      state: 'SGR',
      stateFull: 'Selangor',
      postcode: '47300',
      country: 'Malaysia',
      countryCode: 'MY',
      lat: 3.1235,
      lng: 101.6285,
      timezone: 'Asia/Kuala_Lumpur (MYT)',
      timezoneCode: 'MYT'
    },
    {
      street: 'The Landmark, Jalan Tanjong Tokong, Apt 22-03',
      city: 'George Town',
      state: 'PNG',
      stateFull: 'Penang',
      postcode: '10470',
      country: 'Malaysia',
      countryCode: 'MY',
      lat: 5.4525,
      lng: 100.3065,
      timezone: 'Asia/Kuala_Lumpur (MYT)',
      timezoneCode: 'MYT'
    }
  ],

  // --- 泰国 (TH) ---
  TH: [
    {
      street: 'The Estelle Phrom Phong, 8 Sukhumvit Soi 26, Apt 1804',
      city: 'Khlong Toei Nuea, Watthana',
      state: 'BKK',
      stateFull: 'Bangkok',
      postcode: '10110',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 13.7275,
      lng: 100.5705,
      timezone: 'Asia/Bangkok (ICT)',
      timezoneCode: 'ICT'
    },
    {
      street: 'Saladaeng One, 1 Soi Sala Daeng 1, Apt 12B',
      city: 'Bang Rak',
      state: 'BKK',
      stateFull: 'Bangkok',
      postcode: '10500',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 13.7265,
      lng: 100.5395,
      timezone: 'Asia/Bangkok (ICT)',
      timezoneCode: 'ICT'
    },
    {
      street: 'The Nimmana Condominium, Soi 6 Nimmanhaemin Rd, Apt 412',
      city: 'Mueang Chiang Mai',
      state: 'CNX',
      stateFull: 'Chiang Mai',
      postcode: '50200',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 18.7985,
      lng: 98.9675,
      timezone: 'Asia/Bangkok (ICT)',
      timezoneCode: 'ICT'
    }
  ],

  // --- 越南 (VN) ---
  VN: [
    {
      street: 'Vinhomes Central Park, 208 Nguyen Huu Canh, Apt P6-1802',
      city: 'Quan Binh Thanh',
      state: 'SGN',
      stateFull: 'Ho Chi Minh City',
      postcode: '700000',
      country: 'Vietnam',
      countryCode: 'VN',
      lat: 10.7935,
      lng: 106.7215,
      timezone: 'Asia/Ho_Chi_Minh (ICT)',
      timezoneCode: 'ICT'
    },
    {
      street: 'Vinhomes Metropolis, 29 Lieu Giai, Apt M1-2204',
      city: 'Ba Dinh',
      state: 'HAN',
      stateFull: 'Hanoi',
      postcode: '100000',
      country: 'Vietnam',
      countryCode: 'VN',
      lat: 21.0325,
      lng: 105.8145,
      timezone: 'Asia/Ho_Chi_Minh (ICT)',
      timezoneCode: 'ICT'
    }
  ],

  // --- 菲律宾 (PH) ---
  PH: [
    {
      street: 'One Serendra, 11th Ave, BGC, Apt 16B',
      city: 'Taguig',
      state: 'MNL',
      stateFull: 'Metro Manila',
      postcode: '1634',
      country: 'Philippines',
      countryCode: 'PH',
      lat: 14.5510,
      lng: 121.0535,
      timezone: 'Asia/Manila (PHT)',
      timezoneCode: 'PHT'
    },
    {
      street: 'The Residences at Greenbelt, Esperanza St, Apt 24C',
      city: 'Makati',
      state: 'MNL',
      stateFull: 'Metro Manila',
      postcode: '1228',
      country: 'Philippines',
      countryCode: 'PH',
      lat: 14.5525,
      lng: 121.0185,
      timezone: 'Asia/Manila (PHT)',
      timezoneCode: 'PHT'
    }
  ]
};

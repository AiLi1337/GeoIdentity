import type { RealAddress } from '../../types/identity';

export const EXTENDED_ADDRESSES: Record<string, RealAddress[]> = {
  // --- 韩国 (KR) ---
  KR: [
    {
      street: '강남대로 396 (396 Gangnam-daero, Gangnam-gu)',
      city: '강남구 (Gangnam-gu)',
      state: '11',
      stateFull: '서울특별시 (Seoul)',
      postcode: '06232',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 37.4981,
      lng: 127.0276,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    },
    {
      street: '테헤란로 152 강남파이낸스센터 (152 Teheran-ro, GFC)',
      city: '강남구 (Gangnam-gu)',
      state: '11',
      stateFull: '서울특별시 (Seoul)',
      postcode: '06236',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 37.5003,
      lng: 127.0366,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    },
    {
      street: '해운대해변로 298번길 (298 Haeundaehaebyeon-ro)',
      city: '해운대구 (Haeundae-gu)',
      state: '26',
      stateFull: '부산광역시 (Busan)',
      postcode: '48099',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 35.1601,
      lng: 129.1624,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    },
    {
      street: '분당구 판교역로 146번길 20 (20 Pangyoyeok-ro 146beon-gil)',
      city: '성남시 분당구 (Seongnam-si)',
      state: '41',
      stateFull: '경기도 (Gyeonggi-do)',
      postcode: '13529',
      country: 'South Korea',
      countryCode: 'KR',
      lat: 37.3949,
      lng: 127.1118,
      timezone: 'Asia/Seoul (KST)',
      timezoneCode: 'KST'
    }
  ],

  // --- 瑞士 (CH) - 低税/免税特区 ---
  CH: [
    {
      street: 'Baarerstrasse 53',
      city: 'Zug',
      state: 'ZG',
      stateFull: 'Zug (Tax Haven / Crypto Valley)',
      postcode: '6300',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 47.1729,
      lng: 8.5186,
      isTaxFree: true,
      taxRate: 'Low Tax Haven (7.7% VAT)',
      timezone: 'Europe/Zurich (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Bahnhofstrasse 45',
      city: 'Zürich',
      state: 'ZH',
      stateFull: 'Zurich',
      postcode: '8001',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 47.3718,
      lng: 8.5385,
      timezone: 'Europe/Zurich (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Rue du Rhône 42',
      city: 'Genève',
      state: 'GE',
      stateFull: 'Geneva',
      postcode: '1204',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 46.2044,
      lng: 6.1481,
      timezone: 'Europe/Zurich (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 卢森堡 (LU) - 欧洲低税特区 ---
  LU: [
    {
      street: '35 Boulevard Prince Henri',
      city: 'Luxembourg',
      state: 'LU-LU',
      stateFull: 'Luxembourg City',
      postcode: '1724',
      country: 'Luxembourg',
      countryCode: 'LU',
      lat: 49.6133,
      lng: 6.1264,
      isTaxFree: true,
      taxRate: 'Tax Favored Zone',
      timezone: 'Europe/Luxembourg (CET)',
      timezoneCode: 'CET'
    },
    {
      street: '2 Avenue Charles de Gaulle',
      city: 'Luxembourg',
      state: 'LU-LU',
      stateFull: 'Luxembourg City',
      postcode: '1653',
      country: 'Luxembourg',
      countryCode: 'LU',
      lat: 49.6105,
      lng: 6.1368,
      isTaxFree: true,
      taxRate: 'Tax Favored Zone',
      timezone: 'Europe/Luxembourg (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 爱尔兰 (IE) - 欧洲科技与低税枢纽 ---
  IE: [
    {
      street: 'Grand Canal Square, Silicon Docks',
      city: 'Dublin',
      state: 'D',
      stateFull: 'Dublin',
      postcode: 'D02 P820',
      country: 'Ireland',
      countryCode: 'IE',
      lat: 53.3444,
      lng: -6.2396,
      isTaxFree: true,
      taxRate: 'Tech Hub Low Corporate Tax',
      timezone: 'Europe/Dublin (GMT/IST)',
      timezoneCode: 'GMT'
    },
    {
      street: '1 Albert Quay',
      city: 'Cork',
      state: 'C',
      stateFull: 'Cork',
      postcode: 'T12 X8Y6',
      country: 'Ireland',
      countryCode: 'IE',
      lat: 51.8979,
      lng: -8.4658,
      timezone: 'Europe/Dublin (GMT/IST)',
      timezoneCode: 'GMT'
    }
  ],

  // --- 意大利 (IT) ---
  IT: [
    {
      street: 'Piazza del Duomo 1',
      city: 'Milano',
      state: 'LOM',
      stateFull: 'Lombardy',
      postcode: '20121',
      country: 'Italy',
      countryCode: 'IT',
      lat: 45.4642,
      lng: 9.1900,
      timezone: 'Europe/Rome (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Via del Corso 240',
      city: 'Roma',
      state: 'LAZ',
      stateFull: 'Lazio',
      postcode: '00186',
      country: 'Italy',
      countryCode: 'IT',
      lat: 41.8988,
      lng: 12.4813,
      timezone: 'Europe/Rome (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Via dei Calzaiuoli 12',
      city: 'Firenze',
      state: 'TOS',
      stateFull: 'Tuscany',
      postcode: '50122',
      country: 'Italy',
      countryCode: 'IT',
      lat: 43.7712,
      lng: 11.2554,
      timezone: 'Europe/Rome (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 西班牙 (ES) ---
  ES: [
    {
      street: 'Paseo de la Castellana 89',
      city: 'Madrid',
      state: 'MD',
      stateFull: 'Community of Madrid',
      postcode: '28046',
      country: 'Spain',
      countryCode: 'ES',
      lat: 40.4489,
      lng: -3.6922,
      timezone: 'Europe/Madrid (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Avinguda Diagonal 500',
      city: 'Barcelona',
      state: 'CT',
      stateFull: 'Catalonia',
      postcode: '08006',
      country: 'Spain',
      countryCode: 'ES',
      lat: 41.3954,
      lng: 2.1528,
      timezone: 'Europe/Madrid (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 荷兰 (NL) ---
  NL: [
    {
      street: 'Zuidas, Gustav Mahlerlaan 10',
      city: 'Amsterdam',
      state: 'NH',
      stateFull: 'North Holland',
      postcode: '1082 PP',
      country: 'Netherlands',
      countryCode: 'NL',
      lat: 52.3364,
      lng: 4.8732,
      timezone: 'Europe/Amsterdam (CET)',
      timezoneCode: 'CET'
    },
    {
      street: 'Weena 505, Millennium Tower',
      city: 'Rotterdam',
      state: 'ZH',
      stateFull: 'South Holland',
      postcode: '3013 AL',
      country: 'Netherlands',
      countryCode: 'NL',
      lat: 51.9228,
      lng: 4.4716,
      timezone: 'Europe/Amsterdam (CET)',
      timezoneCode: 'CET'
    }
  ],

  // --- 马来西亚 (MY) ---
  MY: [
    {
      street: 'Kuala Lumpur City Centre, Petronas Tower 2',
      city: 'Kuala Lumpur',
      state: 'KUL',
      stateFull: 'Federal Territory of Kuala Lumpur',
      postcode: '50088',
      country: 'Malaysia',
      countryCode: 'MY',
      lat: 3.1578,
      lng: 101.7119,
      timezone: 'Asia/Kuala_Lumpur (MYT)',
      timezoneCode: 'MYT'
    },
    {
      street: 'Persiaran Barat, PJ New Town',
      city: 'Petaling Jaya',
      state: 'SGR',
      stateFull: 'Selangor',
      postcode: '46050',
      country: 'Malaysia',
      countryCode: 'MY',
      lat: 3.1042,
      lng: 101.6447,
      timezone: 'Asia/Kuala_Lumpur (MYT)',
      timezoneCode: 'MYT'
    },
    {
      street: 'Beach Street, George Town',
      city: 'George Town',
      state: 'PNG',
      stateFull: 'Penang',
      postcode: '10300',
      country: 'Malaysia',
      countryCode: 'MY',
      lat: 5.4164,
      lng: 100.3417,
      timezone: 'Asia/Kuala_Lumpur (MYT)',
      timezoneCode: 'MYT'
    }
  ],

  // --- 泰国 (TH) ---
  TH: [
    {
      street: '689 Sukhumvit Road, EmQuartier',
      city: 'Khlong Toei Nuea, Watthana',
      state: 'BKK',
      stateFull: 'Bangkok',
      postcode: '10110',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 13.7314,
      lng: 100.5694,
      timezone: 'Asia/Bangkok (ICT)',
      timezoneCode: 'ICT'
    },
    {
      street: '1 Silom Road, Silom Edge',
      city: 'Bang Rak',
      state: 'BKK',
      stateFull: 'Bangkok',
      postcode: '10500',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 13.7288,
      lng: 100.5348,
      timezone: 'Asia/Bangkok (ICT)',
      timezoneCode: 'ICT'
    },
    {
      street: 'Nimmanhaemin Road, Soi 5',
      city: 'Mueang Chiang Mai',
      state: 'CNX',
      stateFull: 'Chiang Mai',
      postcode: '50200',
      country: 'Thailand',
      countryCode: 'TH',
      lat: 18.7995,
      lng: 98.9682,
      timezone: 'Asia/Bangkok (ICT)',
      timezoneCode: 'ICT'
    }
  ],

  // --- 越南 (VN) ---
  VN: [
    {
      street: '2 Hai Trieu, Ben Nghe, District 1, Bitexco Financial Tower',
      city: 'Quan 1',
      state: 'SGN',
      stateFull: 'Ho Chi Minh City',
      postcode: '700000',
      country: 'Vietnam',
      countryCode: 'VN',
      lat: 10.7716,
      lng: 106.7044,
      timezone: 'Asia/Ho_Chi_Minh (ICT)',
      timezoneCode: 'ICT'
    },
    {
      street: '54 Lieu Giai, Cong Vi, Ba Dinh, Lotte Center',
      city: 'Ba Dinh',
      state: 'HAN',
      stateFull: 'Hanoi',
      postcode: '100000',
      country: 'Vietnam',
      countryCode: 'VN',
      lat: 21.0318,
      lng: 105.8136,
      timezone: 'Asia/Ho_Chi_Minh (ICT)',
      timezoneCode: 'ICT'
    }
  ],

  // --- 菲律宾 (PH) ---
  PH: [
    {
      street: '5th Ave & 28th St, Bonifacio High Street, BGC',
      city: 'Taguig',
      state: 'MNL',
      stateFull: 'Metro Manila',
      postcode: '1634',
      country: 'Philippines',
      countryCode: 'PH',
      lat: 14.5516,
      lng: 121.0503,
      timezone: 'Asia/Manila (PHT)',
      timezoneCode: 'PHT'
    },
    {
      street: 'Ayala Avenue, Makati Central Business District',
      city: 'Makati',
      state: 'MNL',
      stateFull: 'Metro Manila',
      postcode: '1226',
      country: 'Philippines',
      countryCode: 'PH',
      lat: 14.5552,
      lng: 121.0244,
      timezone: 'Asia/Manila (PHT)',
      timezoneCode: 'PHT'
    }
  ]
};

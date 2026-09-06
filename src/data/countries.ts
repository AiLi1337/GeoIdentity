import type { CountryInfo } from '../types/identity';

export const COUNTRIES: CountryInfo[] = [
  // --- 北美洲 ---
  {
    code: 'US',
    nameZh: '美国',
    nameEn: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    currency: 'USD ($)',
    continent: 'north_america',
    popularStates: [
      // 5大免税州
      { code: 'DE', nameZh: '特拉华州(海淘免税)', nameEn: 'Delaware (Tax-Free)', isTaxFree: true },
      { code: 'OR', nameZh: '俄勒冈州(海淘免税)', nameEn: 'Oregon (Tax-Free)', isTaxFree: true },
      { code: 'MT', nameZh: '蒙大拿州(免税州)', nameEn: 'Montana (Tax-Free)', isTaxFree: true },
      { code: 'NH', nameZh: '新罕布什尔(免税州)', nameEn: 'New Hampshire (Tax-Free)', isTaxFree: true },
      { code: 'AK', nameZh: '阿拉斯加州(免税州)', nameEn: 'Alaska (Tax-Free)', isTaxFree: true },
      // 常用商业与都会州
      { code: 'CA', nameZh: '加利福尼亚州', nameEn: 'California' },
      { code: 'NY', nameZh: '纽约州', nameEn: 'New York' },
      { code: 'TX', nameZh: '德克萨斯州', nameEn: 'Texas' },
      { code: 'FL', nameZh: '佛罗里达州', nameEn: 'Florida' },
      { code: 'WA', nameZh: '华盛顿州', nameEn: 'Washington' },
      { code: 'IL', nameZh: '伊利诺伊州', nameEn: 'Illinois' },
      { code: 'NJ', nameZh: '新泽西州', nameEn: 'New Jersey' },
      { code: 'NV', nameZh: '内华达州', nameEn: 'Nevada' },
      { code: 'MA', nameZh: '马萨诸塞州', nameEn: 'Massachusetts' }
    ]
  },
  {
    code: 'CA',
    nameZh: '加拿大',
    nameEn: 'Canada',
    flag: '🇨🇦',
    dialCode: '+1',
    currency: 'CAD ($)',
    continent: 'north_america',
    popularStates: [
      { code: 'ON', nameZh: '安大略省(多伦多)', nameEn: 'Ontario' },
      { code: 'BC', nameZh: '不列颠哥伦比亚(温哥华)', nameEn: 'British Columbia' },
      { code: 'QC', nameZh: '魁北克省(蒙特利尔)', nameEn: 'Quebec' },
      { code: 'AB', nameZh: '阿尔伯塔省(低税区/卡尔加里)', nameEn: 'Alberta (Low Tax)', isTaxFree: true }
    ]
  },

  // --- 欧洲与低税特区 ---
  {
    code: 'CH',
    nameZh: '瑞士',
    nameEn: 'Switzerland',
    flag: '🇨🇭',
    dialCode: '+41',
    currency: 'CHF (Fr.)',
    continent: 'europe',
    isTaxFreeZone: true,
    popularStates: [
      { code: 'ZG', nameZh: '楚格州(加密谷/低税天堂)', nameEn: 'Zug (Tax Haven)', isTaxFree: true },
      { code: 'ZH', nameZh: '苏黎世州', nameEn: 'Zurich' },
      { code: 'GE', nameZh: '日内瓦州', nameEn: 'Geneva' },
      { code: 'BE', nameZh: '伯尔尼州', nameEn: 'Bern' }
    ]
  },
  {
    code: 'LU',
    nameZh: '卢森堡',
    nameEn: 'Luxembourg',
    flag: '🇱🇺',
    dialCode: '+352',
    currency: 'EUR (€)',
    continent: 'europe',
    isTaxFreeZone: true,
    popularStates: [
      { code: 'LU-LU', nameZh: '卢森堡市(欧洲金融中心)', nameEn: 'Luxembourg City', isTaxFree: true },
      { code: 'LU-ES', nameZh: '阿尔泽特河畔埃施', nameEn: 'Esch-sur-Alzette' }
    ]
  },
  {
    code: 'IE',
    nameZh: '爱尔兰',
    nameEn: 'Ireland',
    flag: '🇮🇪',
    dialCode: '+353',
    currency: 'EUR (€)',
    continent: 'europe',
    isTaxFreeZone: true,
    popularStates: [
      { code: 'D', nameZh: '都柏林(欧洲硅谷)', nameEn: 'Dublin (Tech Hub)', isTaxFree: true },
      { code: 'C', nameZh: '科克', nameEn: 'Cork' },
      { code: 'G', nameZh: '戈尔韦', nameEn: 'Galway' }
    ]
  },
  {
    code: 'GB',
    nameZh: '英国',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    currency: 'GBP (£)',
    continent: 'europe',
    popularStates: [
      { code: 'ENG-LDN', nameZh: '大伦敦区', nameEn: 'Greater London' },
      { code: 'ENG-MAN', nameZh: '大曼彻斯特', nameEn: 'Greater Manchester' },
      { code: 'ENG-BIR', nameZh: '西米德兰兹(伯明翰)', nameEn: 'West Midlands' },
      { code: 'SCT-EDI', nameZh: '苏格兰(爱丁堡/格拉斯哥)', nameEn: 'Scotland' },
      { code: 'ENG-OXF', nameZh: '牛津郡', nameEn: 'Oxfordshire' }
    ]
  },
  {
    code: 'DE',
    nameZh: '德国',
    nameEn: 'Germany',
    flag: '🇩🇪',
    dialCode: '+49',
    currency: 'EUR (€)',
    continent: 'europe',
    popularStates: [
      { code: 'BE', nameZh: '柏林', nameEn: 'Berlin' },
      { code: 'BY', nameZh: '巴伐利亚州(慕尼黑)', nameEn: 'Bavaria' },
      { code: 'NW', nameZh: '北威州(科隆/杜塞尔多夫)', nameEn: 'North Rhine-Westphalia' },
      { code: 'HE', nameZh: '黑森州(法兰克福金融中心)', nameEn: 'Hesse' },
      { code: 'HH', nameZh: '汉堡', nameEn: 'Hamburg' }
    ]
  },
  {
    code: 'FR',
    nameZh: '法国',
    nameEn: 'France',
    flag: '🇫🇷',
    dialCode: '+33',
    currency: 'EUR (€)',
    continent: 'europe',
    popularStates: [
      { code: 'IDF', nameZh: '法兰西岛(巴黎)', nameEn: 'Île-de-France' },
      { code: 'ARA', nameZh: '奥弗涅-罗讷-阿尔卑斯(里昂)', nameEn: 'Auvergne-Rhône-Alpes' },
      { code: 'PAC', nameZh: '普罗旺斯(马赛/尼斯)', nameEn: "Provence-Alpes-Côte d'Azur" },
      { code: 'OCC', nameZh: '奥克西塔尼(图卢兹)', nameEn: 'Occitanie' }
    ]
  },
  {
    code: 'IT',
    nameZh: '意大利',
    nameEn: 'Italy',
    flag: '🇮🇹',
    dialCode: '+39',
    currency: 'EUR (€)',
    continent: 'europe',
    popularStates: [
      { code: 'LOM', nameZh: '伦巴第大区(米兰时尚中心)', nameEn: 'Lombardy (Milan)' },
      { code: 'LAZ', nameZh: '拉齐奥大区(罗马)', nameEn: 'Lazio (Rome)' },
      { code: 'TOS', nameZh: '托斯卡纳(佛罗伦萨)', nameEn: 'Tuscany (Florence)' },
      { code: 'VEN', nameZh: '威尼托(威尼斯)', nameEn: 'Veneto (Venice)' }
    ]
  },
  {
    code: 'ES',
    nameZh: '西班牙',
    nameEn: 'Spain',
    flag: '🇪🇸',
    dialCode: '+34',
    currency: 'EUR (€)',
    continent: 'europe',
    popularStates: [
      { code: 'MD', nameZh: '马德里自治区', nameEn: 'Community of Madrid' },
      { code: 'CT', nameZh: '加泰罗尼亚(巴塞罗那)', nameEn: 'Catalonia (Barcelona)' },
      { code: 'VC', nameZh: '瓦伦西亚自治区', nameEn: 'Valencian Community' },
      { code: 'AN', nameZh: '安达卢西亚(塞维利亚)', nameEn: 'Andalusia (Seville)' }
    ]
  },
  {
    code: 'NL',
    nameZh: '荷兰',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    dialCode: '+31',
    currency: 'EUR (€)',
    continent: 'europe',
    popularStates: [
      { code: 'NH', nameZh: '北荷兰省(阿姆斯特丹)', nameEn: 'North Holland (Amsterdam)' },
      { code: 'ZH', nameZh: '南荷兰省(鹿特丹/海牙)', nameEn: 'South Holland (Rotterdam)' },
      { code: 'UT', nameZh: '乌得勒支省', nameEn: 'Utrecht' }
    ]
  },

  // --- 东亚与亚太 ---
  {
    code: 'JP',
    nameZh: '日本',
    nameEn: 'Japan',
    flag: '🇯🇵',
    dialCode: '+81',
    currency: 'JPY (¥)',
    continent: 'asia_pacific',
    popularStates: [
      { code: '13', nameZh: '东京都', nameEn: 'Tokyo' },
      { code: '27', nameZh: '大阪府', nameEn: 'Osaka' },
      { code: '14', nameZh: '神奈川县(横滨)', nameEn: 'Kanagawa' },
      { code: '26', nameZh: '京都府', nameEn: 'Kyoto' },
      { code: '23', nameZh: '爱知县(名古屋)', nameEn: 'Aichi' },
      { code: '01', nameZh: '北海道(札幌)', nameEn: 'Hokkaido' },
      { code: '40', nameZh: '福冈县', nameEn: 'Fukuoka' },
      { code: '47', nameZh: '冲绳县(那霸)', nameEn: 'Okinawa' }
    ]
  },
  {
    code: 'KR',
    nameZh: '韩国',
    nameEn: 'South Korea',
    flag: '🇰🇷',
    dialCode: '+82',
    currency: 'KRW (₩)',
    continent: 'asia_pacific',
    popularStates: [
      { code: '11', nameZh: '首尔特别市(江南/明洞)', nameEn: 'Seoul' },
      { code: '26', nameZh: '釜山广域市(海云台)', nameEn: 'Busan' },
      { code: '28', nameZh: '仁川广域市(松岛新城)', nameEn: 'Incheon' },
      { code: '41', nameZh: '京畿道(城南/板桥科技谷)', nameEn: 'Gyeonggi-do' }
    ]
  },
  {
    code: 'HK',
    nameZh: '中国香港',
    nameEn: 'Hong Kong',
    flag: '🇭🇰',
    dialCode: '+852',
    currency: 'HKD (HK$)',
    continent: 'asia_pacific',
    isTaxFreeZone: true,
    popularStates: [
      { code: 'CW', nameZh: '中西区(中环/金钟)', nameEn: 'Central and Western', isTaxFree: true },
      { code: 'WC', nameZh: '湾仔区(铜锣湾)', nameEn: 'Wan Chai', isTaxFree: true },
      { code: 'YTM', nameZh: '油尖旺区(尖沙咀/旺角)', nameEn: 'Yau Tsim Mong', isTaxFree: true },
      { code: 'KC', nameZh: '九龙城区', nameEn: 'Kowloon City', isTaxFree: true },
      { code: 'ST', nameZh: '沙田区', nameEn: 'Sha Tin', isTaxFree: true },
      { code: 'IS', nameZh: '离岛区(东涌/赤鱲角)', nameEn: 'Islands', isTaxFree: true }
    ]
  },
  {
    code: 'TW',
    nameZh: '中国台湾',
    nameEn: 'Taiwan',
    flag: '🇹🇼',
    dialCode: '+886',
    currency: 'TWD (NT$)',
    continent: 'asia_pacific',
    popularStates: [
      { code: 'TPE', nameZh: '台北市(信义/大安)', nameEn: 'Taipei City' },
      { code: 'NTP', nameZh: '新北市(板桥/中和)', nameEn: 'New Taipei City' },
      { code: 'TXG', nameZh: '台中市(西屯)', nameEn: 'Taichung City' },
      { code: 'KHH', nameZh: '高雄市(左营/苓雅)', nameEn: 'Kaohsiung City' },
      { code: 'HSZ', nameZh: '新竹市(科学园区)', nameEn: 'Hsinchu City' }
    ]
  },
  {
    code: 'SG',
    nameZh: '新加坡',
    nameEn: 'Singapore',
    flag: '🇸🇬',
    dialCode: '+65',
    currency: 'SGD (S$)',
    continent: 'asia_pacific',
    popularStates: [
      { code: 'CR', nameZh: '中央商业区(滨海湾/乌节路)', nameEn: 'Central Region' },
      { code: 'ER', nameZh: '东部地区(淡滨尼/樟宜)', nameEn: 'East Region' },
      { code: 'WR', nameZh: '西部地区(裕廊东/金文泰)', nameEn: 'West Region' },
      { code: 'NR', nameZh: '北部地区(兀兰/义顺)', nameEn: 'North Region' }
    ]
  },
  {
    code: 'AU',
    nameZh: '澳大利亚',
    nameEn: 'Australia',
    flag: '🇦🇺',
    dialCode: '+61',
    currency: 'AUD ($)',
    continent: 'asia_pacific',
    popularStates: [
      { code: 'NSW', nameZh: '新南威尔士州(悉尼)', nameEn: 'New South Wales' },
      { code: 'VIC', nameZh: '维多利亚州(墨尔本)', nameEn: 'Victoria' },
      { code: 'QLD', nameZh: '昆士兰州(布里斯班)', nameEn: 'Queensland' },
      { code: 'WA', nameZh: '西澳大利亚州(珀斯)', nameEn: 'Western Australia' }
    ]
  },

  // --- 东南亚 ---
  {
    code: 'MY',
    nameZh: '马来西亚',
    nameEn: 'Malaysia',
    flag: '🇲🇾',
    dialCode: '+60',
    currency: 'MYR (RM)',
    continent: 'southeast_asia',
    popularStates: [
      { code: 'KUL', nameZh: '吉隆坡联邦直辖区', nameEn: 'Kuala Lumpur' },
      { code: 'SGR', nameZh: '雪兰莪州(八打灵再也)', nameEn: 'Selangor' },
      { code: 'PNG', nameZh: '槟城州(乔治市)', nameEn: 'Penang' },
      { code: 'JHR', nameZh: '柔佛州(新山)', nameEn: 'Johor' }
    ]
  },
  {
    code: 'TH',
    nameZh: '泰国',
    nameEn: 'Thailand',
    flag: '🇹🇭',
    dialCode: '+66',
    currency: 'THB (฿)',
    continent: 'southeast_asia',
    popularStates: [
      { code: 'BKK', nameZh: '曼谷直辖市(素坤逸/沙吞)', nameEn: 'Bangkok' },
      { code: 'CNX', nameZh: '清迈府', nameEn: 'Chiang Mai' },
      { code: 'HKT', nameZh: '普吉府', nameEn: 'Phuket' },
      { code: 'CBI', nameZh: '春武里府(芭提雅)', nameEn: 'Chonburi' }
    ]
  },
  {
    code: 'VN',
    nameZh: '越南',
    nameEn: 'Vietnam',
    flag: '🇻🇳',
    dialCode: '+84',
    currency: 'VND (₫)',
    continent: 'southeast_asia',
    popularStates: [
      { code: 'SGN', nameZh: '胡志明市(第一区/守德市)', nameEn: 'Ho Chi Minh City' },
      { code: 'HAN', nameZh: '河内市(还剑区/西湖区)', nameEn: 'Hanoi' },
      { code: 'DAD', nameZh: '岘港市', nameEn: 'Da Nang' }
    ]
  },
  {
    code: 'PH',
    nameZh: '菲律宾',
    nameEn: 'Philippines',
    flag: '🇵🇭',
    dialCode: '+63',
    currency: 'PHP (₱)',
    continent: 'southeast_asia',
    popularStates: [
      { code: 'MNL', nameZh: '马尼拉大都会(BGC/马卡蒂)', nameEn: 'Metro Manila' },
      { code: 'CEB', nameZh: '宿务省', nameEn: 'Cebu' },
      { code: 'DVO', nameZh: '达沃市', nameEn: 'Davao' }
    ]
  }
];

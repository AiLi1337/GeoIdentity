import type { CountryCode } from '../../types/identity';

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const ZODIAC_SIGNS = [
  '白羊座 (Aries)', '金牛座 (Taurus)', '双子座 (Gemini)', '巨蟹座 (Cancer)',
  '狮子座 (Leo)', '处女座 (Virgo)', '天秤座 (Libra)', '天蝎座 (Scorpio)',
  '射手座 (Sagittarius)', '摩羯座 (Capricorn)', '水瓶座 (Aquarius)', '双鱼座 (Pisces)'
];

export const EDUCATION_DEGREES = [
  '学士学位 (Bachelor of Science / Arts)',
  '硕士学位 (Master of Science / MBA)',
  '副学士学位 (Associate Degree)',
  '博士学位 (Ph.D.)',
  '高级专业文凭 (Higher Diploma)'
];

export const OCCUPATIONS_BY_INDUSTRY = [
  { industry: '信息技术与互联网 (Information Technology)', titles: ['高级软件工程师', '前端架构师', '产品经理', '数据分析师', '系统运维专家', 'UI/UX 设计总监', '网络安全工程师'] },
  { industry: '金融与投资 (Finance & Banking)', titles: ['投资分析师', '风险合规经理', '财务主管', '量化交易员', '私人银行客户经理', '信贷顾问'] },
  { industry: '医疗健康与生物 (Healthcare & Biotech)', titles: ['临床医学研究员', '药剂师', '生物统计学家', '医疗器械顾问', '健康管理师'] },
  { industry: '市场营销与传媒 (Marketing & Media)', titles: ['品牌增长总监', '数字营销专家', '内容创意总监', '公共关系经理', '社媒运营主管'] },
  { industry: '教育与科研 (Education & Research)', titles: ['大学讲师', '学术研究员', '教育咨询顾问', '课程开发主管'] },
  { industry: '制造与现代物流 (Logistics & Supply Chain)', titles: ['供应链战略总监', '精益生产工程师', '全球采购主管', '物流调度总监'] }
];

export const UNIVERSITIES_BY_COUNTRY: Record<CountryCode, string[]> = {
  US: ['Stanford University', 'MIT', 'Harvard University', 'UC Berkeley', 'Columbia University', 'UCLA', 'NYU', 'University of Washington'],
  GB: ['University of Oxford', 'University of Cambridge', 'Imperial College London', 'UCL', 'London School of Economics', 'University of Edinburgh', 'King\'s College London'],
  JP: ['東京大学 (University of Tokyo)', '京都大学 (Kyoto University)', '早稲田大学 (Waseda University)', '慶應義塾大学 (Keio University)', '大阪大学 (Osaka University)', '東京工業大学 (Tokyo Tech)'],
  CA: ['University of Toronto', 'University of British Columbia', 'McGill University', 'University of Waterloo', 'University of Alberta'],
  AU: ['University of Melbourne', 'University of Sydney', 'Australian National University', 'UNSW Sydney', 'University of Queensland'],
  DE: ['Technical University of Munich (TUM)', 'LMU Munich', 'Heidelberg University', 'Humboldt University of Berlin', 'RWTH Aachen University'],
  FR: ['Sorbonne Université', 'École Polytechnique', 'HEC Paris', 'Université PSL', 'Sciences Po'],
  HK: ['香港大学 (HKU)', '香港科技大学 (HKUST)', '香港中文大学 (CUHK)', '香港理工大学 (PolyU)', '香港城市大学 (CityU)'],
  TW: ['国立台湾大学 (NTU)', '国立清华大学 (NTHU)', '国立阳明交通大学 (NYCU)', '国立成功大学 (NCKU)', '国立政治大学 (NCCU)'],
  SG: ['National University of Singapore (NUS)', 'Nanyang Technological University (NTU)', 'Singapore Management University (SMU)', 'SUTD'],
  KR: ['Seoul National University (SNU)', 'KAIST', 'Yonsei University', 'Korea University', 'POSTECH', 'Sungkyunkwan University (SKKU)'],
  CH: ['ETH Zurich', 'EPFL', 'University of Zurich', 'University of Geneva', 'University of Bern'],
  LU: ['University of Luxembourg', 'Sacred Heart University Luxembourg'],
  IE: ['Trinity College Dublin (TCD)', 'University College Dublin (UCD)', 'University of Galway', 'University College Cork'],
  IT: ['Politecnico di Milano', 'Bocconi University', 'Sapienza University of Rome', 'University of Bologna'],
  ES: ['Universidad Complutense de Madrid', 'Universitat de Barcelona', 'Universidad Autónoma de Madrid', 'IE University'],
  NL: ['Delft University of Technology (TU Delft)', 'University of Amsterdam', 'Erasmus University Rotterdam', 'Leiden University'],
  MY: ['Universiti Malaya (UM)', 'Universiti Kebangsaan Malaysia (UKM)', 'Universiti Putra Malaysia (UPM)', 'Universiti Sains Malaysia (USM)'],
  TH: ['Chulalongkorn University', 'Mahidol University', 'Thammasat University', 'Chiang Mai University'],
  VN: ['Vietnam National University, Hanoi (VNU)', 'VNU University of Science, HCM', 'Hanoi University of Science and Technology'],
  PH: ['University of the Philippines (UP)', 'Ateneo de Manila University', 'De La Salle University (DLSU)', 'University of Santo Tomas']
};

export const COMPANIES_BY_COUNTRY: Record<CountryCode, string[]> = {
  US: ['Apex Software Solutions LLC', 'Beacon Hill Capital', 'Veritas Global Logistics', 'Starlight Media Group', 'Vanguard Data Systems', 'Summit Biotech Inc.'],
  GB: ['Highland & Sterling Ltd', 'Thames Capital Partners', 'Britannia Digital Solutions', 'Crown Logistics Group', 'Kingsway Consulting UK'],
  JP: ['サクラ・テクノロジー株式会社 (Sakura Tech)', '東京アドバンス・ソリューションズ (Tokyo Advance)', 'ミライ・キャピタル合同会社 (Mirai Capital)', '大和グローバル・ロジスティクス (Yamato Global)'],
  CA: ['Maple Leaf Innovations Inc.', 'Great Lakes Financial Group', 'Pacific Horizon Media', 'Northern Frontier Dynamics'],
  AU: ['Southern Cross Ventures Pty Ltd', 'Opal Pacific Technologies', 'Harbour City Consulting', 'Outback Digital Partners'],
  DE: ['Rheinland IT-Systeme GmbH', 'Bavaria Industrie & Handel AG', 'Alpen Capital Management GmbH', 'Nordsee Logistik Services'],
  FR: ['Lumière Technologies SAS', 'Hexagone Conseil & Gestion', 'Azur Médias & Création', 'Seine Logistique Internationale'],
  HK: ['维港创投控股有限公司 (Victoria Harbour Capital)', '九龙数码创新科技有限公司 (Kowloon Tech)', '环球远东贸易商业集团 (Far East Global)'],
  TW: ['敦南数位创新股份有限公司 (Dunnan Digital)', '福尔摩沙半导体科技 (Formosa Semiconductor)', '宝岛卓越金融投资顾问 (Formosa Capital)'],
  SG: ['SingaTech Global Pte Ltd', 'Merlion Capital Holdings', 'Straits Digital Media Pte Ltd', 'Lion City Logistics Network'],
  KR: ['삼성전자 (Samsung Electronics)', '현대자동차 (Hyundai Motor)', '네이버 (Naver Corp)', '카카오 (Kakao)', '쿠팡 (Coupang)', 'LG CNS'],
  CH: ['Novartis International AG', 'Roche Holding Ltd', 'Nestlé S.A.', 'Glencore AG', 'Crypto Valley Labs Zug'],
  LU: ['ArcelorMittal Luxembourg', 'SES S.A. Satellites', 'RTL Group', 'Luxair Cargo Logistics'],
  IE: ['Stripe Payments Europe Ltd', 'Accenture Ireland', 'CRH plc', 'Flutter Entertainment', 'Kerry Group plc'],
  IT: ['Ferrari N.V.', 'Eni S.p.A.', 'Luxottica Group', 'Intesa Sanpaolo Innovation', 'Prada Group S.p.A.'],
  ES: ['Inditex (Zara Group)', 'Banco Santander S.A.', 'Telefónica Tech', 'Amadeus IT Group', 'Iberdrola S.A.'],
  NL: ['ASML Holding N.V.', 'Heineken International', 'Booking Holdings Netherlands', 'Philips Healthcare', 'Adyen Payments'],
  MY: ['Petronas Digital Sdn Bhd', 'Grab Malaysia Technologies', 'CIMB Group Holdings', 'AirAsia Digital Group'],
  TH: ['PTT Public Company Limited', 'CP All Group (7-Eleven Thailand)', 'Central Retail Corp', 'Kasikorn Digital Labs'],
  VN: ['Vingroup Joint Stock Company', 'Viettel Military Telecom', 'FPT Software Global', 'VNG Corporation'],
  PH: ['Ayala Land & Technologies', 'SM Investments Corp', 'Globe Telecom Innovation', 'San Miguel Global Holdings']
};

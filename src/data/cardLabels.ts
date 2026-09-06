import type { CountryCode, CardLanguage, GeneratedIdentity } from '../types/identity';

export interface CardLabels {
  // Address section
  addressTitle: string;
  taxFreeTag: string;
  street: string;
  addressLine2: string;
  cityState: string;
  postcode: string;
  forwarderTitle: string;
  residentialTitle: string;
  copyForwarder: string;

  // Contact section
  contactTitle: string;
  phone: string;
  email: string;
  emailNotice: string;
  username: string;
  emailTip: string;

  // Document section
  docTitle: string;
  docNotice: string;

  // Occupation section
  occupationTitle: string;
  company: string;
  title: string;
  university: string;

  // Finance section
  financeTitle: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
  bank: string;
  financeNotice: string;

  // Header meta & badges
  genderMale: string;
  genderFemale: string;
  ageUnit: string;
}

export const CARD_LABELS_ZH: CardLabels = {
  addressTitle: '实体物理地址 (真实可达)',
  taxFreeTag: '免消费税',
  street: '街道地址 (Line 1)',
  addressLine2: '门牌 / 单元 (Line 2)',
  cityState: '城市与省州',
  postcode: '邮政编码',
  forwarderTitle: '标准收件/转运格式 (点击一键复制)',
  residentialTitle: '居民独栋直发格式 (点击一键复制)',
  copyForwarder: '一键复制转运格式',

  contactTitle: '联系方式与账号',
  phone: '联系电话',
  email: '电子邮箱',
  emailNotice: '测试占位邮箱',
  username: '账号用户名',
  emailTip: '邮箱仅供注册占位与表单填充，非真实收信邮箱',

  docTitle: '法定身份识别',
  docNotice: '仅供格式校验与开发测试，非真实有效证件',

  occupationTitle: '就职企业与高等教育',
  company: '就职企业',
  title: '工作职位',
  university: '毕业院校',

  financeTitle: '虚拟财务卡片',
  cardNumber: '卡号 (通过 Luhn 校验)',
  expDate: '有效期限',
  cvv: '安全码 (CVV)',
  bank: '发卡行',
  financeNotice: '本卡仅供 UI 排版与算法验证，无真实金融功能，不可用于实际扣款',

  genderMale: '男',
  genderFemale: '女',
  ageUnit: '岁'
};

export const CARD_LABELS_EN: CardLabels = {
  addressTitle: 'Physical Address (Authentic)',
  taxFreeTag: 'Tax Free',
  street: 'Street Address (Line 1)',
  addressLine2: 'Unit / Suite (Line 2)',
  cityState: 'City & State/Province',
  postcode: 'Postal Code',
  forwarderTitle: 'eCommerce / Forwarder Standard Format',
  residentialTitle: 'Residential Delivery Standard Format',
  copyForwarder: 'Copy Shipping Format',

  contactTitle: 'Contact & Digital Profile',
  phone: 'Phone Number',
  email: 'Email Address',
  emailNotice: 'Placeholder Mail',
  username: 'Username',
  emailTip: 'Email for registration placeholders & form filling only, not for real communication',

  docTitle: 'Identity & Compliance',
  docNotice: 'For development & format testing only, not a valid legal ID',

  occupationTitle: 'Occupation & Higher Education',
  company: 'Company',
  title: 'Job Title',
  university: 'University',

  financeTitle: 'Virtual Payment Card',
  cardNumber: 'Card Number (Luhn Passed)',
  expDate: 'Exp Date',
  cvv: 'CVV',
  bank: 'Issuing Bank',
  financeNotice: 'For UI layout & algorithm testing only. No real balance or financial function.',

  genderMale: 'Male (M)',
  genderFemale: 'Female (F)',
  ageUnit: 'y/o'
};

export const CARD_LABELS_BY_COUNTRY: Partial<Record<CountryCode, CardLabels>> = {
  // 🇮🇹 Italiano (IT)
  IT: {
    addressTitle: 'Indirizzo di Residenza Ufficiale',
    taxFreeTag: 'Zero Imposte',
    street: 'Indirizzo (Via / Corso)',
    addressLine2: 'Interno / Scala (Line 2)',
    cityState: 'Città e Provincia',
    postcode: 'Codice Postale (CAP)',
    forwarderTitle: 'Formato Standard Spedizione eCommerce',
    residentialTitle: 'Formato Consegna a Domicilio Residenziale',
    copyForwarder: 'Copia Formato Spedizione',

    contactTitle: 'Recapiti di Contatto',
    phone: 'Numero di Telefono',
    email: 'Indirizzo E-mail',
    emailNotice: 'Email Sintetica per Test',
    username: 'Nome Utente',
    emailTip: 'Email generata per test e compilazione moduli, non utilizzabile per comunicazioni reali',

    docTitle: 'Identificazione Fiscale',
    docNotice: 'Solo per test tecnici e validazione formato, documento non valido legalmente',

    occupationTitle: 'Dati Professionali ed Istruzione',
    company: 'Datore di Lavoro',
    title: 'Qualifica Professionale',
    university: 'Università',

    financeTitle: 'Carta di Pagamento per Test',
    cardNumber: 'Numero Carta (Algoritmo Luhn)',
    expDate: 'Scadenza',
    cvv: 'CVV / CVC',
    bank: 'Banca Emittente',
    financeNotice: 'Solo per test di layout ed algoritmi. Nessun saldo reale né funzione di pagamento.',

    genderMale: 'Maschile (M)',
    genderFemale: 'Femminile (F)',
    ageUnit: 'anni'
  },

  // 🇪🇸 Español (ES)
  ES: {
    addressTitle: 'Dirección Residencial Verificable',
    taxFreeTag: 'Sin Impuestos',
    street: 'Dirección (Línea 1)',
    addressLine2: 'Piso / Puerta (Línea 2)',
    cityState: 'Ciudad y Provincia',
    postcode: 'Código Postal (CP)',
    forwarderTitle: 'Formato Estándar de Envío y Paquetería',
    residentialTitle: 'Formato de Entrega Residencial Directa',
    copyForwarder: 'Copiar Formato de Envío',

    contactTitle: 'Información de Contacto',
    phone: 'Teléfono',
    email: 'Correo Electrónico',
    emailNotice: 'Email de Prueba',
    username: 'Nombre de Usuario',
    emailTip: 'Correo para rellenar formularios y pruebas, no apto para comunicación real',

    docTitle: 'Identificación Legal',
    docNotice: 'Solo para pruebas de desarrollo y formato, documento legal no válido',

    occupationTitle: 'Ocupación y Educación Superior',
    company: 'Empresa',
    title: 'Puesto / Cargo',
    university: 'Universidad',

    financeTitle: 'Tarjeta de Pago de Prueba',
    cardNumber: 'Número de Tarjeta (Luhn)',
    expDate: 'Caducidad',
    cvv: 'CVV',
    bank: 'Banco Emisor',
    financeNotice: 'Solo para pruebas de diseño y algoritmos. Sin saldo real ni transacciones.',

    genderMale: 'Masculino (M)',
    genderFemale: 'Femenino (F)',
    ageUnit: 'años'
  },

  // 🇩🇪 Deutsch (DE / CH)
  DE: {
    addressTitle: 'Offizielle Wohnadresse',
    taxFreeTag: 'Steuerfrei',
    street: 'Straße & Hausnummer (Zeile 1)',
    addressLine2: 'Zusatz / Etage (Zeile 2)',
    cityState: 'Stadt & Bundesland',
    postcode: 'Postleitzahl (PLZ)',
    forwarderTitle: 'Standard-Versandformat für Online-Shops',
    residentialTitle: 'Wohnhaus-Direktlieferungsformat',
    copyForwarder: 'Versandformat kopieren',

    contactTitle: 'Kontaktdaten & Benutzerkonto',
    phone: 'Telefonnummer',
    email: 'E-Mail-Adresse',
    emailNotice: 'Synthetische Test-Mail',
    username: 'Benutzername',
    emailTip: 'E-Mail nur für Registrierungs- und Formulartests, kein echtes Postfach',

    docTitle: 'Steuer & Identifikation',
    docNotice: 'Nur für Formatvalidierung & Entwicklungstests, kein amtlicher Ausweis',

    occupationTitle: 'Beruf & Ausbildung',
    company: 'Arbeitgeber',
    title: 'Berufsbezeichnung',
    university: 'Universität / Hochschule',

    financeTitle: 'Test-Zahlungskarte',
    cardNumber: 'Kartennummer (Luhn-geprüft)',
    expDate: 'Gültig bis',
    cvv: 'Prüfziffer (CVV)',
    bank: 'Ausstellende Bank',
    financeNotice: 'Nur für UI-Tests und Algorithmen. Kein reales Guthaben, nicht abbuchungsfähig.',

    genderMale: 'Männlich (M)',
    genderFemale: 'Weiblich (F)',
    ageUnit: 'Jahre'
  },

  CH: {
    addressTitle: 'Offizielle Wohnadresse',
    taxFreeTag: 'Steuerfrei',
    street: 'Strasse & Hausnummer (Zeile 1)',
    addressLine2: 'Zusatz / Etage (Zeile 2)',
    cityState: 'Ort & Kanton',
    postcode: 'Postleitzahl (PLZ)',
    forwarderTitle: 'Standard-Versandformat für Online-Shops',
    residentialTitle: 'Wohnhaus-Direktlieferungsformat',
    copyForwarder: 'Versandformat kopieren',

    contactTitle: 'Kontaktdaten & Benutzerkonto',
    phone: 'Telefonnummer',
    email: 'E-Mail-Adresse',
    emailNotice: 'Synthetische Test-Mail',
    username: 'Benutzername',
    emailTip: 'E-Mail nur für Registrierungs- und Formulartests, kein echtes Postfach',

    docTitle: 'Steuer & Identifikation',
    docNotice: 'Nur für Formatvalidierung & Entwicklungstests, kein amtlicher Ausweis',

    occupationTitle: 'Beruf & Ausbildung',
    company: 'Arbeitgeber',
    title: 'Berufsbezeichnung',
    university: 'Universität / Hochschule',

    financeTitle: 'Test-Zahlungskarte',
    cardNumber: 'Kartennummer (Luhn-geprüft)',
    expDate: 'Gültig bis',
    cvv: 'Prüfziffer (CVV)',
    bank: 'Ausstellende Bank',
    financeNotice: 'Nur für UI-Tests und Algorithmen. Kein reales Guthaben, nicht abbuchungsfähig.',

    genderMale: 'Männlich (M)',
    genderFemale: 'Weiblich (F)',
    ageUnit: 'Jahre'
  },

  // 🇫🇷 Français (FR / LU)
  FR: {
    addressTitle: 'Adresse Postale Authentique',
    taxFreeTag: 'Exonéré de Taxe',
    street: 'Adresse (Ligne 1)',
    addressLine2: 'Complément / Étage (Ligne 2)',
    cityState: 'Ville & Département / Région',
    postcode: 'Code Postal',
    forwarderTitle: 'Format Standard de Livraison e-Commerce',
    residentialTitle: 'Format Livraison Résidentielle Directe',
    copyForwarder: 'Copier format livraison',

    contactTitle: 'Coordonnées de Contact',
    phone: 'Numéro de Téléphone',
    email: 'Adresse e-mail',
    emailNotice: 'Courriel de Test',
    username: 'Nom d\'utilisateur',
    emailTip: 'Courriel pour tests de formulaires uniquement, boîte non fonctionnelle',

    docTitle: 'Identité Officielle & Sécurité',
    docNotice: 'Uniquement pour tests techniques, non valable légalement',

    occupationTitle: 'Emploi & Formation Supérieure',
    company: 'Entreprise',
    title: 'Poste / Fonction',
    university: 'Université',

    financeTitle: 'Carte Bancaire de Test',
    cardNumber: 'Numéro de Carte (Conforme Luhn)',
    expDate: 'Expiration',
    cvv: 'Code CVV',
    bank: 'Banque Émettrice',
    financeNotice: 'Uniquement pour maquettage et algorithmes. Aucun solde ni transaction réelle.',

    genderMale: 'Masculin (M)',
    genderFemale: 'Féminin (F)',
    ageUnit: 'ans'
  },

  LU: {
    addressTitle: 'Adresse Postale Authentique',
    taxFreeTag: 'Exonéré de Taxe',
    street: 'Adresse (Ligne 1)',
    addressLine2: 'Complément / Étage (Ligne 2)',
    cityState: 'Ville & Canton',
    postcode: 'Code Postal',
    forwarderTitle: 'Format Standard de Livraison e-Commerce',
    residentialTitle: 'Format Livraison Résidentielle Directe',
    copyForwarder: 'Copier format livraison',

    contactTitle: 'Coordonnées de Contact',
    phone: 'Numéro de Téléphone',
    email: 'Adresse e-mail',
    emailNotice: 'Courriel de Test',
    username: 'Nom d\'utilisateur',
    emailTip: 'Courriel pour tests de formulaires uniquement, boîte non fonctionnelle',

    docTitle: 'Identité Officielle & Sécurité',
    docNotice: 'Uniquement pour tests techniques, non valable légalement',

    occupationTitle: 'Emploi & Formation Supérieure',
    company: 'Entreprise',
    title: 'Poste / Fonction',
    university: 'Université',

    financeTitle: 'Carte Bancaire de Test',
    cardNumber: 'Numéro de Carte (Conforme Luhn)',
    expDate: 'Expiration',
    cvv: 'Code CVV',
    bank: 'Banque Émettrice',
    financeNotice: 'Uniquement pour maquettage et algorithmes. Aucun solde ni transaction réelle.',

    genderMale: 'Masculin (M)',
    genderFemale: 'Féminin (F)',
    ageUnit: 'ans'
  },

  // 🇯🇵 日本語 (JP)
  JP: {
    addressTitle: '実体居住地住所 (公的表記)',
    taxFreeTag: '免税対象',
    street: '番地・丁目 (Line 1)',
    addressLine2: '建物名・部屋番号 (Line 2)',
    cityState: '市区町村・都道府県',
    postcode: '郵便番号 (〒)',
    forwarderTitle: '通販・転送用標準受取フォーマット',
    residentialTitle: '戸建て住宅受取フォーマット',
    copyForwarder: '受取形式をコピー',

    contactTitle: '連絡先およびアカウント',
    phone: '電話番号',
    email: 'メールアドレス',
    emailNotice: 'テスト用ダミー',
    username: 'ユーザー名',
    emailTip: 'フォーム入力・開発検証用の仮想アドレスです（実際の送受信は不可）',

    docTitle: '公的身分証・マイナンバー',
    docNotice: '開発テスト・書式検証専用（無効な架空データ）',

    occupationTitle: '勤務先および学歴情報',
    company: '勤務先企業',
    title: '役職',
    university: '出身大学',

    financeTitle: 'テスト用決済カード',
    cardNumber: 'カード番号 (Luhn 検証済)',
    expDate: '有効期限',
    cvv: 'セキュリティコード (CVV)',
    bank: '発行銀行',
    financeNotice: 'UI配置・アルゴリズム検証専用（実際の決済・引落はできません）',

    genderMale: '男性',
    genderFemale: '女性',
    ageUnit: '歳'
  },

  // 🇰🇷 한국어 (KR)
  KR: {
    addressTitle: '거주지 도로명 주소 (표준)',
    taxFreeTag: '비과세 대상',
    street: '도로명 주소 (Line 1)',
    addressLine2: '상세 주소 / 동·호수 (Line 2)',
    cityState: '시·군·구 및 시·도',
    postcode: '우편번호 (5자리)',
    forwarderTitle: '배송대행 및 전자상거래 수령지',
    residentialTitle: '단독주택 직배송 표준 포맷',
    copyForwarder: '배송 포맷 복사',

    contactTitle: '연락처 및 계정 정보',
    phone: '전화번호',
    email: '이메일 주소',
    emailNotice: '개발 테스트용 가상',
    username: '사용자 이름',
    emailTip: '폼 입력 및 개발 검증용 가상 이메일입니다 (실제 수발신 불가)',

    docTitle: '신분증 및 식별 번호',
    docNotice: '개발 테스트 및 서식 검증용 가상 식별번호',

    occupationTitle: '직업 및 학력 정보',
    company: '직장명',
    title: '직위',
    university: '출신 대학',

    financeTitle: '테스트용 결제 카드',
    cardNumber: '카드번호 (Luhn 검증 통과)',
    expDate: '유효기간',
    cvv: '보안코드 (CVV)',
    bank: '발급은행',
    financeNotice: 'UI 레이아웃 및 알고리즘 검증 전용 (실제 결제 불가)',

    genderMale: '남성',
    genderFemale: '여성',
    ageUnit: '세'
  },

  // 🇭🇰 / 🇹🇼 繁體中文 (HK / TW)
  HK: {
    addressTitle: '實體物理地址 (真實地標定位)',
    taxFreeTag: '免消費稅',
    street: '街道地址 (Line 1)',
    addressLine2: '單位 / 樓層 (Line 2)',
    cityState: '區域與地區',
    postcode: '郵遞區號',
    forwarderTitle: '標準收件/轉運格式 (點擊一鍵複製)',
    residentialTitle: '住宅獨棟直寄格式 (點擊一鍵複製)',
    copyForwarder: '一鍵複製轉運格式',

    contactTitle: '聯絡方式與帳號',
    phone: '聯絡電話',
    email: '電子郵箱',
    emailNotice: '測試佔位信箱',
    username: '使用者名稱',
    emailTip: '信箱僅供註冊佔位與表單填充，非真實收信信箱',

    docTitle: '法定身分證件',
    docNotice: '僅供格式校驗與開發測試，非真實有效證件',

    occupationTitle: '任職企業與高等教育',
    company: '任職企業',
    title: '職務職稱',
    university: '畢業院校',

    financeTitle: '虛擬財務卡片',
    cardNumber: '卡號 (通過 Luhn 檢驗)',
    expDate: '有效期限',
    cvv: '安全碼 (CVV)',
    bank: '發卡行',
    financeNotice: '本卡僅供 UI 排版與演算法驗證，無真實金融功能，不可用於實際扣款',

    genderMale: '男',
    genderFemale: '女',
    ageUnit: '歲'
  },

  TW: {
    addressTitle: '實體物理地址 (真實地標定位)',
    taxFreeTag: '免消費稅',
    street: '街道地址 (Line 1)',
    addressLine2: '門牌 / 樓層 (Line 2)',
    cityState: '縣市與行政區',
    postcode: '郵遞區號 (3+2 / 3+3)',
    forwarderTitle: '標準收件/轉運格式 (點擊一鍵複製)',
    residentialTitle: '住宅獨棟直寄格式 (點擊一鍵複製)',
    copyForwarder: '一鍵複製轉運格式',

    contactTitle: '聯絡方式與帳號',
    phone: '聯絡電話',
    email: '電子郵箱',
    emailNotice: '測試佔位信箱',
    username: '使用者名稱',
    emailTip: '信箱僅供註冊佔位與表單填充，非真實收信信箱',

    docTitle: '法定身分證件',
    docNotice: '僅供格式校驗與開發測試，非真實有效證件',

    occupationTitle: '任職企業與高等教育',
    company: '任職企業',
    title: '職務職稱',
    university: '畢業院校',

    financeTitle: '虛擬財務卡片',
    cardNumber: '卡號 (通過 Luhn 檢驗)',
    expDate: '有效期限',
    cvv: '安全碼 (CVV)',
    bank: '發卡行',
    financeNotice: '本卡僅供 UI 排版與演算法驗證，無真實金融功能，不可用於實際扣款',

    genderMale: '男',
    genderFemale: '女',
    ageUnit: '歲'
  },

  // 🇳🇱 Nederlands (NL)
  NL: {
    addressTitle: 'Officieel Woonadres',
    taxFreeTag: 'Belastingvrij',
    street: 'Straat & Huisnummer (Regel 1)',
    addressLine2: 'Toevoeging (Regel 2)',
    cityState: 'Plaats & Provincie',
    postcode: 'Postcode',
    forwarderTitle: 'Standaard Verzendformaat Webshop',
    residentialTitle: 'Woonhuis Levering Formaat',
    copyForwarder: 'Verzendformaat Kopiëren',

    contactTitle: 'Contactgegevens & Profiel',
    phone: 'Telefoonnummer',
    email: 'E-mailadres',
    emailNotice: 'Synthetische Test-Mail',
    username: 'Gebruikersnaam',
    emailTip: 'E-mailadres enkel voor formuliertests en registratie, geen echte mailbox',

    docTitle: 'Fiscaal Nummer & Identificatie',
    docNotice: 'Uitsluitend voor formulier- en softwaretests, geen geldig wettelijk document',

    occupationTitle: 'Beroep & Opleiding',
    company: 'Werkgever',
    title: 'Functietitel',
    university: 'Universiteit / Hogeschool',

    financeTitle: 'Test Betaalkaart',
    cardNumber: 'Kaartnummer (Luhn Gevalideerd)',
    expDate: 'Vervaldatum',
    cvv: 'Beveiligingscode (CVV)',
    bank: 'Uitgevende Bank',
    financeNotice: 'Alleen voor UI- en algoritmetesten. Geen reëel saldo of betaalfunctie.',

    genderMale: 'Mannelijk (M)',
    genderFemale: 'Vrouwelijk (V)',
    ageUnit: 'jaar'
  }
};

export function getCardLabels(countryCode: CountryCode, cardLang: CardLanguage, uiLocale: string): CardLabels {
  if (cardLang === 'zh') {
    return CARD_LABELS_ZH;
  }
  if (cardLang === 'en') {
    return CARD_LABELS_EN;
  }
  // cardLang === 'local'
  const local = CARD_LABELS_BY_COUNTRY[countryCode];
  if (local) {
    return local;
  }
  return uiLocale === 'zh' ? CARD_LABELS_ZH : CARD_LABELS_EN;
}

export function formatForwarderShippingText(
  identity: GeneratedIdentity,
  cardLang: CardLanguage,
  displayFullName: string,
  displayCountryName: string
): string {
  const cCode = identity.countryCode;
  const a = identity.address;
  const i = identity;

  if (cardLang === 'zh') {
    return `收件人: ${displayFullName}
街道地址 (Line 1): ${a.addressLine1 || a.street}
门牌/单元 (Line 2): ${a.addressLine2 || 'N/A'}
城市: ${a.city}
省/州: ${a.stateFull || a.state}
邮政编码: ${a.postcode}
国家/地区: ${displayCountryName}
联系电话: ${i.contact.phoneFormatted}`;
  }

  if (cardLang === 'local') {
    if (cCode === 'IT') {
      return `Destinatario: ${displayFullName}
Indirizzo (Via / Corso): ${a.addressLine1 || a.street}
Interno / Scala: ${a.addressLine2 || 'N/A'}
Città: ${a.city}
Provincia: ${a.stateFull || a.state}
CAP: ${a.postcode}
Paese: Italia (IT)
Telefono: ${i.contact.phoneFormatted}`;
    }

    if (cCode === 'ES') {
      return `Destinatario: ${displayFullName}
Dirección (Línea 1): ${a.addressLine1 || a.street}
Piso / Puerta (Línea 2): ${a.addressLine2 || 'N/A'}
Ciudad: ${a.city}
Provincia: ${a.stateFull || a.state}
Código Postal: ${a.postcode}
País: España (ES)
Teléfono: ${i.contact.phoneFormatted}`;
    }

    if (cCode === 'DE' || cCode === 'CH') {
      return `Empfänger: ${displayFullName}
Straße & Hausnummer: ${a.addressLine1 || a.street}
Zusatz / Etage: ${a.addressLine2 || 'N/A'}
Ort: ${a.city}
Bundesland / Kanton: ${a.stateFull || a.state}
Postleitzahl: ${a.postcode}
Land: ${cCode === 'DE' ? 'Deutschland' : 'Schweiz'} (${cCode})
Telefonnummer: ${i.contact.phoneFormatted}`;
    }

    if (cCode === 'FR' || cCode === 'LU') {
      return `Destinataire: ${displayFullName}
Adresse (Ligne 1): ${a.addressLine1 || a.street}
Complément (Ligne 2): ${a.addressLine2 || 'N/A'}
Ville: ${a.city}
Région / Département: ${a.stateFull || a.state}
Code Postal: ${a.postcode}
Pays: ${cCode === 'FR' ? 'France' : 'Luxembourg'} (${cCode})
Téléphone: ${i.contact.phoneFormatted}`;
    }

    if (cCode === 'JP') {
      return `受取人氏名: ${displayFullName}
住所 (Line 1): ${a.addressLine1 || a.street}
建物名・部屋番号 (Line 2): ${a.addressLine2 || ''}
市区町村: ${a.city}
都道府県: ${a.stateFull || a.state}
郵便番号: 〒${a.postcode}
国名: 日本 (JP)
電話番号: ${i.contact.phoneFormatted}`;
    }

    if (cCode === 'KR') {
      return `수령인: ${displayFullName}
도로명 주소 (Line 1): ${a.addressLine1 || a.street}
상세 주소 (Line 2): ${a.addressLine2 || ''}
시·군·구: ${a.city}
시·도: ${a.stateFull || a.state}
우편번호: ${a.postcode}
국가: 대한민국 (KR)
전화번호: ${i.contact.phoneFormatted}`;
    }

    if (cCode === 'HK' || cCode === 'TW') {
      return `收件人: ${displayFullName}
街道地址 (Line 1): ${a.addressLine1 || a.street}
單位/樓層 (Line 2): ${a.addressLine2 || 'N/A'}
縣市/區域: ${a.stateFull || a.state} ${a.city}
郵遞區號: ${a.postcode}
國家/地區: ${cCode === 'HK' ? '香港特別行政區' : '台灣'}
聯絡電話: ${i.contact.phoneFormatted}`;
    }
  }

  // English fallback
  return `Recipient: ${displayFullName}
Address Line 1: ${a.addressLine1 || a.street}
Address Line 2: ${a.addressLine2 || 'N/A'}
City: ${a.city}
State/Province: ${a.stateFull || a.state}
ZIP/Postal Code: ${a.postcode}
Country: ${displayCountryName}
Phone Number: ${i.contact.phoneFormatted}`;
}

import type { GeneratedIdentity, CardLanguage } from '../types/identity';
import { COUNTRY_LOCAL_META } from '../data/names';

export function formatFullIdentityText(identity: GeneratedIdentity, lang: CardLanguage | string = 'zh'): string {
  const cCode = identity.countryCode;

  // 1. 本地母语模式 (Native Local Format)
  if (lang === 'local') {
    // 日本語 (JP)
    if (cCode === 'JP') {
      return `
=== 個人基本情報 (日本国内公的フォーマット) ===
氏名：${identity.basic.localFullName || identity.basic.fullName}
ふりがな：${identity.basic.phoneticName || ''}
ローマ字表記：${identity.basic.fullName}
性別：${identity.basic.gender === 'male' ? '男性' : '女性'}
年齢：${identity.basic.age} 歳
生年月日：${identity.basic.birthDate}
血液型：${identity.basic.bloodType} 型
星座：${identity.basic.zodiacSign}

=== 住所情報 (日本国内公的表記) ===
郵便番号：〒${identity.address.postcode}
住所：${identity.address.stateFull || identity.address.state}${identity.address.city}${identity.address.addressLine1 || identity.address.street} ${identity.address.addressLine2 || ''}
国名：日本 (JP)
経緯度：${identity.address.lat}, ${identity.address.lng}
Google マップ：https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ' ' + identity.address.postcode)}
OpenStreetMap：https://www.openstreetmap.org/?mlat=${identity.address.lat}&mlon=${identity.address.lng}#map=16/${identity.address.lat}/${identity.address.lng}

=== 連絡先情報 ===
電話番号：${identity.contact.phoneFormatted} (${identity.contact.phone})
メールアドレス：${identity.contact.email} (テスト用ダミーアドレス)
ユーザー名：${identity.contact.username}

=== 公的身分証明 / マイナンバー ===
${identity.document.typeNameLocal || '個人番号 (マイナンバー)'}：${identity.document.docNumber}

=== 勤務先および学歴情報 ===
勤務先企業：${identity.occupation.company}
役職：${identity.occupation.title}
業種：${identity.occupation.industry}
出身大学：${identity.occupation.university}
最終学歴：${identity.occupation.educationDegree}
企業公式サイト：${identity.occupation.website}

=== テスト用クレジットカード (Luhn 検証済) ===
カードブランド：${identity.finance.cardType}
カード番号：${identity.finance.cardFormatted}
有効期限：${identity.finance.expMonth}/${identity.finance.expYear}
セキュリティコード (CVV)：${identity.finance.cvv}
発行銀行：${identity.finance.bankName}

=== 免責事項 (Legal Disclaimer) ===
本データは開発テスト用の仮想生成プロファイルです。実在の人物情報や有効な決済カードではありません。商用取引や不正利用は禁止されています。
`.trim();
    }

    // 한국어 (KR)
    if (cCode === 'KR') {
      return `
=== 기본 인적사항 (대한민국 표준) ===
성명: ${identity.basic.localFullName || identity.basic.fullName}
영문 성명: ${identity.basic.fullName}
한자 성명: ${identity.basic.zhFullName || ''}
성별: ${identity.basic.gender === 'male' ? '남성' : '여성'}
연령: 만 ${identity.basic.age} 세
생년월일: ${identity.basic.birthDate}
혈액형: ${identity.basic.bloodType} 형
별자리: ${identity.basic.zodiacSign}

=== 거주지 주소 정보 (한국 표준 도로명) ===
우편번호: ${identity.address.postcode}
도로명 주소: ${identity.address.stateFull || identity.address.state} ${identity.address.city} ${identity.address.addressLine1 || identity.address.street} ${identity.address.addressLine2 || ''}
국가: 대한민국 (KR)
좌표: ${identity.address.lat}, ${identity.address.lng}
Google 지도: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ' ' + identity.address.postcode)}

=== 연락처 정보 ===
전화번호: ${identity.contact.phoneFormatted} (${identity.contact.phone})
이메일: ${identity.contact.email} (개발 테스트용 가상 이메일)
사용자명: ${identity.contact.username}

=== 신분증 식별 정보 ===
${identity.document.typeNameLocal || '주민등록번호 (RRN)'}: ${identity.document.docNumber}

=== 직업 및 학력 정보 ===
직장명: ${identity.occupation.company}
직위: ${identity.occupation.title}
산업군: ${identity.occupation.industry}
출신대학: ${identity.occupation.university}
학위: ${identity.occupation.educationDegree}

=== 테스트용 결제 카드 (Luhn 검증 통과) ===
카드사: ${identity.finance.cardType}
카드번호: ${identity.finance.cardFormatted}
유효기간: ${identity.finance.expMonth}/${identity.finance.expYear}
보안코드 (CVV): ${identity.finance.cvv}
발급은행: ${identity.finance.bankName}

=== 법적 면책 조항 (Legal Disclaimer) ===
본 프로필 데이터는 소프트웨어 테스트 및 UI 검증을 위해 클라이언트 알고리즘으로 생성된 가상 데이터입니다. 실제 금융 거래나 본인 인증에 사용할 수 없습니다.
`.trim();
    }

    // 繁體中文 (HK & TW)
    if (cCode === 'HK' || cCode === 'TW') {
      return `
=== 個人基本資料 (繁體中文標準) ===
姓名：${identity.basic.localFullName || identity.basic.fullName}
英文/羅馬拼音：${identity.basic.fullName}
性別：${identity.basic.gender === 'male' ? '男' : '女'}
年齡：${identity.basic.age} 歲
出生日期：${identity.basic.birthDate}
血型：${identity.basic.bloodType}
星座：${identity.basic.zodiacSign}

=== 實體地址資料 (真實地標定位) ===
國家/地區：${cCode === 'HK' ? '香港特別行政區' : '台灣'}
縣市/區域：${identity.address.stateFull || identity.address.state} ${identity.address.city}
街道地址 (Line 1)：${identity.address.addressLine1 || identity.address.street}
單位/樓層 (Line 2)：${identity.address.addressLine2 || 'N/A'}
郵遞區號：${identity.address.postcode}
經緯度：${identity.address.lat}, ${identity.address.lng}
Google Maps 連結：https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}
OpenStreetMap 連結：https://www.openstreetmap.org/?mlat=${identity.address.lat}&mlon=${identity.address.lng}#map=16/${identity.address.lat}/${identity.address.lng}

=== 本地聯絡方式 ===
電話號碼：${identity.contact.phoneFormatted} (${identity.contact.phone})
電子郵箱：${identity.contact.email} (隨機生成不可用測試信箱)
用戶名：${identity.contact.username}

=== 法定身分證件 ===
${identity.document.typeNameLocal || identity.document.typeNameZh}：${identity.document.docNumber}

=== 職業與學歷背景 ===
任職企業：${identity.occupation.company}
職務職稱：${identity.occupation.title}
所屬行業：${identity.occupation.industry}
畢業院校：${identity.occupation.university}
學歷學位：${identity.occupation.educationDegree}

=== 虛擬財務卡片 (通過 Luhn 檢驗) ===
卡組織：${identity.finance.cardType}
卡號：${identity.finance.cardFormatted}
有效期限：${identity.finance.expMonth}/${identity.finance.expYear}
安全碼 (CVV)：${identity.finance.cvv}
發卡行：${identity.finance.bankName}

=== 法律免責聲明 ===
本檔案所有姓名、證件、電話與卡號均為前端演算法偽隨機產生的【虛擬測試資料】，僅供軟體開發與排版測試使用，嚴禁用於商業交易或非法活動。
`.trim();
    }

    // Deutsch (DE / CH)
    if (cCode === 'DE' || cCode === 'CH') {
      return `
=== Grunddaten zur Person (DACH Standard) ===
Vollständiger Name: ${identity.basic.localFullName || identity.basic.fullName}
Geschlecht: ${identity.basic.gender === 'male' ? 'Männlich' : 'Weiblich'}
Alter: ${identity.basic.age} Jahre
Geburtsdatum: ${identity.basic.birthDate}
Blutgruppe: ${identity.basic.bloodType}
Sternzeichen: ${identity.basic.zodiacSign}

=== Offizielle Wohnadresse ===
Straße & Hausnummer: ${identity.address.addressLine1 || identity.address.street}
Zusatz / Etage (Line 2): ${identity.address.addressLine2 || 'N/A'}
Postleitzahl / Ort: ${identity.address.postcode} ${identity.address.city}
Bundesland / Kanton: ${identity.address.stateFull || identity.address.state}
Land: ${cCode === 'DE' ? 'Deutschland' : 'Schweiz'} (${cCode})
Koordinaten: ${identity.address.lat}, ${identity.address.lng}
Google Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}

=== Kontaktdaten ===
Telefonnummer: ${identity.contact.phoneFormatted} (${identity.contact.phone})
E-Mail-Adresse: ${identity.contact.email} (Synthetische Test-Mail)
Benutzername: ${identity.contact.username}

=== Steuer & Identifikation ===
${identity.document.typeNameLocal || identity.document.typeName}: ${identity.document.docNumber}

=== Beruf & Ausbildung ===
Arbeitgeber: ${identity.occupation.company}
Berufsbezeichnung: ${identity.occupation.title}
Branche: ${identity.occupation.industry}
Universität / Hochschule: ${identity.occupation.university}
Abschluss: ${identity.occupation.educationDegree}

=== Test-Zahlungskarte (Luhn-Validiert) ===
Kartentyp: ${identity.finance.cardType}
Kartennummer: ${identity.finance.cardFormatted}
Gültig bis: ${identity.finance.expMonth}/${identity.finance.expYear}
Prüfziffer (CVV): ${identity.finance.cvv}
Bank: ${identity.finance.bankName}

=== Rechtlicher Haftungsausschluss ===
Alle Daten sind rein algorithmisch erzeugte synthetische Testdaten zur Softwareentwicklung und Formularvalidierung. Jegliche missbräuchliche oder reale Nutzung ist untersagt.
`.trim();
    }

    // Français (FR / LU)
    if (cCode === 'FR' || cCode === 'LU') {
      return `
=== Informations Personnelles (Format Français) ===
Nom et prénom: ${identity.basic.localFullName || identity.basic.fullName}
Genre: ${identity.basic.gender === 'male' ? 'Masculin' : 'Féminin'}
Âge: ${identity.basic.age} ans
Date de naissance: ${identity.basic.birthDate}
Groupe sanguin: ${identity.basic.bloodType}
Signe astrologique: ${identity.basic.zodiacSign}

=== Adresse Postale Authentique ===
Adresse (Ligne 1): ${identity.address.addressLine1 || identity.address.street}
Complément (Ligne 2): ${identity.address.addressLine2 || 'N/A'}
Code postal: ${identity.address.postcode}
Ville: ${identity.address.city}
Région / Département: ${identity.address.stateFull || identity.address.state}
Pays: ${cCode === 'FR' ? 'France' : 'Luxembourg'} (${cCode})
Coordonnées GPS: ${identity.address.lat}, ${identity.address.lng}
Lien Google Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}

=== Coordonnées de Contact ===
Téléphone: ${identity.contact.phoneFormatted} (${identity.contact.phone})
Adresse e-mail: ${identity.contact.email} (Courriel de test non utilisable)
Nom d'utilisateur: ${identity.contact.username}

=== Identifiant Fiscal / Sécurité Sociale ===
${identity.document.typeNameLocal || identity.document.typeName}: ${identity.document.docNumber}

=== Emploi & Formation ===
Entreprise: ${identity.occupation.company}
Poste: ${identity.occupation.title}
Secteur: ${identity.occupation.industry}
Université: ${identity.occupation.university}
Diplôme: ${identity.occupation.educationDegree}

=== Carte de Test (Conforme Luhn) ===
Réseau: ${identity.finance.cardType}
Numéro de carte: ${identity.finance.cardFormatted}
Date d'expiration: ${identity.finance.expMonth}/${identity.finance.expYear}
Code de sécurité (CVV): ${identity.finance.cvv}
Émetteur: ${identity.finance.bankName}

=== Avertissement Légal (Disclaimer) ===
Toutes les données sont purement synthétiques et destinées au test d'interfaces utilisateur et à la validation de formulaires. Strictement interdit pour les transactions réelles ou la fraude.
`.trim();
    }

    // Italiano (IT)
    if (cCode === 'IT') {
      return `
=== Dati Anagrafici (Standard Ufficiale Italiano) ===
Nome completo: ${identity.basic.localFullName || identity.basic.fullName}
Sesso: ${identity.basic.gender === 'male' ? 'Maschile (M)' : 'Femminile (F)'}
Età: ${identity.basic.age} anni
Data di nascita: ${identity.basic.birthDate}
Gruppo sanguigno: ${identity.basic.bloodType}
Segno zodiacale: ${identity.basic.zodiacSign}

=== Indirizzo di Residenza Ufficiale ===
Indirizzo (Via / Corso): ${identity.address.addressLine1 || identity.address.street}
Interno / Scala (Line 2): ${identity.address.addressLine2 || 'N/A'}
CAP / Città: ${identity.address.postcode} ${identity.address.city} (${identity.address.state})
Regione: ${identity.address.stateFull || identity.address.state}
Paese: Italia (IT)
Coordinate geografiche: ${identity.address.lat}, ${identity.address.lng}
Google Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}
OpenStreetMap: https://www.openstreetmap.org/?mlat=${identity.address.lat}&mlon=${identity.address.lng}#map=16/${identity.address.lat}/${identity.address.lng}

=== Recapiti di Contatto ===
Numero di telefono: ${identity.contact.phoneFormatted} (${identity.contact.phone})
Indirizzo e-mail: ${identity.contact.email} (Email sintetica generata per test)
Nome utente: ${identity.contact.username}

=== Identificazione Fiscale Ufficiale ===
${identity.document.typeNameLocal || 'Codice Fiscale'}: ${identity.document.docNumber}

=== Dati Professionali ed Istruzione ===
Datore di lavoro: ${identity.occupation.company}
Qualifica professionale: ${identity.occupation.title}
Settore industriale: ${identity.occupation.industry}
Università: ${identity.occupation.university}
Titolo di studio: ${identity.occupation.educationDegree}
Sito web aziendale: ${identity.occupation.website}

=== Carta di Pagamento per Test (Algoritmo Luhn Valido) ===
Circuito: ${identity.finance.cardType}
Numero carta: ${identity.finance.cardFormatted}
Scadenza: ${identity.finance.expMonth}/${identity.finance.expYear}
Codice di sicurezza (CVV): ${identity.finance.cvv}
Banca emittente: ${identity.finance.bankName}

=== Clausola di Esonero da Responsabilità (Disclaimer) ===
Tutti i dati generati sono profili sintetici virtuali destinati esclusivamente a test tecnici, sviluppo software e impaginazione grafica. È severamente vietato qualsiasi utilizzo fraudolento o reale.
`.trim();
    }

    // Español (ES)
    if (cCode === 'ES') {
      return `
=== Datos de Identidad Personal (Estándar Oficial Español) ===
Nombre completo: ${identity.basic.localFullName || identity.basic.fullName}
Género: ${identity.basic.gender === 'male' ? 'Masculino' : 'Femenino'}
Edad: ${identity.basic.age} años
Fecha de nacimiento: ${identity.basic.birthDate}
Grupo sanguíneo: ${identity.basic.bloodType}
Signo del zodíaco: ${identity.basic.zodiacSign}

=== Dirección Residencial Verificable ===
Dirección (Línea 1): ${identity.address.addressLine1 || identity.address.street}
Piso / Puerta (Línea 2): ${identity.address.addressLine2 || 'N/A'}
Código Postal / Ciudad: ${identity.address.postcode} ${identity.address.city}
Comunidad / Provincia: ${identity.address.stateFull || identity.address.state}
País: España (ES)
Coordenadas GPS: ${identity.address.lat}, ${identity.address.lng}
Enlace Google Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}

=== Información de Contacto ===
Teléfono: ${identity.contact.phoneFormatted} (${identity.contact.phone})
Correo electrónico: ${identity.contact.email} (Email sintético de prueba)
Nombre de usuario: ${identity.contact.username}

=== Identificación Oficial / Documento ===
${identity.document.typeNameLocal || 'Documento Nacional de Identidad (DNI)'}: ${identity.document.docNumber}

=== Empleo y Formación Académica ===
Empresa / Organización: ${identity.occupation.company}
Puesto de trabajo: ${identity.occupation.title}
Sector profesional: ${identity.occupation.industry}
Universidad: ${identity.occupation.university}
Nivel de estudios: ${identity.occupation.educationDegree}

=== Tarjeta de Pago para Pruebas (Luhn Verificado) ===
Tipo de tarjeta: ${identity.finance.cardType}
Número de tarjeta: ${identity.finance.cardFormatted}
Caducidad: ${identity.finance.expMonth}/${identity.finance.expYear}
Código CVV: ${identity.finance.cvv}
Banco emisor: ${identity.finance.bankName}

=== Descargo de Responsabilidad Legal ===
Perfil 100% sintético generado por algoritmo para pruebas de software y validación de formularios. Prohibido su uso para transacciones reales o suplantación.
`.trim();
    }
  }

  // 2. 中文模式 (Chinese Format)
  const isZh = lang === 'zh';
  if (isZh) {
    const avsTierZh = identity.address.addressMode === 'residential'
      ? '住宅 AVS 认证 (独栋洋房)'
      : (identity.address.addressMode === 'derivation' ? '市政合法门牌 · 独一无二' : '都会名苑公寓 · 100% 真实住宅');

    const taxRateZh = (identity.address.isTaxFree || (identity.address.taxRate && identity.address.taxRate.includes('No Sales Tax')))
      ? '0.00% (免消费税)'
      : (identity.address.taxRate || '0.00% (免消费税)');

    const displayName = identity.basic.zhFullName || identity.basic.localFullName || identity.basic.fullName;
    const subName = identity.basic.fullName !== displayName ? identity.basic.fullName : (identity.basic.phoneticName || '');

    return `
=== 个人基本资料 ===
姓名：${displayName} ${subName ? `(${subName})` : ''}
性别：${identity.basic.gender === 'male' ? '男' : '女'}
年龄：${identity.basic.age} 岁
出生日期：${identity.basic.birthDate}
血型：${identity.basic.bloodType}
星座：${identity.basic.zodiacSign}

=== 真实地址信息 (Google Maps 真实可查) ===
地址方案模式：${identity.address.derivationMeta?.modeLabelZh || (identity.address.addressMode === 'residential' ? '方案B·真实居民住宅/独栋' : identity.address.addressMode === 'derivation' ? '方案A·真实居住街区门牌衍生' : '方案C·真实都会公寓/名苑社区库')}
AVS 风控评级：${avsTierZh}
国家/地区：${identity.address.country} (${identity.address.countryCode})
州/省：${identity.address.stateFull || identity.address.state}
城市：${identity.address.city}
街道地址 (Line 1)：${identity.address.addressLine1 || identity.address.street}
单元/公寓号 (Line 2)：${identity.address.addressLine2 || 'N/A'}
邮政编码：${identity.address.postcode}
消费税率：${taxRateZh}
当地时区：${identity.address.timezone || 'UTC'}
坐标：${identity.address.lat}, ${identity.address.lng}
Google Maps 链接 (需代理·谨防送中)：https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}
OpenStreetMap 链接 (国内免翻·零送中风险)：https://www.openstreetmap.org/?mlat=${identity.address.lat}&mlon=${identity.address.lng}#map=16/${identity.address.lat}/${identity.address.lng}
Bing Maps 链接 (微软直连·安全)：https://www.bing.com/maps?q=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}

=== 本地联系方式 ===
电话号码：${identity.contact.phoneFormatted} (${identity.contact.phone})
电子邮箱：${identity.contact.email} (邮箱为随机生成不可用邮箱地址)
用户名：${identity.contact.username}

=== 本地合规身份/证件 (测试用) ===
${identity.document.typeNameZh}：${identity.document.docNumber}

=== 职业与教育背景 ===
公司名称：${identity.occupation.company}
职务：${identity.occupation.title}
所属行业：${identity.occupation.industry}
毕业院校：${identity.occupation.university}
学历：${identity.occupation.educationDegree}
公司官网：${identity.occupation.website}

=== 虚拟财务卡片 (Luhn 校验合规) ===
卡类型：${identity.finance.cardType}
卡号：${identity.finance.cardFormatted}
有效期：${identity.finance.expMonth}/${identity.finance.expYear}
安全码 (CVV)：${identity.finance.cvv}
发卡行：${identity.finance.bankName}

=== 法律免责声明 / Legal Disclaimer ===
本档案所有姓名、证件、电话与卡号均为纯前端算法伪随机生成的【虚拟测试数据】，仅供软件开发、表单格式校验与排版测试使用，严禁用于任何商业交易、实名认证、欺诈等非法活动。
`.trim();
  }

  // 3. 英文模式 (English Format)
  const avsTierEn = identity.address.addressMode === 'residential'
    ? 'Residential AVS Pass'
    : (identity.address.addressMode === 'derivation' ? 'Residential Street (GIS Validated)' : 'Residential Condominium / Apartment');

  const taxRateEn = (identity.address.isTaxFree || (identity.address.taxRate && identity.address.taxRate.includes('免税')))
    ? '0.00% (No Sales Tax)'
    : (identity.address.taxRate || '0.00% (No Sales Tax)');

  const localMeta = COUNTRY_LOCAL_META[cCode];
  const localCountryName = localMeta?.countryLocalName || identity.address.country;

  return `
=== Basic Information ===
Full Name: ${identity.basic.fullName} ${identity.basic.localFullName && identity.basic.localFullName !== identity.basic.fullName ? `(${identity.basic.localFullName})` : ''}
Gender: ${identity.basic.gender}
Age: ${identity.basic.age}
Date of Birth: ${identity.basic.birthDate}
Blood Type: ${identity.basic.bloodType}
Zodiac: ${identity.basic.zodiacSign}

=== Authentic Address (Google Maps Verifiable) ===
Address Scheme Mode: ${identity.address.derivationMeta?.modeLabelEn || (identity.address.addressMode === 'residential' ? 'Scheme B: Real Residential Address' : identity.address.addressMode === 'derivation' ? 'Scheme A: Residential Street Derivation' : 'Scheme C: Real Residential Condos & Apartments')}
AVS Verification Tier: ${avsTierEn}
Country: ${localCountryName} (${identity.address.countryCode})
State/Province: ${identity.address.stateFull || identity.address.state}
City: ${identity.address.city}
Address Line 1: ${identity.address.addressLine1 || identity.address.street}
Address Line 2: ${identity.address.addressLine2 || 'N/A'}
Postal Code: ${identity.address.postcode}
Sales Tax Rate: ${taxRateEn}
Timezone: ${identity.address.timezone || 'UTC'}
Coordinates: ${identity.address.lat}, ${identity.address.lng}
Google Maps URL (Proxy Required · Geo-Shift Warning): https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}
OpenStreetMap URL (Direct · Zero Risk): https://www.openstreetmap.org/?mlat=${identity.address.lat}&mlon=${identity.address.lng}#map=16/${identity.address.lat}/${identity.address.lng}
Bing Maps URL (Direct · Safe): https://www.bing.com/maps?q=${encodeURIComponent(identity.address.street + ', ' + identity.address.city + ', ' + (identity.address.stateFull || identity.address.state) + ' ' + identity.address.postcode)}

=== Contact Information ===
Phone: ${identity.contact.phoneFormatted} (${identity.contact.phone})
Email: ${identity.contact.email} (Synthetic placeholder, unusable email)
Username: ${identity.contact.username}

=== Compliance Document / Tax ID (Test) ===
${identity.document.typeName}: ${identity.document.docNumber}

=== Employment & Education ===
Company: ${identity.occupation.company}
Job Title: ${identity.occupation.title}
Industry: ${identity.occupation.industry}
University: ${identity.occupation.university}
Education: ${identity.occupation.educationDegree}
Website: ${identity.occupation.website}

=== Test Payment Card (Luhn Validated) ===
Card Brand: ${identity.finance.cardType}
Card Number: ${identity.finance.cardFormatted}
Expiry: ${identity.finance.expMonth}/${identity.finance.expYear}
CVV: ${identity.finance.cvv}
Issuing Bank: ${identity.finance.bankName}

=== Legal Disclaimer & Terms of Use ===
All generated personal data, identification numbers, and cards are 100% synthetic test data produced by client-side algorithms for software testing and UI layout only. Strictly prohibited for real transactions, unauthorized registrations, or fraudulent activities.
`.trim();
}

export function buildCSVContent(identities: GeneratedIdentity[]): string {
  const headers = [
    'Country',
    'Address Mode',
    'AVS / Building Tier',
    'Full Name',
    'Local Name',
    'Gender',
    'Age',
    'Birth Date',
    'Phone',
    'Email',
    'Address Line 1',
    'Address Line 2',
    'City',
    'State',
    'Postcode',
    'Tax Rate',
    'Timezone',
    'Latitude',
    'Longitude',
    'Document Type',
    'Document Number',
    'Company',
    'Job Title',
    'University',
    'Card Brand',
    'Card Number',
    'Card Expiry',
    'CVV',
    'OpenStreetMap URL (Direct)',
    'Google Maps URL'
  ];

  const rows = identities.map(id => [
    id.address.country,
    id.address.derivationMeta?.modeLabelEn || id.address.addressMode || 'Scheme C: Condos',
    id.address.derivationMeta?.avsTier || (id.address.addressMode === 'residential' ? 'Residential Single Family' : 'Residential Condominium / Apartment'),
    id.basic.fullName,
    id.basic.localFullName || '',
    id.basic.gender,
    id.basic.age.toString(),
    id.basic.birthDate,
    id.contact.phoneFormatted,
    id.contact.email,
    id.address.addressLine1 || id.address.street,
    id.address.addressLine2 || '',
    id.address.city,
    id.address.stateFull || id.address.state,
    id.address.postcode,
    id.address.taxRate || '',
    id.address.timezone || '',
    id.address.lat.toString(),
    id.address.lng.toString(),
    id.document.typeName,
    id.document.docNumber,
    id.occupation.company,
    id.occupation.title,
    id.occupation.university,
    id.finance.cardType,
    `="${id.finance.cardNumber}"`, // escape for Excel
    `${id.finance.expMonth}/${id.finance.expYear}`,
    id.finance.cvv,
    `https://www.openstreetmap.org/?mlat=${id.address.lat}&mlon=${id.address.lng}#map=16/${id.address.lat}/${id.address.lng}`,
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(id.address.street + ', ' + id.address.city + ', ' + (id.address.stateFull || id.address.state) + ' ' + id.address.postcode)}`
  ]);

  return '\uFEFF' + [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');
}

export function exportToCSV(identities: GeneratedIdentity[], filename = 'identities.csv') {
  const csvContent = buildCSVContent(identities);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export function exportToJSON(identities: GeneratedIdentity[], filename = 'identities.json') {
  const jsonContent = JSON.stringify(identities, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

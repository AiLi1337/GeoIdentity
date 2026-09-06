import type { CountryCode, DocumentInfo, Gender } from '../types/identity';

export function generateDocument(countryCode: CountryCode, gender: Gender, birthYear: number): DocumentInfo {
  switch (countryCode) {
    case 'US': {
      // US SSN: AAA-GG-SSSS
      // Excludes AAA = 000, 666, 900-999; GG = 00; SSSS = 0000
      let area = Math.floor(Math.random() * 899) + 1;
      if (area === 666) area = 667;
      const group = Math.floor(Math.random() * 99) + 1;
      const serial = Math.floor(Math.random() * 9999) + 1;
      const ssn = `${area.toString().padStart(3, '0')}-${group.toString().padStart(2, '0')}-${serial.toString().padStart(4, '0')}`;
      return {
        typeName: 'SSN',
        typeNameZh: '社会安全号码 (SSN)',
        typeNameLocal: 'Social Security Number (SSN)',
        docNumber: ssn,
        description: '符合美国联邦社会保障署标准号段规则的虚拟测试格式'
      };
    }

    case 'GB': {
      // UK National Insurance Number (NINO): 2 letters + 6 digits + 1 letter (A, B, C, D)
      // Exclude invalid prefixes: D, F, I, Q, U, V
      const validPrefixLetters = 'ABCEGHJKLMNOPRSTWXYZ';
      const p1 = validPrefixLetters[Math.floor(Math.random() * validPrefixLetters.length)];
      const p2 = validPrefixLetters[Math.floor(Math.random() * validPrefixLetters.length)];
      const digits = Math.floor(100000 + Math.random() * 900000).toString();
      const suffix = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
      const nino = `${p1}${p2} ${digits.substring(0, 2)} ${digits.substring(2, 4)} ${digits.substring(4, 6)} ${suffix}`;
      return {
        typeName: 'National Insurance Number (NIN)',
        typeNameZh: '国民保险号码 (NIN)',
        typeNameLocal: 'National Insurance Number (NINO)',
        docNumber: nino,
        description: '符合英国皇家税务及海关总署标准格式规则'
      };
    }

    case 'JP': {
      // Japan My Number (個人番号): 12 digits
      let body = '';
      for (let i = 0; i < 11; i++) {
        body += Math.floor(Math.random() * 10).toString();
      }
      // Check digit algorithm for My Number
      let sum = 0;
      for (let n = 1; n <= 11; n++) {
        const p = parseInt(body.charAt(11 - n), 10);
        const q = n <= 6 ? n + 1 : n - 5;
        sum += p * q;
      }
      const rem = sum % 11;
      const checkDigit = rem <= 1 ? 0 : 11 - rem;
      const full = body + checkDigit.toString();
      const formatted = `${full.substring(0, 4)}-${full.substring(4, 8)}-${full.substring(8, 12)}`;
      return {
        typeName: 'My Number (個人番号)',
        typeNameZh: '日本个人番号 (My Number)',
        typeNameLocal: '個人番号 (マイナンバー)',
        docNumber: formatted,
        description: '符合日本行政手续特定个人识别法律校验规则'
      };
    }

    case 'CA': {
      // Canada SIN (Social Insurance Number): 9 digits with Luhn
      let prefix = '4'; // e.g. Ontario
      let body = prefix;
      for (let i = 0; i < 7; i++) {
        body += Math.floor(Math.random() * 10).toString();
      }
      // Luhn check digit
      let sum = 0;
      for (let i = 0; i < body.length; i++) {
        let digit = parseInt(body.charAt(i), 10);
        if (i % 2 === 1) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      const sin = body + checkDigit.toString();
      const formatted = `${sin.substring(0, 3)}-${sin.substring(3, 6)}-${sin.substring(6, 9)}`;
      return {
        typeName: 'SIN',
        typeNameZh: '社会保险号码 (SIN)',
        typeNameLocal: 'Social Insurance Number (SIN)',
        docNumber: formatted,
        description: '符合加拿大加拿大服务局标准 Luhn 校验规则'
      };
    }

    case 'AU': {
      // Australia TFN: 9 digits
      const digits = Math.floor(100000000 + Math.random() * 900000000).toString();
      const formatted = `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)}`;
      return {
        typeName: 'TFN',
        typeNameZh: '澳洲税号 (TFN)',
        typeNameLocal: 'Tax File Number (TFN)',
        docNumber: formatted,
        description: '符合澳大利亚税务局 (ATO) 9位测试格式'
      };
    }

    case 'DE': {
      // Germany Steuer-ID: 11 digits
      const digits = Math.floor(10000000000 + Math.random() * 90000000000).toString();
      const formatted = `${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 8)} ${digits.substring(8, 11)}`;
      return {
        typeName: 'Steuer-Identifikationsnummer',
        typeNameZh: '德国个人税务识别号 (Steuer-ID)',
        typeNameLocal: 'Steuer-Identifikationsnummer (IdNr)',
        docNumber: formatted,
        description: '符合德国联邦中央税务局 11位规范测试格式'
      };
    }

    case 'FR': {
      // France NIR (Numéro de Sécurité Sociale): 15 digits
      const sex = gender === 'male' ? '1' : '2';
      const year = (birthYear % 100).toString().padStart(2, '0');
      const month = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
      const dept = '75'; // Paris
      const commune = Math.floor(100 + Math.random() * 899).toString();
      const order = Math.floor(100 + Math.random() * 899).toString();
      const nir13 = `${sex}${year}${month}${dept}${commune}${order}`;
      const key = (97n - (BigInt(nir13) % 97n)).toString().padStart(2, '0');
      const formatted = `${sex} ${year} ${month} ${dept} ${commune} ${order} ${key}`;
      return {
        typeName: 'Numéro de Sécurité Sociale (NIR)',
        typeNameZh: '法国医保社保号 (NIR)',
        typeNameLocal: 'Numéro de Sécurité Sociale (NIR)',
        docNumber: formatted,
        description: '符合法国国家统计局 INSEE 校验标准'
      };
    }

    case 'HK': {
      // Hong Kong Identity Card (HKID): 1 letter + 6 digits + (check digit)
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const numPart = Math.floor(100000 + Math.random() * 900000).toString();
      // HKID check digit algorithm:
      // Letter value: A=1, B=2, ..., Z=26
      const letterVal = letter.charCodeAt(0) - 64;
      let total = 9 * 36 + 8 * letterVal;
      const weights = [7, 6, 5, 4, 3, 2];
      for (let i = 0; i < 6; i++) {
        total += parseInt(numPart.charAt(i), 10) * weights[i];
      }
      const rem = total % 11;
      let checkChar = '';
      if (rem === 0) checkChar = '0';
      else if (rem === 1) checkChar = 'A';
      else checkChar = (11 - rem).toString();
      return {
        typeName: 'HKID',
        typeNameZh: '香港身份证号 (HKID)',
        typeNameLocal: '香港身分證 (HKID)',
        docNumber: `${letter}${numPart}(${checkChar})`,
        description: '符合香港入境事务处身份证校验模数规则'
      };
    }

    case 'TW': {
      // Taiwan ID: 1 letter + 9 digits (1 for male, 2 for female)
      const letterTable: Record<string, number> = {
        A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17,
        I: 34, J: 18, K: 19, M: 21, N: 22, O: 35, P: 23, Q: 24,
        T: 27, U: 28, V: 29, W: 32, X: 30, Z: 33
      };
      const letters = Object.keys(letterTable);
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const code = letterTable[letter];
      const d0 = Math.floor(code / 10);
      const d1 = code % 10;
      const genderDigit = gender === 'male' ? 1 : 2;
      const midDigits: number[] = [];
      for (let i = 0; i < 7; i++) {
        midDigits.push(Math.floor(Math.random() * 10));
      }
      // Weight algorithm: d0*1 + d1*9 + g*8 + m1*7 + m2*6 + m3*5 + m4*4 + m5*3 + m6*2 + m7*1
      let sum = d0 * 1 + d1 * 9 + genderDigit * 8;
      const weights = [7, 6, 5, 4, 3, 2, 1];
      for (let i = 0; i < 7; i++) {
        sum += midDigits[i] * weights[i];
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      const fullId = `${letter}${genderDigit}${midDigits.join('')}${checkDigit}`;
      return {
        typeName: 'Taiwan National ID',
        typeNameZh: '台湾身分证统一编号',
        typeNameLocal: '中華民國身分證',
        docNumber: fullId,
        description: '符合内政部户政司检验规则（男1女2及地区权重）'
      };
    }

    case 'SG': {
      // Singapore NRIC/FIN: S/T followed by 7 digits and check letter
      const first = 'S';
      const digits: number[] = [];
      for (let i = 0; i < 7; i++) {
        digits.push(Math.floor(Math.random() * 10));
      }
      const weights = [2, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 7; i++) {
        sum += digits[i] * weights[i];
      }
      const letters = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
      const checkLetter = letters[sum % 11];
      const nric = `${first}${digits.join('')}${checkLetter}`;
      return {
        typeName: 'NRIC',
        typeNameZh: '新加坡国民身份证 (NRIC)',
        typeNameLocal: 'National Registration Identity Card (NRIC)',
        docNumber: nric,
        description: '符合新加坡移民与关卡局 (ICA) 校验模数标准'
      };
    }

    case 'KR': {
      // Korea RRN: YYMMDD-GXXXXXX
      const yy = (birthYear % 100).toString().padStart(2, '0');
      const mm = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
      const dd = Math.floor(1 + Math.random() * 28).toString().padStart(2, '0');
      const g = birthYear < 2000 ? (gender === 'male' ? 1 : 2) : (gender === 'male' ? 3 : 4);
      const rand6 = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        typeName: 'Resident Registration Number (RRN)',
        typeNameZh: '韩国居民登录番号 (주민등록번호)',
        typeNameLocal: '주민등록번호 (RRN)',
        docNumber: `${yy}${mm}${dd}-${g}${rand6}`,
        description: '符合韩国行政安全部住民登录规则（含出生年月日与性别码）'
      };
    }

    case 'CH': {
      // Switzerland AHV-Nr: 756.XXXX.XXXX.XX
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(10 + Math.random() * 90);
      return {
        typeName: 'AHV / AVS Number',
        typeNameZh: '瑞士社会保险号 (AHV/AVS)',
        typeNameLocal: 'AHV-Nummer / No AVS',
        docNumber: `756.${p1}.${p2}.${p3}`,
        description: '符合瑞士联邦社会保险署标准 756 国家前缀规范'
      };
    }

    case 'LU': {
      // Luxembourg Matricule: YYYYMMDDXXXXX
      const yyyy = birthYear.toString();
      const mm = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
      const dd = Math.floor(1 + Math.random() * 28).toString().padStart(2, '0');
      const seq = Math.floor(10000 + Math.random() * 90000).toString();
      return {
        typeName: 'Matricule National',
        typeNameZh: '卢森堡国家登记号 (Matricule)',
        typeNameLocal: 'Matricule National',
        docNumber: `${yyyy}${mm}${dd} ${seq}`,
        description: '符合卢森堡国家社会安全登记处 13 位编码体系'
      };
    }

    case 'IE': {
      // Ireland PPS Number: 7 digits + 1-2 letters
      const digits = Math.floor(1000000 + Math.random() * 9000000).toString();
      const letters = 'WTXAGH';
      const char1 = letters[Math.floor(Math.random() * letters.length)];
      return {
        typeName: 'PPS Number',
        typeNameZh: '爱尔兰个人公共服务号 (PPSN)',
        typeNameLocal: 'Personal Public Service Number (PPSN)',
        docNumber: `${digits}${char1}`,
        description: '符合爱尔兰社会保障部个人公共服务标准格式'
      };
    }

    case 'IT': {
      // Italy Codice Fiscale: 16 characters
      const letters = 'ABCDEFGHILMNPQRSTUVZ';
      let cf = '';
      for (let i = 0; i < 6; i++) cf += letters[Math.floor(Math.random() * letters.length)];
      cf += (birthYear % 100).toString().padStart(2, '0');
      cf += ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'][Math.floor(Math.random() * 12)];
      const day = gender === 'male' ? Math.floor(1 + Math.random() * 28) : Math.floor(41 + Math.random() * 28);
      cf += day.toString().padStart(2, '0');
      cf += 'F205'; // Milano code
      cf += letters[Math.floor(Math.random() * letters.length)];
      return {
        typeName: 'Codice Fiscale',
        typeNameZh: '意大利税号 (Codice Fiscale)',
        typeNameLocal: 'Codice Fiscale',
        docNumber: cf,
        description: '符合意大利税务局 (Agenzia delle Entrate) 16位税务识别体系'
      };
    }

    case 'ES': {
      // Spain DNI: 8 digits + 1 check letter
      const num = Math.floor(10000000 + Math.random() * 90000000);
      const chars = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const letter = chars[num % 23];
      return {
        typeName: 'DNI / NIF',
        typeNameZh: '西班牙国家身份号 (DNI/NIF)',
        typeNameLocal: 'Documento Nacional de Identidad (DNI)',
        docNumber: `${num}-${letter}`,
        description: '符合西班牙国家警政总署 8位数字+Mod23 校验字母'
      };
    }

    case 'NL': {
      // Netherlands BSN: 9 digits
      const digits = Math.floor(100000000 + Math.random() * 900000000).toString();
      return {
        typeName: 'BSN (Burgerservicenummer)',
        typeNameZh: '荷兰公民公民服务号 (BSN)',
        typeNameLocal: 'Burgerservicenummer (BSN)',
        docNumber: `${digits.substring(0, 4)}.${digits.substring(4, 6)}.${digits.substring(6)}`,
        description: '符合荷兰公共服务 11-proof 校验格式规范'
      };
    }

    case 'MY': {
      // Malaysia MyKad: YYMMDD-PB-####
      const yy = (birthYear % 100).toString().padStart(2, '0');
      const mm = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
      const dd = Math.floor(1 + Math.random() * 28).toString().padStart(2, '0');
      const pb = ['14', '10', '01', '08'][Math.floor(Math.random() * 4)]; // State codes: KL, Selangor, Johor, Perak
      const seq = Math.floor(1000 + Math.random() * 9000);
      return {
        typeName: 'MyKad Number',
        typeNameZh: '马来西亚国民身份证号 (MyKad)',
        typeNameLocal: 'Kad Pengenalan Malaysia (MyKad)',
        docNumber: `${yy}${mm}${dd}-${pb}-${seq}`,
        description: '符合马来西亚国民登记局 (JPN) 12位个人识别规范'
      };
    }

    case 'TH': {
      // Thailand ID: 13 digits
      let body = '1';
      for (let i = 0; i < 11; i++) body += Math.floor(Math.random() * 10).toString();
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(body.charAt(i), 10) * (13 - i);
      }
      const check = (11 - (sum % 11)) % 10;
      const full = body + check.toString();
      const formatted = `${full.charAt(0)}-${full.substring(1, 5)}-${full.substring(5, 10)}-${full.substring(10, 12)}-${full.charAt(12)}`;
      return {
        typeName: 'Thai National ID',
        typeNameZh: '泰国国民身份证号',
        typeNameLocal: 'เลขประจำตัวประชาชน',
        docNumber: formatted,
        description: '符合泰国内政部政务厅 13位校验模数规则'
      };
    }

    case 'VN': {
      // Vietnam CCCD: 12 digits
      const prov = '079'; // Ho Chi Minh City
      const centuryGender = birthYear < 2000 ? (gender === 'male' ? '0' : '1') : (gender === 'male' ? '2' : '3');
      const yy = (birthYear % 100).toString().padStart(2, '0');
      const rand6 = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        typeName: 'CCCD (Căn cước công dân)',
        typeNameZh: '越南公民身份证号 (CCCD)',
        typeNameLocal: 'Căn cước công dân (CCCD)',
        docNumber: `${prov}${centuryGender}${yy}${rand6}`,
        description: '符合越南公安部新版 12位芯片身份证规范'
      };
    }

    case 'PH': {
      // Philippines PhilSys / SSS
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(1000 + Math.random() * 9000);
      const p4 = Math.floor(1000 + Math.random() * 9000);
      return {
        typeName: 'PhilSys Card Number (PCN)',
        typeNameZh: '菲律宾国民身份识别号 (PhilSys)',
        typeNameLocal: 'PhilSys Card Number (PCN)',
        docNumber: `${p1}-${p2}-${p3}-${p4}`,
        description: '符合菲律宾统计局 (PSA) 国民身份识别编码系统'
      };
    }
  }
}

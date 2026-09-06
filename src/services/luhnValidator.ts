import type { FinanceInfo, CountryCode } from '../types/identity';

/**
 * Calculates the Luhn check digit for a partial number string
 */
function calculateLuhnCheckDigit(partial: string): number {
  const digits = partial.split('').map(Number);
  let sum = 0;
  let shouldDouble = true;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates whether a card number string passes the Luhn check
 */
export function isValidLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let d = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

const BANKS_BY_COUNTRY: Record<CountryCode, string[]> = {
  US: ['JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One'],
  GB: ['Barclays', 'HSBC UK', 'Lloyds Bank', 'NatWest', 'Standard Chartered'],
  JP: ['三菱UFJ銀行 (MUFG)', '三井住友銀行 (SMBC)', 'みずほ銀行 (Mizuho)', '楽天銀行 (Rakuten)'],
  CA: ['Royal Bank of Canada (RBC)', 'TD Bank', 'Scotiabank', 'BMO Bank of Montreal'],
  AU: ['Commonwealth Bank of Australia', 'Westpac', 'ANZ', 'National Australia Bank (NAB)'],
  DE: ['Deutsche Bank', 'Commerzbank', 'DZ Bank', 'KfW', 'N26'],
  FR: ['BNP Paribas', 'Crédit Agricole', 'Société Générale', 'BPCE Group'],
  HK: ['HSBC Hong Kong (匯豐銀行)', 'Hang Seng Bank (恒生銀行)', 'Bank of China HK (中銀香港)', 'Standard Chartered HK'],
  TW: ['中国信託商業銀行 (CTBC)', '国泰世华商业银行 (Cathay)', '玉山商业银行 (E.SUN)', '台北富邦银行 (Fubon)'],
  SG: ['DBS Bank (星展银行)', 'OCBC Bank (华侨银行)', 'UOB (大华银行)'],
  KR: ['KB Kookmin Bank (KB국민은행)', 'Shinhan Bank (신한은행)', 'Woori Bank (우리은행)', 'Hana Bank (하나은행)'],
  CH: ['UBS Switzerland', 'Credit Suisse (UBS Group)', 'Zürcher Kantonalbank', 'Pictet & Cie'],
  LU: ['Banque Internationale à Luxembourg (BIL)', 'BGL BNP Paribas', 'Spuerkeess (BCEE)'],
  IE: ['Bank of Ireland', 'AIB (Allied Irish Banks)', 'Permanent TSB'],
  IT: ['Intesa Sanpaolo', 'UniCredit', 'Banco BPM', 'Banca Monte dei Paschi di Siena'],
  ES: ['Banco Santander', 'BBVA', 'CaixaBank', 'Banco Sabadell'],
  NL: ['ING Bank', 'Rabobank', 'ABN AMRO'],
  MY: ['Maybank (Malayan Banking)', 'CIMB Bank', 'Public Bank', 'RHB Bank'],
  TH: ['Bangkok Bank (ธนาคารกรุงเทพ)', 'Kasikornbank (KBank)', 'Siam Commercial Bank (SCB)'],
  VN: ['Vietcombank', 'VietinBank', 'BIDV', 'Techcombank'],
  PH: ['BDO Unibank', 'Bank of the Philippine Islands (BPI)', 'Metrobank']
};

/**
 * Generates a valid test card conforming to Luhn algorithm
 */
export function generateFinanceInfo(countryCode: CountryCode): FinanceInfo {
  const cardTypes: Array<'Visa' | 'Mastercard' | 'American Express' | 'JCB'> = 
    countryCode === 'JP' 
      ? ['JCB', 'Visa', 'Mastercard'] 
      : ['Visa', 'Mastercard', 'American Express'];

  const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  let prefix = '4';
  let totalLength = 16;

  if (cardType === 'Visa') {
    prefix = '4' + Math.floor(10000 + Math.random() * 90000).toString(); // e.g. 453282
    totalLength = 16;
  } else if (cardType === 'Mastercard') {
    const mcPrefixes = ['51', '52', '53', '54', '55'];
    prefix = mcPrefixes[Math.floor(Math.random() * mcPrefixes.length)] + Math.floor(1000 + Math.random() * 9000).toString();
    totalLength = 16;
  } else if (cardType === 'American Express') {
    const amexPrefixes = ['34', '37'];
    prefix = amexPrefixes[Math.floor(Math.random() * amexPrefixes.length)] + Math.floor(1000 + Math.random() * 9000).toString();
    totalLength = 15;
  } else if (cardType === 'JCB') {
    prefix = '35' + Math.floor(28 + Math.random() * 61).toString() + Math.floor(10 + Math.random() * 90).toString();
    totalLength = 16;
  }

  // Generate random digits up to totalLength - 1
  let body = prefix;
  while (body.length < totalLength - 1) {
    body += Math.floor(Math.random() * 10).toString();
  }

  // Calculate check digit
  const checkDigit = calculateLuhnCheckDigit(body);
  const cardNumber = body + checkDigit.toString();

  // Format with spaces
  let cardFormatted = '';
  if (totalLength === 15) { // Amex: 4-6-5
    cardFormatted = `${cardNumber.substring(0, 4)} ${cardNumber.substring(4, 10)} ${cardNumber.substring(10)}`;
  } else { // 4-4-4-4
    cardFormatted = cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber;
  }

  // Expiration date (2-5 years in future)
  const currentYear = new Date().getFullYear();
  const expYear = (currentYear + 2 + Math.floor(Math.random() * 4)).toString();
  const expMonth = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');

  // CVV
  const cvvLength = cardType === 'American Express' ? 4 : 3;
  let cvv = '';
  for (let i = 0; i < cvvLength; i++) {
    cvv += Math.floor(Math.random() * 10).toString();
  }

  const bankList = BANKS_BY_COUNTRY[countryCode] || BANKS_BY_COUNTRY.US;
  const bankName = bankList[Math.floor(Math.random() * bankList.length)];

  return {
    cardType,
    cardNumber,
    cardFormatted,
    expMonth,
    expYear,
    cvv,
    bankName
  };
}

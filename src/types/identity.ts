export type CountryCode = 
  | 'US' | 'GB' | 'JP' | 'CA' | 'AU' | 'DE' | 'FR' | 'HK' | 'TW' | 'SG'
  | 'KR' | 'CH' | 'IE' | 'LU' | 'IT' | 'ES' | 'NL' | 'MY' | 'TH' | 'VN' | 'PH';

export type Continent = 'all' | 'tax_free' | 'north_america' | 'europe' | 'asia_pacific' | 'southeast_asia';

export type Gender = 'male' | 'female';

export interface CountryInfo {
  code: CountryCode;
  nameZh: string;
  nameEn: string;
  flag: string;
  dialCode: string;
  currency: string;
  continent: 'north_america' | 'europe' | 'asia_pacific' | 'southeast_asia';
  isTaxFreeZone?: boolean;
  popularStates: { code: string; nameZh: string; nameEn: string; isTaxFree?: boolean }[];
}

export type AddressMode = 'landmark' | 'derivation' | 'residential';

export interface AddressDerivationMeta {
  mode: AddressMode;
  modeLabelZh: string;
  modeLabelEn: string;
  ruleSummary?: string;
  ruleSummaryEn?: string;
  interpolated?: boolean;
  baseStreet?: string;
  houseNumberRange?: string;
  buildingType?: 'commercial' | 'residential' | 'derived';
  avsTier?: string;
}

export interface StreetDerivationRule {
  id: string;
  streetName: string;
  minNumber: number;
  maxNumber: number;
  step?: number;
  parity?: 'even' | 'odd' | 'all';
  city: string;
  state: string;
  stateFull?: string;
  postcode: string;
  country: string;
  countryCode: CountryCode;
  startCoord: { lat: number; lng: number };
  endCoord: { lat: number; lng: number };
  taxRate?: string;
  isTaxFree?: boolean;
  timezone?: string;
  timezoneCode?: string;
}

export interface RealAddress {
  street: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  stateFull?: string;
  postcode: string;
  country: string;
  countryCode: CountryCode;
  lat: number;
  lng: number;
  taxRate?: string;
  isTaxFree?: boolean;
  timezone?: string;
  timezoneCode?: string;
  addressMode?: AddressMode;
  buildingType?: 'commercial' | 'residential' | 'derived';
  derivationMeta?: AddressDerivationMeta;
}

export interface BasicInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  localFullName?: string; // e.g. Japanese Kanji or Traditional Chinese
  phoneticName?: string;  // e.g. Furigana or Romaji
  zhFullName?: string;    // e.g. Chinese translated or standard Hanzi name
  gender: Gender;
  age: number;
  birthDate: string; // YYYY-MM-DD
  avatar: string;
  bloodType: string;
  zodiacSign: string;
}

export interface ContactInfo {
  phone: string;
  phoneFormatted: string;
  email: string;
  username: string;
}

export interface DocumentInfo {
  typeName: string;
  typeNameZh: string;
  typeNameLocal?: string;
  docNumber: string;
  description: string;
}

export type CardLanguage = 'zh' | 'en' | 'local';

export interface OccupationInfo {
  company: string;
  title: string;
  industry: string;
  educationDegree: string;
  university: string;
  website: string;
}

export interface FinanceInfo {
  cardType: 'Visa' | 'Mastercard' | 'American Express' | 'JCB';
  cardNumber: string;
  cardFormatted: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  bankName: string;
}

export interface GeneratedIdentity {
  id: string;
  createdAt: number;
  countryCode: CountryCode;
  countryName: string;
  basic: BasicInfo;
  address: RealAddress;
  contact: ContactInfo;
  document: DocumentInfo;
  occupation: OccupationInfo;
  finance: FinanceInfo;
  isFavorite?: boolean;
}

export interface FilterOptions {
  gender: 'random' | 'male' | 'female';
  ageRange: 'random' | '18-25' | '26-35' | '36-50' | '51-65';
  state?: string;
  isTaxFreeOnly?: boolean;
  addressMode?: AddressMode;
}

export * from './ip';


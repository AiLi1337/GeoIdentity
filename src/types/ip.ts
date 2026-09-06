import type { CountryCode } from './identity';

export type IpApiSource = 'IPWhois' | 'IPInfo' | 'GeoJS' | 'IPGuide';

export interface IpQuerySourceResult {
  source: IpApiSource;
  sourceName: string;
  sourceUrl: string;
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  postal?: string;
  isp?: string;
  lat?: number;
  lng?: number;
  latencyMs: number;
  status: 'success' | 'failed';
  error?: string;
}

export interface IpConsensusResult {
  targetIp: string;
  isClientDetected: boolean;
  winnerCountry: string;
  winnerCountryCode: CountryCode;
  winnerRegion: string;
  winnerCity: string;
  winnerPostal?: string;
  winnerLat?: number;
  winnerLng?: number;
  isp?: string;
  totalQueries: number;
  successQueries: number;
  cityVotes: Record<string, number>;
  topCityVoteCount: number;
  confidenceRate: number; // e.g. 75 for 75%
  details: IpQuerySourceResult[];
  matchedStrategy?: 'exact_city_landmark' | 'exact_city_derivation' | 'state_fallback_landmark' | 'general_fallback';
  strategySummaryZh?: string;
  strategySummaryEn?: string;
}

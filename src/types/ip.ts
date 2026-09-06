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
  matchedStrategy?:
    | 'exact_city_residential'
    | 'exact_city_derivation'
    | 'exact_city_landmark'
    | 'state_residential_fallback'
    | 'state_derivation_fallback'
    | 'state_fallback_landmark'
    | 'national_residential_fallback'
    | 'global_residential_fallback'
    | 'general_fallback';
  strategySummaryZh?: string;
  strategySummaryEn?: string;
}

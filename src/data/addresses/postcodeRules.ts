import type { CountryCode } from '../../types/identity';

export type OsmPostcodeStatus = 'missing-original-tag';

export const COUNTRY_POSTCODE_PATTERNS: Partial<Record<CountryCode, RegExp>> = {
  US: /^\d{5}$/,
  TW: /^\d{3}(\d{2,3})?$/,
  NZ: /^\d{4}$/,
  PT: /^\d{4}-\d{3}$/,
  BE: /^\d{4}$/,
  AT: /^\d{4}$/,
  SE: /^\d{3}\s?\d{2}$/,
  FI: /^\d{5}$/,
  PL: /^\d{2}-\d{3}$/,
  HU: /^\d{4}$/,
  CZ: /^\d{3}\s?\d{2}$/,
  SK: /^\d{3}\s?\d{2}$/,
  SI: /^\d{4}$/,
  EE: /^\d{5}$/,
  LV: /^LV-\d{4}$/,
  LT: /^(?:LT-)?\d{5}$/,
  HR: /^\d{5}$/,
  RO: /^\d{6}$/,
  TR: /^\d{5}$/
};

export const COUNTRIES_WITH_OPTIONAL_MISSING_OSM_POSTCODE = new Set<CountryCode>(['NZ', 'PT', 'BE', 'SE']);

/**
 * Single authoritative postcode validator shared across OSM sync, metadata reconciliation, and UI health audit.
 * HK must remain empty; NZ/PT/BE/SE OSM entries may remain empty only with explicit missing-original-tag evidence.
 */
export function isValidCountryPostcode(
  countryCode: CountryCode | undefined,
  postcode: string | undefined,
  options?: { source?: string; postcodeStatus?: OsmPostcodeStatus }
): boolean {
  const code = countryCode || 'US';
  const trimmed = (postcode || '').trim();

  if (code === 'HK') {
    return trimmed === '';
  }

  if (!trimmed) {
    return (
      options?.source === 'OpenStreetMap' &&
      options?.postcodeStatus === 'missing-original-tag' &&
      COUNTRIES_WITH_OPTIONAL_MISSING_OSM_POSTCODE.has(code)
    );
  }

  const pattern = COUNTRY_POSTCODE_PATTERNS[code];
  if (pattern && options?.source === 'OpenStreetMap') {
    return pattern.test(trimmed);
  }

  return true;
}

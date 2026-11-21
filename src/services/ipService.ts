import type { IpConsensusResult, IpQuerySourceResult } from '../types/ip';
import { COUNTRIES } from '../data/countries';

const TIMEOUT_MS = 4000;

function fetchWithTimeout(url: string, ms = TIMEOUT_MS, fetcher: typeof fetch = fetch): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetcher(url, { signal: controller.signal })
    .finally(() => clearTimeout(id));
}

export async function detectClientIp(): Promise<string> {
  try {
    const res = await fetchWithTimeout('https://api.ipify.org?format=json', 3000);
    if (res.ok) {
      const data = await res.json();
      if (data.ip) return data.ip;
    }
  } catch {
    // Fallback 1: ipwho.is
    try {
      const res = await fetchWithTimeout('https://ipwho.is/', 3000);
      if (res.ok) {
        const data = await res.json();
        if (data.ip) return data.ip;
      }
    } catch {
      // Fallback 2: cloudflare cdn-cgi/trace
      try {
        const res = await fetchWithTimeout('/cdn-cgi/trace', 2500);
        if (res.ok) {
          const text = await res.text();
          const match = text.match(/ip=([^\r\n]+)/);
          if (match && match[1]) return match[1].trim();
        }
      } catch {
        // Ignore
      }
    }
  }
  return '';
}

function cleanCityName(raw?: string): string {
  if (!raw) return '';
  return raw
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+Shi$/i, '')
    .replace(/\s+City$/i, '')
    .trim();
}

function matchCountryCode(rawCode?: string, rawName?: string): string {
  const trimmedCode = rawCode?.trim().toUpperCase() || '';
  if (trimmedCode) {
    const found = COUNTRIES.find(c => c.code === trimmedCode);
    return found ? found.code : trimmedCode;
  }
  if (rawName) {
    const trimmedName = rawName.trim();
    const lower = trimmedName.toLowerCase();
    const found = COUNTRIES.find(c =>
      c.nameEn.toLowerCase() === lower ||
      c.nameZh === trimmedName ||
      (c.code === 'TR' && (lower === 'turkey' || lower === 'turkiye' || lower === 'türkiye'))
    );
    if (found) return found.code;
  }
  return '';
}

async function fetchIpJson(url: string, fetcher: typeof fetch): Promise<Record<string, any>> {
  const res = await fetchWithTimeout(url, TIMEOUT_MS, fetcher);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid IP API response');
  }
  return data as Record<string, any>;
}

function extractExplicitApiError(data: Record<string, any>, checkSuccessFlag = false): string | null {
  if (checkSuccessFlag && data.success === false) {
    return typeof data.message === 'string' && data.message.trim() ? data.message : 'API request failed';
  }
  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }
  if (data.error && typeof data.error === 'object') {
    const msg = data.error.message || data.error.title;
    return typeof msg === 'string' && msg.trim() ? msg : 'API request failed';
  }
  return null;
}

function failedIpResult(
  source: IpQuerySourceResult['source'],
  sourceName: string,
  sourceUrl: string,
  ip: string,
  t0: number,
  err: unknown
): IpQuerySourceResult {
  return {
    source,
    sourceName,
    sourceUrl,
    ip,
    country: '',
    countryCode: '',
    region: '',
    city: '',
    latencyMs: Math.round(performance.now() - t0),
    status: 'failed',
    error: err instanceof Error ? err.message : 'Network Timeout'
  };
}

async function queryIpWhois(ip: string, fetcher: typeof fetch = fetch): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
    const d = await fetchIpJson(url, fetcher);
    const apiError = extractExplicitApiError(d, true);
    if (apiError) throw new Error(apiError);
    return {
      source: 'IPWhois',
      sourceName: 'IPWhois Global Geo',
      sourceUrl: 'https://ipwhois.io',
      ip: d.ip || ip,
      country: d.country || '',
      countryCode: d.country_code || '',
      region: d.region || '',
      city: cleanCityName(d.city),
      postal: d.postal || '',
      isp: d.connection?.isp || d.connection?.org || '',
      lat: d.latitude,
      lng: d.longitude,
      latencyMs: Math.round(performance.now() - t0),
      status: 'success'
    };
  } catch (err) {
    return failedIpResult('IPWhois', 'IPWhois Global Geo', 'https://ipwhois.io', ip, t0, err);
  }
}

async function queryIpInfo(ip: string, fetcher: typeof fetch = fetch): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = ip ? `https://ipinfo.io/${encodeURIComponent(ip)}/json` : 'https://ipinfo.io/json';
    const d = await fetchIpJson(url, fetcher);
    const apiError = extractExplicitApiError(d);
    if (apiError) throw new Error(apiError);
    let lat: number | undefined;
    let lng: number | undefined;
    if (d.loc && typeof d.loc === 'string') {
      const parts = d.loc.split(',');
      if (parts.length === 2) {
        lat = parseFloat(parts[0]);
        lng = parseFloat(parts[1]);
      }
    }
    return {
      source: 'IPInfo',
      sourceName: 'IPinfo.io Intelligence',
      sourceUrl: 'https://ipinfo.io',
      ip: d.ip || ip,
      country: d.country || '',
      countryCode: d.country || '',
      region: d.region || '',
      city: cleanCityName(d.city),
      postal: d.postal || '',
      isp: d.org || '',
      lat,
      lng,
      latencyMs: Math.round(performance.now() - t0),
      status: 'success'
    };
  } catch (err) {
    return failedIpResult('IPInfo', 'IPinfo.io Intelligence', 'https://ipinfo.io', ip, t0, err);
  }
}

async function queryGeoJs(ip: string, fetcher: typeof fetch = fetch): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = ip ? `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json` : 'https://get.geojs.io/v1/ip/geo.json';
    const d = await fetchIpJson(url, fetcher);
    const apiError = extractExplicitApiError(d);
    if (apiError) throw new Error(apiError);
    return {
      source: 'GeoJS',
      sourceName: 'GeoJS Fast Anycast',
      sourceUrl: 'https://www.geojs.io',
      ip: d.ip || ip,
      country: d.country || '',
      countryCode: d.country_code || '',
      region: d.region || '',
      city: cleanCityName(d.city),
      postal: '',
      isp: d.organization_name || '',
      lat: d.latitude ? parseFloat(d.latitude) : undefined,
      lng: d.longitude ? parseFloat(d.longitude) : undefined,
      latencyMs: Math.round(performance.now() - t0),
      status: 'success'
    };
  } catch (err) {
    return failedIpResult('GeoJS', 'GeoJS Fast Anycast', 'https://www.geojs.io', ip, t0, err);
  }
}

async function queryIpGuide(ip: string, fetcher: typeof fetch = fetch): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = ip ? `https://ip.guide/${encodeURIComponent(ip)}` : 'https://ip.guide/';
    const d = await fetchIpJson(url, fetcher);
    const apiError = extractExplicitApiError(d);
    if (apiError) throw new Error(apiError);
    const cityName = cleanCityName(d.location?.city);
    const countryName = d.location?.country || '';
    return {
      source: 'IPGuide',
      sourceName: 'IP-Guide Global Geo',
      sourceUrl: 'https://ip.guide',
      ip: d.ip || ip,
      country: countryName,
      countryCode: matchCountryCode(undefined, countryName),
      region: d.location?.city || '',
      city: cityName,
      postal: '',
      isp: d.autonomous_system?.organization || d.autonomous_system?.name || '',
      lat: d.location?.latitude,
      lng: d.location?.longitude,
      latencyMs: Math.round(performance.now() - t0),
      status: 'success'
    };
  } catch (err) {
    return failedIpResult('IPGuide', 'IP-Guide Global Geo', 'https://ip.guide', ip, t0, err);
  }
}

export async function queryMultiSourceIp(inputIp?: string, fetcher: typeof fetch = fetch): Promise<IpConsensusResult> {
  let targetIp = (inputIp || '').trim();
  let isClientDetected = false;

  if (!targetIp) {
    targetIp = await detectClientIp();
    isClientDetected = true;
  }

  // Concurrent queries to 4 authoritative sources (all with native browser CORS support)
  const [rWhois, rInfo, rGeoJs, rGuide] = await Promise.all([
    queryIpWhois(targetIp, fetcher),
    queryIpInfo(targetIp, fetcher),
    queryGeoJs(targetIp, fetcher),
    queryIpGuide(targetIp, fetcher)
  ]);

  return summarizeIpConsensus(targetIp, isClientDetected, [rWhois, rInfo, rGeoJs, rGuide]);
}

export function summarizeIpConsensus(
  targetIp: string,
  isClientDetected: boolean,
  results: IpQuerySourceResult[]
): IpConsensusResult {
  const successfulResults = results.filter(r => r.status === 'success');

  // If all failed, return an empty consensus with general_fallback status (IP card reports lookupFailed)
  if (successfulResults.length === 0) {
    return {
      targetIp: targetIp || '127.0.0.1',
      isClientDetected,
      winnerCountry: '',
      winnerCountryCode: '',
      winnerRegion: '',
      winnerCity: '',
      winnerPostal: '',
      isp: 'Unknown Network',
      totalQueries: results.length,
      successQueries: 0,
      cityVotes: {},
      topCityVoteCount: 0,
      confidenceRate: 0,
      details: results,
      matchedStrategy: 'general_fallback',
      strategySummaryZh: '所有查询接口超时，未能获取 IP 归属地',
      strategySummaryEn: 'All IP APIs timed out; unable to resolve IP location'
    };
  }

  // Vote for City
  const cityVoteMap: Record<string, number> = {};
  const cityDisplayMap: Record<string, string> = {};

  for (const r of successfulResults) {
    if (r.city) {
      const key = r.city.toLowerCase();
      cityVoteMap[key] = (cityVoteMap[key] || 0) + 1;
      if (!cityDisplayMap[key]) {
        cityDisplayMap[key] = r.city;
      }
    }
  }

  // Find top voted city
  let topCityKey = '';
  let topCityVoteCount = 0;
  for (const [key, count] of Object.entries(cityVoteMap)) {
    if (count > topCityVoteCount) {
      topCityVoteCount = count;
      topCityKey = key;
    }
  }

  // Pick representative result with top city (or first successful result)
  const rep = successfulResults.find(r => r.city && r.city.toLowerCase() === topCityKey) || successfulResults[0];

  const winnerCity = cityDisplayMap[topCityKey] || rep.city || 'Unknown';
  const winnerRegion = rep.region || '';
  const candidateCountryCode =
    rep.countryCode?.trim() ||
    successfulResults.find(r => r.countryCode?.trim())?.countryCode?.trim() ||
    '';
  const candidateCountryName =
    rep.country?.trim() ||
    successfulResults.find(r => r.country?.trim())?.country?.trim() ||
    '';
  const winnerCountryCode = matchCountryCode(candidateCountryCode, candidateCountryName);
  const matchedCountry = COUNTRIES.find(c => c.code === winnerCountryCode);
  const winnerCountry = candidateCountryName || matchedCountry?.nameEn || winnerCountryCode;
  const winnerPostal = rep.postal || successfulResults.find(r => r.postal)?.postal || '';
  const winnerLat = rep.lat ?? successfulResults.find(r => r.lat !== undefined)?.lat;
  const winnerLng = rep.lng ?? successfulResults.find(r => r.lng !== undefined)?.lng;
  const isp = rep.isp || successfulResults.find(r => r.isp)?.isp || '';

  // Calculate confidence rate based on agreement
  const confidenceRate = Math.round((topCityVoteCount / successfulResults.length) * 100);

  // Re-map vote counts with display casing for frontend
  const displayCityVotes: Record<string, number> = {};
  for (const [key, count] of Object.entries(cityVoteMap)) {
    const disp = cityDisplayMap[key] || key;
    displayCityVotes[disp] = count;
  }

  return {
    targetIp: rep.ip || targetIp,
    isClientDetected,
    winnerCountry,
    winnerCountryCode,
    winnerRegion,
    winnerCity,
    winnerPostal,
    winnerLat,
    winnerLng,
    isp,
    totalQueries: results.length,
    successQueries: successfulResults.length,
    cityVotes: displayCityVotes,
    topCityVoteCount,
    confidenceRate,
    details: results
  };
}

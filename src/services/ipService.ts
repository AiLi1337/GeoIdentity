import type { CountryCode } from '../types/identity';
import type { IpConsensusResult, IpQuerySourceResult } from '../types/ip';
import { COUNTRIES } from '../data/countries';

const TIMEOUT_MS = 4000;

function fetchWithTimeout(url: string, ms = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal })
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

function matchCountryCode(rawCode?: string, rawName?: string): CountryCode {
  if (rawCode) {
    const upper = rawCode.toUpperCase();
    const found = COUNTRIES.find(c => c.code === upper);
    if (found) return found.code;
  }
  if (rawName) {
    const lower = rawName.toLowerCase();
    const found = COUNTRIES.find(c => 
      c.nameEn.toLowerCase() === lower || 
      c.nameZh === rawName ||
      lower.includes(c.nameEn.toLowerCase())
    );
    if (found) return found.code;
  }
  return 'US';
}

async function queryIpWhois(ip: string): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = `https://ipwho.is/${encodeURIComponent(ip)}`;
    const res = await fetchWithTimeout(url);
    const d = await res.json();
    const latencyMs = Math.round(performance.now() - t0);
    if (!d.success && d.message) {
      return {
        source: 'IPWhois',
        sourceName: 'IPWhois Global Geo',
        sourceUrl: 'https://ipwhois.io',
        ip: ip || d.ip || '',
        country: '',
        countryCode: '',
        region: '',
        city: '',
        latencyMs,
        status: 'failed',
        error: d.message
      };
    }
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
      latencyMs,
      status: 'success'
    };
  } catch (err: any) {
    return {
      source: 'IPWhois',
      sourceName: 'IPWhois Global Geo',
      sourceUrl: 'https://ipwhois.io',
      ip,
      country: '',
      countryCode: '',
      region: '',
      city: '',
      latencyMs: Math.round(performance.now() - t0),
      status: 'failed',
      error: err?.message || 'Network Timeout'
    };
  }
}

async function queryIpInfo(ip: string): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = ip ? `https://ipinfo.io/${encodeURIComponent(ip)}/json` : 'https://ipinfo.io/json';
    const res = await fetchWithTimeout(url);
    const d = await res.json();
    const latencyMs = Math.round(performance.now() - t0);
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
      latencyMs,
      status: 'success'
    };
  } catch (err: any) {
    return {
      source: 'IPInfo',
      sourceName: 'IPinfo.io Intelligence',
      sourceUrl: 'https://ipinfo.io',
      ip,
      country: '',
      countryCode: '',
      region: '',
      city: '',
      latencyMs: Math.round(performance.now() - t0),
      status: 'failed',
      error: err?.message || 'Network Timeout'
    };
  }
}

async function queryGeoJs(ip: string): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = ip ? `https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json` : 'https://get.geojs.io/v1/ip/geo.json';
    const res = await fetchWithTimeout(url);
    const d = await res.json();
    const latencyMs = Math.round(performance.now() - t0);
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
      latencyMs,
      status: 'success'
    };
  } catch (err: any) {
    return {
      source: 'GeoJS',
      sourceName: 'GeoJS Fast Anycast',
      sourceUrl: 'https://www.geojs.io',
      ip,
      country: '',
      countryCode: '',
      region: '',
      city: '',
      latencyMs: Math.round(performance.now() - t0),
      status: 'failed',
      error: err?.message || 'Network Timeout'
    };
  }
}

async function queryIpGuide(ip: string): Promise<IpQuerySourceResult> {
  const t0 = performance.now();
  try {
    const url = ip ? `https://ip.guide/${encodeURIComponent(ip)}` : 'https://ip.guide/';
    const res = await fetchWithTimeout(url);
    const d = await res.json();
    const latencyMs = Math.round(performance.now() - t0);
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
      latencyMs,
      status: 'success'
    };
  } catch (err: any) {
    return {
      source: 'IPGuide',
      sourceName: 'IP-Guide Global Geo',
      sourceUrl: 'https://ip.guide',
      ip,
      country: '',
      countryCode: '',
      region: '',
      city: '',
      latencyMs: Math.round(performance.now() - t0),
      status: 'failed',
      error: err?.message || 'Network Timeout'
    };
  }
}

export async function queryMultiSourceIp(inputIp?: string): Promise<IpConsensusResult> {
  let targetIp = (inputIp || '').trim();
  let isClientDetected = false;

  if (!targetIp) {
    targetIp = await detectClientIp();
    isClientDetected = true;
  }

  // Concurrent queries to 4 authoritative sources (all with native browser CORS support)
  const [rWhois, rInfo, rGeoJs, rGuide] = await Promise.all([
    queryIpWhois(targetIp),
    queryIpInfo(targetIp),
    queryGeoJs(targetIp),
    queryIpGuide(targetIp)
  ]);

  const results: IpQuerySourceResult[] = [rWhois, rInfo, rGeoJs, rGuide];
  const successfulResults = results.filter(r => r.status === 'success');

  // If all failed, create a minimal fallback result
  if (successfulResults.length === 0) {
    return {
      targetIp: targetIp || '127.0.0.1',
      isClientDetected,
      winnerCountry: 'United States',
      winnerCountryCode: 'US',
      winnerRegion: 'California',
      winnerCity: 'Los Angeles',
      winnerPostal: '90001',
      winnerLat: 34.0522,
      winnerLng: -118.2437,
      isp: 'Unknown Network',
      totalQueries: 4,
      successQueries: 0,
      cityVotes: { 'Los Angeles': 0 },
      topCityVoteCount: 0,
      confidenceRate: 0,
      details: results,
      matchedStrategy: 'general_fallback',
      strategySummaryZh: '所有查询接口超时，已启用默认通用降级配置',
      strategySummaryEn: 'All IP APIs timed out, default fallback activated'
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
  const winnerCountry = rep.country || 'United States';
  const winnerCountryCode = matchCountryCode(rep.countryCode, rep.country);
  const winnerPostal = rep.postal || successfulResults.find(r => r.postal)?.postal || '';
  const winnerLat = rep.lat || successfulResults.find(r => r.lat !== undefined)?.lat;
  const winnerLng = rep.lng || successfulResults.find(r => r.lng !== undefined)?.lng;
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
    totalQueries: 4,
    successQueries: successfulResults.length,
    cityVotes: displayCityVotes,
    topCityVoteCount,
    confidenceRate,
    details: results
  };
}

import type { RealAddress } from '../types/identity';
import type { IpConsensusResult } from '../types/ip';
import { COUNTRIES } from '../data/countries';
import { ADDRESS_MAP } from '../data/addresses/index';
import { matchesState, STREET_DERIVATION_RULES, deriveStreetAddress } from '../data/addresses/schemes/derivationRules';
import { RESIDENTIAL_ADDRESSES } from '../data/addresses/schemes/residentialAddresses';

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeCityToken(value: string): string {
  return value
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function cityMatches(itemCity: string, targetCity: string): boolean {
  if (!targetCity || !itemCity) return false;
  const c1 = normalizeCityToken(itemCity);
  const c2 = normalizeCityToken(targetCity);
  if (c1 === c2) return true;
  if (c1.includes(c2) || c2.includes(c1)) return true;

  // Hong Kong districts / aliases (Wan Chai, Tsim Sha Tsui, Central, Sha Tin, Kowloon)
  if (['hong kong', 'hk', 'central', 'wan chai', 'tsim sha tsui', 'sha tin', 'kowloon', 'mong kok'].some(k => c2.includes(k)) &&
      ['hong kong', '香港', 'central', '中环', '湾仔', '尖沙咀', '沙田', '九龙'].some(k => c1.includes(k))) return true;

  // Singapore
  if ((c2.includes('singapore') || c2.includes('sg')) && (c1.includes('singapore') || c1.includes('新加坡'))) return true;

  // Taiwan (Taipei, New Taipei, Taichung, Kaohsiung, Tainan, Hsinchu, Taoyuan, Xinyi, Daan, Banqiao)
  if (['taipei', 'xinyi', 'daan', 'banqiao', 'new taipei'].some(k => c2.includes(k)) &&
      ['台北', '新北', '大安', '信義', '板橋', 'taipei'].some(k => c1.includes(k))) return true;
  if (c2.includes('taichung') && (c1.includes('台中') || c1.includes('taichung') || c1.includes('西屯') || c1.includes('南屯'))) return true;
  if (c2.includes('kaohsiung') && (c1.includes('高雄') || c1.includes('kaohsiung') || c1.includes('左營') || c1.includes('鼓山'))) return true;

  // Australia (Melbourne -> Victoria suburbs: South Yarra, Brighton, Carlton, Hawthorn, Camberwell)
  // Sydney -> New South Wales suburbs: Mosman, Paddington, Manly, Chatswood, Parramatta
  // Brisbane -> Queensland suburbs: New Farm, Paddington, Indooroopilly
  // Perth -> Cottesloe, Subiaco, Fremantle
  if (c2.includes('melbourne') && ['melbourne', 'south yarra', 'brighton', 'carlton', 'hawthorn', 'camberwell'].some(k => c1.includes(k))) return true;
  if (c2.includes('sydney') && ['sydney', 'mosman', 'paddington', 'manly', 'chatswood', 'parramatta'].some(k => c1.includes(k))) return true;
  if (c2.includes('brisbane') && ['brisbane', 'new farm', 'paddington', 'indooroopilly'].some(k => c1.includes(k))) return true;
  if (c2.includes('perth') && ['perth', 'cottesloe', 'subiaco', 'fremantle'].some(k => c1.includes(k))) return true;

  // Japan (Tokyo -> 世田谷, 杉並, 目黒, 練馬, 調布; Osaka -> 阿倍野, 吹田, 豊中; Yokohama -> 神奈川, 横浜; Kyoto -> 京都; Nagoya -> 名古屋; Sapporo -> 札幌; Fukuoka -> 福岡)
  if (c2.includes('tokyo') && ['tokyo', '東京', '世田谷', '杉並', '目黒', '練馬', '調布'].some(k => c1.includes(k))) return true;
  if (c2.includes('osaka') && ['osaka', '大阪', '阿倍野', '吹田', '豊中'].some(k => c1.includes(k))) return true;
  if (c2.includes('yokohama') && ['yokohama', '横浜', '青葉'].some(k => c1.includes(k))) return true;
  if (c2.includes('kyoto') && ['kyoto', '京都', '左京', '伏見'].some(k => c1.includes(k))) return true;
  if (c2.includes('nagoya') && ['nagoya', '名古屋', '千種', '昭和'].some(k => c1.includes(k))) return true;

  // South Korea (Seoul -> Gangnam, Banpo, Yeonnam, Jamsil, Hannam; Busan -> Haeundae, Gwangalli, Seomyeon; Incheon -> Songdo, Bupyeong, Guwol)
  if (['seoul', 'gangnam', 'seocho', 'mapo', 'songpa', 'yongsan'].some(k => c2.includes(k)) &&
      ['seoul', '首尔', '江南', '瑞草', '麻浦', '松坡', '龙山'].some(k => c1.includes(k))) return true;
  if (c2.includes('busan') && ['busan', '釜山', 'haeundae', 'millak'].some(k => c1.includes(k))) return true;

  // Europe / New Zealand multilingual city aliases
  if ((c2.includes('lisbon') || c2.includes('lisboa')) && (c1.includes('lisboa') || c1.includes('lisbon'))) return true;
  if ((c2.includes('brussels') || c2.includes('bruxelles') || c2.includes('brussel')) &&
      (c1.includes('bruxelles') || c1.includes('brussels'))) return true;
  if ((c2.includes('antwerp') || c2.includes('antwerpen') || c2.includes('berchem')) &&
      (c1.includes('antwerp') || c1.includes('berchem'))) return true;
  if ((c2.includes('vienna') || c2.includes('wien')) && (c1.includes('wien') || c1.includes('vienna'))) return true;
  if ((c2.includes('gothenburg') || c2.includes('goteborg')) && (c1.includes('goteborg') || c1.includes('gothenburg'))) return true;
  if ((c2.includes('warsaw') || c2.includes('warszawa')) && (c1.includes('warszawa') || c1.includes('warsaw'))) return true;
  if ((c2.includes('tampere') || c2.includes('pirkanmaa')) && (c1.includes('tampere') || c1.includes('pirkanmaa'))) return true;
  if ((c2.includes('helsinki') || c2.includes('uusimaa')) && (c1.includes('helsinki') || c1.includes('uusimaa'))) return true;
  if ((c2.includes('graz') || c2.includes('styria') || c2.includes('steiermark')) &&
      (c1.includes('graz') || c1.includes('styria') || c1.includes('steiermark'))) return true;

  return false;
}

export function resolveAddressFromIp(consensus: IpConsensusResult): RealAddress {
  const rawCountryCode = (consensus.winnerCountryCode || '').trim().toUpperCase();
  const supportedCountry = COUNTRIES.find(c => c.code === rawCountryCode);
  if (!supportedCountry) {
    const label = consensus.winnerCountry?.trim() || rawCountryCode || 'Unknown';
    throw new Error(`No address sample for country ${label}`);
  }
  const countryCode = supportedCountry.code;
  const targetCity = (consensus.winnerCity || '').trim();
  const targetRegion = (consensus.winnerRegion || '').trim();

  const countryResidential = RESIDENTIAL_ADDRESSES.filter(a => a.countryCode === countryCode);
  const countryCorridors = STREET_DERIVATION_RULES.filter(r => r.countryCode === countryCode);

  // =========================================================================
  // Track 1: Prefer a bundled residential sample in the same city (Scheme B).
  // =========================================================================
  if (targetCity && countryResidential.length > 0) {
    const cityResidential = countryResidential.filter(a => cityMatches(a.city, targetCity));
    if (cityResidential.length > 0) {
      const match = getRandomItem(cityResidential);
      consensus.matchedStrategy = 'exact_city_residential';
      consensus.strategySummaryZh = `IP 同城住宅样本：匹配 ${match.city} 的内置地址；投递、住宅属性与 AVS 未核验`;
      consensus.strategySummaryEn = `Same-city residential sample in ${match.city}; delivery, occupancy and AVS unverified`;
      return {
        ...match,
        addressMode: 'residential',
        buildingType: 'residential',
        derivationMeta: {
          ...match.derivationMeta,
          mode: 'residential',
          modeLabelZh: 'IP 同城住宅样本',
          modeLabelEn: 'IP Same-City Residential Sample',
          ruleSummary: `根据 IP 归属地 ${targetCity} 匹配内置地址样本；投递与 AVS 未核验`,
          buildingType: 'residential',
          avsTier: 'Residential Sample (AVS unverified)'
        }
      };
    }
  }

  // =========================================================================
  // Track 2: Same-city street interpolation (Scheme A).
  // =========================================================================
  if (targetCity && countryCorridors.length > 0) {
    const cityCorridors = countryCorridors.filter(r => cityMatches(r.city, targetCity));
    if (cityCorridors.length > 0) {
      const rule = getRandomItem(cityCorridors);
      const derived = deriveStreetAddress(rule);
      consensus.matchedStrategy = 'exact_city_derivation';
      consensus.strategySummaryZh = `同城街道插值：沿 ${rule.city} ${rule.streetName} 插值门牌，未逐条核验建筑或投递`;
      consensus.strategySummaryEn = `Same-city interpolation along ${rule.streetName}, ${rule.city}; building and delivery unverified`;
      return {
        ...derived,
        addressMode: 'derivation',
        buildingType: 'residential',
        derivationMeta: {
          ...derived.derivationMeta,
          mode: 'derivation',
          modeLabelZh: '方案A·IP 同城街道插值',
          modeLabelEn: 'Scheme A · Same-City IP Interpolation',
          ruleSummary: `基于 IP 归属地 ${targetCity} 沿 ${rule.streetName} 插值；门牌未逐条核验`,
          buildingType: 'residential',
          avsTier: 'Interpolated Number (unverified)'
        }
      };
    }
  }

  // =========================================================================
  // Track 3: Same-state/region residential sample (Scheme B).
  // =========================================================================
  if (targetRegion && countryResidential.length > 0) {
    const stateResidential = countryResidential.filter(
      a => matchesState(a.state, a.stateFull, targetRegion)
    );
    if (stateResidential.length > 0) {
      const match = getRandomItem(stateResidential);
      consensus.matchedStrategy = 'state_residential_fallback';
      consensus.strategySummaryZh = `同州住宅样本：${targetCity || '该区域'} 暂无同城样本，已匹配 ${targetRegion} 的内置地址；投递与 AVS 未核验`;
      consensus.strategySummaryEn = `Residential sample in ${targetRegion}; delivery and AVS unverified`;
      return {
        ...match,
        addressMode: 'residential',
        buildingType: 'residential',
        derivationMeta: {
          ...match.derivationMeta,
          mode: 'residential',
          modeLabelZh: '同州住宅样本',
          modeLabelEn: 'State Residential Sample',
          ruleSummary: `匹配 ${targetRegion} 的内置地址样本；投递与 AVS 未核验`,
          buildingType: 'residential',
          avsTier: 'Residential Sample (AVS unverified)'
        }
      };
    }
  }

  // =========================================================================
  // Track 4: Same-State/Region Street Corridor Derivation Fallback
  // =========================================================================
  if (targetRegion && countryCorridors.length > 0) {
    const stateCorridors = countryCorridors.filter(
      r => matchesState(r.state, r.stateFull, targetRegion)
    );
    if (stateCorridors.length > 0) {
      const rule = getRandomItem(stateCorridors);
      const derived = deriveStreetAddress(rule);
      consensus.matchedStrategy = 'state_derivation_fallback';
      consensus.strategySummaryZh = `同州街道插值：${targetCity || '该区域'} 暂无同城样本，沿 ${targetRegion} ${rule.streetName} 插值门牌，未逐条核验`;
      consensus.strategySummaryEn = `State street interpolation along ${rule.streetName}, ${targetRegion}; street number unverified`;
      return {
        ...derived,
        addressMode: 'derivation',
        buildingType: 'residential',
        derivationMeta: {
          ...derived.derivationMeta,
          mode: 'derivation',
          modeLabelZh: '同州街道插值',
          modeLabelEn: 'State Street Interpolation',
          ruleSummary: `沿 ${targetRegion} 的 ${rule.streetName} 插值；门牌未逐条核验`,
          buildingType: 'residential',
          avsTier: 'Interpolated Number (unverified)'
        }
      };
    }
  }

  // =========================================================================
  // Track 5: Country-level bundled residential sample (Scheme B).
  // =========================================================================
  if (countryResidential.length > 0) {
    const fallbackRes = getRandomItem(countryResidential);
    consensus.matchedStrategy = 'national_residential_fallback';
    consensus.strategySummaryZh = `全国住宅样本：已匹配 ${fallbackRes.city} 的内置地址；可能并非 IP 同城，投递与 AVS 未核验`;
    consensus.strategySummaryEn = `Bundled residential sample in ${fallbackRes.city}; may differ from IP city, delivery and AVS unverified`;
    return {
      ...fallbackRes,
      addressMode: 'residential',
      buildingType: 'residential'
    };
  }

  // =========================================================================
  // Track 5b: Same-country Scheme C / OSM building addresses (for C/OSM-only countries).
  // =========================================================================
  const countryLandmarks = ADDRESS_MAP[countryCode] || [];
  if (countryLandmarks.length > 0) {
    const cityLandmarks = targetCity ? countryLandmarks.filter(a => cityMatches(a.city, targetCity)) : [];
    const regionLandmarks = (!cityLandmarks.length && targetRegion)
      ? countryLandmarks.filter(a =>
          matchesState(a.state, a.stateFull, targetRegion) ||
          (a.stateFull ? cityMatches(a.stateFull, targetRegion) : false) ||
          cityMatches(a.city, targetRegion)
        )
      : [];
    const pool = cityLandmarks.length > 0 ? cityLandmarks : regionLandmarks.length > 0 ? regionLandmarks : countryLandmarks;
    const match = getRandomItem(pool);
    const isCityMatch = cityLandmarks.length > 0;
    const isRegionMatch = !isCityMatch && regionLandmarks.length > 0;
    consensus.matchedStrategy = isCityMatch ? 'exact_city_landmark' : 'state_fallback_landmark';
    consensus.strategySummaryZh = isCityMatch
      ? `IP 同城 OSM 建筑门牌：匹配 ${match.city} 的可核对来源地址；房号、投递与 AVS 未核验`
      : isRegionMatch
        ? `同区 OSM 建筑门牌：${targetCity || '该地区'} 暂无同城样本，已匹配 ${match.city}（${match.state}）；房号与投递未核验`
        : `同国 OSM 建筑门牌：暂未匹配 ${targetCity || targetRegion || countryCode} 精细地区，已限制返回 ${match.country} ${match.city} 可核对地址；投递未核验`;
    consensus.strategySummaryEn = isCityMatch
      ? `Same-city OSM building in ${match.city}; unit, delivery and AVS unverified`
      : isRegionMatch
        ? `Same-region OSM building in ${match.city}; unit, delivery and AVS unverified`
        : `Same-country OSM building in ${match.city}, ${match.country}; may differ from IP city, delivery unverified`;
    return {
      ...match,
      addressMode: 'landmark',
      buildingType: 'residential',
      derivationMeta: {
        mode: 'landmark',
        modeLabelZh: match.source === 'OpenStreetMap' ? '方案C·OSM 住宅建筑门牌' : '方案C·建筑样本',
        modeLabelEn: match.source === 'OpenStreetMap' ? 'Scheme C (OSM Residential Building)' : 'Scheme C (Building Sample)',
        ruleSummary: match.source === 'OpenStreetMap'
          ? 'OpenStreetMap 公开住宅建筑门牌，未验证住户或 AVS'
          : '已有建筑地址样本，未验证住户或 AVS',
        ruleSummaryEn: match.source === 'OpenStreetMap'
          ? 'Public OSM residential building address; no unit, delivery or AVS verification'
          : undefined,
        interpolated: false,
        buildingType: 'residential',
        avsTier: match.source === 'OpenStreetMap' ? 'Residential Building (AVS unverified)' : 'Residential Condominium / Apartment'
      }
    };
  }

  throw new Error(`No address sample for country ${countryCode}`);
}

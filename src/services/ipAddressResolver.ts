import type { CountryCode, RealAddress } from '../types/identity';
import type { IpConsensusResult } from '../types/ip';
import { matchesState, STREET_DERIVATION_RULES, deriveStreetAddress } from '../data/addresses/schemes/derivationRules';
import { RESIDENTIAL_ADDRESSES } from '../data/addresses/schemes/residentialAddresses';

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cityMatches(itemCity: string, targetCity: string): boolean {
  if (!targetCity || !itemCity) return false;
  const c1 = itemCity.toLowerCase().trim();
  const c2 = targetCity.toLowerCase().trim();
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

  return false;
}

export function resolveAddressFromIp(consensus: IpConsensusResult): RealAddress {
  const countryCode = (consensus.winnerCountryCode || 'US') as CountryCode;
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
  // Track 6: Global bundled residential sample for unsupported countries.
  // =========================================================================
  const globalRes = RESIDENTIAL_ADDRESSES.filter(a => a.countryCode === 'US');
  const fallback = globalRes.length > 0 ? getRandomItem(globalRes) : RESIDENTIAL_ADDRESSES[0];
  consensus.matchedStrategy = 'global_residential_fallback';
  consensus.strategySummaryZh = `未收录该国家的 IP 地址样本，返回美国内置地址；投递与 AVS 未核验`;
  consensus.strategySummaryEn = `Country unavailable; using a bundled US address sample, delivery and AVS unverified`;
  return {
    ...fallback,
    addressMode: 'residential',
    buildingType: 'residential'
  };
}

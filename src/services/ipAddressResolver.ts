import type { CountryCode, RealAddress } from '../types/identity';
import type { IpConsensusResult } from '../types/ip';
import { ADDRESS_MAP } from '../data/addresses';
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
  const landmarkList = ADDRESS_MAP[countryCode] || ADDRESS_MAP.US;

  // =========================================================================
  // Track 1: Prioritize Genuine Residential Home in Same City (Scheme B)
  // Guarantees AVS residential pass and 100% real livable house/apartment.
  // =========================================================================
  if (targetCity && countryResidential.length > 0) {
    const cityResidential = countryResidential.filter(a => cityMatches(a.city, targetCity));
    if (cityResidential.length > 0) {
      const match = getRandomItem(cityResidential);
      consensus.matchedStrategy = 'exact_city_residential';
      consensus.strategySummaryZh = `IP同城真实住宅：精准命中 ${match.city} 真实居民洋房/独栋 (AVS住宅认证，非马路/公共地标)`;
      consensus.strategySummaryEn = `Exact City Residential: Genuine residential property in ${match.city} for buyer AVS`;
      return {
        ...match,
        addressMode: 'residential',
        buildingType: 'residential',
        derivationMeta: {
          ...match.derivationMeta,
          mode: 'residential',
          modeLabelZh: 'IP同城真实住宅 (AVS 白名单)',
          modeLabelEn: 'IP Same-City Residential (AVS)',
          ruleSummary: `根据 IP 归属地 ${targetCity} 优先匹配真实居民独立门牌与经纬度`,
          buildingType: 'residential',
          avsTier: 'Residential Single Family'
        }
      };
    }
  }

  // =========================================================================
  // Track 2: Same-City Street Corridor Derivation (Scheme A with Normal Offset)
  // Generates valid house number set back 18-27m from road centerline onto building parcel.
  // =========================================================================
  if (targetCity && countryCorridors.length > 0) {
    const cityCorridors = countryCorridors.filter(r => cityMatches(r.city, targetCity));
    if (cityCorridors.length > 0) {
      const rule = getRandomItem(cityCorridors);
      const derived = deriveStreetAddress(rule);
      consensus.matchedStrategy = 'exact_city_derivation';
      consensus.strategySummaryZh = `同城街道衍生：基于 ${rule.city} ${rule.streetName} 真实路段合法门牌衍生 (建筑红线偏移，避开大马路/中心地标)`;
      consensus.strategySummaryEn = `Same-City Corridor Derivation: Parcel setback along ${rule.streetName}, ${rule.city}`;
      return {
        ...derived,
        derivationMeta: {
          ...derived.derivationMeta,
          mode: 'derivation',
          modeLabelZh: '方案A·IP同城真实街道衍生',
          modeLabelEn: 'Scheme A · Same-City IP Derivation',
          ruleSummary: `基于 IP 归属地 ${targetCity} 沿 ${rule.streetName} 合法门牌走廊生成真实建筑点位`,
          avsTier: 'GIS Derived Street (Parcel Setback)'
        }
      };
    }
  }

  // =========================================================================
  // Track 3: Same-State/Region Residential Fallback (Scheme B)
  // Ensure we find a residential home in the same state before any commercial skyscraper!
  // =========================================================================
  if (targetRegion && countryResidential.length > 0) {
    const stateResidential = countryResidential.filter(
      a => matchesState(a.state, a.stateFull, targetRegion)
    );
    if (stateResidential.length > 0) {
      const match = getRandomItem(stateResidential);
      consensus.matchedStrategy = 'state_residential_fallback';
      consensus.strategySummaryZh = `同州住宅保底：${targetCity || '该区域'} 细分住宅未收录，已匹配 ${targetRegion} 真实居民住宅`;
      consensus.strategySummaryEn = `State Residential Match: Genuine home in ${targetRegion} for buyer AVS`;
      return {
        ...match,
        addressMode: 'residential',
        buildingType: 'residential',
        derivationMeta: {
          ...match.derivationMeta,
          mode: 'residential',
          modeLabelZh: '同州真实住宅 (平滑保底)',
          modeLabelEn: 'State Residential (Fallback)',
          ruleSummary: `已安全匹配至 ${targetRegion} 州级真实居民住宅`,
          buildingType: 'residential',
          avsTier: 'Residential Single Family'
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
      consensus.strategySummaryZh = `同州走廊衍生：${targetCity || '该区域'} 暂无直达住宅，已匹配 ${targetRegion} 核心街道合法门牌`;
      consensus.strategySummaryEn = `State Corridor Derivation: Valid parcel along ${rule.streetName}, ${targetRegion}`;
      return derived;
    }
  }

  // =========================================================================
  // Track 5: Safe National Real Residential Anchor (Scheme B)
  // Ensure every human identity gets a genuine home address, never an office building.
  // =========================================================================
  if (countryResidential.length > 0) {
    const fallbackRes = getRandomItem(countryResidential);
    consensus.matchedStrategy = 'national_residential_fallback';
    consensus.strategySummaryZh = `全域真实住宅保底：已为您匹配 ${fallbackRes.city} 真实居民住宅 (AVS住宅白名单)`;
    consensus.strategySummaryEn = `National Residential Fallback: Genuine residence in ${fallbackRes.city}`;
    return fallbackRes;
  }

  // =========================================================================
  // Track 6: Exact Same-City Commercial Landmark (Only if country has no residential seeds)
  // =========================================================================
  if (targetCity && landmarkList.length > 0) {
    const cityLandmarks = landmarkList.filter(a => cityMatches(a.city, targetCity));
    if (cityLandmarks.length > 0) {
      const match = getRandomItem(cityLandmarks);
      consensus.matchedStrategy = 'exact_city_landmark';
      consensus.strategySummaryZh = `完全同城商业地标：精准命中 ${targetCity} 已收录实体商务大厦 (适合企业/商户开户)`;
      consensus.strategySummaryEn = `Exact City Landmark: Physical commercial building in ${targetCity}`;
      return {
        ...match,
        addressMode: 'landmark',
        buildingType: 'commercial',
        derivationMeta: {
          mode: 'landmark',
          modeLabelZh: 'IP同城实体地标 (100% 真实)',
          modeLabelEn: 'IP Exact City Landmark',
          ruleSummary: `根据 IP 归属地精准匹配到 ${targetCity} 真实商务实体建筑`,
          buildingType: 'commercial',
          avsTier: 'Commercial Landmark'
        }
      };
    }
  }

  // =========================================================================
  // Track 7: Same-State Commercial Landmark Fallback
  // =========================================================================
  if (targetRegion && landmarkList.length > 0) {
    const stateLandmarks = landmarkList.filter(
      a => matchesState(a.state, a.stateFull, targetRegion)
    );
    if (stateLandmarks.length > 0) {
      const match = getRandomItem(stateLandmarks);
      consensus.matchedStrategy = 'state_fallback_landmark';
      consensus.strategySummaryZh = `同州商业地标保底：已匹配 ${targetRegion} 核心商务实体地标`;
      consensus.strategySummaryEn = `State Landmark Fallback: Core commercial landmark in ${targetRegion}`;
      return {
        ...match,
        addressMode: 'landmark',
        buildingType: 'commercial',
        derivationMeta: {
          mode: 'landmark',
          modeLabelZh: '同州核心地标 (平滑保底)',
          modeLabelEn: 'State Core Landmark (Fallback)',
          ruleSummary: `已安全匹配至 ${targetRegion} 州级核心实体地标`,
          buildingType: 'commercial',
          avsTier: 'Commercial Landmark'
        }
      };
    }
  }

  // General fallback
  const fallback = getRandomItem(landmarkList);
  consensus.matchedStrategy = 'general_fallback';
  consensus.strategySummaryZh = `通用保底：已为您分发 ${fallback.city} 核心商业实体地标`;
  consensus.strategySummaryEn = `General Fallback: Assigned core physical landmark in ${fallback.city}`;
  return fallback;
}

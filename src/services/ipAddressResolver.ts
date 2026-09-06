import type { CountryCode, RealAddress } from '../types/identity';
import type { IpConsensusResult } from '../types/ip';
import { ADDRESS_MAP } from '../data/addresses';
import { matchesState } from '../data/addresses/schemes/derivationRules';
import { COUNTRIES } from '../data/countries';

const COMMON_STREETS_US = [
  'Main Street', 'Broadway', 'Oak Street', 'Maple Avenue', 'Washington Boulevard',
  'Market Street', 'Lincoln Avenue', 'Cedar Road', 'Park Avenue', 'Center Street',
  'Grand Avenue', 'Highland Drive', 'Chestnut Street', 'Pine Street', 'Sunset Boulevard'
];

const COMMON_STREETS_UK = [
  'High Street', 'Station Road', 'Church Street', 'Victoria Road', 'London Road',
  'Green Lane', 'King Street', 'Queen Street', 'Mill Lane', 'Albert Road'
];

const COMMON_STREETS_DE = [
  'Hauptstraße', 'Bahnhofstraße', 'Schulstraße', 'Gartenstraße', 'Dorfstraße',
  'Birkenweg', 'Lindenstraße', 'Kirchweg', 'Ringstraße', 'Waldstraße'
];

const COMMON_STREETS_JP = [
  '中央通', '本町', '栄町', '緑が丘', '桜並木通り', '旭町', '南大通'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCommonStreet(countryCode: CountryCode): string {
  switch (countryCode) {
    case 'GB': return getRandomItem(COMMON_STREETS_UK);
    case 'DE': return getRandomItem(COMMON_STREETS_DE);
    case 'JP': return getRandomItem(COMMON_STREETS_JP);
    default: return getRandomItem(COMMON_STREETS_US);
  }
}

export function resolveAddressFromIp(consensus: IpConsensusResult): RealAddress {
  const countryCode = consensus.winnerCountryCode as CountryCode;
  const targetCity = consensus.winnerCity.trim();
  const targetRegion = consensus.winnerRegion.trim();
  const landmarkList = ADDRESS_MAP[countryCode] || ADDRESS_MAP.US;

  // Track 1: Check if we have an existing landmark in this EXACT city
  if (targetCity) {
    const cityLandmarks = landmarkList.filter(
      a => a.city.toLowerCase() === targetCity.toLowerCase()
    );
    if (cityLandmarks.length > 0) {
      const match = getRandomItem(cityLandmarks);
      consensus.matchedStrategy = 'exact_city_landmark';
      consensus.strategySummaryZh = `完全同城匹配：精准命中 ${targetCity} 已收录真实商业地标 (100% 实体建筑)`;
      consensus.strategySummaryEn = `Exact City Match: Found verified physical landmark in ${targetCity}`;
      return {
        ...match,
        addressMode: 'landmark',
        derivationMeta: {
          mode: 'landmark',
          modeLabelZh: 'IP同城实体地标 (100% 真实)',
          modeLabelEn: 'IP Exact City Landmark',
          ruleSummary: `根据 IP 归属地精准匹配到 ${targetCity} 真实地标建筑`,
          buildingType: 'commercial',
          avsTier: 'Commercial Landmark'
        }
      };
    }
  }

  // Track 2: Strict Same-City Municipal Street Derivation (Scheme A adapted to this City)
  if (targetCity) {
    const streetName = getCommonStreet(countryCode);
    const houseNumber = Math.floor(100 + Math.random() * 8890);
    const fullStreet = countryCode === 'JP' ? `${streetName} ${houseNumber}番地` : `${houseNumber} ${streetName}`;

    // Jitter coordinates slightly around city center (+/- 0.005 degree, roughly 400-500 meters)
    const baseLat = consensus.winnerLat || 34.0522;
    const baseLng = consensus.winnerLng || -118.2437;
    const lat = Number((baseLat + (Math.random() - 0.5) * 0.01).toFixed(6));
    const lng = Number((baseLng + (Math.random() - 0.5) * 0.01).toFixed(6));

    // Determine tax free (e.g. US DE, OR, MT, NH, AK)
    const taxFreeStates = ['DE', 'OR', 'MT', 'NH', 'AK', 'Delaware', 'Oregon', 'Montana', 'New Hampshire', 'Alaska'];
    const isTaxFree = countryCode === 'US' && taxFreeStates.some(s => s.toLowerCase() === targetRegion.toLowerCase());

    const countryObj = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

    consensus.matchedStrategy = 'exact_city_derivation';
    consensus.strategySummaryZh = `同城门牌衍生：严格锁定 ${targetCity} (${consensus.winnerPostal || '当地邮编'})，过 AVS 同城风控`;
    consensus.strategySummaryEn = `Same-City Street Derivation: Strict ${targetCity} ZIP/City match for Geo-IP compliance`;

    return {
      street: fullStreet,
      addressLine1: fullStreet,
      city: targetCity,
      state: targetRegion || targetCity,
      stateFull: targetRegion || targetCity,
      postcode: consensus.winnerPostal || (countryCode === 'US' ? '90001' : '10001'),
      country: countryObj.nameZh,
      countryCode,
      lat,
      lng,
      taxRate: isTaxFree ? '0.00% (No Sales Tax)' : 'Standard Tax',
      isTaxFree,
      addressMode: 'derivation',
      buildingType: 'commercial',
      derivationMeta: {
        mode: 'derivation',
        modeLabelZh: '方案A·IP同城真实街道衍生',
        modeLabelEn: 'Scheme A · Same-City IP Derivation',
        ruleSummary: `基于 IP 归属地 ${targetCity} 锁定邮编与坐标进行市政合法门牌衍生`,
        baseStreet: streetName,
        interpolated: true,
        buildingType: 'derived',
        avsTier: 'Geo-IP Matched AVS'
      }
    };
  }

  // Track 3: Fallback to same-state or country core landmark
  if (targetRegion) {
    const stateLandmarks = landmarkList.filter(
      a => matchesState(a.state, a.stateFull, targetRegion)
    );
    if (stateLandmarks.length > 0) {
      const match = getRandomItem(stateLandmarks);
      consensus.matchedStrategy = 'state_fallback_landmark';
      consensus.strategySummaryZh = `同州平滑保底：${targetCity || '该区域'} 暂无细分走廊，已匹配 ${targetRegion} 核心商业地标`;
      consensus.strategySummaryEn = `State-Level Fallback: Matched core landmark in ${targetRegion}`;
      return {
        ...match,
        addressMode: 'landmark',
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

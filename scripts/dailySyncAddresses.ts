import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COUNTRIES } from '../src/data/countries';
import { ADDRESS_MAP } from '../src/data/addresses/index';
import { STREET_DERIVATION_RULES } from '../src/data/addresses/schemes/derivationRules';
import { RESIDENTIAL_ADDRESSES } from '../src/data/addresses/schemes/residentialAddresses';
import { syncOsmApartmentsIfAvailable, assertOsmSnapshotContinuity, type OsmApartment } from './osmAddressSync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 开始执行每日地址库自动化扫描与同步校验...');

const osmPath = path.resolve(__dirname, '../src/data/addresses/osmApartments.json');
const osmApartments = await syncOsmApartmentsIfAvailable();
if (osmApartments === null) {
  console.warn('OpenStreetMap 接口暂不可用；跳过本次同步，保留上次成功的数据与时间戳。');
  process.exit(0);
}
const previousSnapshot = JSON.parse(fs.readFileSync(osmPath, 'utf-8')) as OsmApartment[];
assertOsmSnapshotContinuity(previousSnapshot, osmApartments);
const osmSnapshot = JSON.stringify(osmApartments, null, 2) + '\n';
if (fs.readFileSync(osmPath, 'utf-8').trim() === osmSnapshot.trim()) {
  console.log('OpenStreetMap 地址快照无变化；保留数据版本与获取时间。');
  process.exit(0);
}

// 1. 基础校验
let totalLandmarks = 0;
const totalSchemeACorridors = STREET_DERIVATION_RULES.length;
let totalSchemeACapacity = 0;
const totalSchemeB = RESIDENTIAL_ADDRESSES.length;
let coordinateErrors = 0;

for (const rule of STREET_DERIVATION_RULES) {
  const cap = Math.abs(rule.maxNumber - rule.minNumber) + 1;
  totalSchemeACapacity += cap;
}

const countryBreakdown: Record<string, any> = {};

for (const country of COUNTRIES) {
  const code = country.code;
  const landmarks = code === 'US'
    ? [...(ADDRESS_MAP.US || []).filter(a => a.source !== 'OpenStreetMap'), ...osmApartments]
    : ADDRESS_MAP[code] || [];
  totalLandmarks += landmarks.length;

  const corridors = STREET_DERIVATION_RULES.filter(r => r.countryCode === code);
  let corridorCap = 0;
  for (const c of corridors) {
    corridorCap += Math.abs(c.maxNumber - c.minNumber) + 1;
  }

  const resList = RESIDENTIAL_ADDRESSES.filter(a => a.countryCode === code);

  // 坐标合法性校验
  for (const a of [...landmarks, ...resList]) {
    if (!Number.isFinite(a.lat) || !Number.isFinite(a.lng) || Math.abs(a.lat) > 90 || Math.abs(a.lng) > 180) {
      coordinateErrors++;
    }
  }

  countryBreakdown[code] = {
    code,
    nameZh: country.nameZh,
    nameEn: country.nameEn,
    flag: country.flag,
    continent: country.continent,
    isTaxFreeZone: country.isTaxFreeZone || false,
    landmarkCount: landmarks.length,
    schemeACorridorCount: corridors.length,
    schemeACapacity: corridorCap,
    schemeBResidentialCount: resList.length,
    totalPhysicalPoints: landmarks.length + resList.length,
    totalDerivableCapacity: landmarks.length + resList.length + corridorCap
  };
}

const now = new Date();
const dateStr = now.toISOString().slice(0, 10);
const timeStr = now.toISOString().slice(11, 19);

const metadata = {
  version: `v${dateStr.replace(/-/g, '.')}.${Math.floor(now.getTime() / 86400000) % 100}`,
  lastUpdated: now.toISOString(),
  lastUpdatedFormattedZh: `${dateStr} ${timeStr} (UTC)`,
  lastUpdatedFormattedEn: `${dateStr} ${timeStr} UTC`,
  healthStatus: coordinateErrors === 0 ? 'HEALTHY' : 'WARNING',
  syncSchedule: 'Scheduled daily at 00:00 UTC; GitHub Actions may start later',
  totalCountries: COUNTRIES.length,
  stats: {
    totalPhysicalLandmarks: totalLandmarks,
    totalSchemeACorridors: totalSchemeACorridors,
    totalSchemeACapacity: totalSchemeACapacity,
    totalSchemeBResidential: totalSchemeB,
    totalPhysicalVerifiedAddresses: totalLandmarks + totalSchemeB,
    totalReachableAddresses: totalLandmarks + totalSchemeB + totalSchemeACapacity
  },
  countryBreakdown,
  syncLogs: [
    {
      timestamp: now.toISOString(),
      action: 'DAILY_AUTOMATED_SYNC',
      status: 'SUCCESS',
      message: `已同步 OpenStreetMap 公开住宅建筑门牌 ${osmApartments.length} 处。其余地址来自仓库静态数据；已检查 ${totalLandmarks + totalSchemeB} 处地址坐标是否为数字，未核验 AVS 或邮政投递。`
    }
  ]
};

const targetPath = path.resolve(__dirname, '../src/data/addresses/metadata.json');
if (coordinateErrors > 0) throw new Error(`${coordinateErrors} invalid address coordinates; refusing to publish`);
fs.writeFileSync(osmPath, osmSnapshot, 'utf-8');
fs.writeFileSync(targetPath, JSON.stringify(metadata, null, 2), 'utf-8');

console.log(`✅ 每日地址库同步与健康校验成功！`);
console.log(`📊 统计报告:`);
console.log(`   - 覆盖国家: ${COUNTRIES.length}/21`);
console.log(`   - 真实地标种子: ${totalLandmarks}`);
console.log(`   - 方案A街道走廊: ${totalSchemeACorridors} 条 (可衍生 ${totalSchemeACapacity.toLocaleString()} 独立门牌)`);
console.log(`   - 方案B居民住宅: ${totalSchemeB} 处`);
console.log(`   - 总物理实存点位: ${totalLandmarks + totalSchemeB} 处`);
console.log(`   - 元数据已写入: ${targetPath}`);

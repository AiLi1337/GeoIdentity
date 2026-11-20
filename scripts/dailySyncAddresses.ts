import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isDeepStrictEqual } from 'node:util';
import { COUNTRIES } from '../src/data/countries';
import { ADDRESS_MAP } from '../src/data/addresses/index';
import { STREET_DERIVATION_RULES } from '../src/data/addresses/schemes/derivationRules';
import { RESIDENTIAL_ADDRESSES } from '../src/data/addresses/schemes/residentialAddresses';
import { syncOsmApartmentsIfAvailable, assertOsmSnapshotContinuity, type OsmApartment } from './osmAddressSync';
import { isValidCountryPostcode } from '../src/data/addresses/postcodeRules';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function computeAddressMetadataStats(osmApartments: OsmApartment[]) {
  let totalLandmarks = 0;
  const totalSchemeACorridors = STREET_DERIVATION_RULES.length;
  let totalSchemeACapacity = 0;
  const totalSchemeB = RESIDENTIAL_ADDRESSES.length;
  let coordinateErrors = 0;

  for (const rule of STREET_DERIVATION_RULES) {
    totalSchemeACapacity += Math.abs(rule.maxNumber - rule.minNumber) + 1;
  }

  const countryBreakdown: Record<string, any> = {};

  for (const country of COUNTRIES) {
    const code = country.code;
    const staticLandmarks = (ADDRESS_MAP[code] || []).filter(a => a.source !== 'OpenStreetMap');
    const countryOsm = osmApartments.filter(a => (a.countryCode || 'US') === code);
    const landmarks = [...staticLandmarks, ...countryOsm];
    totalLandmarks += landmarks.length;

    const corridors = STREET_DERIVATION_RULES.filter(r => r.countryCode === code);
    let corridorCap = 0;
    for (const c of corridors) {
      corridorCap += Math.abs(c.maxNumber - c.minNumber) + 1;
    }

    const resList = RESIDENTIAL_ADDRESSES.filter(a => a.countryCode === code);

    for (const a of [...landmarks, ...resList]) {
      const source = 'source' in a && a.source === 'OpenStreetMap' ? 'OpenStreetMap'
        : ('id' in a && typeof a.id === 'string' && /^(node|way|relation)\/\d+$/.test(a.id) ? 'OpenStreetMap' : undefined);
      const postcodeStatus = 'postcodeStatus' in a ? a.postcodeStatus : undefined;
      const hasValidPostcode = isValidCountryPostcode(code, a.postcode, { source, postcodeStatus });
      if (!a.street.trim() || !a.city.trim() || !hasValidPostcode ||
          !Number.isFinite(a.lat) || !Number.isFinite(a.lng) ||
          Math.abs(a.lat) > 90 || Math.abs(a.lng) > 180) {
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
      osmCount: countryOsm.length,
      schemeACorridorCount: corridors.length,
      schemeACapacity: corridorCap,
      schemeBResidentialCount: resList.length,
      totalPhysicalPoints: landmarks.length + resList.length,
      totalDerivableCapacity: landmarks.length + resList.length + corridorCap
    };
  }

  return {
    coordinateErrors,
    totalCountries: COUNTRIES.length,
    stats: {
      totalPhysicalLandmarks: totalLandmarks,
      totalOsmBuildings: osmApartments.length,
      totalSchemeACorridors,
      totalSchemeACapacity,
      totalSchemeBResidential: totalSchemeB,
      totalPhysicalVerifiedAddresses: totalLandmarks + totalSchemeB,
      totalReachableAddresses: totalLandmarks + totalSchemeB + totalSchemeACapacity
    },
    countryBreakdown
  };
}

export function buildRefreshedMetadata(
  osmApartments: OsmApartment[],
  previousMetadata: Record<string, any> | null,
  osmChanged: boolean,
  now: Date = new Date()
) {
  const computed = computeAddressMetadataStats(osmApartments);
  if (computed.coordinateErrors > 0) {
    throw new Error(`${computed.coordinateErrors} invalid address records; refusing to publish`);
  }

  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toISOString().slice(11, 19);

  const previousLogs = Array.isArray(previousMetadata?.syncLogs) ? previousMetadata.syncLogs : [];
  const latestLog = previousLogs.at(-1);
  const logMatchesCurrentStats = typeof latestLog?.message === 'string' &&
    latestLog.status === 'SUCCESS' &&
    new RegExp(`OpenStreetMap[^。]*${osmApartments.length} 处`).test(latestLog.message) &&
    latestLog.message.includes(`检查 ${computed.stats.totalPhysicalVerifiedAddresses} 处`);
  const metadataMatchesCurrentStats = previousMetadata?.totalCountries === computed.totalCountries &&
    isDeepStrictEqual(previousMetadata?.stats, computed.stats) &&
    isDeepStrictEqual(previousMetadata?.countryBreakdown, computed.countryBreakdown);
  const shouldPublishCurrentStats = osmChanged ||
    !previousMetadata?.version ||
    !previousMetadata?.lastUpdated ||
    !previousMetadata?.lastUpdatedFormattedZh ||
    !previousMetadata?.lastUpdatedFormattedEn ||
    !previousMetadata?.metadataUpdatedAt ||
    !previousMetadata?.metadataUpdatedFormattedZh ||
    !previousMetadata?.metadataUpdatedFormattedEn ||
    !metadataMatchesCurrentStats ||
    !logMatchesCurrentStats;

  // lastUpdated records an actual OSM snapshot fetch; metadataUpdatedAt records metadata/statistics publication.
  const lastUpdated = osmChanged || !previousMetadata?.lastUpdated ? now.toISOString() : previousMetadata.lastUpdated;
  const lastUpdatedFormattedZh = osmChanged || !previousMetadata?.lastUpdatedFormattedZh
    ? `${dateStr} ${timeStr} (UTC)`
    : previousMetadata.lastUpdatedFormattedZh;
  const lastUpdatedFormattedEn = osmChanged || !previousMetadata?.lastUpdatedFormattedEn
    ? `${dateStr} ${timeStr} UTC`
    : previousMetadata.lastUpdatedFormattedEn;
  const metadataUpdatedAt = shouldPublishCurrentStats ? now.toISOString() : previousMetadata.metadataUpdatedAt;
  const metadataUpdatedFormattedZh = shouldPublishCurrentStats
    ? `${dateStr} ${timeStr} (UTC)`
    : previousMetadata.metadataUpdatedFormattedZh;
  const metadataUpdatedFormattedEn = shouldPublishCurrentStats
    ? `${dateStr} ${timeStr} UTC`
    : previousMetadata.metadataUpdatedFormattedEn;
  const version = shouldPublishCurrentStats || !previousMetadata?.version
    ? `v${dateStr.replace(/-/g, '.')}.${now.toISOString().slice(11, 23).replace(/[:.]/g, '')}`
    : previousMetadata.version;
  const currentLog = {
    timestamp: metadataUpdatedAt,
    action: osmChanged ? 'DAILY_AUTOMATED_SYNC' : 'SNAPSHOT_STATISTICS_RECONCILED',
    status: 'SUCCESS',
    message: osmChanged
      ? `已同步 OpenStreetMap 公开住宅建筑门牌 ${osmApartments.length} 处。其余地址来自仓库静态数据；已检查 ${computed.stats.totalPhysicalVerifiedAddresses} 处地址坐标与字段格式，未核验 AVS 或邮政投递。`
      : `已核对当前 OpenStreetMap 快照：公开住宅建筑门牌 ${osmApartments.length} 处。本次未替换 OSM 快照；已检查 ${computed.stats.totalPhysicalVerifiedAddresses} 处地址坐标与字段格式，未核验 AVS 或邮政投递。`
  };
  const syncLogs = shouldPublishCurrentStats ? [...previousLogs, currentLog].slice(-10) : previousLogs;

  return {
    version,
    lastUpdated,
    lastUpdatedFormattedZh,
    lastUpdatedFormattedEn,
    metadataUpdatedAt,
    metadataUpdatedFormattedZh,
    metadataUpdatedFormattedEn,
    healthStatus: 'HEALTHY',
    syncSchedule: 'Scheduled daily at 00:00 UTC; GitHub Actions may start later',
    totalCountries: computed.totalCountries,
    stats: computed.stats,
    countryBreakdown: computed.countryBreakdown,
    syncLogs
  };
}

interface AtomicPairFileOps {
  existsSync: (filePath: string) => boolean;
  writeFileSync: (filePath: string, contents: string) => void;
  copyFileSync: (sourcePath: string, targetPath: string) => void;
  renameSync: (sourcePath: string, targetPath: string) => void;
  unlinkSync: (filePath: string) => void;
}

const defaultAtomicPairFileOps: AtomicPairFileOps = {
  existsSync: fs.existsSync,
  writeFileSync: (filePath, contents) => fs.writeFileSync(filePath, contents, 'utf-8'),
  copyFileSync: fs.copyFileSync,
  renameSync: fs.renameSync,
  unlinkSync: fs.unlinkSync
};

export function writeJsonFilesAtomically(
  files: ReadonlyArray<{ path: string; contents: string }>,
  ops: AtomicPairFileOps = defaultAtomicPairFileOps
): void {
  if (files.length === 0) return;

  // Validate all JSON before touching either published file.
  for (const file of files) JSON.parse(file.contents);

  const transactionId = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const staged = files.map(file => ({
    ...file,
    tempPath: `${file.path}.tmp-${transactionId}`,
    backupPath: `${file.path}.bak-${transactionId}`,
    hadOriginal: ops.existsSync(file.path)
  }));

  let committed = 0;
  const errors: unknown[] = [];
  const retainedBackups = new Set<string>();
  try {
    for (const file of staged) ops.writeFileSync(file.tempPath, file.contents);
    for (const file of staged) {
      if (file.hadOriginal) ops.copyFileSync(file.path, file.backupPath);
    }
    for (const file of staged) {
      ops.renameSync(file.tempPath, file.path);
      committed++;
    }
  } catch (error) {
    errors.push(error);
    for (let index = committed - 1; index >= 0; index--) {
      const file = staged[index];
      try {
        if (file.hadOriginal) {
          // Rename over the published file so a failed restore leaves both copies intact.
          ops.renameSync(file.backupPath, file.path);
        } else if (ops.existsSync(file.path)) {
          ops.unlinkSync(file.path);
        }
      } catch (restoreError) {
        if (file.hadOriginal) retainedBackups.add(file.backupPath);
        errors.push(new Error(
          file.hadOriginal
            ? `Rollback failed for ${file.path}; recovery backup retained at ${file.backupPath}`
            : `Rollback failed to remove newly published file ${file.path}`,
          { cause: restoreError }
        ));
      }
    }
  }

  for (const file of staged) {
    const cleanupPaths = retainedBackups.has(file.backupPath)
      ? [file.tempPath]
      : [file.tempPath, file.backupPath];
    for (const cleanupPath of cleanupPaths) {
      try {
        if (ops.existsSync(cleanupPath)) ops.unlinkSync(cleanupPath);
      } catch (cleanupError) {
        errors.push(new Error(`Failed to clean staging file ${cleanupPath}`, { cause: cleanupError }));
      }
    }
  }

  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) {
    throw new AggregateError(errors, errors.map(error =>
      error instanceof Error ? error.message : String(error)
    ).join('; '));
  }
}

async function main() {
  const offlineMode = process.argv.includes('--offline');
  console.log(offlineMode ? '🔄 开始执行离线地址库统计刷新...' : '🔄 开始执行每日地址库自动化扫描与同步校验...');

  const osmPath = path.resolve(__dirname, '../src/data/addresses/osmApartments.json');
  const targetPath = path.resolve(__dirname, '../src/data/addresses/metadata.json');
  const previousSnapshot = JSON.parse(fs.readFileSync(osmPath, 'utf-8')) as OsmApartment[];
  const previousMetadata = fs.existsSync(targetPath)
    ? JSON.parse(fs.readFileSync(targetPath, 'utf-8')) as Record<string, any>
    : null;

  const osmApartments = offlineMode ? null : await syncOsmApartmentsIfAvailable();
  let effectiveOsm = previousSnapshot;
  let osmChanged = false;

  if (osmApartments === null) {
    console.warn(offlineMode
      ? '离线统计刷新模式：保留当前 OSM 快照与同步时间，仅刷新全库统计与国家分布。'
      : 'OpenStreetMap 接口暂不可用；保留上次 OSM 快照与同步时间戳，仅核对静态池统计。');
  } else {
    assertOsmSnapshotContinuity(previousSnapshot, osmApartments);
    const osmSnapshot = JSON.stringify(osmApartments, null, 2) + '\n';
    if (fs.readFileSync(osmPath, 'utf-8').trim() === osmSnapshot.trim()) {
      console.log('OpenStreetMap 地址快照无变化；保留 OSM 获取时间，继续检查 A/B/C 统计是否需刷新。');
    } else {
      effectiveOsm = osmApartments;
      osmChanged = true;
    }
  }

  const nextMetadata = buildRefreshedMetadata(effectiveOsm, previousMetadata, osmChanged);
  const osmJson = JSON.stringify(effectiveOsm, null, 2) + '\n';
  const nextJson = JSON.stringify(nextMetadata, null, 2) + '\n';
  const prevJson = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, 'utf-8').trim() : '';

  if (prevJson !== nextJson.trim()) {
    writeJsonFilesAtomically([
      { path: osmPath, contents: osmJson },
      { path: targetPath, contents: nextJson }
    ]);
    console.log(`✅ OSM 快照与元数据已校验并原子发布: ${targetPath}`);
  } else {
    console.log('元数据统计无变化，无需写入。');
  }

  const s = nextMetadata.stats;
  console.log(`📊 统计报告:`);
  console.log(`   - 覆盖国家: ${nextMetadata.totalCountries}/${nextMetadata.totalCountries}`);
  console.log(`   - 真实地标/方案C样本: ${s.totalPhysicalLandmarks} (其中 OSM ${s.totalOsmBuildings} 处)`);
  console.log(`   - 方案A街道走廊: ${s.totalSchemeACorridors} 条 (可衍生 ${s.totalSchemeACapacity.toLocaleString()} 独立门牌)`);
  console.log(`   - 方案B居民住宅: ${s.totalSchemeBResidential} 处`);
  console.log(`   - 总内置样本点位: ${s.totalPhysicalVerifiedAddresses} 处`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  main().catch(err => {
    console.error('❌ 同步失败:', err);
    process.exit(1);
  });
}

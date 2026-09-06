import topojson from 'topojson-client';
import * as d3 from 'd3-geo';
import world from 'world-atlas/countries-110m.json' with { type: 'json' };
import fs from 'fs';

const nonAntarcticaGeoms = world.objects.countries.geometries.filter(g => g.id !== '010' && g.id !== 10 && g.id !== 'ATA');
const mergedLand = topojson.merge(world, nonAntarcticaGeoms);
const countries = topojson.feature(world, world.objects.countries);

// Fit canvas 1000x500 with padding
const proj = d3.geoNaturalEarth1().fitExtent([[25, 25], [975, 470]], mergedLand);
const pathGen = d3.geoPath(proj);

const landPath = pathGen(mergedLand);
const graticule30 = pathGen(d3.geoGraticule().step([30, 30])());

const isoNumericMap = {
  US: '840', CA: '124', GB: '826', DE: '276', FR: '250', IT: '380', ES: '724', NL: '528', CH: '756', LU: '442', IE: '372',
  JP: '392', KR: '410', TW: '158', AU: '036', MY: '458', TH: '764', VN: '704', PH: '608'
};

const countryPaths = {};
for (const [code, num] of Object.entries(isoNumericMap)) {
  const feat = countries.features.find(f => String(f.id).padStart(3, '0') === num);
  if (feat) {
    countryPaths[code] = pathGen(feat);
  }
}

// Compute pin coordinates
const countryCoords = {
  US: [-98.5, 39.8],     // USA center
  CA: [-106.3, 56.1],    // Canada center
  GB: [-2.2, 54.5],      // UK
  DE: [10.4, 51.1],      // Germany
  FR: [2.2, 46.2],       // France
  IT: [12.5, 42.5],      // Italy
  ES: [-3.7, 40.4],      // Spain
  NL: [5.2, 52.1],       // Netherlands
  CH: [8.2, 46.8],       // Switzerland
  LU: [6.1, 49.8],       // Luxembourg
  IE: [-8.2, 53.4],      // Ireland
  JP: [138.2, 36.2],     // Japan
  KR: [127.7, 35.9],     // South Korea
  HK: [114.1, 22.3],     // Hong Kong
  TW: [121.0, 23.7],     // Taiwan
  SG: [103.8, 1.3],      // Singapore
  AU: [133.7, -25.2],    // Australia
  MY: [101.9, 4.2],      // Malaysia
  TH: [100.9, 15.8],     // Thailand
  VN: [108.2, 14.0],     // Vietnam
  PH: [121.7, 12.8]      // Philippines
};

const pins = {};
for (const [code, [lon, lat]] of Object.entries(countryCoords)) {
  const [x, y] = proj([lon, lat]);
  pins[code] = { x: Math.round(x), y: Math.round(y) };
}

const outContent = `// Pre-projected Natural Earth 1 vector geometries for 1000x500 canvas
export const worldLandPath = ${JSON.stringify(landPath)};

export const worldGraticulePath = ${JSON.stringify(graticule30)};

export const countryVectorPaths: Record<string, string> = ${JSON.stringify(countryPaths, null, 2)};

export const pinCoordinates: Record<string, { x: number; y: number }> = ${JSON.stringify(pins, null, 2)};
`;

fs.writeFileSync('src/data/addresses/worldMapData.ts', outContent);
console.log('Regenerated worldMapData.ts with clean non-Antarctica land!');

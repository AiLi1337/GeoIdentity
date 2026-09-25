import { US_ADDRESSES } from '../src/data/addresses/us';

export interface OsmApartment {
  id: string;
  building: 'apartments' | 'residential' | 'house' | 'detached' | 'semidetached_house' | 'terrace';
  street: string;
  city: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
}

interface OsmElement {
  type?: string;
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const AREAS = [
  { city: 'Wilmington', state: 'DE', bbox: '39.73,-75.57,39.76,-75.53', buildings: 'apartments' },
  { city: 'Portland', state: 'OR', bbox: '45.515,-122.69,45.53,-122.675', buildings: 'apartments' },
  { city: 'Portland', state: 'OR', bbox: '45.512,-122.694,45.514,-122.692', buildings: 'apartments|residential|house|detached|semidetached_house|terrace' }
] as const;

const key = (street: string, city: string, state: string) =>
  `${street} ${city} ${state}`.toLowerCase().replace(/[^a-z0-9]/g, '');

// The OSM object must itself be tagged as a residential building with a street address.
export async function syncOsmApartments(
  fetcher: (url: string, options: { headers: Record<string, string>; signal: AbortSignal }) => Promise<{ ok: boolean; status?: number; json: () => Promise<unknown> }> = fetch
): Promise<OsmApartment[]> {
  const result: OsmApartment[] = [];
  const ids = new Set<string>();
  const addresses = new Set(US_ADDRESSES.map(a => key(a.street, a.city, a.state)));

  for (const area of AREAS) {
    const beforeArea = result.length;
    const buildingFilter = area.buildings === 'apartments'
      ? '["building"="apartments"]'
      : `["building"~"^(${area.buildings})$"]`;
    const query = `[out:json][timeout:25];way${buildingFilter}["addr:housenumber"]["addr:street"]["addr:postcode"](${area.bbox});out center 80;`;
    let body: { elements?: OsmElement[] } | undefined;
    let lastError: unknown;
    for (const endpoint of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
      try {
        const response = await fetcher(`${endpoint}?data=${encodeURIComponent(query)}`, {
          headers: { 'User-Agent': 'GeoIdentity/1.0 (https://github.com/AiLi1337/GeoIdentity)' },
          signal: AbortSignal.timeout(45000)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        body = await response.json() as { elements?: OsmElement[] };
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!body) throw new Error(`OpenStreetMap query for ${area.city} failed`, { cause: lastError });
    if (!Array.isArray(body?.elements)) throw new Error(`Invalid OpenStreetMap response for ${area.city}`);

    for (const element of body.elements) {
      const tags = element.tags;
      const lat = element.lat ?? element.center?.lat;
      const lng = element.lon ?? element.center?.lon;
      if (!area.buildings.split('|').includes(tags?.building || '') ||
          tags['addr:city']?.trim().toLowerCase() !== area.city.toLowerCase() ||
          (tags['addr:state'] && tags['addr:state'].trim().toUpperCase() !== area.state) ||
          !/^\d+[A-Za-z]?$/.test(tags['addr:housenumber']?.trim() || '') ||
          !tags['addr:street']?.trim() ||
          !/^\d{5}$/.test(tags['addr:postcode']?.trim() || '') ||
          !Number.isFinite(lat) || !Number.isFinite(lng) ||
          lat! < -90 || lat! > 90 || lng! < -180 || lng! > 180 ||
          element.type !== 'way' || !element.center ||
          !Number.isSafeInteger(element.id)) continue;

      const id = `${element.type}/${element.id}`;
      const street = `${tags['addr:housenumber'].trim()} ${tags['addr:street'].trim()}`;
      const addressKey = key(street, area.city, area.state);
      if (ids.has(id) || addresses.has(addressKey)) continue;
      ids.add(id);
      addresses.add(addressKey);
      result.push({ id, building: tags.building as OsmApartment['building'], street, city: area.city, state: area.state,
        postcode: tags['addr:postcode'].trim(), lat: lat!, lng: lng! });
    }
    if (result.length === beforeArea) throw new Error(`OpenStreetMap returned no valid residential building addresses for ${area.city}`);
  }
  return result.sort((a, b) => a.id.localeCompare(b.id));
}

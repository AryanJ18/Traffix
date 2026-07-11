import { DELHI_SUFFIX } from './constants.js';

export async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    query + DELHI_SUFFIX
  )}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Location lookup failed');
  const data = await res.json();
  if (!data.length) throw new Error(`Could not find "${query}"`);
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export async function fetchRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Route lookup failed');
  const data = await res.json();
  if (!data.routes?.length) throw new Error('No drivable route between these points');
  const route = data.routes[0];
  return {
    coords: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
}
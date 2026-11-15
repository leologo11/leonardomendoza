import GANTRIES from './data/gantries.js';
import { TOLL_PLAZAS, plazaPrice, TOLL_BY_NODE, tollPrice, AVO_NODES, AVO_NAMES, AVO_TRIPS, AVO_PIRAMIDE, AVO_PER_KM, avoPeak } from './data/tollRates.js';
import { clDay, clWeekday, clMinOfDay } from './data/clTime.js';

// TAG and tolls of a planned trip. Simpler than lib/tagEstimate.js: the route comes from the map's
// router (it already follows the real roads), so a gantry is crossed when the route goes through it
// in the direction it charges — no GPS noise, no caletera doubt to settle.
// Gantries without an official price use these reference values (same as lib/tagEstimate.js).
const REF = { normal: 520, punta: 1020 };

const meters = (a, b) => Math.hypot((a.lat - b.lat) * 110540, (a.lng - b.lng) * 111320 * Math.cos((a.lat * Math.PI) / 180));
const bearing = (a, b) => {
  const r = x => (x * Math.PI) / 180;
  const y = Math.sin(r(b.lng - a.lng)) * Math.cos(r(b.lat));
  const x = Math.cos(r(a.lat)) * Math.sin(r(b.lat)) - Math.sin(r(a.lat)) * Math.cos(r(b.lat)) * Math.cos(r(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};
function segDist(p, a, b) {
  const kx = 111320 * Math.cos((p.lat * Math.PI) / 180), ky = 110540;
  const ax = (a.lng - p.lng) * kx, ay = (a.lat - p.lat) * ky, bx = (b.lng - p.lng) * kx, by = (b.lat - p.lat) * ky;
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  const t = L === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L));
  return Math.hypot(ax + t * dx, ay + t * dy);
}
const when = t => ({ day: clDay(t), weekday: clWeekday(t), minute: clMinOfDay(t) });
// Weekday peak for gantries without an official schedule: 7:00–10:00 and 17:30–20:30.
const refBand = t => { const w = when(t), h = w.minute / 60; return w.weekday >= 1 && w.weekday <= 5 && ((h >= 7 && h < 10) || (h >= 17.5 && h < 20.5)) ? 'punta' : 'normal'; };

// The route lies on the road itself: 15 m from a gantry is going under it. Plaza booths sit on the road
// too (0 m away), while the lateral booths on the ramps beside the highway are 10–30 m off: 5 m.
const GANTRY_M = 15, PLAZA_M = 5;

// coords: [[lng, lat], …] of the route; durations: seconds of each stretch between them; start: ms.
export function routeTolls(coords, durations, start) {
  const pts = [];
  let t = start;
  coords.forEach(([lng, lat], i) => { pts.push({ lat, lng, t }); t += (durations[i] || 0) * 1000; });
  const items = [], seen = new Set(), avo = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if (meters(a, b) < 0.5) continue;
    const mv = bearing(a, b);
    for (const g of GANTRIES) {
      if (Math.abs(g.lat - a.lat) > 0.02 || Math.abs(g.lng - a.lng) > 0.02) continue;
      if (segDist(g, a, b) > GANTRY_M) continue;
      if (g.oneway && Math.abs(((mv - g.brg + 540) % 360) - 180) > 60) continue;
      if (AVO_NODES.has(g.osm)) {
        const ref = AVO_NODES.get(g.osm);
        if (!avo.length || b.t - avo[avo.length - 1].t > 900000 || avo[avo.length - 1].osm !== g.osm) avo.push({ ...g, ref, t: b.t });
        continue;
      }
      // One charge per tramo (its twin lanes / tunnel and surface gantries are the same tramo).
      const row = TOLL_BY_NODE.get(g.osm), key = row ? row.key : `g${g.osm}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (row) {
        const p = tollPrice(row, when(b.t));
        items.push({ t: b.t, road: row.highway, name: `${row.ref ? `${row.ref} ` : ''}${row.tramo}`, band: p.band, price: Math.round(p.amount) });
      } else {
        const band = refBand(b.t);
        items.push({ t: b.t, road: g.road === '?' ? 'Autopista' : g.road, name: g.name || '', band, price: REF[band], reference: true });
      }
    }
    for (const pz of TOLL_PLAZAS) {
      const key = `P:${pz.key}`;
      if (seen.has(key)) continue;
      if (!pz.nodes.some(([, lat, lng]) => segDist({ lat, lng }, a, b) < PLAZA_M)) continue;
      seen.add(key);
      const p = plazaPrice(pz, when(b.t), Math.sin((mv * Math.PI) / 180) < 0);
      items.push({ t: b.t, road: pz.highway, name: pz.name, band: p.band, price: p.amount, kind: pz.kind, free: pz.free, key: pz.key });
    }
  }
  items.push(...avoTrips(avo));
  items.sort((x, y) => x.t - y.t);
  // Paying a troncal plaza lets the car through one lateral free for a while (Los Libertadores 12 h, Ruta 5 Sur 6 h).
  const FREE = { LL: { troncal: ['LL:CANTERAS', 'LL:SANJOSE', 'LL:CHACABUCO'], ms: 12 * 3600000 }, R5S: { troncal: ['R5S:ANGOSTURA', 'R5S:QUINTA'], ms: 6 * 3600000 } };
  const token = {};
  const list = items.filter(c => {
    const g = Object.entries(FREE).find(([, f]) => f.troncal.includes(c.key));
    if (g) { token[g[0]] = c.t + g[1].ms; return true; }
    if (c.kind === 'lateral' && c.free && token[c.free] && c.t <= token[c.free]) { token[c.free] = 0; return false; }
    return true;
  });
  return { items: list, total: list.reduce((s, c) => s + c.price, 0) };
}

// Vespucio Oriente charges per trip, from the gantry where the car got on to the one where it got off.
function avoTrips(seen) {
  const trips = [];
  for (const s of seen) {
    const cur = trips[trips.length - 1];
    if (cur && s.t - cur[cur.length - 1].t < 900000) cur.push(s); else trips.push([s]);
  }
  const name = r => (r ? `${r}${AVO_NAMES[r] ? ` ${AVO_NAMES[r]}` : ''}` : 'pórtico');
  const road = 'Autopista Vespucio Oriente';
  return trips.map(list => {
    const first = list[0], last = list[list.length - 1], peak = avoPeak(when(first.t)), band = peak ? 'punta' : 'normal';
    if (list.length === 1) return first.ref === 'P110' ? { t: first.t, road, name: 'P110 La Pirámide', band, price: peak ? AVO_PIRAMIDE.tbp : AVO_PIRAMIDE.tbfp } : null;
    const trip = AVO_TRIPS.find(x => x[0] === first.ref && x[1] === last.ref);
    if (trip) return { t: first.t, road, name: `${name(first.ref)} → ${name(last.ref)}`, band, price: peak ? trip[3] : trip[2] };
    let m = 0;
    for (let i = 1; i < list.length; i++) m += meters(list[i - 1], list[i]);
    const km = Math.max(1, (m * 1.15) / 1000);
    return { t: first.t, road, name: `${name(first.ref)} → ${name(last.ref)}`, band, price: Math.round(km * (peak ? AVO_PER_KM.tbp : AVO_PER_KM.tbfp)) };
  }).filter(Boolean);
}

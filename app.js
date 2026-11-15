import { CONFIG } from './config.js';
import { routeTolls } from './tag.js';
import { HOLIDAYS } from './data/tollRates.js';
import { clStartOfDay, clDay, clMinOfDay, clWeekday } from './data/clTime.js';

const $ = id => document.getElementById(id);
const money = n => `$${Math.round(n).toLocaleString('es-CL')}`;
const SEATS = 7;

$('name').textContent = CONFIG.nombre;
$('vehicle').textContent = CONFIG.vehiculo;
document.title = `${CONFIG.nombre} · Cotiza tu viaje`;
// Hero: the van drives in on load and again on every tap. The photo replaces the drawing once it loads
// (if it's missing, the drawing stays).
const stage = $('stage');
const drive = () => { stage.classList.remove('go'); void stage.offsetWidth; stage.classList.add('go'); };
stage.addEventListener('click', drive);
if (CONFIG.foto) {
  const img = new Image();
  img.alt = CONFIG.vehiculo;
  img.onload = () => { $('car-svg').replaceWith(img); drive(); };
  img.onerror = drive;
  img.src = CONFIG.foto;
} else drive();
for (let i = 1; i <= SEATS; i++) $('pax').add(new Option(i, i));
for (let i = 0; i <= 8; i++) $('bags').add(new Option(i, i));

// Default: today, next full hour (Chile time).
const now = Date.now(), nextHour = Math.min(23, Math.floor(clMinOfDay(now) / 60) + 1);
$('date').value = $('rdate').value = clDay(now);
$('date').min = $('rdate').min = clDay(now);
$('time').value = `${String(nextHour).padStart(2, '0')}:00`;
$('round').addEventListener('change', e => $('return-row').classList.toggle('hidden', !e.target.checked));

// ── Places: search with OpenStreetMap (Nominatim asks for searches on demand, not on every key). ──
// me: where the driver leaves from (driver mode only).
const picked = { from: null, to: null, me: null };
function choose(which, place) {
  picked[which] = place;
  $(`${which}-chosen`).textContent = place ? `✓ ${place.label}` : '';
  $(`${which}-results`).innerHTML = '';
  if (which === 'me' && place) driverCalc();
}
// Suggestions while typing come from Photon (made for search-as-you-type, near Santiago first);
// if it doesn't answer, Nominatim on Enter / Buscar.
async function photon(q) {
  const r = await (await fetch(`https://photon.komoot.io/api/?limit=8&lat=-33.45&lon=-70.65&bbox=-76,-56,-66,-17&q=${encodeURIComponent(q)}`)).json();
  return r.features.filter(f => f.properties.countrycode === 'CL').slice(0, 5).map(f => {
    const p = f.properties, street = p.street ? `${p.street}${p.housenumber ? ` ${p.housenumber}` : ''}` : '';
    const label = [p.name && p.name !== p.street ? p.name : '', street, p.district || p.city || p.county, p.state === 'Región Metropolitana de Santiago' ? '' : p.state].filter(Boolean);
    return { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], label: [...new Set(label)].join(', ') };
  });
}
async function nominatim(q) {
  const r = await (await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=cl&accept-language=es&q=${encodeURIComponent(q)}`)).json();
  return r.map(x => ({ lat: +x.lat, lng: +x.lon, label: x.display_name.replace(/, Chile$/, '') }));
}
let seq = 0;
async function search(which, full = false) {
  const q = $(which).value.trim(), list = $(`${which}-results`), mine = ++seq;
  if (q.length < 3) { list.innerHTML = ''; return; }
  if (!list.children.length) list.innerHTML = '<li class="note">Buscando…</li>';
  let res = [];
  try { res = await photon(q); } catch {}
  if (full && !res.length) try { res = await nominatim(q); } catch {}
  if (mine !== seq) return;
  list.innerHTML = '';
  if (!res.length) { list.innerHTML = '<li class="note">No lo encontré. Prueba con calle, número y comuna.</li>'; return; }
  for (const r of res) {
    const li = document.createElement('li');
    li.textContent = r.label;
    li.onmousedown = e => e.preventDefault();
    li.onclick = () => { $(which).value = r.label.split(',').slice(0, 2).join(','); choose(which, r); };
    list.append(li);
  }
}
for (const which of ['from', 'to', 'me']) {
  let timer;
  $(which).addEventListener('input', () => { choose(which, null); clearTimeout(timer); timer = setTimeout(() => search(which), 350); });
  $(which).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(timer); search(which, true); } });
}
document.querySelector('[data-search="to"]').onclick = () => search('to', true);
$('here').onclick = () => {
  if (!navigator.geolocation) return;
  $('from-chosen').textContent = 'Buscando tu ubicación…';
  navigator.geolocation.getCurrentPosition(async p => {
    const lat = p.coords.latitude, lng = p.coords.longitude, label = await placeName(lat, lng, 'Mi ubicación');
    $('from').value = label;
    choose('from', { lat, lng, label });
  }, () => { $('from-chosen').textContent = 'No pude ver tu ubicación. Escribe la dirección.'; }, { enableHighAccuracy: true, timeout: 15000 });
};
async function placeName(lat, lng, fallback) {
  try {
    const r = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=${lat}&lon=${lng}`)).json();
    if (r.address) return [r.address.road && `${r.address.road} ${r.address.house_number || ''}`.trim(), r.address.suburb || r.address.city || r.address.town].filter(Boolean).join(', ') || fallback;
  } catch {}
  return fallback;
}

// ── Route and price ─────────────────────────────────────────────────────────────────────────────
async function route(a, b) {
  const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson&annotations=duration`;
  const r = await (await fetch(url)).json();
  if (r.code !== 'Ok' || !r.routes?.length) throw new Error('No encontré una ruta entre esos lugares.');
  return r.routes[0];
}
const at = (date, time) => { const [h, m] = time.split(':').map(Number); return clStartOfDay(date) + (h * 60 + m) * 60000; };

// Traffic band at the departure time (CONFIG.horarios): holidays go as Sunday.
const BAND_NAME = { alta: 'tarifa alta', media: 'tarifa media', baja: 'tarifa baja' };
const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
function band(t) {
  const wd = clWeekday(t), min = clMinOfDay(t);
  const day = CONFIG.horarios[HOLIDAYS.has(clDay(t)) || wd === 0 ? 'domingo' : wd === 6 ? 'sabado' : 'habil'] || {};
  const inside = r => { const [a, b] = r.split('-').map(toMin); return min >= a && min < b; };
  return ['alta', 'media'].find(b => (day[b] || []).some(inside)) || 'baja';
}
// Each stretch of km at its share of the rate (CONFIG.descuentoKm): long trips pay less per km.
function kmPrice(km, rate) {
  const steps = [{ desde: 0, pct: 100 }, ...CONFIG.descuentoKm];
  return steps.reduce((s, x, i) => {
    const end = steps[i + 1]?.desde ?? Infinity;
    return km > x.desde ? s + (Math.min(km, end) - x.desde) * rate * x.pct / 100 : s;
  }, 0);
}

let map, layer, meLayer, quote = null;
function draw(routes) {
  if (!map) {
    map = L.map('map', { zoomControl: false, attributionControl: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
  }
  layer?.remove(); meLayer?.remove();
  const r = routes[0], line = L.polyline(r.geometry.coordinates.map(([lng, lat]) => [lat, lng]), { color: getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0f7b5f', weight: 5 });
  // The pickup and destination pins can be dragged to the exact spot: the trip is quoted again.
  const pin = (which, text) => {
    const m = L.marker([picked[which].lat, picked[which].lng], { draggable: true, icon: L.divIcon({ className: `pin pin-${which}`, html: text, iconSize: [28, 28] }) });
    m.on('dragend', async () => {
      const { lat, lng } = m.getLatLng(), label = await placeName(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      $(which).value = label;
      choose(which, { lat, lng, label });
      $('form').requestSubmit();
    });
    return m;
  };
  layer = L.featureGroup([line, pin('from', 'A'), pin('to', 'B')]).addTo(map);
  fitAll();
}
// The whole trip in view (and the driver's way to the pickup, when it's there).
function fitAll() {
  setTimeout(() => {
    map.invalidateSize();
    const b = layer.getBounds();
    if (meLayer && map.hasLayer(meLayer)) b.extend(meLayer.getBounds());
    map.fitBounds(b, { padding: [30, 30] });
  }, 50);
}

$('form').addEventListener('submit', async e => {
  e.preventDefault();
  $('error').textContent = '';
  if (!picked.from || !picked.to) { $('error').textContent = 'Elige el origen y el destino de la lista (escribe y aprieta Buscar).'; return; }
  const round = $('round').checked;
  const start = at($('date').value, $('time').value);
  if (start < Date.now() - 600000) { $('error').textContent = 'La fecha y hora ya pasaron.'; return; }
  const back = round ? at($('rdate').value, $('rtime').value || $('time').value) : null;
  if (round && back <= start) { $('error').textContent = 'La vuelta tiene que ser después de la ida.'; return; }
  const btn = $('quote');
  btn.disabled = true; btn.textContent = 'Calculando…';
  try {
    const legs = [await route(picked.from, picked.to)];
    if (round) legs.push(await route(picked.to, picked.from));
    const tolls = legs.map((r, i) => routeTolls(r.geometry.coordinates, r.legs[0].annotation.duration, i ? back : start));
    const km = legs.reduce((s, r) => s + r.distance, 0) / 1000, min = legs[0].duration / 60;
    const bands = legs.map((r, i) => band(i ? back : start));
    const raw = Math.max(CONFIG.minimo, CONFIG.cargoBase + legs.reduce((s, r, i) => s + kmPrice(r.distance / 1000, CONFIG.tarifas[bands[i]]), 0));
    const trip = Math.ceil(raw / CONFIG.redondeo) * CONFIG.redondeo;
    const toll = CONFIG.sumarPeajes ? tolls.reduce((s, t) => s + t.total, 0) : 0;
    quote = { km, min, trip, toll, total: trip + toll, round, start, back, bands, legs };
    show(legs, tolls);
    if (driver) {
      $('driver').classList.remove('hidden'); $('me-lines').innerHTML = '';
      // Navigation from where I am (the apps use the phone's GPS) to the pickup, then pickup → destination.
      const ll = p => `${p.lat},${p.lng}`, a = picked.from, b = picked.to;
      $('nav-pick-g').href = `https://www.google.com/maps/dir/?api=1&destination=${ll(a)}&travelmode=driving`;
      $('nav-pick-w').href = `https://waze.com/ul?ll=${ll(a)}&navigate=yes`;
      $('nav-trip-g').href = `https://www.google.com/maps/dir/?api=1&origin=${ll(a)}&destination=${ll(b)}&travelmode=driving`;
      $('nav-trip-w').href = `https://waze.com/ul?ll=${ll(b)}&navigate=yes`;
      $('me-far').classList.add('hidden');
      if (picked.me) driverCalc(); else locateMe();
    }
  } catch (err) {
    $('error').textContent = err.message || 'No se pudo calcular. Intenta de nuevo.';
  } finally { btn.disabled = false; btn.textContent = 'Ver precio'; }
});

function show(legs, tolls) {
  $('result').classList.remove('hidden');
  draw(legs);
  const q = quote, h = Math.floor(q.min / 60), m = Math.round(q.min % 60);
  $('summary').textContent = `${q.km.toFixed(1)} km${q.round ? ' (ida y vuelta)' : ''} · ${h ? `${h} h ` : ''}${m} min de viaje`;
  $('total').textContent = money(q.total);
  $('lines').innerHTML = '';
  const line = (a, b) => { const li = document.createElement('li'); li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = a; li.children[1].textContent = b; $('lines').append(li); };
  const rates = [...new Set(q.bands)].map(b => `${BAND_NAME[b]} ${money(CONFIG.tarifas[b])}/km`).join(' y ');
  line(`${q.round ? 'Viaje ida y vuelta' : 'Viaje'} (${rates})`, money(q.trip));
  if (CONFIG.sumarPeajes) line('TAG y peajes (estimado)', q.toll ? money(q.toll) : 'Sin peajes');
  const items = tolls.flatMap((t, i) => t.items.map(c => ({ ...c, leg: i })));
  $('tolls-detail').classList.toggle('hidden', !items.length || !CONFIG.sumarPeajes);
  $('tolls').innerHTML = '';
  for (const c of items) {
    const li = document.createElement('li');
    li.textContent = `${tolls.length > 1 ? (c.leg ? 'Vuelta · ' : 'Ida · ') : ''}${c.road}: ${c.name} — ${money(c.price)}${c.band === 'punta' ? ' (hora punta)' : c.band === 'saturacion' ? ' (saturación)' : ''}`;
    $('tolls').append(li);
  }
  $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Booking: opens WhatsApp with the trip already written. ────────────────────────────────────────
const fmtWhen = t => new Date(t).toLocaleString('es-CL', { timeZone: 'America/Santiago', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
$('book').onclick = () => {
  if (!quote) return;
  const q = quote, who = $('who').value.trim(), note = $('note').value.trim();
  const text = [
    `Hola, quiero reservar un viaje${who ? `. Soy ${who}` : ''}.`,
    '',
    `📍 Desde: ${picked.from.label}`,
    `🏁 Hasta: ${picked.to.label}`,
    `🗓️ Ida: ${fmtWhen(q.start)}`,
    q.round && `🔁 Vuelta: ${fmtWhen(q.back)}`,
    `👥 Pasajeros: ${$('pax').value} · Maletas: ${$('bags').value}`,
    `🚗 ${q.km.toFixed(1)} km`,
    `💵 Precio cotizado: ${money(q.total)} (viaje ${money(q.trip)}${CONFIG.sumarPeajes ? ` + TAG/peajes ${money(q.toll)}` : ''})`,
    !!note && `📝 ${note}`,
    '',
    `Ver viaje: ${tripLink()}`,
  ].filter(x => x !== false).join('\n');
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
};

// ── The trip as a link: opening it fills the form and quotes again (on the driver's phone, with his costs). ──
const pt = p => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
function tripLink() {
  const s = new URLSearchParams({ o: pt(picked.from), ol: picked.from.label, d: pt(picked.to), dl: picked.to.label, f: $('date').value, h: $('time').value, p: $('pax').value, b: $('bags').value });
  if ($('round').checked) { s.set('rf', $('rdate').value); s.set('rh', $('rtime').value || $('time').value); }
  return `${location.origin}${location.pathname}?${s}`;
}
const params = new URLSearchParams(location.search);
for (const [k, which] of [['o', 'from'], ['d', 'to']]) {
  const [lat, lng] = (params.get(k) || '').split(',').map(Number);
  if (!isFinite(lat) || !isFinite(lng) || !params.get(k)) continue;
  const label = params.get(`${k}l`) || `${lat}, ${lng}`;
  $(which).value = label.split(',').slice(0, 2).join(',');
  choose(which, { lat, lng, label });
}
if (params.get('f')) $('date').value = params.get('f');
if (params.get('h')) $('time').value = params.get('h');
if (params.get('p')) $('pax').value = params.get('p');
if (params.get('b')) $('bags').value = params.get('b');
if (params.get('rf')) { $('round').checked = true; $('return-row').classList.remove('hidden'); $('rdate').value = params.get('rf'); $('rtime').value = params.get('rh') || ''; }

// ── Driver mode: opening the page once with ?yo turns it on for this phone (?cliente turns it off). ──
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} } };
if (params.has('yo')) store.set('conductor', '1');
if (params.has('cliente')) store.set('conductor', null);
const driver = params.has('yo') || store.get('conductor') === '1';
if (driver) $('vehicle').textContent += ' · modo conductor';
if (picked.from && picked.to) $('form').requestSubmit();

const hhmm = t => new Date(t).toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
const fuel = km => km / CONFIG.rendimientoKmL * CONFIG.precioBencina;
// Where I leave from: the phone's GPS, or typed / dragged by hand. A computer has no GPS: the browser
// guesses from the internet connection, often kilometres off, so a rough fix says so.
async function locateMe() {
  if (!navigator.geolocation) { $('me-chosen').textContent = 'No puedo ver tu ubicación: escribe desde dónde sales.'; return; }
  $('me-chosen').textContent = 'Buscando dónde estás…';
  try {
    const p = await new Promise((ok, no) => navigator.geolocation.getCurrentPosition(ok, no, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }));
    const lat = p.coords.latitude, lng = p.coords.longitude, acc = p.coords.accuracy, label = await placeName(lat, lng, 'Mi ubicación');
    $('me').value = label;
    choose('me', { lat, lng, label });
    if (acc > 300) $('me-chosen').textContent = `⚠ Ubicación aproximada (±${acc >= 1000 ? `${(acc / 1000).toFixed(1)} km` : `${Math.round(acc)} m`}). Si no estás ahí, escribe desde dónde sales o arrastra el punto "Tú" en el mapa.`;
  } catch {
    $('me-chosen').textContent = 'No pude ver tu ubicación. Escribe desde dónde sales.';
  }
}
$('me-btn').onclick = locateMe;
async function driverCalc() {
  const me = picked.me, out = $('me-lines');
  if (!quote || !me) return;
  $('me-status').textContent = 'Calculando…';
  try {
    const q = quote, tolls = (r, t) => routeTolls(r.geometry.coordinates, r.legs[0].annotation.duration, t).total;
    // To the pickup: leave so as to arrive on time (or now, if that's already late).
    const go = await route(me, picked.from), leave = Math.max(Date.now(), q.start - go.duration * 1000);
    // Back to where I am now, from where the client is left (the pickup when it's a round trip).
    const end = q.round ? picked.from : picked.to, endAt = q.round ? q.back + q.legs[1].duration * 1000 : q.start + q.legs[0].duration * 1000;
    const home = await route(end, me);
    const goKm = go.distance / 1000, homeKm = home.distance / 1000;
    const goCost = fuel(goKm) + tolls(go, leave), tripFuel = fuel(q.km), homeCost = fuel(homeKm) + tolls(home, endAt);
    const left = q.trip - goCost - tripFuel;
    // How far I am from the pickup, big, and my way there on the map (dashed).
    const goMin = Math.round(go.duration / 60);
    $('me-far-km').textContent = `Estás a ${goKm.toFixed(1)} km del cliente`;
    $('me-far-min').textContent = `${goMin >= 60 ? `${Math.floor(goMin / 60)} h ` : ''}${goMin % 60} min manejando hasta el punto de retiro`;
    $('me-far').classList.remove('hidden');
    const mine = L.marker([me.lat, me.lng], { draggable: true, icon: L.divIcon({ className: 'pin pin-me', html: 'Tú', iconSize: [28, 28] }) });
    mine.on('dragend', async () => {
      const { lat, lng } = mine.getLatLng(), label = await placeName(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      $('me').value = label;
      choose('me', { lat, lng, label });
    });
    meLayer?.remove();
    meLayer = L.featureGroup([L.polyline(go.geometry.coordinates.map(([lng, lat]) => [lat, lng]), { color: '#16181d', weight: 4, dashArray: '6 8', opacity: 0.7 }), mine]).addTo(map);
    fitAll();
    out.innerHTML = '';
    const line = (a, b, cls = '') => { const li = document.createElement('li'); li.className = cls; li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = a; li.children[1].textContent = b; out.append(li); };
    line(`Sal a las ${hhmm(leave)}`, `llegas ${hhmm(leave + go.duration * 1000)}`, 'strong');
    line(`Ir a buscarlo · ${goKm.toFixed(1)} km`, `−${money(goCost)}`);
    line(`Bencina ${money(fuel(goKm))} + TAG ${money(goCost - fuel(goKm))}`, '', 'sub');
    line(`Bencina del viaje · ${q.km.toFixed(1)} km`, `−${money(tripFuel)}`);
    line('El TAG del viaje lo paga el cliente', '', 'sub');
    line('Cobras por el viaje', money(q.trip));
    line('Te queda', money(left), 'strong');
    line(`Si vuelves vacío hasta aquí · ${homeKm.toFixed(1)} km`, `−${money(homeCost)}`);
    line('Te queda volviendo vacío', money(left - homeCost), 'strong');
    $('me-status').textContent = `Bencina a ${money(CONFIG.precioBencina)}/L y ${CONFIG.rendimientoKmL} km/L (se cambia en config.js).`;
  } catch (err) {
    $('me-status').textContent = err.message || 'No se pudo calcular.';
  }
}

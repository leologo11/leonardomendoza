// The page's own code is loaded fresh on every visit (see index.html), and so are the settings and
// the TAG code: a phone never keeps an old version.
const fresh = new URL(import.meta.url).search;
const { CONFIG } = await import(`./config.js${fresh}`);
const { routeTolls } = await import(`./tag.js${fresh}`);
import { HOLIDAYS } from './data/tollRates.js';
import { clStartOfDay, clDay, clMinOfDay, clWeekday } from './data/clTime.js';

const $ = id => document.getElementById(id);
const money = n => `$${Math.round(n).toLocaleString('es-CL')}`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

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
  // The photo faces left, so it comes in from the right.
  img.onload = () => { $('car-svg').replaceWith(img); stage.classList.add('rev', 'photo-car'); drive(); };
  img.onerror = drive;
  img.src = CONFIG.foto;
} else drive();
// Passengers and bags: the 3rd row folds down, so the more passengers, the fewer big bags fit (CONFIG.maletas).
const SEATS = Math.max(...Object.keys(CONFIG.maletas).map(Number));
const maxBags = pax => CONFIG.maletas[pax] ?? 0;
for (let i = 1; i <= SEATS; i++) $('pax').add(new Option(i, i));
function fitBags() {
  const pax = +$('pax').value, max = maxBags(pax), was = +$('bags').value || 0;
  $('bags').innerHTML = '';
  for (let i = 0; i <= max; i++) $('bags').add(new Option(i, i));
  $('bags').value = Math.min(was, max);
  $('bags-hint').textContent = `Con ${plural(pax, 'pasajero', 'pasajeros')} caben hasta ${plural(max, 'maleta grande', 'maletas grandes')}${max < maxBags(1) ? ' (con asientos de la 3.ª fila arriba)' : ''}, más bolsos de mano.`;
}
$('pax').addEventListener('change', fitBags);
fitBags();
$('cap').innerHTML = `<span>${SEATS} pasajeros</span><span>Hasta ${maxBags(1)} maletas</span><a href="contacto.vcf">Guardar contacto</a>`;

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
  // The quick button of that place stays marked while it's the one chosen.
  document.querySelectorAll(`.quick[data-for="${which}"] button`).forEach(b => b.classList.toggle('on', !!place && place.label === b.textContent));
  if (which === 'me' && place) driverCalc();
  // Picking a stop once there's a price quotes again with it.
  if (stops.includes(which) && place && quote) $('form').requestSubmit();
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
    li.onclick = () => { $(which).value = shortLabel(r.label); choose(which, r); };
    list.append(li);
  }
}
function wire(which) {
  let timer;
  $(which).addEventListener('input', () => { choose(which, null); clearTimeout(timer); timer = setTimeout(() => search(which), 350); });
  $(which).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(timer); search(which, true); } });
}
['from', 'to', 'me'].forEach(wire);
document.querySelector('[data-search="to"]').onclick = () => search('to', true);
const shortLabel = label => label.split(',').slice(0, 2).join(',');

// ── Stops on the way, as many as wanted: ↑ ↓ change the order, ✕ removes one. Each searches like the
// other fields; `stops` keeps their ids in trip order (their places live in `picked`). ──
const stops = [];
let stopN = 0;
const requote = () => { if (quote && picked.from && picked.to) $('form').requestSubmit(); };
function relabel() {
  stops.forEach((id, i) => {
    const row = $(`${id}-row`);
    row.querySelector('label').textContent = `Parada ${i + 1}`;
    row.querySelector('[data-act="up"]').disabled = i === 0;
    row.querySelector('[data-act="down"]').disabled = i === stops.length - 1;
    $('stops').append(row);
  });
  $('add-stop').textContent = stops.length ? '＋ Otra parada' : '＋ Agregar parada';
}
function addStop(place) {
  const id = `s${++stopN}`, row = document.createElement('div');
  stops.push(id);
  row.className = 'place stop'; row.id = `${id}-row`;
  row.innerHTML = `<label for="${id}"></label><div class="with-btn">
    <input id="${id}" placeholder="Dirección de la parada" enterkeyhint="search">
    <button type="button" class="mini" data-act="up" aria-label="Subir parada">↑</button>
    <button type="button" class="mini" data-act="down" aria-label="Bajar parada">↓</button>
    <button type="button" class="mini del" data-act="del" aria-label="Quitar parada">✕</button>
  </div><ul class="results" id="${id}-results"></ul><div class="chosen" id="${id}-chosen"></div>`;
  $('stops').append(row);
  wire(id);
  row.addEventListener('click', e => {
    const act = e.target.dataset?.act, i = stops.indexOf(id);
    if (!act) return;
    if (act === 'del') { stops.splice(i, 1); delete picked[id]; row.remove(); }
    else {
      const j = act === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= stops.length) return;
      [stops[i], stops[j]] = [stops[j], stops[i]];
      row.classList.add('moved'); setTimeout(() => row.classList.remove('moved'), 600);
    }
    relabel();
    requote();
  });
  relabel();
  if (place) { $(id).value = shortLabel(place.label); choose(id, place); } else $(id).focus();
  return id;
}
$('add-stop').onclick = () => addStop();
// Quick places (CONFIG.rapidos): one tap fills pickup or destination with that place, shown by its name.
document.querySelectorAll('.quick').forEach(box => {
  const which = box.dataset.for;
  for (const q of CONFIG.rapidos || []) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = q.nombre;
    b.onclick = () => {
      $(which).value = q.nombre;
      choose(which, { lat: q.lat, lng: q.lng, label: q.nombre });
      requote();
    };
    box.append(b);
  }
});
// The way back: the destination becomes the pickup, and the stops go in reverse.
$('swap').onclick = () => {
  const a = picked.from, b = picked.to, va = $('from').value, vb = $('to').value;
  $('from').value = vb; $('to').value = va;
  choose('from', b); choose('to', a);
  stops.reverse(); relabel();
  requote();
};
// ── "Where am I": the browser asks for permission the first time. If it was blocked, or the device has
// location off, say how to fix it on that device. GPS first; if it's slow, the network fix.
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
function geoHelp(code) {
  if (!navigator.geolocation || !window.isSecureContext) return 'Este navegador no entrega la ubicación. Escribe la dirección.';
  if (code === 1) return isIOS
    ? 'La ubicación está bloqueada. En el iPhone: 1) Ajustes → Privacidad y seguridad → Localización: que esté activada, y en «Sitios web de Safari» (o «Chrome») elige «Al usar la app». 2) En Safari, toca «aA» junto a la dirección → Configuración del sitio web → Ubicación → Permitir. Después recarga la página.'
    : 'La ubicación está bloqueada. Toca el ícono a la izquierda de la dirección de la página (🔒 o ⓘ) → Ubicación → Permitir. Después recarga la página.';
  if (code === 2) return isIOS || /Android/.test(navigator.userAgent)
    ? 'El celular tiene la ubicación apagada. Actívala en Ajustes y prueba otra vez, o escribe la dirección.'
    : 'Este computador tiene la ubicación apagada (Windows: Configuración → Privacidad → Ubicación). Prueba otra vez o escribe la dirección.';
  return 'Tardó mucho en encontrarte. Prueba otra vez o escribe la dirección.';
}
const getPos = opts => new Promise((ok, no) => navigator.geolocation.getCurrentPosition(ok, no, opts));
// Fills `which` (from / me) with where the device is; on a computer the fix is a guess from the
// internet connection, often km off, so a rough one says so.
async function locate(which, label) {
  const note = $(`${which}-chosen`);
  if (!navigator.geolocation || !window.isSecureContext) { note.textContent = geoHelp(); return; }
  try { if ((await navigator.permissions?.query({ name: 'geolocation' }))?.state === 'denied') { note.textContent = geoHelp(1); return; } } catch {}
  note.textContent = 'Buscando dónde estás… (si el navegador pregunta, toca «Permitir»)';
  let p;
  try { p = await getPos({ enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }); } catch (err) {
    if (err.code === 1) { note.textContent = geoHelp(1); return; }
    try { p = await getPos({ enableHighAccuracy: false, timeout: 15000, maximumAge: 120000 }); } catch (err2) { note.textContent = geoHelp(err2.code); return; }
  }
  const lat = p.coords.latitude, lng = p.coords.longitude, acc = p.coords.accuracy;
  note.textContent = 'Buscando la dirección…';
  const name = await placeName(lat, lng, label);
  $(which).value = name;
  choose(which, { lat, lng, label: name });
  if (acc > 300) note.textContent = `Ubicación aproximada (±${acc >= 1000 ? `${(acc / 1000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} km` : `${Math.round(acc)} m`}): ${name}. Si no es ahí, escribe la dirección${which === 'me' ? ' o arrastra el punto "Tú" en el mapa' : ' o mueve el punto A en el mapa'}.`;
}
$('here').onclick = () => locate('from', 'Mi ubicación');
async function placeName(lat, lng, fallback) {
  try {
    const r = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=es&lat=${lat}&lon=${lng}`)).json();
    if (r.address) return [r.address.road && `${r.address.road} ${r.address.house_number || ''}`.trim(), r.address.suburb || r.address.city || r.address.town].filter(Boolean).join(', ') || fallback;
  } catch {}
  return fallback;
}

// ── Route and price ─────────────────────────────────────────────────────────────────────────────
// The route through every point in order (pickup, stops, destination).
async function route(...pts) {
  const url = `https://router.project-osrm.org/route/v1/driving/${pts.map(p => `${p.lng},${p.lat}`).join(';')}?overview=full&geometries=geojson&annotations=duration,nodes`;
  const r = await (await fetch(url)).json();
  if (r.code !== 'Ok' || !r.routes?.length) throw new Error('No encontré una ruta entre esos lugares.');
  return r.routes[0];
}
// Seconds of each stretch of the whole geometry (one list per leg between stops, end to end).
const durations = r => r.legs.flatMap(l => l.annotation.duration);
// The road node of each coordinate (legs share their joining node), to tell which gantries it goes through.
const nodesOf = r => r.legs.flatMap((l, i) => (i ? l.annotation.nodes.slice(1) : l.annotation.nodes));
const stopPlaces = () => stops.map(id => picked[id]).filter(Boolean);
const at = (date, time) => { const [h, m] = time.split(':').map(Number); return clStartOfDay(date) + (h * 60 + m) * 60000; };

// ── Price of the km. By distance, each stretch at its own value (CONFIG.porKm: the further, the cheaper).
// The whole trip at CONFIG.tarifaAlta at peak hour (weekdays, not holidays) or when it starts, stops or
// ends at a busy place (CONFIG.lugares). The client only sees the total; the driver sees why.
const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const isPeak = t => {
  const wd = clWeekday(t), min = clMinOfDay(t);
  return wd >= 1 && wd <= 5 && !HOLIDAYS.has(clDay(t)) && CONFIG.horaPunta.some(r => { const [a, b] = r.split('-').map(toMin); return min >= a && min < b; });
};
const meters = (a, b) => Math.hypot((a.lat - b.lat) * 110540, (a.lng - b.lng) * 111320 * Math.cos((a.lat * Math.PI) / 180));
const busyPlace = pts => CONFIG.lugares.find(l => pts.some(p => meters(p, l) <= l.radio))?.nombre || null;
function kmPrice(km) {
  const t = CONFIG.porKm;
  return t.reduce((s, x, i) => {
    const end = t[i + 1]?.desde ?? Infinity;
    return km > x.desde ? s + (Math.min(km, end) - x.desde) * x.valor : s;
  }, 0);
}
// One leg: its price and why (null = by distance).
function legPrice(km, t, place) {
  const why = place || (isPeak(t) ? 'hora punta' : null);
  return { amount: why ? km * CONFIG.tarifaAlta : kmPrice(km), why };
}

let map, layer, meLayer, quote = null;
function draw(routes) {
  if (!map) {
    map = L.map('map', { zoomControl: true, attributionControl: false });
    map.zoomControl.setPosition('topright');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
  }
  layer?.remove(); meLayer?.remove();
  const r = routes[0], line = L.polyline(r.geometry.coordinates.map(([lng, lat]) => [lat, lng]), { color: '#0a0a0a', weight: 5, opacity: 0.85 });
  // The pickup and destination pins can be dragged to the exact spot: the trip is quoted again.
  const pin = (which, text, kind = which) => {
    const m = L.marker([picked[which].lat, picked[which].lng], { draggable: true, icon: L.divIcon({ className: `pin pin-${kind}`, html: text, iconSize: [28, 28] }) });
    m.on('dragend', async () => {
      const { lat, lng } = m.getLatLng(), label = await placeName(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      $(which).value = label;
      choose(which, { lat, lng, label });
      $('form').requestSubmit();
    });
    return m;
  };
  const stopPins = stops.filter(id => picked[id]).map((id, i) => pin(id, String(i + 1), 'stop'));
  layer = L.featureGroup([line, pin('from', 'A'), ...stopPins, pin('to', 'B')]).addTo(map);
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
  const loose = stops.findIndex(id => !picked[id] && $(id).value.trim());
  if (loose >= 0) { $('error').textContent = `Elige la parada ${loose + 1} de la lista, o quítala con ✕.`; return; }
  const round = $('round').checked;
  const start = at($('date').value, $('time').value);
  if (start < Date.now() - 600000) { $('error').textContent = 'La fecha y hora ya pasaron.'; return; }
  const back = round ? at($('rdate').value, $('rtime').value || $('time').value) : null;
  if (round && back <= start) { $('error').textContent = 'La vuelta tiene que ser después de la ida.'; return; }
  const btn = $('quote');
  btn.disabled = true; btn.textContent = 'Calculando…';
  try {
    // Going: through the stops. Coming back (round trip): straight home.
    const legs = [await route(picked.from, ...stopPlaces(), picked.to)];
    if (round) legs.push(await route(picked.to, picked.from));
    const tolls = legs.map((r, i) => routeTolls(r.geometry.coordinates, durations(r), i ? back : start, nodesOf(r)));
    const km = legs.reduce((s, r) => s + r.distance, 0) / 1000, min = legs[0].duration / 60;
    const place = busyPlace([picked.from, ...stopPlaces(), picked.to]);
    const prices = legs.map((r, i) => legPrice(r.distance / 1000, i ? back : start, place));
    const byKm = CONFIG.cargoBase + prices.reduce((s, p) => s + p.amount, 0);
    const trip = Math.ceil(Math.max(CONFIG.minimo, byKm) / CONFIG.redondeo) * CONFIG.redondeo;
    const toll = CONFIG.sumarPeajes ? tolls.reduce((s, t) => s + t.total, 0) : 0;
    const why = byKm < CONFIG.minimo ? 'tarifa mínima' : [...new Set(prices.map(p => p.why ? `${p.why}: ${money(CONFIG.tarifaAlta)}/km` : 'por distancia'))].join(' y ');
    quote = { km, min, trip, toll, total: trip + toll, round, start, back, legs, tolls, why };
    show(legs, tolls);
    if (driver) {
      $('driver').classList.remove('hidden'); $('me-lines').innerHTML = '';
      // Navigation from where I am (the apps use the phone's GPS) to the pickup, then pickup → destination.
      const ll = p => `${p.lat},${p.lng}`, a = picked.from, b = picked.to;
      $('nav-pick-g').href = `https://www.google.com/maps/dir/?api=1&destination=${ll(a)}&travelmode=driving`;
      $('nav-pick-w').href = `https://waze.com/ul?ll=${ll(a)}&navigate=yes`;
      // Google Maps takes the stops along; Waze only one point, so it goes to the first stop.
      const way = stopPlaces();
      $('nav-trip-g').href = `https://www.google.com/maps/dir/?api=1&origin=${ll(a)}&destination=${ll(b)}${way.length ? `&waypoints=${encodeURIComponent(way.map(ll).join('|'))}` : ''}&travelmode=driving`;
      $('nav-trip-w').href = `https://waze.com/ul?ll=${ll(way[0] || b)}&navigate=yes`;
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
  const n = stopPlaces().length;
  // The client sees time and stops; km and how it was priced only in driver mode.
  $('summary').textContent = `${driver ? `${q.km.toFixed(1)} km · ` : ''}${q.round ? 'ida y vuelta · ' : ''}${n ? `${plural(n, 'parada', 'paradas')} · ` : ''}${h ? `${h} h ` : ''}${m} min de viaje`;
  $('total').textContent = money(q.total);
  $('lines').innerHTML = '';
  const line = (a, b) => { const li = document.createElement('li'); li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = a; li.children[1].textContent = b; $('lines').append(li); };
  line(`${q.round ? 'Viaje ida y vuelta' : 'Viaje'}${driver ? ` (${q.why})` : ''}`, money(q.trip));
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
// "dom 15 nov · 18:00"
const fmtWhen = t => {
  const o = { timeZone: 'America/Santiago' };
  const day = new Date(t).toLocaleDateString('es-CL', { ...o, weekday: 'short', day: 'numeric', month: 'short' }).replace(/[.,]/g, '');
  return `${day} · ${new Date(t).toLocaleTimeString('es-CL', { ...o, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`;
};
$('book').onclick = () => {
  if (!quote) return;
  // Cash or transfer: required, it goes in the message.
  const pay = document.querySelector('input[name="pay"]:checked')?.value;
  document.querySelector('.pay').classList.toggle('missing', !pay);
  $('book-error').textContent = pay ? '' : 'Elige cómo vas a pagar: efectivo o transferencia.';
  if (!pay) return;
  const q = quote, who = $('who').value.trim(), note = $('note').value.trim(), pax = +$('pax').value, bags = +$('bags').value;
  // TAG grouped by highway (both legs together): "Costanera Norte $1.321 · Ruta 68 $5.400".
  const roads = new Map();
  for (const c of q.tolls.flatMap(t => t.items)) roads.set(c.road, (roads.get(c.road) || 0) + c.price);
  const tag = [...roads].map(([r, a]) => `${r} ${money(a)}`).join(' · ');
  const text = [
    `Hola ${CONFIG.nombre.split(' ')[0]}, quiero reservar un viaje.`,
    !!who && `*${who}*`,
    '',
    `📍 *Desde:* ${picked.from.label}`,
    ...stopPlaces().map((s, i) => `🛑 *Parada ${i + 1}:* ${s.label}`),
    `🏁 *Hasta:* ${picked.to.label}`,
    `🗓️ ${fmtWhen(q.start)}${q.round ? ` · vuelta ${fmtWhen(q.back)}` : ''}`,
    `👥 ${plural(pax, 'pasajero', 'pasajeros')} · ${plural(bags, 'maleta', 'maletas')}`,
    '',
    `💵 *Total: ${money(q.total)}*`,
    `• Viaje${q.round ? ' ida y vuelta' : ''}: ${money(q.trip)}`,
    CONFIG.sumarPeajes && (tag ? `• TAG ${money(q.toll)}: ${tag}` : '• Sin TAG ni peajes'),
    `${pay === 'Efectivo' ? '💵' : '🏦'} *Pago:* ${pay}`,
    !!note && `📝 ${note}`,
    '',
    `Ver viaje: ${tripLink()}`,
  ].filter(x => x !== false).join('\n');
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
};

// ── The trip as a short link: ?v=from lat,lng,to lat,lng,YYMMDDHHMM,passengers,bags[,return YYMMDDHHMM].
// Opening it fills the form and quotes again (on the driver's phone, with his costs); the addresses are
// looked up again from the coordinates. Older links (o, ol, d, dl, f, h…) still open.
const stamp = (date, time) => `${date.slice(2).replace(/-/g, '')}${time.replace(':', '')}`;
function tripLink() {
  const c = p => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;
  const v = [c(picked.from), c(picked.to), stamp($('date').value, $('time').value), $('pax').value, $('bags').value];
  if ($('round').checked) v.push(stamp($('rdate').value, $('rtime').value || $('time').value));
  // Stops in order: &s=lat,lng;lat,lng
  const s = stopPlaces().map(c).join(';');
  return `${location.origin}${location.pathname}?v=${v.join(',')}${s ? `&s=${s}` : ''}`;
}
const params = new URLSearchParams(location.search);
const short = (params.get('v') || '').split(',');
if (short.length >= 7) {
  const [la1, ln1, la2, ln2, when, p, b, back] = short;
  const unstamp = s => [`20${s.slice(0, 2)}-${s.slice(2, 4)}-${s.slice(4, 6)}`, `${s.slice(6, 8)}:${s.slice(8, 10)}`];
  [['from', +la1, +ln1], ['to', +la2, +ln2]].forEach(([which, lat, lng]) => {
    if (!isFinite(lat) || !isFinite(lng)) return;
    const place = { lat, lng, label: `${lat}, ${lng}` };
    choose(which, place);
    placeName(lat, lng, place.label).then(label => { place.label = label; $(which).value = label; $(`${which}-chosen`).textContent = `✓ ${label}`; });
  });
  [$('date').value, $('time').value] = unstamp(when);
  $('pax').value = Math.min(+p, SEATS); fitBags(); $('bags').value = Math.min(+b, maxBags(+$('pax').value));
  if (back) { $('round').checked = true; $('return-row').classList.remove('hidden'); [$('rdate').value, $('rtime').value] = unstamp(back); }
  for (const s of (params.get('s') || '').split(';').filter(Boolean)) {
    const [lat, lng] = s.split(',').map(Number);
    if (!isFinite(lat) || !isFinite(lng)) continue;
    const place = { lat, lng, label: `${lat}, ${lng}` }, id = addStop(place);
    placeName(lat, lng, place.label).then(label => { place.label = label; $(id).value = label; $(`${id}-chosen`).textContent = `✓ ${label}`; });
  }
}
for (const [k, which] of [['o', 'from'], ['d', 'to']]) {
  const [lat, lng] = (params.get(k) || '').split(',').map(Number);
  if (!isFinite(lat) || !isFinite(lng) || !params.get(k)) continue;
  const label = params.get(`${k}l`) || `${lat}, ${lng}`;
  $(which).value = label.split(',').slice(0, 2).join(',');
  choose(which, { lat, lng, label });
}
if (params.get('f')) $('date').value = params.get('f');
if (params.get('h')) $('time').value = params.get('h');
if (params.get('p')) { $('pax').value = Math.min(+params.get('p'), SEATS); fitBags(); }
if (params.get('b')) $('bags').value = Math.min(+params.get('b'), maxBags(+$('pax').value));
if (params.get('rf')) { $('round').checked = true; $('return-row').classList.remove('hidden'); $('rdate').value = params.get('rf'); $('rtime').value = params.get('rh') || ''; }

// ── Driver mode: opening the page once with ?yo turns it on for this phone (?cliente turns it off). ──
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} } };
if (params.has('yo')) store.set('conductor', '1');
if (params.has('cliente')) store.set('conductor', null);
const driver = params.has('yo') || store.get('conductor') === '1';
if (driver) $('vehicle').textContent += ' · modo conductor';
// QR visitors (?qr) land on a welcome card: quote, save the contact (contacto.vcf) or write on WhatsApp.
if (params.has('qr')) {
  const close = () => { $('welcome').classList.add('hidden'); history.replaceState(null, '', location.pathname); };
  $('w-title').textContent = CONFIG.nombre;
  $('w-sub').textContent = `${CONFIG.vehiculo} · hasta ${SEATS} pasajeros · ${maxBags(1)} maletas`;
  $('w-wa').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Hola ${CONFIG.nombre.split(' ')[0]}, quiero cotizar un viaje.`)}`;
  $('w-close').onclick = close;
  $('welcome').addEventListener('click', e => { if (e.target.id === 'welcome') close(); });
  $('w-quote').onclick = () => { close(); $('form').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  $('welcome').classList.remove('hidden');
}
if (picked.from && picked.to) $('form').requestSubmit();

const hhmm = t => new Date(t).toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
const fuel = km => km / CONFIG.rendimientoKmL * CONFIG.precioBencina;
// Where I leave from: the phone's GPS (locate), or typed / dragged by hand.
const locateMe = () => locate('me', 'Mi ubicación');
$('me-btn').onclick = locateMe;
async function driverCalc() {
  const me = picked.me, out = $('me-lines');
  if (!quote || !me) return;
  $('me-status').textContent = 'Calculando…';
  try {
    const q = quote, tolls = (r, t) => routeTolls(r.geometry.coordinates, durations(r), t, nodesOf(r)).total;
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
    meLayer = L.featureGroup([L.polyline(go.geometry.coordinates.map(([lng, lat]) => [lat, lng]), { color: '#6b6b6b', weight: 4, dashArray: '6 8', opacity: 0.8 }), mine]).addTo(map);
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
document.querySelector('.pay').addEventListener('change', () => { document.querySelector('.pay').classList.remove('missing'); $('book-error').textContent = ''; });

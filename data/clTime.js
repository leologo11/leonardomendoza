// Fast Chile local time for heavy loops (GPS studies go through tens of thousands of points).
// toLocaleString with a timeZone builds a new formatter on every call — slow and memory-hungry —
// so the offset is worked out once per hour with a single formatter and reused.
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const offsets = new Map();
function offsetAt(t) {
  const h = Math.floor(t / 3600000);
  let o = offsets.get(h);
  if (o === undefined) {
    const p = Object.fromEntries(fmt.formatToParts(new Date(h * 3600000)).map(x => [x.type, x.value]));
    o = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - h * 3600000;
    if (offsets.size > 20000) offsets.clear();
    offsets.set(h, o);
  }
  return o;
}
// A Date whose UTC fields hold Chile's local time: read it with getUTCHours(), getUTCDay()…
export const clDate = t => { const ms = typeof t === 'number' ? t : Date.parse(t); return new Date(ms + offsetAt(ms)); };
export const clDay = t => clDate(t).toISOString().slice(0, 10);
export const clHour = t => clDate(t).getUTCHours();
export const clMinOfDay = t => { const d = clDate(t); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
export const clWeekday = t => clDate(t).getUTCDay();
export const nextDay = day => new Date(Date.parse(`${day}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
// The instant Chile's day starts (00:00 local) for a 'YYYY-MM-DD' date.
export const clStartOfDay = day => { const t = Date.parse(`${day}T00:00:00Z`); const u = t - offsetAt(t + 4 * 3600000); return t - offsetAt(u); };

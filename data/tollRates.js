// Generated from lib/tollRates.js — do not edit here.
// 2026 toll prices of Santiago's urban highways, gantry by gantry (car category 1), transcribed from
// each concession's official tariff sheet. Each gantry (tramo) has its three prices — TBFP (low /
// fuera de punta), TBP (medium / punta) and TS (high / saturación) — and the hours when TBP and TS
// apply, by day: L = Monday to Friday, S = Saturday, D = Sunday, F = public holiday. Outside those
// hours the gantry charges TBFP. A gantry without hours always charges TBFP.
// `nodes` are the OpenStreetMap ids of the physical gantries of that tramo (twin lanes / tunnel and
// surface gantries of one tramo charge once).

const h = s => (s ? s.split(',').map(x => x.trim()) : []);
// F === null: holidays follow their weekday (the concession doesn't treat them apart). W1…W5: hours
// of one weekday (Monday…Friday) when they differ from the rest.
const sched = (L, S, D, F, W = {}) => ({ L, S: S || {}, D: D || {}, F: F === null ? null : F || {}, ...W });

// ── Autopista Central (rige 17.03.2026 – 31.12.2026). "Sábado y festivos" share one column. ─────
const AC = 'Autopista Central';
const ac = (ref, tramo, km, tbfp, tbp, ts, { tsL, tbpL, tbpS, tbpD } = {}, nodes = []) => ({
  key: `AC:${ref}`, ref, highway: AC, tramo, km, tbfp, tbp, ts, nodes,
  hours: sched({ ts: h(tsL), tbp: h(tbpL) }, { tbp: h(tbpS) }, { tbp: h(tbpD) }, { tbp: h(tbpS) }),
});
const AC_ROWS = [
  // Eje Norte-Sur, dirección sur → norte
  ac('PA2', 'Los Guindos - La Capilla', 7.68, 868.37, null, null, {}, [335626019]),
  ac('PA3', 'La Capilla - Colón', 5.63, 585.09, 1170.18, 1755.28, { tsL: '07:00-07:30', tbpL: '06:30-07:00, 07:30-08:00', tbpD: '18:00-20:00' }, [6114286297]),
  ac('PA5', 'Colón - Las Acacias', 3.22, 334.63, 669.27, 1003.90, { tsL: '07:00-08:00', tbpL: '06:30-07:00, 08:00-09:30', tbpD: '18:00-20:00' }, [6114291823]),
  ac('PA7', 'Las Acacias - Américo Vespucio', 4.35, 452.06, 904.14, null, { tbpL: '07:30-09:30', tbpD: '18:30-20:30' }, [2490264555]),
  ac('PA30', 'Américo Vespucio - Departamental', 3.78, 392.83, 785.66, null, { tbpL: '07:30-09:30', tbpS: '07:30-09:30', tbpD: '18:30-20:30' }, [6116371334]),
  ac('PA10', 'Departamental - Carlos Valdovinos', 2.75, 285.79, 571.58, null, { tbpL: '07:30-09:30', tbpS: '07:30-09:30', tbpD: '18:30-20:30' }, [6116371328]),
  ac('PA31', 'Carlos Valdovinos - Alameda', 3.55, 368.93, 737.86, 1106.79, { tsL: '08:30-09:00', tbpL: '06:30-08:30, 09:00-14:00, 17:00-19:00', tbpS: '10:00-13:00', tbpD: '18:30-20:30' }, [4399757534]),
  ac('PA13', 'Alameda - Río Mapocho', 1.75, 181.86, 363.73, 545.60, { tsL: '08:30-09:00', tbpL: '06:30-08:30, 09:00-14:00, 17:00-19:00', tbpS: '10:00-13:00', tbpD: '18:30-20:30' }, [6114084135]),
  ac('PA16', 'Río Mapocho - 14 de la Fama', 4.09, 425.04, 850.10, null, { tbpL: '07:30-09:30' }, [288057884]),
  ac('PA17', '14 de la Fama - A. Vespucio Norte', 4.45, 462.46, 924.92, null, { tbpL: '07:00-10:00, 10:30-15:00, 16:30-19:30' }, [2077631034]),
  // Eje Norte-Sur, dirección norte → sur
  ac('PA18', 'A. Vespucio Norte - 14 de la Fama', 4.45, 462.46, 924.92, 1387.38, { tsL: '17:30-18:00', tbpL: '07:00-08:30, 09:30-10:00' }, [6114138859]),
  ac('PA15', '14 de la Fama - Río Mapocho', 4.09, 425.04, 850.10, null, { tbpL: '07:30-08:00, 08:30-09:00, 18:30-20:30' }, [6116236799]),
  ac('PA14', 'Río Mapocho - Alameda', 1.75, 181.86, 363.73, 545.60, { tsL: '10:00-10:30, 11:00-11:30, 15:30-16:00, 19:30-20:00', tbpL: '07:00-08:30, 09:00-09:30, 15:00-15:30, 16:00-16:30, 18:30-19:30, 20:00-20:30', tbpS: '11:00-15:00' }, [6114084136]),
  ac('PA12', 'Alameda - Carlos Valdovinos', 3.55, 368.93, 737.86, 1106.79, { tsL: '10:00-10:30, 11:00-11:30, 15:30-16:00, 19:30-20:00', tbpL: '07:00-08:30, 09:00-09:30, 15:00-15:30, 16:00-16:30, 18:30-19:30, 20:00-20:30', tbpS: '11:00-15:00' }, [6114084134]),
  ac('PA11', 'Carlos Valdovinos - Departamental', 2.75, 285.79, 571.58, null, { tbpS: '11:00-15:00' }, [6116371330]),
  ac('PA9', 'Departamental - Américo Vespucio', 3.78, 392.83, 785.66, null, { tbpL: '18:00-20:30', tbpS: '11:00-15:00' }, [6116371333]),
  ac('PA8', 'Américo Vespucio - Las Acacias', 4.35, 452.06, 904.14, null, { tbpL: '18:00-20:30' }, [2490264558]),
  ac('PA32', 'Las Acacias - Lo Blanco', 1.70, 176.67, 353.34, 530.01, { tsL: '17:30-19:30', tbpL: '18:30-20:30' }, [157288624]),
  ac('PA6', 'Lo Blanco - Colón', 1.52, 157.96, 315.93, 473.89, { tsL: '17:30-19:30', tbpL: '10:00-10:30, 19:30-20:30' }, [6114291826]),
  ac('PA37', 'Colón - Calera de Tango', 4.38, 455.18, null, null, {}, [9566814796]),
  ac('PA4', 'Calera de Tango - La Capilla', 1.25, 129.90, null, null, {}, [6114286295]),
  ac('PA1', 'La Capilla - Los Guindos', 7.68, 868.37, null, null, {}, [9844306687]),
  // Eje General Velásquez, sur → norte
  ac('PA19', 'Ruta 5 Sur - Américo Vespucio', 3.97, 412.57, null, null, {}, [6114138863]),
  ac('PA21', 'Américo Vespucio - Carlos Valdovinos', 4.93, 512.34, null, null, {}, [6116324745]),
  ac('PA23', 'Carlos Valdovinos - Alameda', 2.77, 287.86, 575.74, null, { tbpL: '07:00-10:00' }, [6116324740]),
  ac('PA25', 'Alameda - Río Mapocho', 4.06, 421.93, 843.86, null, { tbpL: '07:00-09:30, 14:30-15:00, 19:00-19:30' }, [6116337640]),
  ac('PA28', 'Río Mapocho - Ruta 5 Norte', 4.93, 512.34, 1024.69, 1537.04, { tsL: '07:30-08:30', tbpL: '07:00-07:30, 08:30-09:30, 10:00-10:30, 18:00-19:00' }, [285899561]),
  // Eje General Velásquez, norte → sur
  ac('PA29', 'Ruta 5 Norte - Río Mapocho', 4.93, 512.34, 1024.69, null, { tbpL: '17:00-20:30' }, [6116337639]),
  ac('PA26', 'Río Mapocho - Alameda', 4.06, 421.93, 843.86, null, { tbpL: '18:30-20:30' }, [6116337642]),
  ac('PA24', 'Alameda - Carlos Valdovinos', 2.77, 287.86, 575.74, 863.61, { tsL: '18:30-19:00', tbpL: '18:00-18:30, 19:00-20:30' }, [6116324742]),
  ac('PA22', 'Carlos Valdovinos - Américo Vespucio', 4.93, 512.34, null, null, {}, [6116324746]),
  ac('PA20', 'Américo Vespucio - Ruta 5 Sur', 3.97, 412.57, null, null, {}, [5145133779]),
];

// ── Autopista Vespucio Norte (01.02.2026 – 31.12.2026). "Sábados y festivos" share one column. ──
const VN = 'Autopista Vespucio Norte';
const vn = (ref, tramo, km, tbfp, tbp, ts, { tbpL, tbpS, tbpD, tsL } = {}, nodes = []) => ({
  key: `VN:${ref}`, ref, highway: VN, tramo, km, tbfp, tbp, ts, nodes,
  hours: sched({ ts: h(tsL), tbp: h(tbpL) }, { tbp: h(tbpS) }, { tbp: h(tbpD) }, { tbp: h(tbpS) }),
});
const VN_ROWS = [
  // Oriente → poniente
  vn('P15', 'El Salto - Recoleta', 1.40, 140.68, 281.37, 422.05, { tbpL: '17:30-18:30, 19:00-22:00', tbpS: '13:00-15:00, 20:00-22:00', tsL: '18:30-19:00' }, [6117130668]),
  vn('P13', 'Recoleta - Pedro Fontova', 4.10, 412.00, 824.01, 1236.01, { tbpL: '17:30-18:30, 19:00-22:00', tbpS: '13:00-15:00, 20:00-22:00', tsL: '18:30-19:00' }, [6117130670]),
  vn('P11', 'Pedro Fontova - Ruta 5 Norte', 3.00, 301.47, 602.93, null, { tbpL: '07:30-09:00, 17:30-19:00', tbpS: '13:00-15:00, 20:00-22:00', tbpD: '21:00-23:00' }, [6117130671, 13122129279]),
  vn('P8', 'Ruta 5 Norte - Condell', 6.50, 653.18, 1306.36, null, { tbpL: '07:30-09:30', tbpS: '13:00-15:00, 20:00-22:00', tbpD: '21:00-23:00' }, [6117130674]),
  vn('P6', 'Condell - Costanera Norte', 4.50, 452.20, 904.40, null, { tbpL: '07:30-09:30, 17:30-18:30' }, [6116371480]),
  vn('P4', 'Costanera Norte - Ruta 68', 3.50, 351.71, 703.42, 1055.13, { tbpL: '15:30-16:30, 19:30-20:00', tbpS: '11:00-14:00, 19:00-22:00', tsL: '16:30-19:30' }, [6116371482]),
  vn('P2', 'Ruta 68 - Los Mares', 2.10, 211.03, 422.05, 633.08, { tbpL: '15:30-17:30, 19:30-20:00', tsL: '17:30-19:30' }, [9611695677]),
  vn('P17', 'Los Mares - Ruta 78', 3.90, 391.91, 783.81, 1175.72, { tbpL: '15:30-17:30, 19:30-20:00', tsL: '17:30-19:30' }, [5521500757]),
  // Poniente → oriente
  vn('P1', 'Ruta 78 - Santa Elena', 1.20, 120.59, 241.17, 361.76, { tbpL: '06:30-07:00, 10:00-12:30', tsL: '07:00-10:00' }, [4455202302]),
  vn('P16', 'Santa Elena - Ruta 68', 4.80, 482.35, 964.69, 1447.04, { tbpL: '06:30-07:00, 10:00-12:30', tsL: '07:00-10:00' }, [9611695678]),
  vn('P3', 'Ruta 68 - Costanera Norte', 3.50, 351.71, 703.42, null, { tbpL: '07:30-09:30', tbpS: '18:00-21:00', tbpD: '19:00-22:00' }, [13877100]),
  vn('P5', 'Costanera Norte - Condell', 4.50, 452.20, 904.40, null, { tbpL: '07:30-08:00', tbpS: '18:00-21:00', tbpD: '19:00-22:00' }, [6116371481]),
  vn('P7', 'Condell - Lo Echevers', 1.04, 104.51, 209.02, null, { tbpL: '07:30-09:00, 10:30-11:30, 17:30-20:00', tbpS: '13:00-15:00, 18:00-21:00', tbpD: '19:00-22:00' }, [6117130675]),
  vn('P9', 'Lo Echevers - Ruta 5 Norte', 5.46, 548.67, 1097.34, null, { tbpL: '07:30-09:00, 10:30-11:30, 17:30-20:00', tbpS: '13:00-15:00, 18:00-21:00', tbpD: '19:00-22:00' }, [6117130673]),
  vn('P10', 'Ruta 5 Norte - Pedro Fontova', 3.00, 301.47, 602.93, 904.40, { tbpL: '07:30-08:00, 09:00-09:30, 17:30-20:00', tbpS: '18:00-21:00', tbpD: '19:00-22:00', tsL: '08:00-09:00' }, [6117130672]),
  vn('P12', 'Pedro Fontova - Guanaco', 0.69, 69.34, 138.67, null, { tbpL: '07:30-09:30' }, [6117130669]),
  vn('P14', 'Guanaco - El Salto', 4.81, 483.35, 966.70, null, { tbpL: '07:30-09:30' }, [13881069]),
];

// ── Autopista Vespucio Sur (2026, MOP sheet). Sunday and holidays share one column. ──────────────────────
const VS = 'Autopista Vespucio Sur';
const vs = (ref, tramo, km, tbfp, tbp, ts, { tbpL, tsL, tbpS, tbpD } = {}, nodes = []) => ({
  key: `VS:${ref}`, ref, highway: VS, tramo, km, tbfp, tbp, ts, nodes,
  hours: sched({ ts: h(tsL), tbp: h(tbpL) }, { tbp: h(tbpS) }, { tbp: h(tbpD) }, { tbp: h(tbpD) }),
});
const VS_ROWS = [
  // Poniente → oriente
  vs('1.3', '2ª Transversal - Camino a Melipilla', 5.30, 532.59, 1065.18, 1597.78, { tbpL: '08:30-09:30', tsL: '07:30-08:30', tbpS: '18:00-21:00', tbpD: '19:00-22:00' }, [6114181656]),
  vs('2.2', 'Gral. Velásquez - Ruta 5', 2.50, 251.22, 502.45, 753.67, { tbpS: '18:00-21:00', tbpD: '19:00-22:00' }, [6114181660]),
  vs('3.4', 'Ruta 5 - Gran Avenida', 1.20, 120.59, 241.17, 361.76, { tbpL: '18:00-18:30, 19:30-20:00', tsL: '18:30-19:30', tbpS: '13:00-15:00, 18:00-21:00', tbpD: '19:00-22:00' }, [6114181666]),
  vs('3.2', 'Gran Avenida - Santa Rosa', 4.70, 472.30, 944.60, 1416.89, { tbpL: '18:00-18:30, 19:30-20:00', tsL: '18:30-19:30', tbpS: '13:00-15:00, 18:00-21:00', tbpD: '19:00-22:00' }, [6114181668]),
  vs('4.3', 'Coronel - Santa Julia', 0.45, 45.22, 90.44, 135.66, { tbpL: '08:30-09:30, 18:00-18:30, 19:30-20:00', tsL: '07:30-08:30, 18:30-19:30', tbpS: '18:00-21:00', tbpD: '19:00-22:00' }, [6114166012]),
  vs('4.2', 'Gnmo. de Alderete - Vic. Mackenna', 2.65, 266.30, 532.59, 798.89, { tbpL: '08:30-09:30, 18:00-18:30, 19:30-20:00', tsL: '07:30-08:30, 18:30-19:30', tbpS: '18:00-21:00', tbpD: '19:00-22:00' }, [6114166014]),
  vs('5.4', 'Las Torres - Quilín', 3.81, 382.86, 765.73, 1148.59, { tbpL: '08:30-09:30', tsL: '07:30-08:30' }, [6116872049]),
  vs('5.2', 'Quilín - Grecia', 2.89, 290.41, 580.83, 871.24, { tbpL: '08:30-09:30', tsL: '07:30-08:30' }, [6116872055]),
  // Oriente → poniente
  vs('5.1', 'Grecia - Quilín', 1.21, 121.59, 243.18, 364.78, { tbpL: '20:00-22:00', tsL: '19:00-20:00', tbpS: '13:00-15:00, 20:00-22:00' }, [6116872054]),
  vs('5.3', 'Quilín - Las Torres', 5.49, 551.68, 1103.37, 1655.05, { tbpL: '20:00-22:00', tsL: '19:00-20:00', tbpS: '13:00-15:00, 20:00-22:00' }, [6116872050]),
  vs('4.1', 'Gnmo. de Alderete - Santa Julia', 3.10, 311.52, 623.03, null, { tbpS: '13:00-15:00, 20:00-22:00', tbpD: '21:00-23:00' }, [9624207147]),
  vs('3.1', 'Santa Rosa - Gran Avenida', 3.31, 332.62, 665.24, 997.86, { tbpL: '08:30-09:30', tsL: '07:30-08:30', tbpS: '13:00-15:00, 20:00-22:00', tbpD: '21:00-23:00' }, [6114181670]),
  vs('3.3', 'Gran Avenida - Ruta 5', 2.59, 260.27, 520.53, 780.80, { tbpL: '08:30-09:30', tsL: '07:30-08:30', tbpS: '13:00-15:00, 20:00-22:00', tbpD: '21:00-23:00' }, [6114181664]),
  vs('2.1', 'Ruta 5 - General Velásquez', 2.50, 251.22, 502.45, 753.67, { tbpL: '08:30-09:30', tsL: '07:30-08:30' }, [6114181662]),
  vs('1.1', 'General Velásquez - Ruta 78', 5.30, 532.59, 1065.18, null, { tbpS: '11:00-14:00, 19:00-22:00' }, [6114181658]),
];

// ── Costanera Norte (2026). Sundays and holidays: TBFP all day. ────────────────────────────────
const CN = 'Costanera Norte';
const cn = (ref, dir, tramo, km, tbfp, tbp, ts, { tbpL, tsL, tbpS, tsS } = {}, nodes = []) => ({
  key: `CN:${ref}:${dir}`, ref, highway: CN, tramo, km, tbfp, tbp, ts, nodes,
  hours: sched({ ts: h(tsL), tbp: h(tbpL) }, { ts: h(tsS), tbp: h(tbpS) }),
});
// Hours from the MOP 2026 sheet "Peajes Tarifas 2026 / Autopistas Urbanas — Costanera Norte".
const CN_EAST = { tbpL: '07:00-07:30, 08:30-10:00, 12:00-13:00, 14:00-15:00, 17:30-19:30', tsL: '07:30-08:30, 13:00-14:00' };
const CN_CENTER = { tbpL: '07:00-07:30, 08:30-10:00, 11:00-13:00, 14:00-17:00, 19:30-21:00', tsL: '07:30-08:30, 13:00-14:00, 17:00-19:30', tbpS: '11:30-15:00, 16:30-17:00, 18:30-19:30' };
const CN_WEST_OP = { tbpL: '12:00-15:00, 18:00-21:00' };
const CN_KEN_OP = { tbpL: '07:00-07:30, 08:30-10:00, 12:00-13:00, 14:00-15:00, 17:30-19:00', tsL: '07:30-08:30, 13:00-14:00' };
const CN_KEN_PO = { tbpL: '07:00-09:30, 12:00-13:00, 14:00-15:00, 15:30-16:00, 16:30-18:00, 19:30-21:00', tsL: '13:00-14:00, 18:00-19:30' };
const CN_WEST_PO = { tbpL: '07:00-07:30, 09:30-10:00, 12:00-15:00, 18:00-18:30', tsL: '07:30-09:30' };
const CN_TAJAMAR_PO = { tbpL: '14:00-16:30, 19:30-21:00', tsL: '07:00-14:00, 16:30-19:30', tbpS: '08:30-15:30, 18:30-19:00' };
const CN_EAST_PO = { tbpL: '12:00-13:00, 14:00-15:00, 18:00-18:30, 19:30-21:00', tsL: '13:00-14:00, 18:30-19:30' };
const CN_ROWS = [
  // Eje Costanera, oriente → poniente
  cn('P0', 'OP', 'Puente Padre Arteaga - Puente San Francisco', 1.4, 149.80, 288.40, 436.80, CN_EAST, [253434286]),
  cn('P1', 'OP', 'Puente San Francisco - Gran Vía', 4.2, 449.40, 865.20, 1310.40, CN_EAST, [2951662070]),
  cn('P2.1', 'OP', 'Gran Vía - Centenario', 3.98, 425.86, 819.88, 1241.76, CN_EAST, [9627393148]),
  cn('P2.2', 'OP', 'Centenario - Puente Lo Saldes', 2.47, 264.29, 508.82, 770.64, CN_EAST, [6117130667]),
  cn('SB', 'OP', 'Salida Bellavista', 2.185, 233.79, 450.11, 681.72, CN_CENTER, [9516346638]),
  cn('P3', 'OP', 'Puente Lo Saldes - Vivaceta', 7.19, 719.04, 1384.32, 2096.64, CN_CENTER, [9638303965]),
  cn('EV', 'OP', 'Entrada Vivaceta', 1.115, 119.41, 229.89, 348.19, CN_CENTER, [6116236796]),
  cn('P5', 'OP', 'Vivaceta - Carrascal', 6.69, 715.83, 1378.14, null, CN_WEST_OP, [2612857718]),
  cn('P6.1', 'OP', 'Carrascal - Petersen', 2.24, 239.68, 461.44, null, CN_WEST_OP, [9641637789]),
  cn('P6.2', 'OP', 'Petersen - Américo Vespucio Poniente', 3.41, 364.87, 702.46, null, CN_WEST_OP, [6509152133]),
  cn('P9', 'OP', 'Américo Vespucio Poniente - Ruta 68', 5.0, 535.00, 1030.00, null, { ...CN_WEST_OP, tbpS: '11:00-11:30' }, [6508970707]),
  // Eje Kennedy, oriente → poniente
  cn('P7', 'OP', 'Estoril - Las Tranqueras', 2.3385, 250.21, 481.73, 729.61, CN_KEN_OP, [2486323474]),
  cn('P8', 'OP', 'Las Tranqueras - Costanera Norte', 5.4565, 583.84, 1124.03, 1702.42, CN_KEN_OP, [5579887517, 3241339769]),
  // Eje Kennedy, poniente → oriente
  cn('P8', 'PO', 'Costanera Norte - Las Tranqueras', 5.4565, 583.84, 1124.03, 1702.42, CN_KEN_PO, [5788252112, 5788252531, 9515321517, 9515305316, 9695367765]),
  cn('P7', 'PO', 'Las Tranqueras - Estoril', 2.3385, 250.21, 481.73, 729.61, CN_KEN_PO, [6116282528]),
  // Eje Costanera, poniente → oriente
  cn('P9', 'PO', 'Ruta 68 - Américo Vespucio Poniente', 5.0, 535.00, 1030.00, null, { tbpL: '07:00-10:00, 12:00-15:00' }, [6508970705]),
  cn('P6.2', 'PO', 'Américo Vespucio Poniente - Petersen', 3.41, 364.87, 702.46, 1063.90, CN_WEST_PO, [6509152132]),
  cn('P6.1', 'PO', 'Petersen - Carrascal', 2.24, 239.68, 461.44, 698.88, CN_WEST_PO, [9641637788]),
  cn('P5', 'PO', 'Carrascal - Vivaceta', 6.69, 715.83, 1378.14, 2087.28, CN_WEST_PO, [5572951836]),
  cn('P4', 'PO', 'Vivaceta - Torres Tajamar', 3.86, 413.02, 795.16, 1204.32, CN_TAJAMAR_PO, [6116236797]),
  cn('P3', 'PO', 'Torres Tajamar - Puente Lo Saldes', 2.86, 306.02, 589.16, 892.32, CN_TAJAMAR_PO, [9638303963]),
  cn('P2.2', 'PO', 'Puente Lo Saldes - Centenario', 2.47, 264.29, 508.82, 770.64, CN_EAST_PO, [2948768935]),
  cn('P2.1', 'PO', 'Centenario - Gran Vía', 3.98, 425.86, 819.88, 1241.76, CN_EAST_PO, [9627393149]),
  cn('P1', 'PO', 'Gran Vía - Puente San Francisco', 4.2, 449.40, 865.20, 1310.40, CN_EAST_PO, [6117141442]),
  cn('P0', 'PO', 'Puente San Francisco - Puente Padre Arteaga', 1.4, 149.80, 288.40, 436.80, CN_EAST_PO, [9626675441]),
];

// ── Flat-price toll plazas (same price at any hour). ──────────────────────────────────────────
const flat = (key, highway, tramo, price, nodes) => ({ key, ref: '', highway, tramo, km: null, tbfp: price, tbp: null, ts: null, nodes, hours: sched({}) });
const FLAT_ROWS = [
  flat('AS:MAIPO', 'Autopista Acceso Sur', 'Troncal Río Maipo', 621, [13743054369, 13743054399]),
  flat('AS:TOCORNAL', 'Autopista Acceso Sur', 'Troncal Tocornal', 207, [5516568781, 6518635362]),
  flat('AS:GABRIELA', 'Autopista Acceso Sur', 'Troncal Gabriela', 621, [6479098231, 6479098244]),
  // Los Libertadores: TAG price of the trunk plazas Las Canteras / San José (Chacabuco $3.300 is beyond the map area).
  flat('LL:CANTERAS', 'Autopista Los Libertadores', 'Plaza troncal Las Canteras', 1400, [267454369, 277060427, 9645902676, 9645902677]),
  flat('LL:SANJOSE', 'Autopista Los Libertadores', 'Plaza troncal San José', 1400, [314200644]),
];

// ── Túnel San Cristóbal (01.02.2026 – 31.12.2026). Holidays on a weekday use the Saturday hours. ─
const TSC = 'Túnel San Cristóbal';
const TSC_ROWS = [
  { key: 'TSC:SK', ref: 'P101', highway: TSC, tramo: 'El Salto → Kennedy', km: null, tbfp: 565, tbp: 904, ts: 1131, nodes: [6114221889],
    hours: sched({ tbp: h('07:00-07:30, 10:00-11:00, 15:30-17:30'), ts: h('07:30-09:30, 17:30-20:30') }, { tbp: h('10:00-14:00') }, {}, { tbp: h('10:00-14:00') }) },
  { key: 'TSC:KS', ref: 'P102', highway: TSC, tramo: 'Kennedy → El Salto', km: null, tbfp: 452, tbp: 678, ts: null, nodes: [636752664],
    hours: sched({ tbp: h('07:00-10:00, 17:30-20:30') }, { tbp: h('10:00-14:00') }, { tbp: h('17:00-21:00') }, { tbp: h('10:00-14:00') }) },
];

// ── Autopista Nororiente (2026): one price per sector and direction; peak hours by day. ─────────
const AN = 'Autopista Nororiente';
const AN_H = sched({ tbp: h('07:00-09:00, 19:00-21:00') }, { tbp: h('08:00-10:00, 17:00-21:00') }, { tbp: h('08:00-10:00') }, null);
const AN_ROWS = [
  { key: 'AN:ORI:OP', ref: 'P64/P61', highway: AN, tramo: 'Sector Oriente (Nudo Centenario - Av. El Valle), oriente → poniente', km: null, tbfp: 4116, tbp: 6173, ts: null, nodes: [382079878, 5568374798], hours: AN_H },
  { key: 'AN:ORI:PO', ref: 'P65/P60', highway: AN, tramo: 'Sector Oriente (Av. El Valle - Nudo Centenario), poniente → oriente', km: null, tbfp: 4116, tbp: 6173, ts: null, nodes: [4999156848, 5568374819], hours: AN_H },
  { key: 'AN:PON:OP', ref: 'P62', highway: AN, tramo: 'Sector Poniente (Av. El Valle - Ruta 5 Norte), oriente → poniente', km: null, tbfp: 2744, tbp: 4116, ts: null, nodes: [4999156428], hours: AN_H },
  { key: 'AN:PON:PO', ref: 'P63', highway: AN, tramo: 'Sector Poniente (Ruta 5 Norte - Av. El Valle), poniente → oriente', km: null, tbfp: 2744, tbp: 4116, ts: null, nodes: [4999156427], hours: AN_H },
];

// ── Nueva Aconcagua, Ruta 5 Norte urbana (Autovía Santiago - Lampa), 01.01.2026 – 31.12.2026. Both
// directions; peak (TBP): Monday 7:15–10:00 and 17:15–20:00; Tuesday–Thursday 7:15–9:00 and 17:45–20:00;
// Friday 7:15–10:00 and 16:45–20:45; Saturday and holidays 9:15–15:45; Sunday 17:15–22:00. Lampa: flat.
const NA = 'Ruta 5 Norte (Nueva Aconcagua)';
const NA_H = sched({ tbp: h('07:15-09:00, 17:45-20:00') }, { tbp: h('09:15-15:45') }, { tbp: h('17:15-22:00') }, { tbp: h('09:15-15:45') },
  { W1: { tbp: h('07:15-10:00, 17:15-20:00') }, W5: { tbp: h('07:15-10:00, 16:45-20:45') } });
const na = (n, tramo, tbfp, tbp, nodes) => ({ key: `NA:${n}`, ref: `N° ${n}`, highway: NA, tramo, km: null, tbfp, tbp, ts: null, nodes, hours: NA_H });
const NA_ROWS = [
  na(1, 'Paso Superior Lo Marcoleta (oriente)', 181, 362, [6548823505]),
  na(2, 'Paso Superior Lo Marcoleta (poniente)', 181, 362, [6548823501]),
  na(3, 'Enlace Buenaventura (oriente)', 218, 436, [6122216578]),
  na(4, 'Enlace Buenaventura (poniente)', 218, 436, [6548809057]),
  na(5, 'Paso Superior La Montaña (oriente)', 397, 794, [6615396127]),
  na(6, 'Paso Superior La Montaña (poniente)', 397, 794, [6615396126]),
  na(7, 'Enlace Lo Pinto (oriente)', 486, 972, [6615396116]),
  na(8, 'Enlace Lo Pinto (poniente)', 486, 972, [6615396115]),
  flat('NA:LAMPA', NA, 'Plaza de peaje Lampa', 900, [1946795899, 1946795918, 6223443638, 6277890252]),
];

// ── Ruta 68 (2026): troncal Lo Prado. Peak, both directions: weekends (Friday 17:00 to Monday 00:00)
// and long weekends (from 17:00 the day before until 00:00 of the first working day after). An isolated
// holiday midweek is normal.
const R68_ROWS = [
  { key: 'R68:LOPRADO', ref: '', highway: 'Ruta 68', tramo: 'Troncal Lo Prado', km: null, tbfp: 2700, tbp: 4000, ts: null, nodes: [9651968599, 9651968600, 243646585, 5508725661],
    hours: sched({}), peak: ({ day, weekday, minute }) => weekday === 6 || weekday === 0 || (weekday === 5 && minute >= 1020)
      || longWeekends().some(x => (day >= x.first && day <= x.last) || (addDay(x.first, -1) === day && minute >= 1020)) },
];

// ── Ruta 78, Autopista Santiago - San Antonio (free flow, tarifas desde 01.01.2026, autos cat. 2).
// Peak only in high season (20 Dec – 10 Mar) and long weekends, by direction:
//   toward Santiago: high-season Sundays 18:00–22:00; long weekends, the return day 18:00–22:00.
//   toward San Antonio: high-season Fridays 18:00–22:00 and Saturdays 10:00–13:00; long weekends,
//   the eve 18:00–22:00 and the first day 10:00–13:00.
// (Pomaire and Puangue are beyond the map area.)
const addDay = (day, n) => { const d = new Date(`${day}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const wd = day => new Date(`${day}T12:00:00Z`).getUTCDay();
// Long weekends: Thursday/Friday holiday + Saturday + Sunday, or Saturday + Sunday + Monday/Tuesday holiday.
const longWeekends = () => [...HOLIDAYS].flatMap(hd => {
  const w = wd(hd);
  if (w === 4 || w === 5) return [{ first: hd, last: addDay(hd, 7 - w) }];
  if (w === 1 || w === 2) return [{ first: addDay(hd, -w - 1), last: hd }];
  return [];
});
const highSeason = day => { const md = day.slice(5); return md >= '12-20' || md <= '03-10'; };
const r78Peak = toSantiago => ({ day, weekday, minute }) => {
  const at = (a, b) => minute >= a * 60 && minute < b * 60;
  const lw = longWeekends();
  if (toSantiago) return (highSeason(day) && weekday === 0 && at(18, 22)) || lw.some(x => x.last === day && at(18, 22));
  return (highSeason(day) && ((weekday === 5 && at(18, 22)) || (weekday === 6 && at(10, 13))))
    || lw.some(x => (addDay(x.first, -1) === day && at(18, 22)) || (x.first === day && at(10, 13)));
};
const r78 = (name, tbfp, tbp, toStgo, toSA) => [
  { key: `R78:${name}:S`, ref: '', highway: 'Ruta 78', tramo: `${name} (hacia Santiago)`, km: null, tbfp, tbp, ts: null, nodes: [toStgo], hours: sched({}), peak: r78Peak(true) },
  { key: `R78:${name}:SA`, ref: '', highway: 'Ruta 78', tramo: `${name} (hacia San Antonio)`, km: null, tbfp, tbp, ts: null, nodes: [toSA], hours: sched({}), peak: r78Peak(false) },
];
const R78_ROWS = [
  ...r78('Américo Vespucio', 718, 1077, 454636152, 454636182),
  ...r78('Rinconada', 330, 495, 12511401260, 12511401261),
  ...r78('Padre Hurtado', 225, 337.5, 12511401267, 5532689550),
  ...r78('Malloco', 225, 337.5, 12511401277, 12511401272),
  ...r78('Talagante', 375, 562.5, 12511401245, 12511401244),
  ...r78('El Paico', 375, 562.5, 12511401282, 12511401283),
];

// ── Plazas de peaje interurbanas (lib/tollPlazas.json): casetas con vías TAG y/o manuales y pórticos
// fuera de la red urbana, con su precio 2026 para autos (o el último publicado, en `note`). Se cobran
// como TAG; si el conductor pagó en la caseta, entrega el comprobante y esa pasada se descuenta.
// Autopista Los Andes, Ruta 60-CH (10.01.2026 – 09.01.2027), punta:
//   hacia el poniente (Los Andes → Viña): temporada alta (20 dic – 5 mar) viernes 18–22 y sábado 11–14;
//   fines de semana largos, la víspera 18–22 y el primer día 11–14.
//   hacia el oriente (Viña → Los Andes): temporada alta domingo 17–21; fines de semana largos, el día de
//   regreso 17–21; resto del año, domingo 17–19. (Fuera de los fines de semana largos en ambos casos.)
const r60Peak = ({ day, weekday, minute }, west) => {
  const at = (a, b) => minute >= a * 60 && minute < b * 60;
  const md = day.slice(5), high = md >= '12-20' || md <= '03-05';
  const lw = longWeekends(), inLw = lw.some(x => day >= x.first && day <= x.last);
  if (west) return (!inLw && high && ((weekday === 5 && at(18, 22)) || (weekday === 6 && at(11, 14)))) || lw.some(x => (addDay(x.first, -1) === day && at(18, 22)) || (x.first === day && at(11, 14)));
  return (!inLw && weekday === 0 && (high ? at(17, 21) : at(17, 19))) || lw.some(x => x.last === day && at(17, 21));
};
// west: the car was driving westward (toward the coast); on Ruta 78 eastward is toward Santiago.
const PLAZA_PEAK = {
  r60: (w, west) => r60Peak(w, west),
  r68: w => !!R68_ROWS[0].peak(w),
  r78: (w, west) => r78Peak(!west)(w),
};
export const TOLL_PLAZAS = [{"key":"LL:CHACABUCO","highway":"Autopista Los Libertadores","name":"Troncal Chacabuco","kind":"troncal","normal":3300,"punta":null,"peak":null,"free":"LL","nodes":[[335639289,-33.000788,-70.687245]]},{"key":"LL:CHICUREO","highway":"Autopista Los Libertadores","name":"Lateral Chicureo","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":"LL","nodes":[[277060582,-33.282965,-70.702682]],"note":"tarifa 2025 (2026 no publicada)"},{"key":"LL:SANLUIS","highway":"Autopista Los Libertadores","name":"Lateral San Luis (Colina)","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":"LL","nodes":[[6114084131,-33.208953,-70.668045]],"note":"tarifa 2025 (2026 no publicada)"},{"key":"R68:ZAPATA","highway":"Ruta 68","name":"Troncal Zapata","kind":"troncal","normal":2700,"punta":4000,"peak":"r68","free":null,"nodes":[[6613063427,-33.371552,-71.300062],[6613063432,-33.370647,-71.299468],[9668288305,-33.369045,-71.303257],[9668288306,-33.368968,-71.3032]]},{"key":"R68:L-CZAPATA","highway":"Ruta 68","name":"Lateral Cuesta Zapata","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[282392436,-33.366769,-71.308506]]},{"key":"R68:L-ALGARROBO","highway":"Ruta 68","name":"Lateral Algarrobo","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[4273727995,-33.340624,-71.366673]]},{"key":"R68:L-TAPIHUE","highway":"Ruta 68","name":"Lateral Casablanca - Tapihue","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[303743015,-33.328601,-71.390358]]},{"key":"R68:L-LOVASQUEZ","highway":"Ruta 68","name":"Lateral Casablanca - Lo Vásquez","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[303739936,-33.30552,-71.411215]]},{"key":"R68:L-QUINTAY","highway":"Ruta 68","name":"Lateral Quintay - Tunquén","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[256284942,-33.1615,-71.542052]]},{"key":"R68:TSUR","highway":"Autopista Troncal Sur","name":"Troncal Sur","kind":"troncal","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[276093010,-33.062926,-71.434041],[294489553,-33.063448,-71.434126],[9721386231,-33.063522,-71.431671],[9721386232,-33.063407,-71.431655]]},{"key":"R68:TSUR-L1","highway":"Autopista Troncal Sur","name":"Lateral Villa Olímpica - Quilpué","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[254521764,-33.061846,-71.457493]]},{"key":"R68:TSUR-L2","highway":"Autopista Troncal Sur","name":"Lateral Valparaíso - Viña del Mar","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[294493344,-33.061511,-71.457091]]},{"key":"R66:LASARANAS","highway":"Ruta 66 (Ruta de la Fruta)","name":"Troncal Las Arañas","kind":"troncal","normal":2050,"punta":null,"peak":null,"free":null,"nodes":[[12816390867,-34.078116,-71.37089]]},{"key":"R66:SANPEDRO","highway":"Ruta 66 (Ruta de la Fruta)","name":"Troncal San Pedro","kind":"troncal","normal":1100,"punta":null,"peak":null,"free":null,"nodes":[[314199538,-33.82457,-71.526424]]},{"key":"R60:MONASTERIO","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Lateral Monasterio","kind":"lateral","normal":1300,"punta":1900,"peak":"r60","free":null,"nodes":[[2391019974,-32.769514,-70.703814],[2391020972,-32.769255,-70.703584]]},{"key":"R60:PANQUEHUE","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Lateral Panquehue","kind":"lateral","normal":2300,"punta":3450,"peak":"r60","free":null,"nodes":[[6326595641,-32.760209,-70.828352],[6326595642,-32.760279,-70.828287]]},{"key":"R60:LAPALMA","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Lateral La Palma","kind":"lateral","normal":2050,"punta":3100,"peak":"r60","free":null,"nodes":[[2372472714,-32.875537,-71.231631],[2372472658,-32.875029,-71.230781]]},{"key":"R60:SANISIDRO","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Lateral San Isidro","kind":"lateral","normal":2050,"punta":3100,"peak":"r60","free":null,"nodes":[[1462311530,-32.901303,-71.245815],[1462325851,-32.902746,-71.249396]]},{"key":"R60:QPONIENTE","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Lateral Quillota Poniente","kind":"lateral","normal":3050,"punta":4600,"peak":"r60","free":null,"nodes":[[9714023298,-32.927381,-71.286487]]},{"key":"R60:QUILLOTA","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Troncal Quillota","kind":"troncal","normal":5350,"punta":8050,"peak":"r60","free":null,"nodes":[[269817031,-32.934973,-71.288251],[311548941,-32.93498,-71.288361]]},{"key":"R60:LAURELES","highway":"Autopista Los Andes (Ruta 60-CH)","name":"Lateral Los Laureles","kind":"lateral","normal":2050,"punta":3100,"peak":"r60","free":null,"nodes":[[411093652,-32.972114,-71.300955],[2337678382,-32.97335,-71.302674]]},{"key":"NA:LASVEGAS","highway":"Ruta 5 Norte (Nueva Aconcagua)","name":"Plaza de peaje Las Vegas (Llay Llay)","kind":"troncal","normal":2900,"punta":null,"peak":null,"free":null,"nodes":[[14115251545,-32.844016,-70.989277],[14115251546,-32.843559,-70.989179],[14115251521,-32.840633,-71.029466],[14115251522,-32.840483,-71.029432]]},{"key":"NA:ELMELON","highway":"Ruta 5 Norte (Nueva Aconcagua)","name":"Túnel El Melón","kind":"troncal","normal":2900,"punta":null,"peak":null,"free":null,"nodes":[[289393693,-32.629653,-71.230569],[289394039,-32.629614,-71.230857],[9922542378,-32.629664,-71.230794],[9922542380,-32.629687,-71.230671]]},{"key":"R78:POMAIRE","highway":"Ruta 78","name":"Pomaire","kind":"troncal","normal":599,"punta":898.5,"peak":"r78","free":null,"nodes":[[12511401284,-33.669425,-71.150747],[9008699779,-33.669301,-71.150724]]},{"key":"R78:PUANGUE","highway":"Ruta 78","name":"Puangue","kind":"troncal","normal":1161,"punta":1741.5,"peak":"r78","free":null,"nodes":[[12511410971,-33.647546,-71.360291],[12511410970,-33.647476,-71.360178]]},{"key":"R5S:ANGOSTURA","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Troncal Nueva Angostura","kind":"troncal","normal":3800,"punta":null,"peak":null,"free":"R5S","nodes":[[4249905414,-33.907806,-70.73144],[4503134946,-33.907402,-70.730908],[5008518142,-33.907615,-70.731267],[5008518144,-33.9076,-70.731062]]},{"key":"R5S:PAINE","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Paine","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[310962195,-33.822059,-70.751439],[310962046,-33.818407,-70.751252]]},{"key":"R5S:CHAMPA","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Hospital - Champa","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[310964816,-33.852205,-70.748769]]},{"key":"R5S:RANCAGUA-N","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Rancagua Norte","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[314508313,-34.037618,-70.705914]]},{"key":"R5S:RANCAGUA","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Rancagua - Doñihue","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[694519307,-34.18092,-70.790648],[1180098111,-34.183931,-70.788434]]},{"key":"R5S:REQUINOA","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Requínoa","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1197290227,-34.281973,-70.818679],[1197293536,-34.288986,-70.821905]]},{"key":"R5S:ROSARIO","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Rosario","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1197204235,-34.34667,-70.840725],[1197291417,-34.34597,-70.840755]]},{"key":"R5S:RENGO","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Rengo - Malloa","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1136582956,-34.403547,-70.873365],[1136582973,-34.400011,-70.871746]]},{"key":"R5S:PELEQUEN","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Pelequén","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[700672595,-34.465977,-70.897147],[700672458,-34.465564,-70.898352]]},{"key":"R5S:ELTAMBO","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral El Tambo","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[726965010,-34.552804,-70.961795],[726966165,-34.551701,-70.961434]]},{"key":"R5S:SANFERNANDO","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral San Fernando","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[243658123,-34.572124,-70.972746],[726965123,-34.574384,-70.972747],[2620071295,-34.590528,-70.9695]]},{"key":"R5S:BELLAVISTA","highway":"Ruta 5 Sur (Ruta del Maipo)","name":"Lateral Sierras de Bellavista","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[9493843494,-34.595118,-70.973241],[6119860277,-34.594025,-70.973092]]},{"key":"IQ:R16","highway":"Acceso Iquique","name":"Troncal Ruta 16 (Alto Hospicio)","kind":"troncal","normal":2350,"punta":null,"peak":null,"free":"","nodes":[[6630779555,-20.21606,-69.903442],[6630779556,-20.216173,-69.903414]]},{"key":"IQ:R1","highway":"Acceso Iquique","name":"Troncal Ruta 1","kind":"troncal","normal":1550,"punta":null,"peak":null,"free":"","nodes":[[1573336768,-20.495595,-70.161717],[2281476484,-20.495615,-70.161594]]},{"key":"LOA:CBAYOS","highway":"Rutas del Loa (Ruta 25)","name":"Cerritos Bayos","kind":"troncal","normal":3350,"punta":null,"peak":null,"free":"","nodes":[[12050978848,-22.695745,-69.188534],[12050978852,-22.695814,-69.188364]]},{"key":"ANT:R1","highway":"Autopista Región de Antofagasta","name":"Troncal Ruta 1","kind":"troncal","normal":1700,"punta":null,"peak":null,"free":"","nodes":[[1919595942,-23.310564,-70.419055],[1919595943,-23.310605,-70.418984]]},{"key":"ANT:AERO","highway":"Autopista Región de Antofagasta","name":"Acceso Aeropuerto","kind":"lateral","normal":1150,"punta":null,"peak":null,"free":"","nodes":[[12413749923,-23.451511,-70.431208],[1975916928,-23.451562,-70.43122]]},{"key":"ANT:R5","highway":"Autopista Región de Antofagasta","name":"Troncal Ruta 5","kind":"troncal","normal":2850,"punta":null,"peak":null,"free":"","nodes":[[3479601467,-23.453842,-70.125186],[3479601468,-23.453956,-70.125175]]},{"key":"VC:PVIEJO","highway":"Ruta 5 Norte (Vallenar - Caldera)","name":"Troncal Puerto Viejo","kind":"troncal","normal":1750,"punta":null,"peak":null,"free":"","nodes":[[1938951638,-27.348174,-70.636375],[1938951646,-27.348294,-70.636334]]},{"key":"VC:TOTORAL","highway":"Ruta 5 Norte (Vallenar - Caldera)","name":"Troncal Totoral","kind":"troncal","normal":2900,"punta":null,"peak":null,"free":"","nodes":[[1949636338,-27.997073,-70.565916],[1949636339,-27.997114,-70.565755]]},{"key":"LSV:CACHIYUYO","highway":"Ruta 5 Norte (La Serena - Vallenar)","name":"Troncal Cachiyuyo","kind":"troncal","normal":3150,"punta":null,"peak":null,"free":"","nodes":[[3359418518,-29.086711,-70.917138],[4340572600,-29.08674,-70.916949]]},{"key":"LSV:PCOLORADA","highway":"Ruta 5 Norte (La Serena - Vallenar)","name":"Troncal Punta Colorada","kind":"troncal","normal":3150,"punta":null,"peak":null,"free":"","nodes":[[4291821777,-29.371009,-71.073152],[4340554528,-29.371105,-71.073083]]},{"key":"R43:LASCARDAS","highway":"Ruta 43 (La Serena - Ovalle)","name":"Troncal Las Cardas","kind":"troncal","normal":3700,"punta":null,"peak":null,"free":"","nodes":[[4491781304,-30.330342,-71.244131],[5768578088,-30.330357,-71.244256]]},{"key":"ELQ:GUANAQUEROS","highway":"Ruta 5 Norte (Los Vilos - La Serena)","name":"Lateral Guanaqueros","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":"","nodes":[[959025845,-30.19738,-71.387961]]},{"key":"ELQ:TONGOY","highway":"Ruta 5 Norte (Los Vilos - La Serena)","name":"Lateral Tongoy","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":"","nodes":[[959025978,-30.351708,-71.432331]]},{"key":"ELQ:NORTE","highway":"Ruta 5 Norte (Los Vilos - La Serena)","name":"Troncal Norte (Tongoy)","kind":"troncal","normal":4250,"punta":null,"peak":null,"free":"","nodes":[[1970134247,-30.408191,-71.445538],[1970135049,-30.408219,-71.445402]]},{"key":"ELQ:OVALLE","highway":"Ruta 5 Norte (Los Vilos - La Serena)","name":"Lateral Ovalle (Ruta 45)","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":"","nodes":[[1001230974,-30.707482,-71.488889]]},{"key":"ELQ:SUR","highway":"Ruta 5 Norte (Los Vilos - La Serena)","name":"Troncal Sur (Puerto Oscuro)","kind":"troncal","normal":4250,"punta":null,"peak":null,"free":"","nodes":[[1450348598,-31.420145,-71.570709],[1450353534,-31.420199,-71.570835]]},{"key":"ELQ:COMBARBALA","highway":"Ruta 5 Norte (Los Vilos - La Serena)","name":"Lateral Combarbalá (Ruta D-71)","kind":"lateral","normal":1100,"punta":null,"peak":null,"free":"","nodes":[[1975904302,-31.44608,-71.56125]]},{"key":"NA:PICHIDANGUI","highway":"Ruta 5 Norte","name":"Troncal Pichidangui","kind":"troncal","normal":2900,"punta":null,"peak":null,"free":"","nodes":[[1502159456,-32.174895,-71.521059],[1502159436,-32.174962,-71.520674],[14115636731,-32.175347,-71.520935],[14115636738,-32.17532,-71.521041]]},{"key":"NP:NOGALES","highway":"Camino Nogales - Puchuncaví","name":"Troncal Nogales","kind":"troncal","normal":1950,"punta":null,"peak":null,"free":"","nodes":[[279071594,-32.753036,-71.253196],[10848061260,-32.753301,-71.252959],[10847869518,-32.753365,-71.2533],[10848061311,-32.753013,-71.252912]],"note":"en horario punta $3.900"},{"key":"NP:BYPASS","highway":"Camino Nogales - Puchuncaví","name":"Bypass Puchuncaví","kind":"troncal","normal":500,"punta":null,"peak":null,"free":"","nodes":[[13382276202,-32.714329,-71.440055],[13382276203,-32.714437,-71.439658],[13382272800,-32.714132,-71.439866],[13382276201,-32.714406,-71.439823]],"note":"en horario punta $1.000"},{"key":"LC:F90","highway":"Red Vial Litoral Central","name":"Troncal Ruta F-90","kind":"troncal","normal":1950,"punta":null,"peak":null,"free":"","nodes":[[2451587257,-33.400596,-71.497672]],"note":"en horario punta $2.900"},{"key":"LC:F965","highway":"Red Vial Litoral Central","name":"Troncal F-965-G","kind":"troncal","normal":1300,"punta":null,"peak":null,"free":"","nodes":[[286402239,-33.471637,-71.473219]]},{"key":"LC:F94","highway":"Red Vial Litoral Central","name":"Troncal Sector 1 (Nuevo Camino Costero)","kind":"troncal","normal":4100,"punta":null,"peak":null,"free":"","nodes":[[286405164,-33.48246,-71.581703]]},{"key":"LC:LASCRUCES","highway":"Red Vial Litoral Central","name":"Lateral Las Cruces","kind":"lateral","normal":850,"punta":null,"peak":null,"free":"","nodes":[[1438009145,-33.472964,-71.599221]]},{"key":"VM:MELIPILLA","highway":"Variante Melipilla","name":"Troncal Variante Melipilla","kind":"troncal","normal":3900,"punta":null,"peak":null,"free":"","nodes":[[889424786,-33.673356,-71.167637]]},{"key":"R5S:L-SFSUR","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral San Fernando Sur","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1131731427,-34.60568,-70.983124],[1131731422,-34.607718,-70.984086]]},{"key":"R5S:L-CHIMBARONGO","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Chimbarongo","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1131764742,-34.714321,-71.030564]]},{"key":"R5S:QUINTA","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Troncal Quinta","kind":"troncal","normal":3800,"punta":null,"peak":null,"free":"","nodes":[[5463432177,-34.79606,-71.048489],[9438229387,-34.796225,-71.047935],[4896317197,-34.800652,-71.049635],[4896317049,-34.796102,-71.048162],[10282781463,-34.796083,-71.048305]]},{"key":"R5S:L-TENO","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Teno","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[566750888,-34.883785,-71.150528]]},{"key":"R5S:L-CURICO-N","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Curicó Norte","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[3044494467,-34.976611,-71.205738],[302481769,-34.982717,-71.215052]]},{"key":"R5S:L-CURICO","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Curicó","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[302481517,-34.99396,-71.232402]]},{"key":"R5S:L-CURICO-S","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Curicó Sur","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[302520886,-35.049183,-71.280033],[302520255,-35.050782,-71.282286]]},{"key":"R5S:L-LONTUE","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Lontué","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1172468602,-35.093077,-71.318112],[1172468534,-35.095577,-71.319602]]},{"key":"R5S:L-MOLINA","highway":"Ruta 5 Sur (Santiago - Talca)","name":"Lateral Molina","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"R5S","nodes":[[1743802090,-35.133437,-71.35469]]},{"key":"TCH:RIOCLARO","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Troncal Río Claro","kind":"troncal","normal":3300,"punta":null,"peak":null,"free":"","nodes":[[10282827208,-35.209602,-71.411513],[10282827909,-35.209853,-71.411092],[268896769,-35.209663,-71.411335],[1551964055,-35.209735,-71.411207]]},{"key":"TCH:L-TALCA-N","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Talca Norte","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[967459410,-35.489366,-71.659271]]},{"key":"TCH:L-TALCA","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Talca","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[664173553,-35.521282,-71.676707]]},{"key":"TCH:L-TALCA-S","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Talca Sur","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[2563054763,-35.566234,-71.698011],[4700308404,-35.577199,-71.706641]]},{"key":"TCH:L-MAULE","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Maule","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[614533211,-35.600938,-71.706395],[614532084,-35.633676,-71.706645]]},{"key":"TCH:L-SANJAVIER","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral San Javier","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1552704940,-35.694987,-71.68617]]},{"key":"TCH:L-VILLAALEGRE","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Villa Alegre","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1917607498,-35.837108,-71.631851]]},{"key":"TCH:RETIRO","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Troncal Retiro","kind":"troncal","normal":3300,"punta":null,"peak":null,"free":"","nodes":[[10282922115,-36.009054,-71.732662],[10282922114,-36.009325,-71.732221],[10282922112,-36.009234,-71.732355],[10282922113,-36.009152,-71.732504]]},{"key":"TCH:L-PARRAL","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Parral","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[636161562,-36.157235,-71.81389]]},{"key":"TCH:L-SANCARLOS-N","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral San Carlos Norte","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[310364143,-36.414122,-71.94597]]},{"key":"TCH:L-SANCARLOS","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral San Carlos","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[308525663,-36.439987,-71.962482]]},{"key":"TCH:L-COCHARCAS","highway":"Ruta 5 Sur (Talca - Chillán)","name":"Lateral Cocharcas","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[4505353301,-36.524459,-72.072423]]},{"key":"CHC:L-CHILLAN","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Chillán","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[266072602,-36.559281,-72.095178]]},{"key":"CHC:L-CHILLAN-S","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Chillán Sur","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[300780398,-36.625933,-72.160539]]},{"key":"CHC:L-BULNES","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Bulnes","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[968141993,-36.722996,-72.274406],[1768291863,-36.747784,-72.285426],[303533842,-36.755814,-72.29531]]},{"key":"CHC:SANTACLARA","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Troncal Santa Clara","kind":"troncal","normal":3400,"punta":null,"peak":null,"free":"","nodes":[[327815169,-36.909286,-72.34237],[327815183,-36.909353,-72.341925],[11620106553,-36.90949,-72.342112],[11620106554,-36.909469,-72.342253]]},{"key":"CHC:L-CABRERO","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Cabrero","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[985870804,-37.044097,-72.371628]]},{"key":"CHC:L-LAJA","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Laja","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1876506401,-37.173878,-72.391654]]},{"key":"CHC:L-LIMA","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Lima","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1043963139,-37.234609,-72.36916]]},{"key":"CHC:L-RARINCO","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Rarinco","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1071540137,-37.388644,-72.361392],[1071540017,-37.390908,-72.361518]]},{"key":"CHC:L-MDOLORES","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral María Dolores","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1044171079,-37.438419,-72.39661],[1044170677,-37.442772,-72.399496]]},{"key":"CHC:L-LOSANGELES","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Los Ángeles","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1028608662,-37.481763,-72.405178],[1028608420,-37.485974,-72.404196]]},{"key":"CHC:L-LOSANGELES-S","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Los Ángeles Sur","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1028381887,-37.531588,-72.32506],[1037850025,-37.531878,-72.32802]]},{"key":"CHC:L-MULCHEN","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Mulchén","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[1357203481,-37.704223,-72.257473]]},{"key":"CHC:LASMAICAS","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Troncal Las Maicas","kind":"troncal","normal":3400,"punta":null,"peak":null,"free":"","nodes":[[327686761,-37.806423,-72.331025],[327686771,-37.806641,-72.33076],[11620105900,-37.806601,-72.330864],[11620105901,-37.806513,-72.33094]]},{"key":"CHC:L-COLLIPULLI","highway":"Ruta 5 Sur (Chillán - Collipulli)","name":"Lateral Collipulli","kind":"lateral","normal":800,"punta":null,"peak":null,"free":"","nodes":[[5891871618,-37.853471,-72.396516]]},{"key":"CT:L-ERCILLA","highway":"Ruta 5 Sur (Collipulli - Temuco)","name":"Lateral Ercilla","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1915926904,-38.237956,-72.355913]]},{"key":"CT:L-PAILAHUEQUE","highway":"Ruta 5 Sur (Collipulli - Temuco)","name":"Lateral Pailahueque","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1928059436,-38.251117,-72.359127]]},{"key":"CT:PUA","highway":"Ruta 5 Sur (Collipulli - Temuco)","name":"Troncal Púa","kind":"troncal","normal":3600,"punta":null,"peak":null,"free":"","nodes":[[1167950893,-38.362812,-72.386019],[327802632,-38.362824,-72.385891]]},{"key":"CT:L-PERQUENCO","highway":"Ruta 5 Sur (Collipulli - Temuco)","name":"Lateral Perquenco","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1738234909,-38.522351,-72.456262]]},{"key":"CT:L-LAUTARO","highway":"Ruta 5 Sur (Collipulli - Temuco)","name":"Lateral Lautaro","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1167950721,-38.547038,-72.457688]]},{"key":"CT:L-TEMUCO-N","highway":"Ruta 5 Sur (Collipulli - Temuco)","name":"Lateral Temuco Norte","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[380049058,-38.664489,-72.488775]]},{"key":"TRB:L-TEMUCO-S","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Lateral Temuco Sur","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[939364985,-38.77515,-72.581283]]},{"key":"TRB:L-LICANCO","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Lateral Licanco","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[380161463,-38.782385,-72.611686]]},{"key":"TRB:QUEPE","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Troncal Quepe","kind":"troncal","normal":3600,"punta":null,"peak":null,"free":"","nodes":[[327784037,-38.915745,-72.624257],[539094675,-38.915775,-72.624017]]},{"key":"TRB:L-FREIRE","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Lateral Freire","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[804034814,-38.991293,-72.646876]]},{"key":"TRB:L-LONCOCHE","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Lateral Loncoche","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[979045538,-39.358835,-72.639728],[1815464312,-39.359334,-72.620928]]},{"key":"TRB:L-LANCO-N","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Lateral Lanco","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1168824772,-39.442302,-72.771481]]},{"key":"TRB:LANCO","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Troncal Lanco","kind":"troncal","normal":3600,"punta":null,"peak":null,"free":"","nodes":[[1168824970,-39.480365,-72.806531],[1168823913,-39.480405,-72.80634]]},{"key":"TRB:L-PAILLACO","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Lateral Paillaco","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[960933812,-40.087391,-72.864659]]},{"key":"TRB:LAUNION","highway":"Ruta 5 Sur (Temuco - Río Bueno)","name":"Troncal La Unión","kind":"troncal","normal":3600,"punta":null,"peak":null,"free":"","nodes":[[1169043544,-40.228106,-72.938861],[1169043525,-40.228159,-72.938711]]},{"key":"RBPM:L-RIOBUENO","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Río Bueno","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1424652327,-40.322137,-72.986786]]},{"key":"RBPM:L-OSORNO-N","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Osorno Norte","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1169052238,-40.413107,-73.001714]]},{"key":"RBPM:L-PILAUCO","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Osorno (Pilauco)","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[303929417,-40.561913,-73.10036]]},{"key":"RBPM:L-OSORNO","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Osorno","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[2444845826,-40.579419,-73.098143],[270891412,-40.583851,-73.097648],[270892686,-40.590036,-73.098055],[270893651,-40.594831,-73.09911]]},{"key":"RBPM:L-RIONEGRO","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Río Negro","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[271073049,-40.808509,-73.167507]]},{"key":"RBPM:L-PURRANQUE","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Purranque","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1474285645,-40.901401,-73.152246]]},{"key":"RBPM:CUATROVIENTOS","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Troncal Cuatro Vientos","kind":"troncal","normal":3600,"punta":null,"peak":null,"free":"","nodes":[[1169173370,-40.959093,-73.13386],[1169173374,-40.959117,-73.133997]]},{"key":"RBPM:L-FRESIA","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Fresia","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1169178315,-41.009143,-73.120332]]},{"key":"RBPM:L-FRUTILLAR","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Frutillar","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1021788130,-41.120083,-73.062558]]},{"key":"RBPM:L-LLANQUIHUE","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Llanquihue","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[272205104,-41.214549,-73.055946],[801676737,-41.219311,-73.052557]]},{"key":"RBPM:L-PVARAS-N","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Puerto Varas Norte","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[801247271,-41.2547,-73.023277],[801247129,-41.256259,-73.020461]]},{"key":"RBPM:L-PVARAS","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Puerto Varas","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[801260694,-41.272176,-73.007425],[800117192,-41.276747,-73.007361]]},{"key":"RBPM:L-ALERCE","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Lateral Alerce","kind":"lateral","normal":900,"punta":null,"peak":null,"free":"","nodes":[[1141577732,-41.316323,-73.01074],[610664957,-41.319802,-73.007608]]},{"key":"RBPM:BYPASS","highway":"Ruta 5 Sur (Río Bueno - Puerto Montt)","name":"Troncal By Pass Puerto Montt","kind":"troncal","normal":1100,"punta":null,"peak":null,"free":"","nodes":[[1887510312,-41.438455,-72.956634],[812339606,-41.438497,-72.956409],[267231332,-41.439101,-72.956037]]},{"key":"PMP:L-TRAPEN","highway":"Ruta 5 Sur (Puerto Montt - Pargua)","name":"Lateral Trapén","kind":"lateral","normal":850,"punta":null,"peak":null,"free":"","nodes":[[2972280091,-41.516688,-73.078186],[2963473313,-41.516979,-73.077778]]},{"key":"PMP:L-1","highway":"Ruta 5 Sur (Puerto Montt - Pargua)","name":"Lateral Puerto Montt - Pargua","kind":"lateral","normal":650,"punta":null,"peak":null,"free":"","nodes":[[2899126820,-41.58903,-73.233472],[2899136716,-41.589405,-73.233298]],"note":"lateral de $650 a $1.450 según la salida"},{"key":"PMP:TRONCAL","highway":"Ruta 5 Sur (Puerto Montt - Pargua)","name":"Troncal Puerto Montt - Pargua","kind":"troncal","normal":3100,"punta":null,"peak":null,"free":"","nodes":[[2899137037,-41.616994,-73.27386],[2899137036,-41.617085,-73.273707]]},{"key":"PMP:L-2","highway":"Ruta 5 Sur (Puerto Montt - Pargua)","name":"Lateral Puerto Montt - Pargua","kind":"lateral","normal":650,"punta":null,"peak":null,"free":"","nodes":[[8954761153,-41.723446,-73.374003]],"note":"lateral de $650 a $1.450 según la salida"},{"key":"ITA:AGUAAMARILLA","highway":"Autopista del Itata (Ruta 152)","name":"Troncal Agua Amarilla","kind":"troncal","normal":4400,"punta":null,"peak":null,"free":"","nodes":[[323201402,-36.72999,-72.860209],[267235510,-36.73008,-72.860217]]},{"key":"ITA:RAFAEL","highway":"Autopista del Itata (Ruta 152)","name":"Lateral Rafael","kind":"lateral","normal":1700,"punta":null,"peak":null,"free":"","nodes":[[1166158995,-36.728327,-72.865645],[1166159006,-36.728414,-72.865382]]},{"key":"ITA:NUEVAALDEA","highway":"Autopista del Itata (Ruta 152)","name":"Lateral Nueva Aldea","kind":"lateral","normal":1000,"punta":null,"peak":null,"free":"","nodes":[[538935918,-36.65835,-72.457709],[538935961,-36.659723,-72.457296]]},{"key":"IP:TALCAHUANO","highway":"Ruta Interportuaria","name":"Talcahuano","kind":"troncal","normal":1750,"punta":null,"peak":null,"free":"","nodes":[[304476315,-36.732714,-73.088227]],"note":"en horario punta $2.500"},{"key":"IP:PENCO","highway":"Ruta Interportuaria","name":"Penco","kind":"troncal","normal":1750,"punta":null,"peak":null,"free":"","nodes":[[6781610121,-36.75793,-73.011316]],"note":"en horario punta $2.500"},{"key":"IP:AEROPUERTO","highway":"Ruta Interportuaria","name":"Aeropuerto (Alessandri)","kind":"troncal","normal":1750,"punta":null,"peak":null,"free":"","nodes":[[323555648,-36.76932,-73.050699]],"note":"desde Penco $1.250; en horario punta $2.500"},{"key":"CC:HUINANCO","highway":"Autopista Concepción - Cabrero (Ruta 146)","name":"Troncal Huinanco","kind":"troncal","normal":3900,"punta":null,"peak":null,"free":"","nodes":[[5151082242,-36.960264,-72.728382],[5151082243,-36.960358,-72.728407]]},{"key":"CC:PUENTESNEGROS","highway":"Autopista Concepción - Cabrero (Ruta 146)","name":"Troncal Puentes Negros","kind":"troncal","normal":550,"punta":null,"peak":null,"free":"","nodes":[[6344317505,-37.111213,-72.271352],[5178799370,-37.111343,-72.271411]]},{"key":"R160:CHIVILINGO","highway":"Ruta 160","name":"Chivilingo","kind":"troncal","normal":2750,"punta":null,"peak":null,"free":"","nodes":[[3498336637,-37.149071,-73.174323],[3498336636,-37.14924,-73.174141]]},{"key":"R160:PILPILCO","highway":"Ruta 160","name":"Pilpilco","kind":"troncal","normal":600,"punta":null,"peak":null,"free":"","nodes":[[303534586,-37.574447,-73.41535],[2569095512,-37.574456,-73.415231]]},{"key":"NAH:COIHUE","highway":"Ruta Nahuelbuta (Ruta 180)","name":"Troncal Coihue","kind":"troncal","normal":1300,"punta":null,"peak":null,"free":"","nodes":[[12159040364,-37.557361,-72.580008],[12159040363,-37.557475,-72.579961]]},{"key":"NAH:RENAICO","highway":"Ruta Nahuelbuta (Ruta 180)","name":"Troncal Renaico","kind":"troncal","normal":2250,"punta":null,"peak":null,"free":"","nodes":[[12152931946,-37.674665,-72.595068],[12152931945,-37.674673,-72.595214]]}]
  .map(p => ({ ...p, peakAt: p.peak ? PLAZA_PEAK[p.peak] : null }));
// Price of one pass through a plaza.
export function plazaPrice(p, w, west) {
  const pk = !!(p.peakAt && p.punta && p.peakAt(w, west));
  return { band: pk ? 'punta' : 'normal', amount: pk ? p.punta : p.normal };
}

// ── Acceso Vial Aeropuerto AMB (2026): single TAG price. ─────────────────────────────────────────
const AMB_ROWS = [flat('AMB', 'Acceso Vial Aeropuerto AMB', 'Pórtico Acceso Vial AMB', 889, [6316909495, 10052503573, 10052503576])];

export const TOLL_ROWS = [...AC_ROWS, ...VN_ROWS, ...VS_ROWS, ...CN_ROWS, ...FLAT_ROWS, ...TSC_ROWS, ...AN_ROWS, ...NA_ROWS, ...R68_ROWS, ...R78_ROWS, ...AMB_ROWS];

// ── Américo Vespucio Oriente (AVO I, 2026): charged per trip, by entry and exit gantry. ──────────
// Peak (TBP) Monday to Friday 7:30–9:30 and 17:30–19:30 (not holidays); otherwise TBFP.
export const AVO_NODES = new Map([
  [7857987358, 'P101'], [9193322368, 'P103'], [7858008986, 'P104'], [7857987371, 'P108'], [6876949652, 'P110'],
  [6876949534, 'P201'], [6876949435, 'P203'], [7857987382, 'P205'], [7858008992, 'P209'], [7857987360, 'P210'], [9193205577, 'P211'], [6876949475, 'P212'],
  // AVO gantries the map has without a number.
  [7857987369, ''], [7857987375, ''], [9193098855, ''], [9193389137, ''], [9193389152, ''], [9938078827, ''],
]);
export const AVO_NAMES = { P101: 'Bilbao', P102: 'Martín de Zamora', P103: 'Los Militares', P104: 'Presidente Riesco', P105: 'Salida Kennedy Oriente', P106: 'Salida Kennedy Poniente', P107: 'Kennedy-Vespucio', P108: 'Costanera Norte - Nororiente', P109: 'Pte. Centenario', P110: 'La Pirámide', P111: 'Cerro Colorado', P201: 'C. Empresarial - El Salto', P202: 'Viaducto', P203: 'Costanera Norte Oriente', P204: 'Salida Av. Vitacura', P205: 'Vitacura', P206: 'Kennedy-Vespucio Sur', P209: 'Cristóbal Colón', P210: 'Isabel la Católica', P211: 'Tobalaba', P212: 'Costanera Sur' };
// [entry, exit, TBFP, TBP] for cars.
export const AVO_TRIPS = [
  ['P101', 'P103', 545, 1090], ['P101', 'P111', 644, 1287], ['P101', 'P105', 900, 1799], ['P101', 'P106', 841, 1682], ['P101', 'P108', 983, 1966], ['P101', 'P109', 1269, 2538],
  ['P102', 'P103', 254, 507], ['P102', 'P111', 352, 704], ['P102', 'P105', 608, 1216], ['P102', 'P106', 549, 1099], ['P102', 'P108', 692, 1383], ['P102', 'P109', 978, 1955],
  ['P104', 'P105', 300, 601], ['P104', 'P106', 242, 483], ['P104', 'P108', 384, 767], ['P104', 'P109', 670, 1340],
  ['P107', 'P108', 374, 748], ['P107', 'P109', 660, 1321],
  ['P201', 'P203', 536, 1072], ['P201', 'P212', 765, 1530], ['P201', 'P204', 860, 1720], ['P201', 'P103', 1519, 3038], ['P201', 'P210', 1834, 3667], ['P201', 'P211', 1999, 3998],
  ['P202', 'P203', 704, 1407], ['P202', 'P212', 932, 1865], ['P202', 'P204', 1028, 2056], ['P202', 'P103', 1686, 3373], ['P202', 'P210', 2001, 4002], ['P202', 'P211', 2167, 4333],
  ['P205', 'P103', 468, 936], ['P205', 'P210', 783, 1566], ['P205', 'P211', 948, 1897],
  ['P107', 'P103', 510, 1020], ['P107', 'P210', 824, 1649], ['P107', 'P211', 990, 1980],
  ['P206', 'P210', 645, 1289], ['P206', 'P211', 810, 1620], ['P209', 'P211', 278, 557],
];
export const AVO_PIRAMIDE = { tbfp: 267, tbp: 534 };
export const AVO_PER_KM = { tbfp: 232, tbp: 464 };
export const avoPeak = ({ day, weekday, minute }) => !HOLIDAYS.has(day) && weekday >= 1 && weekday <= 5 && ((minute >= 450 && minute < 570) || (minute >= 1050 && minute < 1170));
export const TOLL_BY_NODE = new Map(TOLL_ROWS.flatMap(r => r.nodes.map(n => [n, r])));

// Chilean public holidays 2026 (they use the holiday column / Sunday rules).
export const HOLIDAYS = new Set(['2026-01-01', '2026-04-03', '2026-04-04', '2026-05-01', '2026-05-21', '2026-06-21', '2026-06-29', '2026-07-16', '2026-08-15', '2026-09-18', '2026-09-19', '2026-10-12', '2026-10-31', '2026-11-01', '2026-12-08', '2026-12-25']);

const toMin = t => { const [a, b] = t.split(':').map(Number); return a * 60 + b; };
const inAny = (list, min) => (list || []).some(r => { const [a, b] = r.split('-'); return min >= toMin(a) && min < toMin(b); });

// Price of one pass: which band applies at that moment (day type + minute of day) and its price.
export function tollPrice(row, { day, weekday, minute }) {
  if (row.peak) return row.peak({ day, weekday, minute }) ? { band: 'punta', amount: row.tbp } : { band: 'normal', amount: row.tbfp };
  const type = HOLIDAYS.has(day) && row.hours.F !== null ? 'F' : weekday === 0 ? 'D' : weekday === 6 ? 'S' : 'L';
  const hrs = (type === 'L' && row.hours[`W${weekday}`]) || row.hours[type] || {};
  if (row.ts && inAny(hrs.ts, minute)) return { band: 'saturacion', amount: row.ts, dayType: type };
  if (row.tbp && inAny(hrs.tbp, minute)) return { band: 'punta', amount: row.tbp, dayType: type };
  return { band: 'normal', amount: row.tbfp, dayType: type };
}

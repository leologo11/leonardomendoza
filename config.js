// Tus datos y tus precios. Cambia solo lo que está entre comillas o los números.
export const CONFIG = {
  nombre: 'Leonardo Mendoza',
  vehiculo: 'Jetour X70 blanca · 7 pasajeros',
  // Foto de la camioneta (déjala en la carpeta img). Vacío ('') = sin foto.
  foto: 'img/x70.png',
  // Tu WhatsApp con código de país, sin + ni espacios (Chile: 569 + tu número).
  whatsapp: '56981430340',

  // Valor por km según el tráfico a la hora de salida.
  tarifas: { alta: 1000, media: 800, baja: 700 },
  // Cuándo es tarifa alta y media (hora de Chile). Todo lo que no está aquí es tarifa baja.
  horarios: {
    habil: { alta: ['07:00-10:00', '17:00-21:00'], media: ['00:00-06:00', '10:00-17:00'] }, // lunes a viernes
    sabado: { media: ['00:00-06:00', '10:00-21:00'] },
    domingo: { media: ['00:00-06:00'] }, // domingos y festivos
  },
  // Viajes largos: desde cierto km, ese tramo se cobra a un % del valor por km.
  // Ej: 120 km = los primeros 30 al 100%, del 30 al 100 al 85% y del 100 en adelante al 75%.
  descuentoKm: [{ desde: 30, pct: 85 }, { desde: 100, pct: 75 }],

  // Precio del viaje = cargo base + los km. Nunca menos que el mínimo.
  cargoBase: 5000,
  minimo: 15000,
  // El precio del viaje se redondea hacia arriba a este múltiplo (1000 = $23.400 → $24.000).
  redondeo: 1000,

  // Suma el TAG y los peajes estimados al total.
  sumarPeajes: true,

  // Solo para ti (modo conductor): tus gastos para saber cuánto te queda.
  rendimientoKmL: 10, // km por litro de tu Jetour
  precioBencina: 1300, // $ por litro
};

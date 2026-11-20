// Tus datos y tus precios. Cambia solo lo que está entre comillas o los números.
export const CONFIG = {
  nombre: 'Leonardo Mendoza',
  // Cómo queda guardado en los contactos del cliente («Guardar contacto»): así te encuentran buscando «Uber».
  nombreContacto: 'Leonardo Uber',
  vehiculo: 'Jetour X70 blanca',
  // Maletas grandes que caben según cuántos pasajeros van (la 3.ª fila se abate). El máximo de pasajeros
  // es el número más alto de esta lista (6 + el conductor = 7 asientos).
  maletas: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 2, 6: 1 },
  // Foto de la camioneta (déjala en la carpeta img). Vacío ('') = sin foto.
  foto: 'img/x70.png',
  // Clave de Google (Places API) para el buscador de direcciones. Vacía = buscador gratis de OpenStreetMap.
  // Es una clave de navegador: debe estar restringida en Google Cloud a conductores.muveapp.cl.
  googleKey: 'AIzaSyDLoKqEMSCRFragtDWRZAn9QeQUgyPUF9E',
  // Tu WhatsApp con código de país, sin + ni espacios (Chile: 569 + tu número).
  whatsapp: '56981430340',
  // Link de Google para que te dejen una reseña (Perfil de Empresa → Pedir reseñas). Vacío ('') = sin botón.
  resenas: 'https://g.page/r/CUe4tSRoDWIJECE/review',

  // Valor por km según la distancia: cada tramo de km a su precio.
  // Ej: 40 km = 15 km a $798 + 15 km a $718 + 10 km a $638.
  // 19-11-2026: bajados 20% (antes 950 / 855 / 760 / 665, alta 950, base 2.000, mínimo 8.000, tramo 5.000)
  // y después subidos 5% (760 / 684 / 608 / 532, alta 760, base 1.600, mínimo 6.400, tramo 4.000).
  porKm: [{ desde: 0, valor: 798 }, { desde: 15, valor: 718 }, { desde: 30, valor: 638 }, { desde: 100, valor: 559 }],

  // En hora punta, o si el viaje parte, para o llega en un lugar concurrido, TODO el viaje va a este valor por km.
  tarifaAlta: 798,
  horaPunta: ['07:00-10:00', '17:00-21:00'], // lunes a viernes (no festivos), hora de Chile
  // Rutas: se muestran 2 (la más rápida, recomendada, y la siguiente). Si la otra demora más, su viaje sube
  // este % de su tiempo extra (50 = la mitad), sin pasar del precio de la más rápida salvo por sus km.
  tiempoExtraPct: 50,

  // Paradas: cada tramo después de una parada se cobra como un viaje aparte (su cargo base y sus km desde
  // el primer tramo de precio), y nunca menos que minimoTramo. Va escondido en el precio del viaje.
  // Además, con paradas nunca cuesta menos que el mismo viaje directo + minimoTramo por parada.
  parada: { minimoTramo: 4200 },

  // Nombre de tu tarifa: sale sobre el precio y en los mensajes («Tarifa XL · hasta 6 pasajeros»).
  // Según cuántos pasajeros van: hasta 4 = Tarifa Black (se compara con Uber Black), 5 o más = Tarifa XL (UberXL).
  // recargoPct = cuánto más cuesta el viaje con esa tarifa (el TAG no cambia).
  tarifas: [
    { hasta: 4, nombre: 'Tarifa Black', uber: 'Uber Black', recargoPct: 0 },
    { hasta: 6, nombre: 'Tarifa XL', uber: 'UberXL', recargoPct: 10 },
  ],
  // Modo conductor: escribes el precio de Uber (Black o XL) y te sugiere este % más barato (redondeado hacia abajo a $500).
  uberDescuentoPct: 10,

  // Recargo de madrugada: si el viaje (o la vuelta) sale en este horario, ese tramo cuesta este % más
  // (también el cargo base y el mínimo). Todos los días, hora de Chile.
  madrugada: { horario: '00:00-06:00', recargoPct: 20 },

  // Botones rápidos bajo «¿Dónde te recojo?» y «¿A dónde vas?»: un toque y queda ese lugar.
  rapidos: [
    { nombre: 'Aeropuerto', lat: -33.39665, lng: -70.7939 }, // Terminal 1 Nacional, Armando Cortínez Oriente 1704
  ],

  // Lugares concurridos: nombre, posición y radio en metros alrededor.
  lugares: [
    { nombre: 'Aeropuerto', lat: -33.3925, lng: -70.7900, radio: 2500 },
    { nombre: 'Estadio Nacional', lat: -33.4644, lng: -70.6106, radio: 700 },
    { nombre: 'Estadio Monumental', lat: -33.5065, lng: -70.6049, radio: 600 },
    { nombre: 'Claro Arena (San Carlos de Apoquindo)', lat: -33.3959, lng: -70.5014, radio: 600 },
    { nombre: 'Movistar Arena / Parque O\'Higgins', lat: -33.4618, lng: -70.6651, radio: 800 },
    { nombre: 'Espacio Riesco', lat: -33.3840, lng: -70.6213, radio: 500 },
    { nombre: 'Costanera Center', lat: -33.4180, lng: -70.6068, radio: 300 },
    { nombre: 'Parque Arauco', lat: -33.4012, lng: -70.5754, radio: 500 },
    { nombre: 'Alto Las Condes', lat: -33.3898, lng: -70.5482, radio: 500 },
    { nombre: 'Mall Plaza Egaña', lat: -33.4527, lng: -70.5698, radio: 400 },
    { nombre: 'Mall Plaza Vespucio', lat: -33.5176, lng: -70.5984, radio: 500 },
    { nombre: 'Mall Florida Center', lat: -33.5108, lng: -70.6055, radio: 400 },
    { nombre: 'Terminales Alameda / Sur / San Borja', lat: -33.4532, lng: -70.6845, radio: 700 },
    { nombre: 'Terminal Los Héroes', lat: -33.4445, lng: -70.6586, radio: 300 },
    { nombre: 'Plaza de Armas', lat: -33.4374, lng: -70.6513, radio: 400 },
    { nombre: 'Cerro San Cristóbal (Pío Nono)', lat: -33.4342, lng: -70.6357, radio: 400 },
  ],

  // Precio del viaje = cargo base + los km. Nunca menos que el mínimo.
  cargoBase: 1680,
  minimo: 6720,
  // El precio del viaje se redondea hacia arriba a este múltiplo (1000 = $23.400 → $24.000).
  redondeo: 1000,

  // Suma el TAG y los peajes estimados al total.
  sumarPeajes: true,

  // Solo para ti (modo conductor): tus gastos para saber cuánto te queda.
  rendimientoKmL: 10, // km por litro de tu Jetour
  precioBencina: 1300, // $ por litro
};

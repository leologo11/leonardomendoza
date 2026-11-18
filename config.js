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

  // Valor por km según la distancia: cada tramo de km a su precio.
  // Ej: 40 km = 15 km a $950 + 15 km a $855 + 10 km a $760.
  porKm: [{ desde: 0, valor: 950 }, { desde: 15, valor: 855 }, { desde: 30, valor: 760 }, { desde: 100, valor: 665 }],

  // En hora punta, o si el viaje parte, para o llega en un lugar concurrido, TODO el viaje va a este valor por km.
  tarifaAlta: 950,
  horaPunta: ['07:00-10:00', '17:00-21:00'], // lunes a viernes (no festivos), hora de Chile
  // Rutas: se muestran hasta 3 (la más rápida, otras y una sin TAG si existe). Si una demora más que la
  // más rápida, su viaje sube este % de su tiempo extra (50 = la mitad: 20% más de tiempo → 10% más caro).
  tiempoExtraPct: 50,
  // La ruta sin TAG (o con menos TAG) siempre sale al menos esto más barata que la más rápida.
  menosTag: 1000,

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
  cargoBase: 2000,
  minimo: 8000,
  // El precio del viaje se redondea hacia arriba a este múltiplo (1000 = $23.400 → $24.000).
  redondeo: 1000,

  // Suma el TAG y los peajes estimados al total.
  sumarPeajes: true,

  // Solo para ti (modo conductor): tus gastos para saber cuánto te queda.
  rendimientoKmL: 10, // km por litro de tu Jetour
  precioBencina: 1300, // $ por litro
};

import { ImpostorWord } from '../types';

export interface ImpostorTheme {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

export const RANDOM_THEME = 'Al azar';

export const IMPOSTOR_THEMES: ImpostorTheme[] = [
  { id: 'comida', title: 'Comida', subtitle: 'Antojos, bares y pecados culinarios', color: '#FF7A3D' },
  { id: 'lugares', title: 'Lugares', subtitle: 'Sitios donde siempre pasa algo', color: '#00E8A0' },
  { id: 'profesiones', title: 'Profesiones', subtitle: 'Oficios con historia y drama', color: '#A78BFA' },
  { id: 'animales', title: 'Animales', subtitle: 'Bichos con personalidad', color: '#B8F000' },
  { id: 'objetos', title: 'Objetos', subtitle: 'Cosas del día a día con aura', color: '#FFB020' },
  { id: 'ficcion', title: 'Ficción', subtitle: 'Criaturas, magia y rarezas', color: '#FF6BCB' },
  { id: 'deportes', title: 'Deportes', subtitle: 'Sudor, ranking y excusas', color: '#38BDF8' },
  { id: 'tecnologia', title: 'Tecnología', subtitle: 'Apps, bugs y notificaciones', color: '#5B8CFF' },
  { id: 'viajes', title: 'Viajes', subtitle: 'Maletas, escalas y jet lag', color: '#34D399' },
  { id: 'fiesta', title: 'Fiesta', subtitle: 'Previas, afters y caos controlado', color: '#FF4D6D' },
  { id: 'escuela', title: 'Escuela', subtitle: 'Exámenes, chuletas y recreo', color: '#FBBF24' },
  { id: 'cine', title: 'Cine', subtitle: 'Spoilers, trailers y maratones', color: '#F472B6' },
  { id: 'naturaleza', title: 'Naturaleza', subtitle: 'Clima, paisaje y supervivencia', color: '#4ADE80' },
  { id: 'ciudad', title: 'Ciudad', subtitle: 'Metro, terrazas y obras eternas', color: '#94A3B8' },
  { id: 'musica', title: 'Música', subtitle: 'Playlists, conciertos y earworms', color: '#C084FC' },
  { id: 'hogar', title: 'Hogar', subtitle: 'Sofá, nevera y vecinos', color: '#FB923C' },
  { id: 'espana', title: 'España', subtitle: 'Siesta, tapas y puentes', color: '#F87171' },
];

export const THEME_COLORS: Record<string, string> = {
  [RANDOM_THEME]: '#00D1FF',
  ...Object.fromEntries(IMPOSTOR_THEMES.map((t) => [t.title, t.color])),
};

function words(category: string, list: string[]): ImpostorWord[] {
  return list.map((word, i) => ({
    id: `${category.slice(0, 3).toLowerCase()}${i + 1}`,
    word,
    category,
  }));
}

export const IMPOSTOR_WORDS: ImpostorWord[] = [
  ...words('Comida', [
    'Croqueta', 'Tortilla', 'Bravas', 'Calamares', 'Nocilla', 'Kebab', 'Sushi',
    'Paella', 'Gazpacho', 'Churros', 'Ramen', 'Nachos', 'Vermut', 'Aceitunas',
    'Pulpo', 'Tosta', 'Menú', 'Mixto', 'Falafel', 'Ceviche', 'Batido', 'Gominola',
    'Ibérico', 'Sangría', 'Turrón', 'Aguacate',
  ]),
  ...words('Lugares', [
    'Ikea', 'Aeropuerto', 'Urgencias', 'Biblioteca', 'Parking', 'Terraza',
    'Mercadillo', 'Camping', 'Escape room', 'Lavandería', 'Coworking', 'Spa',
    'Estadio', 'Museo', 'Food court', 'Ascensor', 'Correos', 'Open space',
    'Hostel', 'Discoteca', 'Playa', 'Gimnasio', 'Oficina', 'Supermercado',
    'Autobús',
  ]),
  ...words('Profesiones', [
    'Camarero', 'Influencer', 'DJ', 'Profe', 'Urgenciólogo', 'Repartidor',
    'Cajero', 'Barbero', 'Community', 'Detective', 'Piloto', 'Veterinario',
    'Fotógrafo', 'Guía', 'Dentista', 'Bombero', 'Abogado', 'Chef', 'Actor',
    'Periodista', 'Arquitecto', 'Mago', 'Personal trainer', 'Astronauta',
    'Vendedor',
  ]),
  ...words('Animales', [
    'Mapache', 'Gaviota', 'Perezoso', 'Camaleón', 'Hamster', 'Loro',
    'Pingüino', 'Koala', 'Pulpo', 'Erizo', 'Flamenco', 'Búho', 'Panda',
    'Cisne', 'Ardilla', 'Medusa', 'Abeja', 'Tiburón', 'Delfín', 'Lobo',
    'Cabra', 'Tortuga', 'Gato', 'Perro', 'Zorro',
  ]),
  ...words('Objetos', [
    'Cargador', 'Powerbank', 'Tupper', 'Calcetín', 'Mando', 'Paraguas',
    'AirPods', 'Termo', 'Candado', 'Imán', 'Clip', 'Funda', 'Cojín',
    'Tijeras', 'Espejo', 'Lámpara', 'Bolígrafo', 'Almohada', 'Chubasquero',
    'Bastón selfie', 'Tarjeta', 'Llaves', 'Botella', 'Cinta', 'Mechero',
  ]),
  ...words('Ficción', [
    'Vampiro', 'Zombie', 'Dragón', 'Ninja', 'Alien', 'Fantasma', 'Pirata',
    'Robot', 'Unicornio', 'Sirena', 'Hombre lobo', 'Genio', 'Bruja',
    'Cyborg', 'Kraken', 'Elfo', 'Troll', 'Gárgola', 'Duende', 'Hadita',
    'Centauro', 'Superhéroe', 'Mago', 'Monstruo', 'Golem',
  ]),
  ...words('Deportes', [
    'Pádel', 'CrossFit', 'Yoga', 'Running', 'Surf', 'Futsal', 'Boxeo',
    'Escalada', 'Ski', 'Triatlón', 'Ping-pong', 'Bowling', 'Dardos',
    'Voleibol', 'Minigolf', 'Senderismo', 'Patines', 'Natación', 'Tenis',
    'Fútbol', 'Basket', 'Pilates', 'Karate', 'Bici', 'Spinning',
  ]),
  ...words('Tecnología', [
    'WiFi', 'Captcha', 'Bluetooth', 'Selfie', 'Hashtag', 'Emoji', 'Streak',
    'Algoritmo', 'ChatGPT', 'Autocorrector', 'VPN', 'Streaming', 'Podcast',
    'Drone', 'QR', 'Notificación', 'Buffer', 'Cloud', 'Zoom', 'Mute',
    'AirDrop', 'Screenshot', 'Spam', 'Cookie', 'Update',
  ]),
  ...words('Viajes', [
    'Jet lag', 'Duty free', 'Low cost', 'Escala', 'Pasaporte', 'Maleta',
    'Visa', 'Booking', 'Hostel', 'Crucero', 'Ferry', 'Aduana', 'Souvenir',
    'Mochilero', 'Road trip', 'Boarding', 'Layover', 'Trolley', 'Adaptor',
    'Mapa', 'Taxi', 'Uber', 'Tour', 'All inclusive', 'Check-in',
  ]),
  ...words('Fiesta', [
    'Previa', 'After', 'Resaca', 'Cubata', 'Shot', 'Karaoke', 'Botellón',
    'Photocall', 'Confeti', 'Reggaeton', 'Chupito', 'Glowstick', 'VIP',
    'Portero', 'Pista', 'DJ set', 'Smoke', 'Disfraz', 'Tarta', 'Uber',
    'Lista', 'Entrada', 'Afterparty', 'Chándal', 'Caña',
  ]),
  ...words('Escuela', [
    'Chuleta', 'Examen', 'Recreo', 'Boletín', 'Pupitre', 'Pizarra',
    'Deberes', 'Campus', 'Erasmus', 'Apuntes', 'PowerPoint', 'Tutoría',
    'Laboratorio', 'Comedor', 'Timbre', 'Suplente', 'Recuperación',
    'Exposición', 'Fotocopia', 'Mochila', 'Nota', 'Campus WiFi', 'Seminario',
    'Prácticas', 'Graduación',
  ]),
  ...words('Cine', [
    'Spoiler', 'Trailer', 'Cliffhanger', 'Cameo', 'Remake', 'Binge',
    'Plot twist', 'Oscar', 'Palomitas', 'Secuela', 'Spin-off', 'Doblaje',
    'Créditos', 'Easter egg', 'Director cut', 'Maratón', 'Reality',
    'Opening', 'Casting', 'Blooper', 'Premiere', 'Blockbuster', 'Indie',
    'Soundtrack', 'Post-credits',
  ]),
  ...words('Naturaleza', [
    'Volcán', 'Aurora', 'Tornado', 'Eclipse', 'Glaciar', 'Arrecife',
    'Cascada', 'Oasis', 'Avalancha', 'Géiser', 'Niebla', 'Marea',
    'Arcoíris', 'Selva', 'Desierto', 'Cañón', 'Rocío', 'Rayo',
    'Huracán', 'Floración', 'Arroyo', 'Cueva', 'Hongo', 'Atardecer',
    'Arena',
  ]),
  ...words('Ciudad', [
    'Metro', 'Semáforo', 'Terraza', 'Grafiti', 'Uber', 'Bici',
    'Azotea', 'Andén', 'Obras', 'Parking', 'Kiosko', 'Fuente',
    'Coworking', 'Food truck', 'Rascacielos', 'Peatonal', 'Buzón',
    'Cajero', 'Farmacia', 'Contenedor', 'Puente', 'Plaza', 'Patio',
    'Paso cebra', 'Rotonda',
  ]),
  ...words('Música', [
    'Playlist', 'Earworm', 'Vinilo', 'Remix', 'Festival', 'Karaoke',
    'Wrapped', 'Shuffle', 'Concierto', 'Backstage', 'Cover', 'Acústico',
    'Micrófono', 'Coro', 'Saxofón', 'Batería', 'Guitarra', 'Himno',
    'DJ set', 'Opening', 'Ensayo', 'Entrada', 'Setlist', 'Bis',
    'Vinilo rosa',
  ]),
  ...words('Hogar', [
    'Sofá', 'Nevera', 'Manta', 'Snooze', 'Mando', 'Plantita',
    'Tendedero', 'Microondas', 'Lavavajillas', 'Persiana', 'Felpudo',
    'Aspiradora', 'Balcón', 'Ikea', 'Roomie', 'Calefacción', 'Timbre',
    'Alfombra', 'Armario', 'Ducha', 'Despertador', 'Cojín', 'Enchufe',
    'WiFi piso', 'Cubo',
  ]),
  ...words('España', [
    'Siesta', 'Tapas', 'Vermut', 'Puente', 'Mercadona', 'Sobremesa',
    'Chiringuito', 'Falleras', 'Ibiza', 'Turrón', 'Sangría', 'Aperitivo',
    'Flamenco', 'Jamón', 'Aceite', 'Lotería', 'Semana Santa', 'Feria',
    'San Fermín', 'Tortilla', 'Caña', 'Tapeo', 'Churros', 'Gazpacho',
    'Barrio',
  ]),
];

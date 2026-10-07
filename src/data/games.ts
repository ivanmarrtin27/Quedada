import { Game } from '../types';

export const GAMES: Game[] = [
  {
    id: 'preferencias',
    title: 'Qué Prefieres',
    subtitle: 'Elige entre dos opciones y debate',
    minPlayers: 2,
    maxPlayers: 20,
    color: '#00D1FF',
  },
  {
    id: 'impostor',
    title: 'Impostor',
    subtitle: 'Uno miente. El resto investiga',
    minPlayers: 3,
    maxPlayers: 12,
    color: '#FF4D6D',
  },
  {
    id: 'yoNunca',
    title: 'Yo Nunca',
    subtitle: 'Confiesa… o bebe / pierde punto',
    minPlayers: 3,
    maxPlayers: 20,
    color: '#FFB020',
  },
  {
    id: 'verdadesRetos',
    title: 'Verdades o Retos',
    subtitle: 'El clásico de fiesta, con niveles',
    minPlayers: 3,
    maxPlayers: 16,
    color: '#A78BFA',
  },
  {
    id: 'masProbable',
    title: 'Más Probable Que…',
    subtitle: 'Señala a quien encaje con la frase',
    minPlayers: 3,
    maxPlayers: 16,
    color: '#00E8A0',
  },
];

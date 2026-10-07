import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'clasico',
    title: 'Clásico',
    subtitle: 'Decisiones cotidianas para todos',
    color: '#00D1FF',
  },
  {
    id: 'amigos',
    title: 'Amigos',
    subtitle: 'Ideal para quedar y reírse',
    color: '#A78BFA',
  },
  {
    id: 'parejas',
    title: 'Parejas',
    subtitle: 'Para conoceros un poco más',
    color: '#FF6BCB',
  },
  {
    id: 'locuras',
    title: 'Locuras',
    subtitle: 'Absurdo, raro y muy divertido',
    color: '#FFB020',
  },
  {
    id: 'picante',
    title: 'Picante',
    subtitle: 'Cuando la noche se calienta',
    color: '#FF4D6D',
    ageRestricted: true,
  },
];

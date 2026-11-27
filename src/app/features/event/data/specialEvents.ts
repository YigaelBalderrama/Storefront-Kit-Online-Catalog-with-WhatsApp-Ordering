import { Event } from '../models/event';
export const SPECIAL_EVENTS: readonly Event[] = [
  {
    id: 'Magic the gathering',
    imageLogo: '/images/mtgLogo.svg',
    description: 'Prerealese',
    image: '/images/mtgLorwyn.svg',
  },
  {
    id: 'Pokemon',
    imageLogo: '/images/pokemonLogo.svg',
    days: 'MIERCOLES',
    description: 'Liga Pokemon',
    image: '/images/pokemonLeague.svg',
  },
];

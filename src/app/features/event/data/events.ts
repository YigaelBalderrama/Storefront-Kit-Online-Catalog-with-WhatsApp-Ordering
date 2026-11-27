import { Event } from '../models/event';
export const EVENTS: readonly Event[] = [
  {
    id: 'Pokemon',
    imageLogo: '/images/pokemonLogo.svg',
    days: 'MIERCOLES',
    description: 'Academia + torneo gratuito.',
    image: '/images/pokemonAcademic.svg',
  },
  {
    id: 'Magic the gathering',
    imageLogo: '/images/mtgLogo.svg',
    days: 'JUEVES',
    description: 'Torneo FNM',
    image: '/images/mtgStandard.svg',
  },
  {
    id: 'Magic the gathering',
    imageLogo: '/images/mtgLogo.svg',
    days: 'VIERNES',
    description: 'Torneo DUEL',
    image: '/images/mtgCommander.svg',
  },
  {
    id: 'Pokemon',
    imageLogo: '/images/pokemonLogo.svg',
    days: 'SABADO',
    description: 'Torneo expandido',
    image: '/images/pokemonLogo.svg',
  },
  {
    id: 'Pokemon',
    imageLogo: '/images/pokemonLogo.svg',
    days: 'DOMINGO',
    description: 'Torneo Standard',
    image: '/images/pokemonLogo.svg',
  },
];

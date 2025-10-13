import dogThor from '@/assets/dog-thor.png';
import dogBob from '@/assets/dog-bob.png';
import dogRex from '@/assets/dog-rex.png';
import catLuna from '@/assets/cat-luna.png';
import catMia from '@/assets/cat-mia.png';
import catMel from '@/assets/cat-mel.png';

export interface Pet {
  id: string;
  name: string;
  type: 'cachorro' | 'gato';
  breed: string;
  age: string;
  gender: 'Macho' | 'Fêmea';
  size: 'Pequeno' | 'Médio' | 'Grande';
  vaccinated: boolean;
  neutered: boolean;
  description: string;
  history: string;
  image: string;
}

export const pets: Pet[] = [
  {
    id: '1',
    name: 'Thor',
    type: 'cachorro',
    breed: 'Vira-lata',
    age: '3 anos',
    gender: 'Macho',
    size: 'Grande',
    vaccinated: true,
    neutered: true,
    description: 'Thor é um labrador carinhoso e brincalhão que adora crianças.',
    history: 'Thor foi resgatado das ruas quando ainda era filhote. Ele é muito sociável e se dá bem com outros animais.',
    image: dogThor
  },
  {
    id: '2',
    name: 'Luna',
    type: 'gato',
    breed: 'Vira-lata',
    age: '2 anos',
    gender: 'Fêmea',
    size: 'Pequeno',
    vaccinated: true,
    neutered: true,
    description: 'Luna é uma gatinha tranquila e elegante, perfeita para apartamentos.',
    history: 'Luna foi encontrada abandonada em uma caixa. Hoje é uma gatinha saudável e carinhosa.',
    image: catLuna
  },
  {
    id: '3',
    name: 'Bob',
    type: 'cachorro',
    breed: 'Vira-lata',
    age: '5 anos',
    gender: 'Macho',
    size: 'Médio',
    vaccinated: true,
    neutered: true,
    description: 'Bob é um cachorro calmo e fiel, ideal para famílias.',
    history: 'Bob viveu nas ruas por alguns anos antes de ser resgatado. É muito grato e companheiro.',
    image: dogBob
  },
  {
    id: '4',
    name: 'Mel',
    type: 'gato',
    breed: 'Vira-lata',
    age: '1 ano',
    gender: 'Fêmea',
    size: 'Pequeno',
    vaccinated: true,
    neutered: false,
    description: 'Mel é uma gatinha peluda e super afetuosa.',
    history: 'Mel foi doada por uma família que não podia mais cuidar dela. É muito carinhosa e adora colo.',
    image: catMel
  },
  {
    id: '5',
    name: 'Rex',
    type: 'cachorro',
    breed: 'Vira-lata',
    age: '4 anos',
    gender: 'Macho',
    size: 'Grande',
    vaccinated: true,
    neutered: true,
    description: 'Rex é protetor e leal, ótimo guardião para sua casa.',
    history: 'Rex foi treinado como cão de guarda mas seu antigo dono precisou se mudar. Ele é obediente e inteligente.',
    image: dogRex
  },
  {
    id: '6',
    name: 'Mia',
    type: 'gato',
    breed: 'Vira-lata',
    age: '6 meses',
    gender: 'Fêmea',
    size: 'Pequeno',
    vaccinated: true,
    neutered: false,
    description: 'Mia é uma gatinha brincalhona e cheia de energia.',
    history: 'Mia nasceu na rua e foi resgatada muito novinha. É curiosa e adora brinquedos.',
    image: catMia
  }
];

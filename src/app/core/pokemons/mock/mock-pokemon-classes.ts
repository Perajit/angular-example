import { PokemonClass } from '../pokemon-class.model';

const iconPath = '/assets/images/pokemons';

export default [
  {
    index: 1,
    name: 'Pikachu',
    icon: `${iconPath}/pikachu.png`
  },
  {
    index: 52,
    name: 'Meowth',
    icon: `${iconPath}/meowth.png`
  },
  {
    index: 54,
    name: 'Psyduck',
    icon: `${iconPath}/psyduck.png`
  },
  {
    index: 133,
    name: 'Eevee',
    icon: `${iconPath}/eevee.png`
  },
  {
    index: 149,
    name: 'Dragonite',
    icon: `${iconPath}/dragonite.png`
  },
  {
    index: 150,
    name: 'Mewtwo',
    icon: `${iconPath}/mewtwo.png`
  }
] as PokemonClass[];

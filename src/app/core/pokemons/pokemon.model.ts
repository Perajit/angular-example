export interface PokemonInput {
  name: string;
  class: string;
  cp: number;
}

export interface Pokemon extends PokemonInput {
  id: number;
}

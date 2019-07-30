export interface Pokemon extends PokemonInput {
  id: number;
}

export interface PokemonInput {
  name: string;
  class: string;
  cp: number;
}

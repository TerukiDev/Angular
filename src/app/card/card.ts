export const CATEGORIES = ['Pokemon', 'Trainer', 'Energy'] as const;
export type Category = (typeof CATEGORIES)[number];

export const TYPES = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless'] as const;
export type PokemonType = (typeof TYPES)[number];

export const STAGES = ['Basic', 'Stage 1', 'Stage 2'] as const;
export type Stage = (typeof STAGES)[number];

export const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;
export type Rarity = (typeof RARITIES)[number];

export interface Ability {
  name: string;
  effect: string;
}

export interface Attack {
  name: string;
  cost: PokemonType[];
  damage: string;
  effect: string;
}

export interface Card {
  id: number;
  name: string;
  category: Category;
  type: PokemonType | null;
  stage: Stage | null;
  hp: number | null;
  ability: Ability | null;
  attacks: Attack[];
  weakness: PokemonType | null;
  resistance: PokemonType | null;
  retreat: number | null;
  effect: string | null;
  rarity: Rarity;
  imageUrl: string;
}

export const RARITY_SYMBOLS: Record<Rarity, string> = {
  Common: '●',
  Uncommon: '◆',
  Rare: '★',
};

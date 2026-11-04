export const CATEGORIES = ['Pokemon', 'Trainer', 'Energy'] as const;
export type Category = (typeof CATEGORIES)[number];

export const TYPES = ['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon', 'Colorless'] as const;
export type PokemonType = (typeof TYPES)[number];

export const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;
export type Rarity = (typeof RARITIES)[number];

export interface Card {
  id: number;
  name: string;
  category: Category;
  type: PokemonType | null;
  hp: number | null;
  rarity: Rarity;
  imageUrl: string;
}

export const RARITY_SYMBOLS: Record<Rarity, string> = {
  Common: '●',
  Uncommon: '◆',
  Rare: '★',
};

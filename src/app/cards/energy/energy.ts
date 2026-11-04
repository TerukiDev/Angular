import { Component, computed, input } from '@angular/core';
import { PokemonType } from '../../card/card';

// Element généré par IA
const GLYPHS: Record<PokemonType, string> = {
  Grass: 'M19.5 4C11 4 5.5 8.6 5.5 15.4c0 1.4.3 2.6.9 3.7L4 21.5 5.2 22.7l2.4-2.4c1 .6 2.2.9 3.6.9 6.6 0 8.3-7.4 8.3-17.2z',
  Fire: 'M12.5 2s6 4.8 6 11a6.5 6.5 0 0 1-13 0c0-3.3 2.2-5.6 2.2-5.6s.2 3.3 2.3 3.3C10 6.5 12.5 2 12.5 2z',
  Water: 'M12 2.5s7 7.6 7 12.6a7 7 0 0 1-14 0c0-5 7-12.6 7-12.6z',
  Lightning: 'M13.5 2 4.5 13.5h6L9.5 22l9-11.5h-6z',
  Psychic: 'M12 5.5C6.5 5.5 2.5 12 2.5 12s4 6.5 9.5 6.5 9.5-6.5 9.5-6.5-4-6.5-9.5-6.5zm0 10.2a3.7 3.7 0 1 1 0-7.4 3.7 3.7 0 0 1 0 7.4z',
  Fighting: 'M7 9.5V8a1.8 1.8 0 0 1 3.6 0v-.6a1.8 1.8 0 0 1 3.6 0v.6a1.8 1.8 0 0 1 3.6 0V15a6.5 6.5 0 0 1-6.5 6.5h-.6A5.7 5.7 0 0 1 5 15.8v-3.5a2 2 0 0 1 2-2h3.2v2.4H7z',
  Darkness: 'M15.5 3a9 9 0 1 0 6 15.6A8.2 8.2 0 0 1 15.5 3z',
  Metal: 'M12 2.5 20.3 7.2v9.6L12 21.5l-8.3-4.7V7.2zm0 5.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z',
  Fairy: 'M12 2.5c.9 5.2 3.3 7.6 8.5 8.5-5.2.9-7.6 3.3-8.5 8.5-.9-5.2-3.3-7.6-8.5-8.5 5.2-.9 7.6-3.3 8.5-8.5z',
  Dragon: 'M12 2 18.5 9 15 10.5l4 3.5-7 8-7-8 4-3.5L5.5 9z',
  Colorless: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6l-5.4 2.9 1.2-6-4.5-4.2 6.1-.7z',
};

export function typeColor(type: PokemonType | null | undefined): string {
  return type ? `var(--${type.toLowerCase()})` : 'var(--colorless)';
}

@Component({
  selector: 'app-energy',
  imports: [],
  templateUrl: './energy.html',
  styleUrl: './energy.css',
})
export class Energy {
  readonly type = input.required<PokemonType>();
  protected readonly color = computed(() => typeColor(this.type()));
  protected readonly glyph = computed(() => GLYPHS[this.type()]);
}

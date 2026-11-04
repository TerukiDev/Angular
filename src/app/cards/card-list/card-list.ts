import { Component, computed, inject } from '@angular/core';
import { CATEGORIES, RARITIES, RARITY_SYMBOLS, TYPES } from '../../card/card';
import { CardService } from '../card.service';
import { CollectionService } from '../collection.service';
import { Energy } from '../energy/energy';
import { Filter } from '../filter/filter';
import { SetNumberPipe } from '../set-number.pipe';
import { RouterLink } from '@angular/router';

const OWNERSHIP = ['Owned', 'Missing'];

@Component({
  selector: 'app-card-list',
  imports: [RouterLink, SetNumberPipe, Filter, Energy],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
})
export class CardList {
  private readonly cardService = inject(CardService);
  private readonly collection = inject(CollectionService);

  protected readonly cards = this.cardService.cards;
  protected readonly count = this.cardService.count;
  protected readonly counts = this.collection.counts;
  protected readonly ownedCount = this.collection.ownedCount;

  protected readonly loading = computed(() => this.cardService.loading() || this.collection.loading());
  protected readonly error = computed(() => this.cardService.error() ?? this.collection.error());

  protected readonly progress = computed(() =>
    this.count() ? Math.round((this.ownedCount() / this.count()) * 100) : 0,
  );

  protected readonly ownershipOptions = OWNERSHIP;
  protected readonly rarities = RARITIES;
  protected readonly raritySymbols = RARITY_SYMBOLS;
  protected readonly categories = CATEGORIES;
  
  protected readonly types = computed(() => TYPES.filter((type) => this.cards().some((card) => card.type === type)));

  protected readonly search = this.collection.search;
  protected readonly owned = this.collection.owned;
  protected readonly rarity = this.collection.rarity;
  protected readonly category = this.collection.category;
  protected readonly type = this.collection.type;
  protected readonly hasFilters = this.collection.hasFilters;
  protected readonly view = this.collection.view;

  protected readonly filteredCards = computed(() => {
    const query = this.search().trim().toLowerCase().replace(/^#/, '');
    const isNumber = /^\d+$/.test(query);
    const owned = this.owned();
    const rarity = this.rarity();
    const category = this.category();
    const type = this.type();
    const counts = this.counts();

    return this.cards().filter((card) => {
      if (query && (isNumber ? card.id !== Number(query) : !card.name.toLowerCase().includes(query))) return false;
      if (owned) {
        const isOwned = (counts.get(card.id) ?? 0) > 0;
        if (owned === 'Owned' ? !isOwned : isOwned) return false;
      }
      if (rarity && card.rarity !== rarity) return false;
      if (category && card.category !== category) return false;
      if (type && card.type !== type) return false;
      return true;
    });
  });

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected clearFilters(): void {
    this.collection.clearFilters();
  }

  protected onReload(): void {
    if (this.cardService.error()) this.cardService.loadCards();
    if (this.collection.error()) this.collection.load();
  }
}

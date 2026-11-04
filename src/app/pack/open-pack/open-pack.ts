import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RARITY_SYMBOLS } from '../../card/card';
import { CardService } from '../../cards/card.service';
import { CollectionService } from '../../cards/collection.service';
import { typeColor } from '../../cards/energy/energy';
import { Holo } from '../../cards/holo';
import { SetNumberPipe } from '../../cards/set-number.pipe';
import { PackService } from '../pack.service';

@Component({
  selector: 'app-open-pack',
  imports: [RouterLink, SetNumberPipe, Holo],
  templateUrl: './open-pack.html',
  styleUrl: './open-pack.css',
})
export class OpenPack {
  private readonly cardService = inject(CardService);
  private readonly collection = inject(CollectionService);
  protected readonly pack = inject(PackService);

  protected readonly raritySymbols = RARITY_SYMBOLS;

  protected readonly cards = this.cardService.cards;
  protected readonly total = this.cardService.count;
  protected readonly collected = this.collection.ownedCount;
  protected readonly loading = computed(() => this.cardService.loading() || this.collection.loading());
  protected readonly error = computed(() => this.cardService.error() ?? this.collection.error());

  protected readonly stack = computed(() =>
    this.pack
      .pulled()
      .slice(this.pack.index(), this.pack.index() + 3)
      .map((card, i) => ({ key: this.pack.index() + i, card })),
  );

  protected readonly glow = computed(() => {
    if (this.pack.phase() !== 'revealing') return 'transparent';
    const card = this.pack.current();
    if (!card || !card.type) return 'rgba(200, 200, 210, 0.5)';
    return typeColor(card.type);
  });

  protected readonly leaving = signal(false);

  protected advance(): void {
    if (this.pack.phase() !== 'revealing' || this.leaving()) return;
    this.leaving.set(true);
  }

  protected onCardLeft(): void {
    if (!this.leaving()) return;
    this.leaving.set(false);
    this.pack.next();
  }

  protected onReload(): void {
    if (this.cardService.error()) this.cardService.loadCards();
    if (this.collection.error()) this.collection.load();
  }
}

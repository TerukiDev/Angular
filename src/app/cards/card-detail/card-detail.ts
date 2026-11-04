import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RARITY_SYMBOLS } from '../../card/card';
import { CardService } from '../card.service';
import { CollectionService } from '../collection.service';
import { SetNumberPipe } from '../set-number.pipe';
import { Energy } from '../energy/energy';

@Component({
  selector: 'app-card-detail',
  imports: [RouterLink, SetNumberPipe, Energy],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail {
  private readonly cardService = inject(CardService);
  private readonly collection = inject(CollectionService);

  readonly id = input.required<string>();

  protected readonly raritySymbols = RARITY_SYMBOLS;
  protected readonly loading = computed(() => this.cardService.loading() || this.collection.loading());
  protected readonly error = computed(() => this.cardService.error() ?? this.collection.error());

  protected readonly card = computed(() =>
    this.cardService.cards().find((c) => c.id === Number(this.id())),
  );

  protected readonly owned = computed(() => this.collection.counts().get(Number(this.id())) ?? 0);

  protected range(count: number | null): number[] {
    return Array.from({ length: count ?? 0 }, (_, i) => i);
  }
}
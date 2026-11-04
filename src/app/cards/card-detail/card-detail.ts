import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RARITY_SYMBOLS } from '../../card/card';
import { CardService } from '../card.service';
import { CollectionService } from '../collection.service';
import { SetNumberPipe } from '../set-number.pipe';
import { Energy } from '../energy/energy';
import { Holo } from '../holo';

@Component({
  selector: 'app-card-detail',
  imports: [RouterLink, SetNumberPipe, Energy, Holo],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
})
export class CardDetail {
  private readonly cardService = inject(CardService);
  private readonly collection = inject(CollectionService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly raritySymbols = RARITY_SYMBOLS;
  protected readonly total = this.cardService.count;
  protected readonly loading = computed(() => this.cardService.loading() || this.collection.loading());
  protected readonly error = computed(() => this.cardService.error() ?? this.collection.error());

  protected readonly card = computed(() =>
    this.cardService.cards().find((c) => c.id === Number(this.id())),
  );

  protected readonly owned = computed(() => this.collection.counts().get(Number(this.id())) ?? 0);

  protected readonly confirming = linkedSignal({ source: this.id, computation: () => false });
  protected readonly busy = signal(false);
  protected readonly actionError = linkedSignal<string, string | null>({ source: this.id, computation: () => null });

  protected range(count: number | null): number[] {
    return Array.from({ length: count ?? 0 }, (_, i) => i);
  }

  protected removeOne(): void {
    this.busy.set(true);
    this.actionError.set(null);

    this.collection.removeOne(Number(this.id())).subscribe({
      next: () => this.busy.set(false),
      error: () => {
        this.actionError.set('Could not update your collection. Please try again.');
        this.busy.set(false);
      },
    });
  }

  protected deleteCard(): void {
    this.busy.set(true);
    this.actionError.set(null);

    this.cardService.deleteCard(Number(this.id())).subscribe({
      next: () => this.router.navigate(['/collection']),
      error: () => {
        this.actionError.set('Could not delete the card. Please try again.');
        this.busy.set(false);
      },
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Card } from '../card/card';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/cards';

  private readonly cardsSignal = signal<Card[]>([]);
  private readonly loadingSignal = signal(true);
  private readonly errorSignal = signal<string | null>(null);

  readonly cards = this.cardsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  
  readonly count = computed(() => this.cardsSignal().length);

  constructor() {
    this.loadCards();
  }

  loadCards(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Card[]>(this.apiUrl).subscribe({
      next: (cards) => {
        this.cardsSignal.set(cards);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Failed to load cards. Is the API running on port 3000?');
        this.loadingSignal.set(false);
      },
    });
  }
}   
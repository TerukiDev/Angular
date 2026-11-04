import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { concatMap, Observable, tap } from 'rxjs';
import { Card } from '../card/card';
import { CollectionService } from './collection.service';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly collection = inject(CollectionService);
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

  addCard(card: Omit<Card, 'id'>): Observable<Card> {
    return this.http
      .post<Card>(this.apiUrl, card)
      .pipe(tap((created) => this.cardsSignal.update((cards) => [...cards, created])));
  }

  updateCard(id: number, changes: Partial<Card>): Observable<Card> {
    return this.http
      .patch<Card>(`${this.apiUrl}/${id}`, changes)
      .pipe(tap((updated) => this.cardsSignal.update((cards) => cards.map((card) => (card.id === id ? updated : card)))));
  }

  /** Deletes the card from the set and drops it from the collection. */
  deleteCard(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.cardsSignal.update((cards) => cards.filter((card) => card.id !== id))),
      concatMap(() => this.collection.forget(id)),
    );
  }
}

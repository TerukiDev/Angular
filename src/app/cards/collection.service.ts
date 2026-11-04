import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { concatMap, from, Observable, tap, toArray } from 'rxjs';
import { CollectionEntry } from '../card/card';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/collection';

  private readonly entriesSignal = signal<CollectionEntry[]>([]);
  private readonly loadingSignal = signal(true);
  private readonly errorSignal = signal<string | null>(null);

  readonly entries = this.entriesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly counts = computed(() => new Map(this.entriesSignal().map((entry) => [entry.id, entry.count])));
  readonly ownedCount = computed(() => this.entriesSignal().filter((entry) => entry.count > 0).length);

  readonly search = signal('');
  readonly owned = signal<string | null>(null);
  readonly rarity = signal<string | null>(null);
  readonly category = signal<string | null>(null);
  readonly type = signal<string | null>(null);
  readonly view = signal<'grid' | 'list'>('grid');

  readonly hasFilters = computed(() => !!this.search().trim() || !!this.owned() || !!this.rarity() || !!this.category() || !!this.type());

  constructor() {
    this.load();
  }

  clearFilters(): void {
    this.search.set('');
    this.owned.set(null);
    this.rarity.set(null);
    this.category.set(null);
    this.type.set(null);
  }

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<CollectionEntry[]>(this.apiUrl).subscribe({
      next: (entries) => {
        this.entriesSignal.set(entries);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Failed to load your collection. Is the API running on port 3000?');
        this.loadingSignal.set(false);
      },
    });
  }

  addCards(ids: number[]): Observable<CollectionEntry[]> {
    return from(ids).pipe(
      concatMap((id) => this.setCount(id, (this.counts().get(id) ?? 0) + 1)),
      toArray(),
    );
  }

  setCount(id: number, count: number): Observable<CollectionEntry> {
    const exists = this.entriesSignal().some((entry) => entry.id === id);
    const request = exists
      ? this.http.patch<CollectionEntry>(`${this.apiUrl}/${id}`, { count })
      : this.http.post<CollectionEntry>(this.apiUrl, { id, count });

    return request.pipe(
      tap((saved) =>
        this.entriesSignal.update((entries) =>
          exists ? entries.map((entry) => (entry.id === id ? saved : entry)) : [...entries, saved],
        ),
      ),
    );
  }
}

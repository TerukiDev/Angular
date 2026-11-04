import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Card, Rarity } from '../card/card';
import { CardService } from '../cards/card.service';
import { CollectionService } from '../cards/collection.service';

export type PackPhase = 'sealed' | 'opening' | 'revealing' | 'done';

const PACK: [Rarity, number][] = [
  ['Common', 7],
  ['Uncommon', 3],
  ['Rare', 1],
];

@Injectable({ providedIn: 'root' })
export class PackService {
  private readonly cardService = inject(CardService);
  private readonly collection = inject(CollectionService);

  private readonly phaseSignal = signal<PackPhase>('sealed');
  private readonly pulledSignal = signal<Card[]>([]);
  private readonly newIdsSignal = signal<Set<number>>(new Set());
  private readonly indexSignal = signal(0);
  private readonly errorSignal = signal<string | null>(null);

  readonly phase = this.phaseSignal.asReadonly();
  readonly pulled = this.pulledSignal.asReadonly();
  readonly newIds = this.newIdsSignal.asReadonly();
  readonly index = this.indexSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly current = computed<Card | undefined>(() => this.pulledSignal()[this.indexSignal()]);
  readonly left = computed(() => this.pulledSignal().length - this.indexSignal() - 1);

  private run = 0;
  private torn = false;
  private saved = false;

  constructor() {
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => this.reset());
  }

  open(): void {
    if (this.phaseSignal() === 'opening' || this.phaseSignal() === 'revealing') return;

    const pulled = this.pick();
    const counts = this.collection.counts();
    const run = ++this.run;

    this.pulledSignal.set(pulled);
    this.newIdsSignal.set(new Set(pulled.filter((card) => !counts.get(card.id)).map((card) => card.id)));
    this.indexSignal.set(0);
    this.errorSignal.set(null);
    this.phaseSignal.set('opening');
    this.torn = false;
    this.saved = false;

    this.collection.addCards(pulled.map((card) => card.id)).subscribe({
      next: () => {
        if (run !== this.run) return;
        this.saved = true;
        this.startReveal();
      },
      error: () => {
        if (run !== this.run) return;
        this.reset();
        this.errorSignal.set('Could not save the pack to your collection. Please try again.');
      },
    });
  }

  tearDone(): void {
    this.torn = true;
    this.startReveal();
  }

  next(): void {
    if (this.phaseSignal() !== 'revealing') return;
    if (this.left() > 0) {
      this.indexSignal.update((index) => index + 1);
    } else {
      this.phaseSignal.set('done');
    }
  }

  showAll(): void {
    if (this.phaseSignal() === 'revealing') this.phaseSignal.set('done');
  }

  reset(): void {
    this.run++;
    this.phaseSignal.set('sealed');
    this.pulledSignal.set([]);
    this.newIdsSignal.set(new Set());
    this.indexSignal.set(0);
    this.errorSignal.set(null);
  }

  private startReveal(): void {
    if (this.torn && this.saved && this.phaseSignal() === 'opening') {
      this.phaseSignal.set('revealing');
    }
  }

  private pick(): Card[] {
    return PACK.flatMap(([rarity, amount]) =>
      this.sample(this.cardService.cards().filter((card) => card.rarity === rarity), amount),
    );
  }

  private sample(cards: Card[], amount: number): Card[] {
    const pool = [...cards];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, amount);
  }
}

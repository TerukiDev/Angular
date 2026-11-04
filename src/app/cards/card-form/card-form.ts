import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Attack, CATEGORIES, Card, Category, PokemonType, RARITIES, Rarity, STAGES, Stage, TYPES } from '../../card/card';
import { CardService } from '../card.service';
import { Energy } from '../energy/energy';

const MAX_COST = 5;

function attackForm(attack?: Attack) {
  return new FormGroup({
    name: new FormControl(attack?.name ?? '', { nonNullable: true, validators: Validators.required }),
    cost: new FormControl<PokemonType[]>(attack?.cost ?? [], { nonNullable: true }),
    damage: new FormControl(attack?.damage ?? '', { nonNullable: true }),
    effect: new FormControl(attack?.effect ?? '', { nonNullable: true }),
  });
}

@Component({
  selector: 'app-card-form',
  imports: [ReactiveFormsModule, RouterLink, Energy],
  templateUrl: './card-form.html',
  styleUrl: './card-form.css',
})
export class CardForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cardService = inject(CardService);
  private readonly router = inject(Router);

  readonly id = input<string>();

  protected readonly categories = CATEGORIES;
  protected readonly types = TYPES;
  protected readonly stages = STAGES;
  protected readonly rarities = RARITIES;

  protected readonly loading = this.cardService.loading;
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected readonly isEdit = computed(() => this.id() !== undefined);
  protected readonly card = computed(() => this.cardService.cards().find((card) => card.id === Number(this.id())));

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['Pokemon' as Category],
    type: ['Grass' as PokemonType],
    rarity: ['Common' as Rarity],
    imageUrl: ['', Validators.pattern(/^https?:\/\/.+/)],
    hp: [50, [Validators.required, Validators.min(10)]],
    stage: ['Basic' as Stage],
    weakness: ['' as PokemonType | ''],
    resistance: ['' as PokemonType | ''],
    retreat: [1, [Validators.required, Validators.min(0), Validators.max(4)]],
    abilityName: [''],
    abilityEffect: [''],
    attacks: this.fb.array<ReturnType<typeof attackForm>>([]),
    effect: [''],
  });

  protected readonly attacks = this.form.controls.attacks;
  protected readonly maxCost = MAX_COST;
  protected readonly category = toSignal(this.form.controls.category.valueChanges, {
    initialValue: this.form.controls.category.value,
  });
  protected readonly backLink = computed(() => (this.isEdit() ? ['/cards', this.id()] : ['/collection']));

  private filledId: number | null = null;

  constructor() {
    effect(() => {
      const card = this.card();
      if (card && card.id !== this.filledId) {
        this.filledId = card.id;
        this.fillForm(card);
      }
    });

    const { hp, retreat, attacks } = this.form.controls;
    effect(() => {
      const isPokemon = this.category() === 'Pokemon';
      for (const control of [hp, retreat, attacks]) {
        if (isPokemon) control.enable();
        else control.disable();
      }
    });
  }

  protected addAttack(): void {
    this.attacks.push(attackForm());
  }

  protected addCost(index: number, type: PokemonType): void {
    const cost = this.attacks.at(index).controls.cost;
    if (cost.value.length < MAX_COST) cost.setValue([...cost.value, type]);
  }

  protected removeCost(index: number, position: number): void {
    const cost = this.attacks.at(index).controls.cost;
    cost.setValue(cost.value.filter((_, i) => i !== position));
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);

    const card = this.toCard();
    const request = this.isEdit() ? this.cardService.updateCard(Number(this.id()), card) : this.cardService.addCard(card);

    request.subscribe({
      next: (saved) => this.router.navigate(['/cards', saved.id]),
      error: () => {
        this.submitError.set('Could not save the card. Is the API running on port 3000?');
        this.saving.set(false);
      },
    });
  }

  private fillForm(card: Card): void {
    this.attacks.clear();
    card.attacks.forEach((attack) => this.attacks.push(attackForm(attack)));

    this.form.patchValue({
      name: card.name,
      category: card.category,
      type: card.type ?? 'Grass',
      rarity: card.rarity,
      imageUrl: card.imageUrl,
      hp: card.hp ?? 50,
      stage: card.stage ?? 'Basic',
      weakness: card.weakness ?? '',
      resistance: card.resistance ?? '',
      retreat: card.retreat ?? 1,
      abilityName: card.ability?.name ?? '',
      abilityEffect: card.ability?.effect ?? '',
      effect: card.effect ?? '',
    });
  }

  private toCard(): Omit<Card, 'id'> {
    const value = this.form.getRawValue();
    const isPokemon = value.category === 'Pokemon';

    return {
      name: value.name.trim(),
      category: value.category,
      type: value.category === 'Trainer' ? null : value.type,
      rarity: value.rarity,
      imageUrl: value.imageUrl.trim(),
      hp: isPokemon ? value.hp : null,
      stage: isPokemon ? value.stage : null,
      weakness: (isPokemon && value.weakness) || null,
      resistance: (isPokemon && value.resistance) || null,
      retreat: isPokemon ? value.retreat : null,
      ability: isPokemon && value.abilityName.trim() ? { name: value.abilityName.trim(), effect: value.abilityEffect.trim() } : null,
      attacks: isPokemon ? value.attacks : [],
      effect: isPokemon ? null : value.effect.trim() || null,
    };
  }
}

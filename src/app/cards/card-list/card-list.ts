import { Component, inject } from '@angular/core';
import { CardService } from '../card.service';
import { SetNumberPipe } from '../set-number.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-list',
  imports: [RouterLink, SetNumberPipe],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
})
export class CardList {
  private readonly cardService = inject(CardService);
  protected readonly cards = this.cardService.cards;
  protected readonly count = this.cardService.count;
  protected readonly loading = this.cardService.loading;
  protected readonly error = this.cardService.error;

  protected onReload(): void {
    this.cardService.loadCards();
  }
}
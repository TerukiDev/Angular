import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class Filter {
  readonly label = input.required<string>();
  readonly options = input.required<readonly string[]>();
  readonly symbols = input<Record<string, string>>({});

  readonly selected = input<string | null>(null);
  readonly selectedChange = output<string | null>();

  protected select(option: string | null): void {
    this.selectedChange.emit(option);
  }
}

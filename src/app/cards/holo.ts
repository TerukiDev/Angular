import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appHolo]',
  host: {
    class: 'holo',
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
  },
})
export class Holo {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected onMove(event: PointerEvent): void {
    if (event.pointerType === 'touch') return;

    const rect = this.el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    this.el.classList.add('is-active');
    this.el.style.setProperty('--px', `${x * 100}%`);
    this.el.style.setProperty('--py', `${y * 100}%`);
    this.el.style.setProperty('--rx', `${(0.5 - y) * 16}deg`);
    this.el.style.setProperty('--ry', `${(x - 0.5) * 16}deg`);
  }

  protected onLeave(): void {
    this.el.classList.remove('is-active');
    this.el.style.setProperty('--rx', '0deg');
    this.el.style.setProperty('--ry', '0deg');
  }
}

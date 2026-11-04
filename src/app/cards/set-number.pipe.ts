import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'setNumber' })
export class SetNumberPipe implements PipeTransform {
  transform(id: number): string {
    return String(id).padStart(3, '0');
  }
}
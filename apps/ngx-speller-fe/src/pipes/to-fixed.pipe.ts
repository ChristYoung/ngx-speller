import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toFixed',
  standalone: true,
})
export class ToFixedPipe implements PipeTransform {
  transform(value: string | number, fixedPosition: number): string {
    return typeof value === 'string'
      ? parseFloat(value).toFixed(fixedPosition)
      : Number(value).toFixed(fixedPosition);
  }
}

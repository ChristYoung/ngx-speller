import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter',
  standalone: true,
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  // if the flag is true, then the first letter of the string will be capitalized, otherwise it will return the string as it is.
  transform(value: unknown, flag: boolean): string {
    if (typeof value === 'string' && flag) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value as string;
  }
}

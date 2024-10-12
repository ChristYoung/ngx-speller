import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventButtonDefault]',
  standalone: true,
})
export class PreventButtonDefaultDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'BUTTON' && ['Space', 'Enter', 'NumpadEnter'].includes(event.code)) {
      event.preventDefault(); // Prevent the default action of the button
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.nodeName === 'BUTTON') {
      target.blur();
    }
  }
}

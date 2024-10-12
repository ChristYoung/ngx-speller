import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appHoldKeypress]',
  standalone: true,
})
export class HoldKeypressDirective {
  @Input() holdThreshold: number = 500;
  @Input('appHoldKeypress') enable = true;
  @Input() targetKeycode: string;
  @Output() keyHold: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
  @Output() keyRelease: EventEmitter<void> = new EventEmitter<void>();

  private timeout: any;
  private isEventTriggered: boolean = false;
  private isLongPressTriggered: boolean = false;

  constructor() {}

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.code !== this.targetKeycode || !this.enable) return;
    if (!this.isEventTriggered) {
      this.isEventTriggered = true;
      this.timeout = setTimeout(() => {
        this.isLongPressTriggered = true;
        this.keyHold.emit(e);
      }, this.holdThreshold);
    }
  }

  @HostListener('window:keyup')
  onKeyUp() {
    if (this.isLongPressTriggered && this.isEventTriggered) {
      this.keyRelease.emit();
      this.isEventTriggered = false;
      this.isLongPressTriggered = false;
    }
    clearTimeout(this.timeout);
  }
}

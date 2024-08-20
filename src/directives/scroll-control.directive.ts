  // TODO: scroll to position doesn't work, need to do some research on it.

import { ViewportScroller } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollControl]',
  standalone: true
})
export class ScrollControlDirective {

  @Input() scrollThreshold: number = 200;

  private topButton: HTMLElement;
  private bottomButton: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewportScroller: ViewportScroller
  ) {
    this.topButton = this.createButton('Scroll Top');
    this.bottomButton = this.createButton('Scroll Bottom');
    this.renderer.setStyle(this.topButton, 'display', 'none');
    this.renderer.setStyle(this.bottomButton, 'display', 'none');
    this.renderer.appendChild(this.el.nativeElement, this.topButton);
    this.renderer.appendChild(this.el.nativeElement, this.bottomButton);

    this.renderer.listen(this.topButton, 'click', () => this.scrollToTop());
    this.renderer.listen(this.bottomButton, 'click', () => this.scrollToBottom());
  }

  private createButton(text: string): HTMLElement {
    const button = this.renderer.createElement('button');
    this.renderer.setProperty(button, 'innerText', text);
    this.renderer.setStyle(button, 'position', 'fixed');
    this.renderer.setStyle(button, 'right', '20px');
    this.renderer.setStyle(button, 'z-index', '1000');
    return button;
  }

  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  private scrollToBottom(): void {
    const scrollHeight = this.el.nativeElement.scrollHeight;
    this.viewportScroller.scrollToPosition([0, scrollHeight]);
  }

  @HostListener('scroll', [])
  onScroll(): void {
    
    const scrollTop = this.el.nativeElement.scrollTop;
    const scrollHeight = this.el.nativeElement.scrollHeight;
    const clientHeight = this.el.nativeElement.clientHeight;
    console.log('scrollTop',scrollTop)

    if (scrollTop > this.scrollThreshold) {
      this.renderer.setStyle(this.topButton, 'display', 'block');
      this.renderer.setStyle(this.topButton, 'bottom', `${clientHeight - scrollTop + 40}px`);
    } else {
      this.renderer.setStyle(this.topButton, 'display', 'none');
    }

    if (scrollHeight - scrollTop - clientHeight > this.scrollThreshold) {
      this.renderer.setStyle(this.bottomButton, 'display', 'block');
      this.renderer.setStyle(this.bottomButton, 'top', `${scrollTop + clientHeight - 40}px`);
    } else {
      this.renderer.setStyle(this.bottomButton, 'display', 'none');
    }
  }

}

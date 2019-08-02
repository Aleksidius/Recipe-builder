import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appBoldElement]'
})
export class BoldElementDirective {

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) { }

  @HostListener('mouseenter')
  bold() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'font-weight',
      'bold'
    );
  }

  @HostListener('mouseleave')
  unBold() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'font-weight',
      'normal'
    );
  }
}


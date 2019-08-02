import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appColorElement]'
})
export class ColorElementDirective {

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) { }

  @Input() elementColor: string;

  @HostListener('mouseenter')
  color() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      this.elementColor
    );
  }

  @HostListener('mouseleave')
  unColor() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      null
    );
  }

}

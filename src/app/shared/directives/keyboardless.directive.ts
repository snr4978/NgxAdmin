import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[keyboardless]'
})
export class KeyboardlessDirective {

  constructor(
    private _elementRef: ElementRef,
    private _renderer2: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this._renderer2.listen(this._elementRef.nativeElement, 'focus', () => {
      this._renderer2.setAttribute(this._elementRef.nativeElement, 'readonly', 'readonly');
      setTimeout(() => this._renderer2.removeAttribute(this._elementRef.nativeElement, 'readonly'), 100);
    });
  }
}

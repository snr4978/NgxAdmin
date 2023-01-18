import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective {

  private _value: boolean | undefined;

  constructor(
    private _elementRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    if (this._value !== false) {
      setTimeout(() => this._elementRef.nativeElement.focus());
    }
  }

  @Input()
  public set focus(value: boolean) {
    if ((this._value = value) === false) {
      setTimeout(() => this._elementRef.nativeElement.blur());
    }
    else {
      setTimeout(() => this._elementRef.nativeElement.focus());
    }
  };
}

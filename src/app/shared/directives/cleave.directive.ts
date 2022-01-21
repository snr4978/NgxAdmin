import { Directive, ElementRef, Input } from '@angular/core';
import Cleave from 'cleave.js';

@Directive({
  selector: '[cleave]'
})
export class CleaveDirective {

  constructor(
    private _elementRef: ElementRef
  ) { }

  @Input()
  public set cleave(options: any) {
    if (this._instance) {
      this._instance.destroy();
    }
    this._instance = new Cleave(this._elementRef.nativeElement, options);
  }

  private _instance: Cleave;
}

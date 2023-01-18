import { Directive, AfterViewInit, ElementRef, ViewContainerRef, Renderer2, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[loading]'
})
export class LoadingDirective implements AfterViewInit {

  private _overlay: any;
  private _spinner: MatProgressSpinner;
  private _wrapper: any;
  private _value: boolean = false;

  constructor(
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef,
    private _renderer: Renderer2
  ) {
    this._spinner = this._viewContainerRef.createComponent(MatProgressSpinner).instance;
    this._spinner.mode = 'indeterminate';
    switch (this._elementRef.nativeElement.tagName) {
      case 'BUTTON': {
        this._spinner.diameter = 20;
        break;
      }
    }
  }

  ngAfterViewInit(): void {
    switch (this._elementRef.nativeElement.tagName) {
      case 'BUTTON': {
        this._wrapper = this._elementRef.nativeElement.querySelector('.mdc-button__label');
        this._overlay = this._renderer.createElement('span');
        this._renderer.appendChild(this._elementRef.nativeElement, this._overlay);
        this._renderer.appendChild(this._overlay, this._spinner._elementRef.nativeElement);
        this._renderer.addClass(this._overlay, 'mdc-button__label');
        if (this._value) {
          this._renderer.setStyle(this._wrapper, 'display', 'none');
          this._renderer.setStyle(this._overlay, 'display', 'flex');
        }
        else {
          this._renderer.setStyle(this._overlay, 'display', 'none');
        }
        break;
      }
      default: {
        this._overlay = this._renderer.createElement('div');
        this._renderer.setStyle(this._overlay, 'display', this._value ? 'flex' : 'none');
        this._renderer.setStyle(this._overlay, 'position', 'absolute');
        this._renderer.setStyle(this._overlay, 'top', 0);
        this._renderer.setStyle(this._overlay, 'left', 0);
        this._renderer.setStyle(this._overlay, 'bottom', 0);
        this._renderer.setStyle(this._overlay, 'right', 0);
        this._renderer.setStyle(this._overlay, 'z-index', 110);
        this._renderer.setStyle(this._overlay, 'align-items', 'center');
        this._renderer.setStyle(this._overlay, 'justify-content', 'center');
        this._renderer.setStyle(this._overlay, 'background-color', 'rgba(0, 0, 0, 0.15)');
        this._renderer.appendChild(this._elementRef.nativeElement, this._overlay);
        this._renderer.appendChild(this._overlay, this._spinner._elementRef.nativeElement);
        break;
      }
    }
  }

  @Input()
  public set loading(value: boolean) {
    this._value = value;
    switch (this._elementRef.nativeElement.tagName) {
      case 'BUTTON': {
        if (value) {
          this._wrapper && this._renderer.setStyle(this._wrapper, 'display', 'none');
          this._overlay && this._renderer.setStyle(this._overlay, 'display', 'flex');
        }
        else {
          this._wrapper && this._renderer.removeStyle(this._wrapper, 'display');
          this._overlay && this._renderer.setStyle(this._overlay, 'display', 'none');
        }
        break;
      }
      default: {
        if (value) {
          this._overlay && this._renderer.setStyle(this._overlay, 'display', 'flex');
        }
        else {
          this._overlay && this._renderer.setStyle(this._overlay, 'display', 'none');
        }
        break;
      }
    }
  };

  @Input()
  public set color(color: ThemePalette) {
    this._spinner.color = color;
  }
}

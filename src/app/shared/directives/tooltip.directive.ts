import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { MatTooltip, MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[matTooltipTemplate]',
  host: {
    'class': 'mat-tooltip-trigger'
  }
})
export class TooltipDirective extends MatTooltip {

  private _template: TemplateRef<any>;
  
  protected readonly _tooltipComponent = TooltipComponent;

  constructor(
    overlay: Overlay,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    viewContainerRef: ViewContainerRef,
    ngZone: NgZone,
    platform: Platform,
    ariaDescriber: AriaDescriber,
    focusMonitor: FocusMonitor,
    @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() dir: Directionality,
    @Optional() @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) defaultOptions: MatTooltipDefaultOptions,
    @Inject(DOCUMENT) _document: any) {
    super(overlay, elementRef, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions);
    super['_portal'] = new ComponentPortal(this._tooltipComponent, viewContainerRef);
  }

  @Input('matTooltipTemplate')
  public set template(value: TemplateRef<any>) {
    this.message = '...';
    this._template = value;
  }

  show(delay: number = this.showDelay): void {
    super.show(delay);
    const instance = this._tooltipInstance as TooltipComponent;
    if (instance) {
      instance.template = this._template;
    }
  }
}

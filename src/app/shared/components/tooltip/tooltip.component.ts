import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { matTooltipAnimations, TooltipComponent as MatTooltipComponent } from '@angular/material/tooltip';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [matTooltipAnimations.tooltipState],
  host: {
    '[style.zoom]': '_visibility === "visible" ? 1 : null',
    '(body:click)': 'this._handleBodyInteraction()',
    '(body:auxclick)': 'this._handleBodyInteraction()',
    'aria-hidden': 'true',
  }
})
export class TooltipComponent extends MatTooltipComponent {

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    breakpointObserver: BreakpointObserver) {
    super(changeDetectorRef, breakpointObserver);
  }

  public template: TemplateRef<any>;
}

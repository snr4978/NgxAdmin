import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOWN_ARROW, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER, MatDatepicker } from '@angular/material/datepicker';
import { take } from 'rxjs';
import { DatetimepickerContent } from '../datetimepicker-content/datetimepicker-content.component';

@Component({
  selector: 'mat-datetimepicker',
  template: '',
  exportAs: 'matDatetimepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
    { provide: MatDatepicker, useExisting: Datetimepicker }
  ]
})
export class Datetimepicker<D> extends MatDatepicker<D> implements OnInit, AfterViewInit {

  ngOnInit(): void {
    this['_openOverlay'] = () => {
      // 摘录自 https://github.com/ng-docs/components/blob/master/src/material/datepicker/datepicker-base.ts
      this['_destroyOverlay']();
      const isDialog = this.touchUi;
      const portal = new ComponentPortal<DatetimepickerContent<D>>(
        DatetimepickerContent,
        this['_viewContainerRef'],
      );
      const overlayRef = (this['_overlayRef'] = this['_overlay'].create(
        new OverlayConfig({
          positionStrategy: this[isDialog ? '_getDialogStrategy' : '_getDropdownStrategy'](),
          hasBackdrop: true,
          backdropClass: [
            isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
            this['_backdropHarnessClass'],
          ],
          direction: this['_dir'],
          scrollStrategy: isDialog ? this['_overlay'].scrollStrategies.block() : this['_scrollStrategy'](),
          panelClass: `mat-datetimeepicker-${isDialog ? 'dialog' : 'popup'}`,
        }),
      ));
      this['_getCloseStream'](overlayRef).subscribe((event: any) => {
        if (event) {
          event.preventDefault();
        }
        this.close();
      });
      overlayRef.keydownEvents().subscribe((event: any) => {
        const keyCode = event.keyCode;
        if (
          keyCode === UP_ARROW ||
          keyCode === DOWN_ARROW ||
          keyCode === LEFT_ARROW ||
          keyCode === RIGHT_ARROW ||
          keyCode === PAGE_UP ||
          keyCode === PAGE_DOWN
        ) {
          event.preventDefault();
        }
      });
      this['_componentRef'] = overlayRef.attach(portal);
      this._forwardContentValues(this['_componentRef'].instance);
      if (!isDialog) {
        this['_ngZone'].onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
      }
    }
  }

  ngAfterViewInit(): void {
    const datepickerInput = this.datepickerInput as any;
    const format = JSON.parse(JSON.stringify(datepickerInput._dateFormats));
    format.display.dateInput = format.display.datetimeInput;
    datepickerInput._dateFormats = format;
  }
}
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DateRange, ExtractDateTypeFromSelection, MatCalendarUserEvent, MatDatepickerContent, matDatepickerAnimations } from '@angular/material/datepicker';
import { Moment } from 'moment';

@Component({
  selector: 'mat-datetimepicker-content',
  templateUrl: './datetimepicker-content.component.html',
  styleUrls: ['./datetimepicker-content.component.scss'],
  host: {
    'class': 'mat-datepicker-content',
    '[@transformPanel]': '_animationState',
    '(@transformPanel.start)': '_handleAnimationEvent($event)',
    '(@transformPanel.done)': '_handleAnimationEvent($event)',
    '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
  },
  animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar],
  exportAs: 'matDatepickerContent',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['color'],
})
export class DatetimepickerContent<S, D = ExtractDateTypeFromSelection<S>> extends MatDatepickerContent<S, D> {

  private __calendar: boolean = true;
  private __date: D | null = null;
  private __hour: number = 0;
  private __minute: number = 0;

  public get calendar() {
    return this.__calendar;
  }

  public get hour() {
    return this.__hour;
  }

  public get minute() {
    return this.__minute;
  }

  public selectDate(e: MatCalendarUserEvent<D | null>): void {
    if (e.value) {
      this.__date = e.value;
      this.__calendar = false;
      if (this['_model'].selection instanceof DateRange) {
        this.selectHour(0);
        this.selectMinute(0);
      }
      else {
        const moment = this['_model'].selection as Moment;
        if (moment) {
          this.selectHour(moment.hour());
          this.selectMinute(moment.minute());
        }
      }
    }
  }

  public selectHour(e: number): void {
    this.__hour = e;
  }

  public selectMinute(e: number): void {
    this.__minute = e;
  }

  public selectTime(e: { hour: number, minute: number }): void {
    (this.__date as Moment).hour(e.hour).minute(e.minute);
    const selection = this['_model'].selection;
    const isRange = selection instanceof DateRange;
    if (isRange && this['_rangeSelectionStrategy']) {
      const newSelection = this['_rangeSelectionStrategy'].selectionFinished(
        this.__date,
        selection as unknown as DateRange<D>,
        null,
      );
      this['_model'].updateSelection(newSelection as unknown as S, this);
    }
    else if (this.__date) {
      if (isRange) {
        this['_model'].add(this.__date);
        if (this['_model'].isComplete() && this['_model'].selection.start.isAfter(this['_model'].selection.end)) {
          this['_model'].add(this.__date);
        }
      }
      else {
        if (!(this.__date as unknown as Moment).isSame(selection)) {
          this['_model'].add(this.__date);
        }
      }
    }
    if ((!this['_model'] || this['_model'].isComplete()) && !this._actionsPortal) {
      this.datepicker.close();
    }
    else {
      this.__calendar = true;
    }
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-crud-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class CrudFilterComponent {

  private _form: FormGroup;
  private _fields: any[] | undefined;

  constructor(
    private _formBuilder: FormBuilder
  ) {
    this._form = this._formBuilder.group({});
  }

  public get form() {
    return this._form;
  }

  public get fields() {
    return this._fields ?? [];
  }

  @Output()
  public changed: EventEmitter<{ action: string, query: string }> = new EventEmitter();

  @Input()
  public set fields(value: any[]) {
    if (value) {
      value.forEach((item: any) => {
        if (item.type == 'date-range' || item.type == 'datetime-range') {
          const controlFrom = new FormControl();
          const controlTo = new FormControl();
          if (item.default) {
            controlFrom.setValue(item.default[0]);
            controlFrom.setValue(item.default[1]);
          }
          this.form.addControl(`${item.id}From`, controlFrom);
          this.form.addControl(`${item.id}To`, controlTo);
        }
        else {
          const control = new FormControl();
          if (item.default) {
            control.setValue(item.default);
          }
          this.form.addControl(item.id, control);
        }
      });
      this._fields = value;
    }
  }

  public static queryString(field: any, value: any): string {
    if (field.convertor) {
      return field.convertor(value);
    }
    else {
      switch (field.type) {
        case 'multi-select':
          return value instanceof Array ? value.map((id: any) => `${field.id}=${id}&`).join('') || `${field.id}=0&` : '';
        case 'date':
        case 'datetime':
          return value?._isAMomentObject ? `${field.id}=${value.format(field.type == 'datetime' ? 'yyyy-MM-DD HH:mm' : 'yyyy-MM-DD')}&` : '';
        case 'date-range':
        case 'datetime-range':
          const format = field.type == 'datetime-range' ? 'yyyy-MM-DD HH:mm' : 'yyyy-MM-DD'
          let query = '';
          if (value[0]?._isAMomentObject) {
            query += `${field.id}From=${value[0].format(format)}&`;
          }
          if (value[1]?._isAMomentObject) {
            query += `${field.id}To=${value[1].format(format)}&`;
          }
          return query;
        default:
          return value?.toString().length ? `${field.id}=${value}&` : '';
      }
    }
  }

  public search(action?: string) {
    let query: string = '';
    this._fields?.forEach(item => {
      if ((item.type === 'date-range' || item.type === 'datetime-range') && !item.convertor) {
        query += CrudFilterComponent.queryString(item, [this._form.controls[`${item.id}From`].value, this._form.controls[`${item.id}To`].value]);
      }
      else {
        query += CrudFilterComponent.queryString(item, this._form.controls[item.id].value);
      }
    });
    this.changed.emit({
      action: action ?? 'search',
      query: query
    });
  }

  public reset() {
    this._fields?.forEach(item => {
      switch (item.type) {
        case 'date-range':
        case 'datetime-range':
          this._form.controls[`${item.id}From`].reset(item.default && item.default[0]);
          this._form.controls[`${item.id}To`].reset(item.default && item.default[1]);
          break;
        default:
          this._form.controls[item.id].reset(item.default);
          break;
      }
    });
    this.search('reset');
  }
}

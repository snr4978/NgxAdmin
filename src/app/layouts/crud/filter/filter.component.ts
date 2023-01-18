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
        if (item.type == 'date-range') {
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

  public search(action?: string) {
    let query: string = '';
    this._fields?.forEach(item => {
      if (item.convertor) {
        query += item.convertor(this._form.controls[item.id].value);
      }
      else {
        switch (item.type) {
          case 'multi-select':
            if (this._form.controls[item.id].value instanceof Array) {
              query += this._form.controls[item.id].value.map((id: any) => `${item.id}=${id}&`).join('') || `${item.id}=0&`;
            }
            break;
          case 'date':
            if (this._form.controls[item.id].value?._isAMomentObject) {
              query += `${item.id}=${this._form.controls[item.id].value.format('yyyy-MM-DD')}&`;
            }
            break;
          case 'date-range':
            if (this._form.controls[`${item.id}From`].value?._isAMomentObject) {
              query += `${item.id}From=${this._form.controls[`${item.id}From`].value.format('yyyy-MM-DD')}&`;
            }
            if (this._form.controls[`${item.id}To`].value?._isAMomentObject) {
              query += `${item.id}To=${this._form.controls[`${item.id}To`].value.format('yyyy-MM-DD')}&`;
            }
            break;
          default:
            if (this._form.controls[item.id].value?.toString().length) {
              query += `${item.id}=${this._form.controls[item.id].value}&`;
            }
            break;
        }
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

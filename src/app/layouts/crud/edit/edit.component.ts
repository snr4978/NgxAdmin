import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-crud-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class CrudEditComponent {

  private _form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private _formBuilder: FormBuilder,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _toastService: ToastService,
    private _dialogRef: MatDialogRef<CrudEditComponent>
  ) {
    const controls: any = {};
    _data.fields.forEach((item: any) => {
      const value = [
        _data.data ?
          item.convertor ?
            item.convertor(_data.data[item.id], 'r') :
            _data.data[item.id] :
          item.default
      ];
      const validator = [];
      if (item.validator) {
        validator.push(...item.validator);
      }
      if (item.required) {
        validator.push(Validators.required);
      }
      if (validator.length) {
        value.push(validator);
      }
      controls[item.id] = value;
    });
    this._form = this._formBuilder.group(controls);
  }

  public get data() {
    return this._data.data;
  }

  public get id() {
    return this._data.data ? this._data.data[this._data.pk] : null;
  }

  public get fields() {
    return this._data.fields;
  }

  public get form() {
    return this._form;
  }
  public func() { }
  public async save(): Promise<void> {
    const data: any = {};
    this._data.fields.forEach((item: any) => {
      data[item.id] = item.convertor ?
        item.convertor(this._form.controls[item.id].value, 'w') :
        this._form.controls[item.id].value;
    });
    const res: boolean = (this.id ?
      await this._httpService.put(`${this._data.api}/${this.id}`, data).catch(e => {
        if (!this._data.error || this._data.error(e) !== false) {
          this._dialogRef.close({ success: false });
        }
      }) :
      await this._httpService.post(this._data.api, data).catch(e => {
        if (!this._data.error || this._data.error(e) !== false) {
          this._dialogRef.close({ success: false });
        }
      })
    ) !== undefined;
    if (res) {
      this._toastService.show(this._i18nService.translate('shared.notification.success'));
      this._dialogRef.close({ success: true });
    }
  }
}

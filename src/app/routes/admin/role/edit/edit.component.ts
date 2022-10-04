import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-admin-role-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class RoleEditComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private _formBuilder: FormBuilder,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _toastService: ToastService,
    private _dialogRef: MatDialogRef<RoleEditComponent>
  ) {
    this.formGroup = this._formBuilder.group({
      name: [_data?.name, [Validators.required]],
      remark: [_data?.remark]
    });
  }

  //id
  public get id() {
    return this._data?.id;
  }

  //表单
  public formGroup: FormGroup;

  //保存
  public async save(): Promise<void> {
    const data: any = {
      name: this.formGroup.controls['name'].value,
      remark: this.formGroup.controls['remark'].value
    };
    const res: boolean = (this.id ?
      await this._httpService.put(`roles/${this.id}`, data).catch(async err => {
        switch (err.status) {
          case 409:
            this._toastService.show(this._i18nService.translate(`routes.admin.role.error.conflict.${err.error?.propertyName?.toLowerCase()}`));
            break;
          case 410:
            this._toastService.show(this._i18nService.translate(`routes.admin.role.error.gone.${err.error?.propertyName?.toLowerCase()}`));
            this._dialogRef.close({ success: false });
            break;
          case 422:
            this._toastService.show(this._i18nService.translate('shared.notification.fail'));
            this._dialogRef.close({ success: false });
            break;
          default:
            this._dialogRef.close({ success: false });
            break;
        }
      }) :
      await this._httpService.post('roles', data).catch(async err => {
        switch (err.status) {
          case 409:
            this._toastService.show(this._i18nService.translate(`routes.admin.role.error.conflict.${err.error?.propertyName?.toLowerCase()}`));
            break;
          case 422:
            this._toastService.show(this._i18nService.translate('shared.notification.fail'));
            this._dialogRef.close({ success: false });
            break;
          default:
            this._dialogRef.close({ success: false });
            break;
        }
      })
    ) !== undefined;
    if (res) {
      this._toastService.show(this._i18nService.translate('shared.notification.success'));
      this._dialogRef.close({ success: true });
    }
  }
}

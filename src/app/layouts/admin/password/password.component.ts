import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService,
    private _toastService: ToastService,
    private _dialogRef: MatDialogRef<PasswordComponent>
  ) {
    this.formGroup = this._formBuilder.group({
      current: ['', [Validators.required]],
      replacement: ['', [Validators.required]],
      confirm: ['', [Validators.required, this.confirmValidators]]
    });
  }

  //表单
  public formGroup: FormGroup;

  //密码确认验证
  private confirmValidators: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.parent) {
      return control.value != control.parent.controls['replacement'].value ? {
        confirm: true
      } : null;
    }
  };

  //提交修改
  public async change() {
    const res = await this._httpService.put('users/current/password', {
      current: this.formGroup.controls['current'].value,
      replacement: this.formGroup.controls['replacement'].value
    }).catch(err => {
      if (err.status == 422) {
        this._toastService.show(this._i18nService.translate(`layouts.admin.password.invalid.${err.error}`));
      }
    }) !== undefined;
    if (res) {
      this._dialogRef.close();
      await this._httpService.delete('sessions', { reason: 'Modify Password' });
      await this._dialogService.alert(this._i18nService.translate('layouts.admin.password.success'));
      this._routerService.navigate('/auth/login');
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  private _form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService,
    private _toastService: ToastService,
    private _dialogRef: MatDialogRef<PasswordComponent>
  ) {
    this._form = this._formBuilder.group({
      current: ['', [Validators.required]],
      replacement: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    }, {
      validators: (form: FormGroup) => {
        const replacement = form.controls.replacement;
        const confirm = form.controls.confirm;
        const error = replacement.value == confirm.value ? null : { confirm: true };
        confirm.setErrors(error);
        return error;
      }
    });
  }

  public get form() {
    return this._form;
  }

  public async change() {
    const res = await this._httpService.put('users/current/password', {
      current: this._form.controls.current.value,
      replacement: this._form.controls.replacement.value
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

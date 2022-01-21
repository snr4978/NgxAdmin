import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';

@Component({
  selector: 'app-expire',
  templateUrl: './expire.component.html',
  styleUrls: ['./expire.component.scss']
})
export class ExpireComponent implements AfterViewInit {

  constructor(
    private _renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService
  ) {
    this.formGroup = this._formBuilder.group({
      current: ['', [Validators.required]],
      replacement: ['', [Validators.required]],
      confirm: ['', [Validators.required, this.confirmValidators]]
    });
  }

  ngAfterViewInit(): void {
    this._formElement.nativeElement.querySelectorAll('.mat-form-field-outline').forEach((item: any) => {
      this._renderer.addClass(item, 'app-background-card');
      this._renderer.setStyle(item, 'border-radius', '5px');
    });
  }

  //表单
  @ViewChild('form')
  private _formElement: ElementRef;
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
  public loading: boolean;
  public async continue() {
    this.loading = true;
    const result = await this._httpService.put('users/current/password', {
      current: this.formGroup.controls['current'].value,
      replacement: this.formGroup.controls['replacement'].value
    }).catch(error => {
      this.loading = false;
      if (error.status == 422) {
        this._dialogService.alert(this._i18nService.translate(`layouts.auth.expire.invalid.${error.error}`));
      }
    }) !== undefined;
    if (result) {
      await this._httpService.delete('sessions', { reason: 'Modify Password' });
      this.loading = false;
      await this._dialogService.alert(this._i18nService.translate('layouts.auth.expire.success'));
      this._routerService.navigate('/auth/login');
    }
  }
}

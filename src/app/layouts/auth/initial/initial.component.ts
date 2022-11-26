import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
  queries: {
    _$form: new ViewChild('$form')
  }
})
export class InitialComponent implements AfterViewInit {

  private _loading: boolean;
  private _form: FormGroup;
  private _$form: ElementRef;

  constructor(
    private _renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService
  ) {
    this._form = this._formBuilder.group({
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

  ngAfterViewInit(): void {
    this._$form.nativeElement.querySelectorAll('.mat-form-field-outline').forEach((item: any) => {
      this._renderer.addClass(item, 'app-background-card');
      this._renderer.setStyle(item, 'border-radius', '5px');
    });
  }

  public get loading() {
    return this._loading;
  }

  public get form() {
    return this._form;
  }

  public async continue() {
    this._loading = true;
    const result = await this._httpService.post('users/current/password', {
      replacement: this._form.controls.replacement.value
    }).catch(error => {
      this._loading = false;
      switch (error.status) {
        case 405:
          this._dialogService.alert(this._i18nService.translate('layouts.auth.initial.invalid.operation'));
          break;
        case 422:
          this._dialogService.alert(this._i18nService.translate('layouts.auth.initial.invalid.content'));
          break;
      }
    }) !== undefined;
    if (result) {
      await this._httpService.delete('sessions', { reason: 'Modify Password' });
      this._loading = false;
      await this._dialogService.alert(this._i18nService.translate('layouts.auth.initial.success'));
      this._routerService.navigate('/auth/login');
    }
  }
}

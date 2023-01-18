import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  private _$form: ElementRef | undefined;
  private _form: FormGroup;
  private _loading: boolean = false;

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
      validators: (control: AbstractControl): ValidationErrors | null => {
        const form = control as FormGroup;
        const replacement = form.controls['replacement'];
        const confirm = form.controls['confirm'];
        const error = replacement.value === confirm.value ? null : { confirm: true };
        if (confirm.value) {
          confirm.setErrors(error);
        }
        return error;
      }
    });
  }

  ngAfterViewInit(): void {
    this._$form!.nativeElement.querySelectorAll('.mat-mdc-text-field-wrapper').forEach((item: any) => {
      this._renderer.addClass(item, 'app-background-card');
      this._renderer.setStyle(item, 'border-radius', '5px');
    });
  }

  public get form() {
    return this._form;
  }

  public get loading() {
    return this._loading;
  }

  public async continue() {
    this._loading = true;
    const result = await this._httpService.post('users/current/password', {
      replacement: this._form.controls['replacement'].value
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

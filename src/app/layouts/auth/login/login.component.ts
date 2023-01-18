import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSettings, appSettings } from '@app/core/services/setting.service';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService, I18nItem } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  queries: {
    _$form: new ViewChild('$form')
  }
})
export class LoginComponent implements OnInit, AfterViewInit {

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
      account: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('token');
  }

  ngAfterViewInit(): void {
    this._$form!.nativeElement.querySelectorAll('.mat-mdc-text-field-wrapper').forEach((item: any) => {
      this._renderer.addClass(item, 'app-background-card');
      this._renderer.setStyle(item, 'border-radius', '5px');
    });
  }

  public get settings(): AppSettings {
    return appSettings;
  }

  public get languages(): I18nItem[] {
    return this._i18nService.items;
  };

  public get language(): string {
    return this._i18nService.current;
  };

  public get form() {
    return this._form;
  }

  public get loading() {
    return this._loading;
  }

  public set language(value: string) {
    this._i18nService.current = value;
  };

  public async login(): Promise<void> {
    this._loading = true;
    const res: any = await this._httpService.post('sessions', {
      account: this._form.controls['account'].value,
      password: this._form.controls['password'].value
    }).catch(error => {
      this._loading = false;
      switch (error.status) {
        case 401:
          this._dialogService.alert(this._i18nService.translate('layouts.auth.login.fail'));
          break;
        case 423:
          this._dialogService.alert(this._i18nService.translate('layouts.auth.login.frozen'));
          break;
      }
    });
    if (res) {
      this._loading = false;
      localStorage.setItem('token', res.token);
      this._routerService.navigate('/');
    }
  }
}

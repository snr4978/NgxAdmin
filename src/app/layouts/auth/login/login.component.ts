import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AppSettings, appSettings } from '@app/core/services/setting.service';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService, I18nItem } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private _renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService
  ) {
    this.formGroup = this._formBuilder.group({
      account: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('token');
  }

  ngAfterViewInit(): void {
    this._formElement.nativeElement.querySelectorAll('.mat-form-field-outline').forEach((item: any) => {
      this._renderer.addClass(item, 'app-background-card');
      this._renderer.setStyle(item, 'border-radius', '5px');
    });
  }

  //设置
  public get settings(): AppSettings {
    return appSettings;
  }

  //表单
  @ViewChild('form')
  private _formElement: ElementRef;
  public formGroup: FormGroup;
  public get account() {
    return this.formGroup.controls['account'];
  }
  public get password() {
    return this.formGroup.controls['password'];
  }

  //语言
  public get languages(): I18nItem[] {
    return this._i18nService.items;
  };
  public get language(): string {
    return this._i18nService.current;
  };
  public set language(value: string) {
    this._i18nService.current = value;
  };

  //登录
  public loading: boolean;
  public async login(): Promise<void> {
    this.loading = true;
    const response: any = await this._httpService.post('sessions', {
      account: this.account.value,
      password: this.password.value
    }).catch(error => {
      this.loading = false;
      switch (error.status) {
        case 401:
          this._dialogService.alert(this._i18nService.translate('layouts.auth.login.fail'));
          break;
        case 423:
          this._dialogService.alert(this._i18nService.translate('layouts.auth.login.frozen'));
          break;
      }
    });
    if (response) {
      this.loading = false;
      localStorage.setItem('token', response.token);
      this._routerService.navigate('/');
    }
  }
}

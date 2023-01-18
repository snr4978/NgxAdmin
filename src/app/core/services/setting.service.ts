import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { I18nService, i18nItems } from '@app/core/services/i18n.service';
import { webApis } from '@app/core/services/http.service';
import { hubs } from '@app/core/services/signalr.service';

export interface AppSettings {
  appName?: string;
  appFullName?: string;
  appLogo?: string;
  appLogoAssets?: boolean;
  appDescription?: string;
  appCopyright?: string;
  htmlTitle?: string;
  defaultAvatar?: string;
}

export const appSettings: AppSettings = {};

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private _http: HttpClient,
    private _title: Title,
    private _i18nService: I18nService
  ) {
    this._i18nService.onchange.subscribe(() => appSettings.htmlTitle && this._title.setTitle(this._i18nService.translate(appSettings.htmlTitle)));
  }

  public startup(): Promise<any> {
    return new Promise((resolve) => {
      forkJoin([
        this._http.get(`assets/settings/app.json?timestamp=${Date.now()}`),
        this._http.get(`assets/settings/i18n.json?timestamp=${Date.now()}`),
        this._http.get(`assets/settings/srv.json?timestamp=${Date.now()}`)
      ]).subscribe(
        (res: any[]) => {
          Object.assign(appSettings, res[0]);
          Object.assign(i18nItems, res[1]);
          Object.assign(webApis, res[2]);
          Object.assign(hubs, res[2]);
          appSettings.htmlTitle && this._title.setTitle(this._i18nService.translate(appSettings.htmlTitle));
          appSettings.appLogoAssets = !!appSettings.appLogo && /\./.test(appSettings.appLogo);
          resolve(null);
        }
      );
    });
  }
}

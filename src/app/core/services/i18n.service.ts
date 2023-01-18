import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export interface I18nItem {
  lang: string;
  desc: string;
}

export const i18nItems: I18nItem[] = [];

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private _observable: Observable<LangChangeEvent>;

  constructor(
    private _translateService: TranslateService
  ) {
    this._translateService.use(localStorage.getItem('i18n') || _translateService.getBrowserCultureLang() || 'zh-CN');
    this._observable = this._translateService.onLangChange.asObservable();
  }

  public get onchange(): Observable<LangChangeEvent> {
    return this._observable;
  }

  public get items(): I18nItem[] {
    return i18nItems;
  };

  public get current(): string {
    return this._translateService.currentLang;
  }

  public set current(value: string) {
    this._translateService.use(value);
    localStorage.setItem('i18n', value);
  }

  public translate(key: string, params?: {}): string {
    return this._translateService.instant(key, params);
  }
}

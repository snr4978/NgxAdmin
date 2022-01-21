import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

export interface I18nItem {
  lang: string;
  desc: string;
}

export const i18nItems: I18nItem[] = [];

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(
    private _translateService: TranslateService
  ) {
    _translateService.use(localStorage.getItem('i18n') || _translateService.getBrowserCultureLang());
  }

  public get onchange(): EventEmitter<LangChangeEvent> {
    return this._translateService.onLangChange;
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

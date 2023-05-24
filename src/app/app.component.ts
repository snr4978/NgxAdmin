import { Component, HostBinding } from '@angular/core';
import { I18nService } from '@app/core/services/i18n.service';
import { MediaService } from '@app/core/services/media.service';
import { ThemeService } from '@app/core/services/theme.service';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

  constructor(
    private _i18nService: I18nService,
    private _mediaService: MediaService,
    private _themeService: ThemeService
  ) {
    (<any>window).AndroidShell?.setStatusBarColor(this._themeService.items.find(item => item.theme === _themeService.current).cbg);
    this._mediaService.onchange.subscribe((e: string) => this._class = `media-${this._media = e} theme-${this._theme}`);
    this._themeService.onchange.subscribe((e: string) => this._class = `theme-${this._theme = e} media-${this._media}`);
  }

  @HostBinding('class')
  private _class: string = `media-${this._mediaService.current} theme-${this._themeService.current}`;
  private _media: string = this._mediaService.current;
  private _theme: string = this._themeService.current;

}

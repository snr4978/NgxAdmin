import { Component } from '@angular/core';
import { ThemeService } from '@app/core/services/theme.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  constructor(
    private _themeService: ThemeService
  ) {
    (<any>window).AndroidShell?.setStatusBarColor(this._themeService.items.find(item => item.theme === _themeService.current).cbg);
  }

  public get theme(): string {
    return this._themeService.current;
  };

}

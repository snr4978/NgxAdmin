import { Component, OnDestroy, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgProgressComponent } from 'ngx-progressbar';
import { AppSettings, appSettings } from '@app/core/services/setting.service';
import { DialogService } from '@app/core/services/dialog.service';
import { EventService } from '@app/core/services/event.service'
import { HttpService } from '@app/core/services/http.service';
import { I18nService, I18nItem } from '@app/core/services/i18n.service';
import { MediaService } from '@app/core/services/media.service';
import { RouterService, RouterItem } from '@app/core/services/router.service';
import { SignalrService } from '@app/core/services/signalr.service';
import { ThemeService, ThemeItem } from '@app/core/services/theme.service';
import { ToastService } from '@app/core/services/toast.service';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('expand', [
      state('collapsed', style({ height: '0', maxHeight: '0' })),
      state('expanded', style({ height: '*', maxHeight: 'unset' })),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(.4, 0, .2, 1)')),
    ]),
  ]
})
export class AdminComponent implements OnDestroy {

  constructor(
    private _dialogService: DialogService,
    private _eventService: EventService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _mediaService: MediaService,
    private _routerService: RouterService,
    private _signalrService: SignalrService,
    private _themeService: ThemeService,
    private _toastService: ToastService
  ) {
    this.init();
    this.online();
    this.message();
    this.layout.react(this._mediaService.current);
    this._mediaService.onchange.subscribe(this.layout.react);
  }

  ngOnDestroy(): void {
    this._alive = false;
    this._onlineHub?.stop();
    this._messageHub?.stop();
  }

  //进度条
  @ViewChild('$progress', { static: true })
  private _progress: NgProgressComponent;

  //设置
  public get settings(): AppSettings {
    return appSettings;
  }

  //布局
  public layout: {
    media?: string,
    sidenavpos?: string,
    sidenavfold?: boolean,
    sidenavopen?: boolean,
    screenfull: any,
    react: (e: string) => void
  } = {
      screenfull: screenfull,
      react: e => {
        this.layout.sidenavpos = 'start';
        switch (this.layout.media = e) {
          case 'mobile':
            //mobile默认布局：导航悬浮并收起
            this.layout.sidenavfold = true;
            this.layout.sidenavopen = false;
            break;
          case 'tablet':
            //tablet默认布局：导航悬浮并打开
            this.layout.sidenavfold = true;
            this.layout.sidenavopen = true;
            break;
          case 'monitor':
            //monitor默认布局：导航平铺
            this.layout.sidenavfold = false;
            this.layout.sidenavopen = true;
            break;
        }
      }
    };

  //账号
  public avatar: string = appSettings.defaultAvatar = 'data:image/jpeg;base64,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';
  public account: {
    name: string,
    avatar: string
  } = {
      name: '...',
      avatar: this.avatar
    };

  //菜单
  public menu: {
    items?: RouterItem[],
    toggle?: (item: any) => void
  } = {};

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

  //主题
  public get themes(): ThemeItem[] {
    return this._themeService.items;
  };
  public get theme(): string {
    return this._themeService.current;
  };
  public set theme(value: string) {
    this._themeService.current = value;
  };

  //初始化
  private async init(): Promise<void> {
    const response = await this._httpService.join(
      this._httpService.get('users/current'),
      this._httpService.get('users/current/routes')
    ).catch();
    if (response) {
      this.account.name = response[0].name;
      this.account.avatar = response[0].avatar || this.avatar;
      this.menu = {
        items: this._routerService.init(response[1]),
        toggle: item => this._routerService.focus(item)
      }
    }
  }

  //上线
  private _alive: boolean = true;
  private _onlineHub: any;
  private async online(): Promise<void> {
    if (this._alive) {
      this._onlineHub = await this._signalrService.connect('identity', {
        conflict: async () => {
          this._onlineHub.stop();
          await this._dialogService.alert(this._i18nService.translate('shared.notification.conflict'));
          this._routerService.navigate('/auth/login');
        }
      }).catch(e => {
        if (e) {
          setTimeout(async () => await this.online(), 5000);
        }
      });
    }
  }

  //消息
  public messages: {
    count?: number,
    list?: {
      id: number,
      time: Date,
      subject: string,
      source: {
        name: string,
        avatar?: string
      }
    }[],
    open: (id?: number) => void
  } = {
      open: id => {
        this._routerService.navigate('/message', { id });
      }
    };
  private _messageHub: any;
  private async message(): Promise<void> {
    const refresh = async (): Promise<void> => {
      const response = await this._httpService.join(
        this._httpService.get('users/current/messages/count?flag=false'),
        this._httpService.get('users/current/messages?flag=false&limit=5')
      ).catch();
      if (response) {
        this.messages.count = response[0];
        this.messages.list = response[1];
      }
    }
    refresh();
    if (this._alive) {
      this._messageHub = await this._signalrService.connect('message', {
        notify: async () => {
          await refresh();
          if (this.messages.count > 0) {
            this._toastService.show(this._i18nService.translate('layouts.admin.message.notify'));
          }
        }
      }).catch(e => {
        if (e) {
          setTimeout(async () => await this.message(), 5000);
        }
      });
    }
    this._eventService.on('openMessage', refresh);
  }

  //账号配置
  public profile(e: any): void {
    const file = new FileReader();
    if (e.path[0].files.length) {
      file.readAsDataURL(e.path[0].files[0]);
      file.onload = () => {
        this._dialogService.open(ProfileComponent, {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          restoreFocus: false,
          data: file.result
        }).then((result: string) => {
          e.path[0].value = null;
          if (result) {
            this.account.avatar = result;
          }
        });
      }
    }
  }

  //修改密码
  public password(): void {
    this._dialogService.open(PasswordComponent, { autoFocus: false });
  }

  //注销
  public logout(): void {
    this._progress.progressRef = null;
    this._httpService.delete('sessions', { reason: 'Logout' });
    this._routerService.navigate('/auth/login');
  }
}

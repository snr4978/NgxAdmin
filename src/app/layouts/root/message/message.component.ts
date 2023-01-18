import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@app/core/services/event.service';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';
import { ToastService } from '@app/core/services/toast.service';
import { MessageListComponent } from './list/list.component';
import { MessageContentComponent } from './content/content.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  queries: {
    _list: new ViewChild('$list'),
    _content: new ViewChild('$content')
  }
})
export class MessageComponent implements AfterViewInit {

  private _list: MessageListComponent | undefined;
  private _content: MessageContentComponent | undefined;
  private _init: boolean;
  private _listed: boolean;
  private _tab: number | undefined;
  private _id: number | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _eventService: EventService,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService,
    private _toastService: ToastService
  ) {
    this._init = false;
    this._listed = false;
    this._activatedRoute.queryParams.subscribe(p => {
      this._tab = (this._id = p['id']) ? 1 : 0;
      if (this._init) {
        this.ngAfterViewInit();
      }
    });
  }

  ngAfterViewInit(): void {
    this._init = true;
    if (this._id) {
      this._content!.load(this._id);
    }
    else {
      if (!this._listed || this._list!.loading) {
        this._listed = true;
        this._list!.refresh();
      }
    }
  }

  public get tab() {
    return this._tab;
  }

  public mark = async (id: number[], flag: boolean, notify?: boolean) => {
    const res: boolean = await this._httpService.post('users/current/messages/batch', {
      method: 'update',
      data: id.map(item => {
        return {
          id: item,
          flag: flag
        };
      })
    }) !== undefined;
    if (res) {
      if (notify !== false) {
        this._toastService.show(this._i18nService.translate('shared.notification.success'));
      }
      this._list!.refresh();
      this._eventService.emit('openMessage');
    }
  }

  public delete = async (id: number[]) => {
    if (await this._dialogService.confirm(this._i18nService.translate('shared.notification.confirm'))) {
      const res: boolean = await this._httpService.post('users/current/messages/batch', {
        method: 'delete',
        data: id.map(item => {
          return { id: item };
        })
      }) !== undefined;
      if (res) {
        this._toastService.show(this._i18nService.translate('shared.notification.success'));
        if (id) {
          this._routerService.navigate('/message');
        }
        else {
          this._list!.refresh();
        }
      }
    }
  }
}

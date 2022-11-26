import { Component, EventEmitter, Output } from '@angular/core';
import { appSettings } from '@app/core/services/setting.service';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';

@Component({
  selector: 'app-message-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class MessageContentComponent {

  private _id: number;
  private _subject: string;
  private _time: string;
  private _content: string;
  private _source: { name: string, avatar: string };
  private _loading: boolean;

  constructor(
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService
  ) {
    this._loading = true;
  }

  public get subject() {
    return this._subject;
  }

  public get time() {
    return this._time;
  }

  public get content() {
    return this._content;
  }

  public get source() {
    return this._source;
  }

  public get loading() {
    return this._loading;
  }

  @Output('mark')
  public markEvent: EventEmitter<{ id: number[], flag: boolean, notify: boolean }> = new EventEmitter();

  @Output('delete')
  public deleteEvent: EventEmitter<number[]> = new EventEmitter();

  public load = async (id: number) => {
    this._id = id;
    this._loading = true;
    const res: any = await this._httpService.get(`users/current/messages/${id}`).catch(() => null);
    if (res) {
      this._subject = res.subject;
      this._time = res.time;
      this._content = res.content;
      this._source = {
        name: res.source.name,
        avatar: res.source.avatar || appSettings.defaultAvatar
      };
      if (res.flag === false) {
        this.mark(true, false);
      }
    }
    else {
      await this._dialogService.alert(this._i18nService.translate('layouts.admin.message.exception'));
      this._routerService.navigate('/message');
    }
    this._loading = false;
  };

  public mark = (flag: boolean, notify: boolean) => {
    this.markEvent.emit({
      id: [this._id],
      flag: flag,
      notify: notify
    });
  };

  public delete = () => {
    this.deleteEvent.emit([this._id]);
  };

  public close = () => {
    this._routerService.navigate('/message');
  };
}

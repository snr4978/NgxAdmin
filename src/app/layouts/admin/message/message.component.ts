import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { appSettings } from '@app/core/services/setting.service';
import { EventService } from '@app/core/services/event.service';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { RouterService } from '@app/core/services/router.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _eventService: EventService,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _routerService: RouterService,
    private _toastService: ToastService
  ) {
    this._activatedRoute.queryParams.subscribe(async p => {
      this.view = null;
      if (p.id) {
        this.detail = await this._httpService.get(`users/current/messages/${p.id}`);
        if (this.detail) {
          this.view = 'detail';
          this.detail.source.avatar ??= appSettings.defaultAvatar;
          if (this.detail.flag == false) {
            await this._httpService.post('users/current/messages/batch', {
              method: 'update',
              data: [{
                id: p.id,
                flag: true
              }]
            });
          }
        }
        else {
          await this._dialogService.alert(this._i18nService.translate('layouts.admin.message.exception'));
          this._routerService.navigate('/message');
        }
      }
      if (this.view == null) {
        this.view = 'list';
        this.refresh();
      }
      this._eventService.emit('openMessage');
    });
  }

  public view: 'detail' | 'list';

  public detail: any = {
    id: null,
    subject: null,
    time: null,
    content: null,
    source: {
      name: null,
      avatar: null
    }
  };

  public list: any = {
    loading: true,
    columns: ['select', 'subject', 'time', 'source'],
    rows: [],
    total: 0,
    selection: new SelectionModel<any>(true, []),
    pageIndex: 0,
    pageSize: 30,
    filter: {
      query: '',
      form: this._formBuilder.group({
        subject: '',
        source: '',
        start: '',
        end: '',
        flag: ''
      })
    }
  };

  public select(e?: any): void {
    if (e) {
      if (this.list.selection.selected.length == this.list.rows.length) {
        this.list.selection.clear();
      }
      else {
        this.list.rows.forEach(i => this.list.selection.select(i));
      }
    }
  }

  public async refresh(e?: any): Promise<void> {
    if (e) {
      if (e.pageIndex !== undefined) {
        this.list.pageIndex = e.pageIndex;
        this.list.pageSize = e.pageSize;
      }
    }
    let res: any = null;
    let lastPage: number = -1;
    while (this.list.pageIndex > lastPage) {
      lastPage > -1 && (this.list.pageIndex = lastPage);
      res = await this._httpService.get(`users/current/messages?${this.list.filter.query}offset=${this.list.pageSize * this.list.pageIndex}&limit=${this.list.pageSize}`);
      lastPage = res ? Math.max(0, Math.ceil(res.total / this.list.pageSize) - 1) : Number.MAX_VALUE;
    }
    this.list.loading = false;
    if (res) {
      this.list.total = res.total;
      this.list.rows = res.items;
      this.list.selection.clear();
    }
  }

  public search() {
    let query: string = '';
    for (const key in this.list.filter.form.controls) {
      const value = this.list.filter.form.controls[key].value;
      if (value?.format) {
        query += `${key}=${value.format('yyyy-MM-DD')}&`;
      }
      else {
        if (value?.toString().length) {
          query += `${key}=${value}&`;
        }
      }
    }
    this.list.filter.query = query;
    this.refresh();
    this._eventService.emit('openMessage');
  }

  public reset() {
    for (const key in this.list.filter.form.controls) {
      this.list.filter.form.controls[key].reset('');
    }
    this.list.filter.query = '';
    this.refresh();
  }

  public async mark(flag: boolean, id?: number): Promise<void> {
    const res: boolean = await this._httpService.post('users/current/messages/batch', {
      method: 'update',
      data: id ? [{
        id: id,
        flag: flag
      }] : this.list.selection.selected.map(i => {
        return {
          id: i.id,
          flag: flag
        };
      })
    }) !== undefined;
    if (res) {
      this._toastService.show(this._i18nService.translate('shared.notification.success'));
      this.refresh();
      this._eventService.emit('openMessage');
    }
  }

  public async delete(id?: number): Promise<void> {
    if (await this._dialogService.confirm(this._i18nService.translate('shared.notification.confirm'))) {
      const res: boolean = await this._httpService.post('users/current/messages/batch', {
        method: 'delete',
        data: id ? [{
          id: id
        }] : this.list.selection.selected.map(i => {
          return { id: i.id };
        })
      }) !== undefined;
      if (res) {
        this._toastService.show(this._i18nService.translate('shared.notification.success'));
        if (id) {
          this._routerService.navigate('/message');
        }
        else {
          this.refresh();
        }
      }
    }
  }

  public read(id: number): void {
    this._routerService.navigate('/message', { id });
  }

  public exit(): void {
    this._routerService.navigate('/message');
  }
}

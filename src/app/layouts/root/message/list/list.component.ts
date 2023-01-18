import { Component, EventEmitter, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '@app/core/services/event.service';
import { HttpService } from '@app/core/services/http.service';
import { RouterService } from '@app/core/services/router.service';
import { Paginator } from '@app/shared/utilities/paginator';

@Component({
  selector: 'app-message-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MessageListComponent {

  private _columns: any[];
  private _rows: any[];
  private _selection: SelectionModel<any>;
  private _total: number;
  private _pageIndex: number;
  private _pageSize: number;
  private _query: string;
  private _filter: FormGroup;
  private _colorful: boolean;
  private _loading: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _eventService: EventService,
    private _httpService: HttpService,
    private _routerService: RouterService
  ) {
    this._columns = ['select', 'subject', 'time', 'source'];
    this._rows = [];
    this._selection = new SelectionModel<any>(true, []);
    this._total = 0;
    this._pageIndex = 0;
    this._pageSize = 30;
    this._query = '';
    this._filter = this._formBuilder.group({
      subject: null,
      source: null,
      start: null,
      end: null,
      flag: null
    });
    this._colorful = false;
    this._loading = true;
  }

  public get columns() {
    return this._columns;
  }

  public get rows() {
    return this._rows;
  }

  public get selection() {
    return this._selection;
  }

  public get total() {
    return this._total;
  }

  public get pageIndex() {
    return this._pageIndex;
  }

  public get pageSize() {
    return this._pageSize;
  }

  public get filter() {
    return this._filter;
  }

  public get colorful() {
    return this._colorful;
  }

  public get loading() {
    return this._loading;
  }

  public set colorful(value: boolean) {
    this._colorful = value;
  }

  @Output('mark')
  public markEvent: EventEmitter<{ id: number[], flag: boolean }> = new EventEmitter();

  @Output('delete')
  public deleteEvent: EventEmitter<number[]> = new EventEmitter();

  public refresh = async (e?: any) => {
    if (e) {
      if (e.pageIndex !== undefined) {
        this._pageIndex = e.pageIndex;
        this._pageSize = e.pageSize;
      }
    }
    const paginator = new Paginator();
    if (await paginator.request(
      (offset, limit) => this._httpService.get(`users/current/messages?${this._query}offset=${offset}&limit=${limit}`),
      this._pageSize,
      this._pageIndex
    )) {
      this._pageIndex = paginator.index;
      this._total = paginator.total;
      this._rows = paginator.items;
      this._selection.clear();
    }
    this._loading = false;
  }

  public search = () => {
    let query: string = '';
    for (const key in this._filter.controls) {
      const value = this._filter.controls[key].value;
      if (value?.format) {
        query += `${key}=${value.format('yyyy-MM-DD')}&`;
      }
      else {
        if (value?.toString().length) {
          query += `${key}=${value}&`;
        }
      }
    }
    this._query = query;
    this._pageIndex = 0;
    this.refresh();
    this._eventService.emit('openMessage');
  }

  public reset = () => {
    for (const key in this._filter.controls) {
      this._filter.controls[key].reset('');
    }
    this._query = '';
    this._pageIndex = 0;
    this.refresh();
    this._eventService.emit('openMessage');
  }

  public mark = (flag: boolean) => {
    this.markEvent.emit({
      id: this._selection.selected.map(item => item.id),
      flag: flag
    });
  };

  public delete = () => {
    this.deleteEvent.emit(this._selection.selected.map(item => item.id));
  };

  public read = (id: number) => {
    this._routerService.navigate('/message', { id });
  }
}

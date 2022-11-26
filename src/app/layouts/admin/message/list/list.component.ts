import { Component, EventEmitter, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '@app/core/services/event.service';
import { HttpService } from '@app/core/services/http.service';
import { RouterService } from '@app/core/services/router.service';

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
    this._loading = true;
    this._columns = ['select', 'subject', 'time', 'source'];
    this._selection = new SelectionModel<any>(true, []);
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
    let res: any = null;
    let lastPage: number = -1;
    while (this._pageIndex > lastPage) {
      lastPage > -1 && (this._pageIndex = lastPage);
      res = await this._httpService.get(`users/current/messages?${this._query}offset=${this._pageSize * this._pageIndex}&limit=${this._pageSize}`);
      lastPage = res ? Math.max(0, Math.ceil(res.total / this._pageSize) - 1) : Number.MAX_VALUE;
    }
    this._loading = false;
    if (res) {
      this._total = res.total;
      this._rows = res.items;
      this._selection.clear();
    }
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

  public select = (e?: any) => {
    if (e) {
      if (this._selection.selected.length == this._rows.length) {
        this._selection.clear();
      }
      else {
        this._rows.forEach(item => this._selection.select(item));
      }
    }
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

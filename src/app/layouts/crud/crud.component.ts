import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';
import { TableColumnDefinition } from '@app/shared/components/table-column-pattern/table-column-pattern.component';
import { Paginator } from '@app/shared/utilities/paginator';
import { CrudEditComponent } from './edit/edit.component';
import { CrudFilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
  host: {
    'class': 'app-crud'
  },
  queries: {
    _filter: new ViewChild('$filter')
  }
})
export class CrudComponent implements OnDestroy {

  private _filter!: CrudFilterComponent;
  private _pk: string = 'id';
  private _api: string | undefined;
  private _columns: TableColumnDefinition<any> | undefined;
  private _fixed: boolean = false;
  private _pageable: boolean = true;
  private _selectable: 'single' | 'multiple' | false = 'multiple';
  private _editable: boolean = true;
  private _addable: boolean = true;
  private _deletable: boolean = true;
  private _rowClass: ((row: any) => string) | undefined;
  private _toolbarTemplate: TemplateRef<any> | null | undefined;
  private _toolbarButtonsTemplate: TemplateRef<any> | null | undefined;
  private _toolbarIconsTemplate: TemplateRef<any> | null | undefined;
  private _toolbarSelectionTemplate: TemplateRef<any> | null | undefined;
  private _rowOperationTemplate: TemplateRef<any> | null | undefined;
  private _rowExpandingTemplate: TemplateRef<any> | null | undefined;
  private _convertor: ((e: any) => Promise<{ items: any[], total?: number }>) | undefined;
  private _error: ((e: any) => boolean) | undefined;
  private _filters: { id: string, type: string, label: string, order?: number, template?: TemplateRef<any>, range?: any[], convertor?: (val: any) => string, default?: any }[] = [];
  private _editors: { id: string, type: string, label: string, order?: number, template?: TemplateRef<any>, range?: any[], convertor?: (val: any) => any, validator?: ValidatorFn[], required?: boolean, default?: any }[] = [];
  private _loading: boolean = true;
  private _query: { static: string, dynamic: string } = { static: '', dynamic: '' };
  private _pageIndex: number = 0;
  private _pageSize: number = 30;
  private _sort: string = '';
  private _rows: any[] = [];
  private _total: number = 0;
  private _selection = new SelectionModel<any>(true, []);
  private _resizeObserver: ResizeObserver;
  private _rect: DOMRectReadOnly | undefined;

  constructor(
    private _elementRef: ElementRef,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _toastService: ToastService
  ) {
    this._resizeObserver = new ResizeObserver((e: ResizeObserverEntry[]) => this._rect = e[0].contentRect);
    this._resizeObserver.observe(this._elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this._resizeObserver.unobserve(this._elementRef.nativeElement);
  }

  public get filter() {
    return this._filter;
  }

  public get columns() {
    return this._columns;
  }

  public get fixed() {
    return this._fixed;
  }

  public get pageable() {
    return this._pageable;
  }

  public get selectable() {
    return this._selectable;
  }

  public get editable() {
    return this._editable;
  }

  public get addable() {
    return this._addable;
  }

  public get deletable() {
    return this._deletable;
  }

  public get rowClass() {
    return this._rowClass;
  }

  public get toolbarTemplate() {
    return this._toolbarTemplate ?? null;
  }

  public get toolbarButtonsTemplate() {
    return this._toolbarButtonsTemplate ?? null;
  }

  public get toolbarIconsTemplate() {
    return this._toolbarIconsTemplate ?? null;
  }

  public get toolbarSelectionTemplate() {
    return this._toolbarSelectionTemplate ?? null;
  }

  public get rowOperationTemplate() {
    return this._rowOperationTemplate ?? null;
  }

  public get rowExpandingTemplate() {
    return this._rowExpandingTemplate ?? null;
  }

  public get filters() {
    return this._filters;
  }

  public get loading() {
    return this._loading;
  }

  public get query() {
    return this._query.static ? `${this._query.static}&${this._query.dynamic}` : this._query.dynamic;
  }

  public get pageIndex() {
    return this._pageIndex;
  }

  public get pageSize() {
    return this._pageSize;
  }

  public get rows() {
    return this._rows;
  }

  public get total() {
    return this._total;
  }

  public get selection() {
    return this._selection;
  }

  public get rect() {
    return this._rect;
  }

  @Output('refresh')
  public refreshEvent: EventEmitter<string | null> = new EventEmitter();

  @Input()
  public set pk(value: string) {
    this._pk = value;
  }

  @Input()
  public set api(value: string) {
    if (this._api = value) {
      this.refresh({ action: 'init' });
    }
  }

  @Input()
  public set defination(value: {
    id: string,
    header?: string,
    template?: TemplateRef<any>,
    style?: any,
    sortable?: boolean,
    sticky?: 'start' | 'end',
    display?: boolean,
    filter?: {
      field: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'date-range',
      order?: number,
      template?: TemplateRef<any>,
      range?: any[],
      convertor?: (val: any) => string,
      default?: any
    },
    editor?: {
      field: 'text' | 'number' | 'select' | 'multi-select' | 'date',
      order?: number,
      template?: TemplateRef<any>,
      range?: any[],
      convertor?: (val: any) => any,
      validator?: ValidatorFn[],
      required?: boolean,
      default?: any
    }
  }[]) {
    const columns = value ? value.filter((item: any) => item.display !== null)
      .map((item: any) => {
        return {
          id: item.id,
          header: item.header,
          template: item.template,
          style: item.style,
          sortable: item.sortable,
          sticky: item.sticky,
          display: item.display
        };
      }) : [];
    if (this._selectable) {
      columns.unshift({
        id: '@selection',
        header: null,
        template: null,
        style: null,
        sortable: false,
        sticky: 'start',
        display: true
      });
    }
    if (this._editable || this.rowOperationTemplate) {
      columns.push({
        id: '@operation',
        header: null,
        template: null,
        style: null,
        sortable: false,
        sticky: 'end',
        display: true
      });
    }
    this._columns = new TableColumnDefinition<any>(columns);
    this._filters = [];
    this._editors = [];
    value && value.forEach(item => {
      if (item.filter) {
        this._filters.push({
          id: item.id,
          type: item.filter.field,
          label: item.header ?? '',
          order: item.filter.order,
          template: item.filter.template,
          range: item.filter.range,
          convertor: item.filter.convertor,
          default: item.filter.default ?? null
        });
      }
      if (item.editor) {
        this._editors.push({
          id: item.id,
          type: item.editor.field,
          label: item.header ?? '',
          order: item.editor.order,
          template: item.editor.template,
          range: item.editor.range,
          convertor: item.editor.convertor,
          validator: item.editor.validator,
          required: item.editor.required,
          default: item.editor.default ?? null
        });
      }
    });
  }

  @Input()
  public set fixed(value: boolean) {
    this._fixed = value;
  }

  @Input()
  public set pageable(value: boolean) {
    this._pageable = value;
  }

  @Input()
  public set selectable(value: 'single' | 'multiple' | false) {
    this._selectable = value;
    if (value) {
      if (this._columns?.length && !this._columns.find(item => item.id == '@selection')) {
        this._columns.unshift({
          id: '@selection',
          sticky: 'start'
        });
      }
      this._selection['_multiple'] = value != 'single';
    }
    else {
      if (this._columns?.length && this._columns[0].id == '@selection') {
        this._columns.shift();
      }
    }
  }

  @Input()
  public set editable(value: boolean) {
    this._editable = value;
    if (value) {
      if (this._columns?.length && !this._columns.find(item => item.id == '@operation')) {
        this._columns.push({
          id: '@operation',
          sticky: 'end'
        });
      }
    }
    else {
      if (this._columns?.length && this._columns[this._columns.length - 1].id == '@operation') {
        this._columns.pop();
      }
    }
  }

  @Input()
  public set addable(value: boolean) {
    this._addable = value;
  }

  @Input()
  public set deletable(value: boolean) {
    this._deletable = value;
  }

  @Input('row-class')
  public set rowClass(value: ((row: any) => string) | undefined) {
    this._rowClass = value;
  }

  @Input('toolbar-template')
  public set toolbarTemplate(value: TemplateRef<any> | null) {
    this._toolbarTemplate = value;
  }

  @Input('toolbar-buttons-template')
  public set toolbarButtonsTemplate(value: TemplateRef<any> | null) {
    this._toolbarButtonsTemplate = value;
  }

  @Input('toolbar-icons-template')
  public set toolbarIconsTemplate(value: TemplateRef<any> | null) {
    this._toolbarIconsTemplate = value;
  }

  @Input('toolbar-selection-template')
  public set toolbarSelectionTemplate(value: TemplateRef<any> | null) {
    this._toolbarSelectionTemplate = value;
  }

  @Input('row-operation-template')
  public set rowOperationTemplate(value: TemplateRef<any> | null) {
    this._rowOperationTemplate = value;
  }

  @Input('row-expanding-template')
  public set rowExpandingTemplate(value: TemplateRef<any> | null) {
    this._rowExpandingTemplate = value;
  }

  @Input()
  public set convertor(value: (e: any) => Promise<{ items: any[], total?: number }>) {
    this._convertor = value;
  }

  @Input()
  public set error(value: (e: any) => boolean) {
    this._error = value;
  }

  @Input()
  public set query(value: string) {
    this._query.static = value;
  }

  public set loading(value: boolean) {
    this._loading = value;
  }

  public async refresh(e?: any): Promise<void> {
    let action: string | null = null;
    if (e) {
      if (e.pageIndex !== undefined) {
        action = 'page';
        this._pageIndex = e.pageIndex;
        this._pageSize = e.pageSize;
      }
      else if (e.active !== undefined) {
        action = 'sort';
        this._sort = e.direction ?
          e.direction == 'desc' ? `~${e.active}` : e.active :
          '';
      }
      else if (e.query !== undefined) {
        action = e.action;
        this._pageIndex = 0;
        this._query.dynamic = e.query;
      }
      else {
        action = e.action;
        this._pageIndex = 0;
      }
    }
    let res: any;
    if (this._pageable) {
      const paginator = new Paginator();
      if (await paginator.request(
        (offset, limit) => this._httpService.get(`${this._api}?${this.query}sort=${this._sort}&offset=${offset}&limit=${limit}`),
        this._pageSize,
        this._pageIndex
      )) {
        this._pageIndex = paginator.index;
        res = {
          total: paginator.total,
          items: paginator.items
        };
      }
    }
    else {
      res = await this._httpService.get(`${this._api}?${this.query}sort=${this._sort}`);
    }
    if (res) {
      if (this._convertor) {
        res = await this._convertor(res);
      }
      this._total = res.total;
      this._rows = res.items;
      this._selection.clear();
    }
    this._loading = false;
    this.refreshEvent.emit(action);
  }

  public async edit(item?: any): Promise<void> {
    if (await this._dialogService.open(CrudEditComponent, {
      autoFocus: !item,
      data: {
        data: item,
        fields: this._editors,
        pk: this._pk,
        api: this._api,
        error: this._error
      }
    })) {
      this.refresh({ action: item ? 'edit' : 'add' });
    }
  }

  public async delete(): Promise<void> {
    if (await this._dialogService.confirm(this._i18nService.translate('shared.notification.confirm'))) {
      const res: boolean = await this._httpService.post(`${this._api}/batch`, {
        method: 'delete',
        data: this._selection.selected.map(i => i[this._pk])
      }) !== undefined;
      if (res) {
        this._toastService.show(this._i18nService.translate('shared.notification.success'));
        this.refresh({ action: 'delete' });
      }
    }
  }
}

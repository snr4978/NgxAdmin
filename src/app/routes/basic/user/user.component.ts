import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';
import { UserEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-basic-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _toastService: ToastService
  ) {
    this.refresh();
    this._httpService.get('roles').then((res: any) => this.roles = res.items);
  }

  public loading: boolean = true;
  public columns: string[] = ['select', 'name', 'account', 'role', 'id'];
  public rows: any[];
  public total: number = 0;
  public selection = new SelectionModel<any>(true, []);
  public sort: string = '';
  public pageIndex: number = 0;
  public pageSize: number = 30;
  public filter: {
    query: string,
    form: FormGroup
  } = {
      query: '',
      form: this._formBuilder.group({
        name: '',
        account: '',
        role: ''
      })
    };
  public roles: any[];

  public select(e?: any): void {
    if (e) {
      if (this.selection.selected.length == this.rows.length) {
        this.selection.clear();
      }
      else {
        this.rows.forEach(i => this.selection.select(i));
      }
    }
  }

  public async refresh(e?: any): Promise<void> {
    if (e) {
      if (e.pageIndex !== undefined) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
      }
      else if (e.active !== undefined) {
        this.sort = e.direction ?
          e.direction == 'desc' ? `~${e.active}` : e.active :
          '';
      }
    }
    let res: any = null;
    let lastPage: number = -1;
    while (this.pageIndex > lastPage) {
      lastPage > -1 && (this.pageIndex = lastPage);
      res = await this._httpService.get(`users?${this.filter.query}sort=${this.sort}&offset=${this.pageSize * this.pageIndex}&limit=${this.pageSize}`);
      lastPage = res ? Math.max(0, Math.ceil(res.total / this.pageSize) - 1) : Number.MAX_VALUE;
    }
    if (res) {
      this.loading = false;
      this.total = res.total;
      this.rows = res.items;
      this.selection.clear();
    }
  }

  public search() {
    let query: string = '';
    for (const key in this.filter.form.controls) {
      const value = this.filter.form.controls[key].value.toString();
      if (value.length) {
        query += `${key}=${value}&`;
      }
    }
    this.filter.query = query;
    this.refresh();
  }

  public reset() {
    for (const key in this.filter.form.controls) {
      this.filter.form.controls[key].reset('');
    }
    this.filter.query = '';
    this.refresh();
  }

  public async edit(item?: any): Promise<void> {
    if (await this._dialogService.open(UserEditComponent, { data: item })) {
      this.refresh();
    }
  }

  public async delete(): Promise<void> {
    if (await this._dialogService.confirm(this._i18nService.translate('shared.notification.confirm'))) {
      const res: boolean = await this._httpService.post('users/batch', {
        method: 'delete',
        data: this.selection.selected.map(i => i.id)
      }) !== undefined;
      if (res) {
        this._toastService.show(this._i18nService.translate('shared.notification.success'));
        this.refresh();
      }
    }
  }

  public async password(id: number): Promise<void> {
    if (await this._dialogService.confirm(this._i18nService.translate('shared.notification.confirm'))) {
      const res = this._httpService.delete(`users/${id}/password`).catch(async err => {
        switch (err.status) {
          case 410:
            this._toastService.show(this._i18nService.translate('routes.basic.user.gone'));
            this.refresh();
            break;
          case 422:
            this._toastService.show(this._i18nService.translate('shared.notification.fail'));
            break;
          default:
            break;
        }
      }) !== undefined;
      if (res) {
        this._toastService.show(this._i18nService.translate('shared.notification.success'));
      }
    }
  }
}

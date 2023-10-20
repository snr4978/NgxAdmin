import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService } from '@app/core/services/dialog.service';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';
import { CrudComponent } from '@app/layouts/crud/crud.component';

@Component({
  selector: 'app-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  queries: {
    _crud: new ViewChild('$crud'),
    _role: new ViewChild('$role')
  }
})
export class UserComponent implements AfterViewInit {

  private _crud!: CrudComponent;
  private _role!: TemplateRef<any>;
  private _defination: any;

  constructor(
    private _dialogService: DialogService,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _toastService: ToastService
  ) { }

  async ngAfterViewInit(): Promise<void> {
    const res: any = await this._httpService.get('roles');
    this._defination = [{
      id: 'name',
      header: 'routes.admin.user.name',
      filter: { field: 'text' },
      editor: { field: 'text', required: true }
    }, {
      id: 'account',
      header: 'routes.admin.user.account',
      filter: { field: 'text' },
      editor: { field: 'text', required: true }
    }, {
      id: 'role',
      header: 'routes.admin.user.role',
      template: this._role,
      sortable: false,
      filter: { field: 'select', range: res.items },
      editor: { field: 'multi-select', range: res.items, convertor: (val: any, io: 'r' | 'w') => io == 'r' ? val.map((i: any) => i.id) : val }
    }];
  }

  public get defination() {
    return this._defination;
  }

  public error = (e: any) => {
    switch (e.status) {
      case 409:
        this._toastService.show(this._i18nService.translate(`routes.admin.user.error.conflict.${e.error?.propertyName?.toLowerCase()}`));
        return false;
      case 410:
        this._toastService.show(this._i18nService.translate(`routes.admin.user.error.gone.${e.error?.propertyName?.toLowerCase()}`));
        return true;
      case 422:
        this._toastService.show(this._i18nService.translate('shared.notification.fail'));
        return true;
      default:
        return true;
    }
  }

  public password = async (id: number) => {
    if (await this._dialogService.confirm(this._i18nService.translate('shared.notification.confirm'))) {
      const res = this._httpService.delete(`users/${id}/password`).catch(async err => {
        switch (err.status) {
          case 410:
            this._toastService.show(this._i18nService.translate(`routes.admin.user.error.gone.${err.error?.propertyName?.toLowerCase()}`));
            this._crud.refresh();
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

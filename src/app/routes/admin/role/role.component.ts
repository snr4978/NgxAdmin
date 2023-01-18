import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DialogService } from '@app/core/services/dialog.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';
import { CrudComponent } from '@app/layouts/crud/crud.component';
import { RoleMenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-admin-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  queries: {
    _crud: new ViewChild('$crud')
  }
})
export class RoleComponent implements AfterViewInit {

  private _crud!: CrudComponent;
  private _defination: any;

  constructor(
    private _dialogService: DialogService,
    private _i18nService: I18nService,
    private _toastService: ToastService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._defination = [{
        id: 'name',
        header: 'routes.admin.role.name',
        filter: { field: 'text' },
        editor: { field: 'text', required: true }
      }, {
        id: 'remark',
        header: 'routes.admin.role.remark',
        editor: { field: 'text' }
      }];
    });
  }

  public get defination() {
    return this._defination;
  }

  public error = (e: any) => {
    switch (e.status) {
      case 409:
        this._toastService.show(this._i18nService.translate(`routes.admin.role.error.conflict.${e.error?.propertyName?.toLowerCase()}`));
        return false;
      case 410:
        this._toastService.show(this._i18nService.translate(`routes.admin.role.error.gone.${e.error?.propertyName?.toLowerCase()}`));
        return true;
      case 422:
        this._toastService.show(this._i18nService.translate('shared.notification.fail'));
        return true;
      default:
        return true;
    }
  }

  public menu = async (id: number) => {
    var res: any = await this._dialogService.open(RoleMenuComponent, {
      data: id,
      autoFocus: false
    });
    if (res && !res.success) {
      this._crud.refresh();
    }
  }
};
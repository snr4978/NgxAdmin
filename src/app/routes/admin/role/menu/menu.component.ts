import { Component, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-admin-role-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('expand', [
      state('collapsed', style({ height: '0' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', animate('200ms cubic-bezier(.4, 0, .2, 1)')),
    ]),
  ]
})
export class RoleMenuComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _id: any,
    private _httpService: HttpService,
    private _i18nService: I18nService,
    private _toastService: ToastService,
    private _dialogRef: MatDialogRef<RoleMenuComponent>
  ) {
    this._ctrl = new NestedTreeControl<any>(node => node.children);
    this._tree = new MatTreeNestedDataSource<any>();
    this._selection = new SelectionModel<number>(true);
    this._httpService.get(`roles/${this._id}/menu`).then((res: any) => {
      if (res.menu.children?.length) {
        const stack = [...res.menu.children];
        while (stack.length) {
          const item = stack.pop();
          if (item.children?.length) {
            item.children.forEach((child: any) => child.parent = item);
            stack.push(...item.children);
          }
        }
      }
      this._selection.select(...res.permission);
      this._tree.data = res.menu.children;
      for (let item of this._tree.data) {
        this._ctrl.expandDescendants(item);
      }
      this._loading = false;
    });
  }

  private _loading: boolean = true;
  private _ctrl: NestedTreeControl<any>;
  private _tree: MatTreeNestedDataSource<any>;
  private _selection: SelectionModel<number>;

  public get loading() {
    return this._loading;
  }

  public get ctrl() {
    return this._ctrl;
  }

  public get tree() {
    return this._tree;
  }

  public get selection() {
    return this._selection;
  }

  //是否可展开
  public expandable = (_: number, node: any) =>
    node.children?.length;

  //是否因子节点选中而被选中
  public selected = (node: any, indeterminate: boolean) => {
    if (this._tree.data) {
      const descendants = this._ctrl.getDescendants(node);
      let result = descendants.some(item => this._selection.isSelected(item.data.id));
      if (indeterminate) {
        result &&= !descendants.every(item => this._selection.isSelected(item.data.id));
      }
      return result;
    }
  }

  //选择节点
  public toggle = (node: any) => {
    this._selection.toggle(node.data.id);
    //后代
    const descendants = this._ctrl.getDescendants(node);
    if (descendants.length) {
      if (this._selection.isSelected(node.data.id)) {
        this._selection.select(...descendants.map(item => item.data.id));
      }
      else {
        this._selection.deselect(...descendants.map(item => item.data.id));
      }
    }
    //祖先
    let parent = node.parent;
    while (parent) {
      if (this._selection.isSelected(parent.data.id)) {
        if (!this.selected(parent, false)) {
          this._selection.deselect(parent.data.id);
        }
      }
      else {
        if (this.selected(parent, false)) {
          this._selection.select(parent.data.id);
        }
      }
      parent = parent.parent;
    }
  }

  //保存
  public save = async () => {
    const res = this._httpService.post(`roles/${this._id}/menu`, this._selection.selected).catch(async err => {
      switch (err.status) {
        case 410:
          this._toastService.show(this._i18nService.translate(`routes.admin.role.error.gone.${err.error?.propertyName?.toLowerCase()}`));
          this._dialogRef.close({ success: false });
          break;
        case 422:
          this._toastService.show(this._i18nService.translate('shared.notification.fail'));
          this._dialogRef.close({ success: false });
          break;
        default:
          this._dialogRef.close({ success: false });
          break;
      }
    }) !== undefined;
    if (res) {
      this._toastService.show(this._i18nService.translate('shared.notification.success'));
      this._dialogRef.close({ success: true });
    }
  }
}

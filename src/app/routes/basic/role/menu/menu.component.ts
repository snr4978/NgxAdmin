import { Component, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { HttpService } from '@app/core/services/http.service';
import { I18nService } from '@app/core/services/i18n.service';
import { ToastService } from '@app/core/services/toast.service';

@Component({
  selector: 'app-basic-role-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
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
    this.ctrl = new FlatTreeControl<any>(node => node.level, node => node.expandable);
    this.tree = new MatTreeFlatDataSource(this.ctrl, new MatTreeFlattener((node: any, level: number) => {
      return {
        id: node.data.id,
        name: node.data.header,
        level: level,
        expandable: node.children && node.children.length
      }
    }, node => node.level, node => node.expandable, node => node.children));
    this.selection = new SelectionModel<number>(true);
    this._httpService.get(`roles/${this._id}/menu`).then((res: any) => {
      this.tree.data = res.menu.children;
      this.selection.select(...res.permission);
      this.ctrl.expandAll();
      this.loading = false;
    });
  }

  public loading: boolean = true;
  public ctrl: FlatTreeControl<any>;
  public tree: MatTreeFlatDataSource<any, any, any>;
  public selection: SelectionModel<number>;

  //是否是内部节点
  public internal(_: number, node: any): boolean {
    return node.expandable;
  }

  //是否因子节点选中而被选中
  public selected(node: any, indeterminate: boolean): boolean {
    if (this.ctrl.dataNodes) {
      const descendants = this.ctrl.getDescendants(node);
      let result = descendants.some(item => this.selection.isSelected(item.id));
      if (indeterminate) {
        result &&= !descendants.every(item => this.selection.isSelected(item.id));
      }
      return result;
    }
  }

  //选择节点
  public toggle(node: any): void {
    this.selection.toggle(node.id);
    //后代
    const descendants = this.ctrl.getDescendants(node);
    if (descendants.length) {
      if (this.selection.isSelected(node.id)) {
        this.selection.select(...descendants.map(item => item.id));
      }
      else {
        this.selection.deselect(...descendants.map(item => item.id));
      }
    }
    //祖先
    let parent = this.parent(node);
    while (parent) {
      if (this.selection.isSelected(parent.id)) {
        if (!this.selected(parent, false)) {
          this.selection.deselect(parent.id);
        }
      }
      else {
        if (this.selected(parent, false)) {
          this.selection.select(parent.id);
        }
      }
      parent = this.parent(parent);
    }
  }

  //父节点
  private parent(node: any): any {
    const currentLevel = node.level;
    if (currentLevel < 1) {
      return null;
    }
    for (let i = this.ctrl.dataNodes.indexOf(node) - 1; i >= 0; i--) {
      const currentNode = this.ctrl.dataNodes[i];
      if (currentNode.level < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  //保存
  public async save(): Promise<void> {
    const res = this._httpService.post(`roles/${this._id}/menu`, this.selection.selected).catch(async err => {
      switch (err.status) {
        case 410:
          this._toastService.show(this._i18nService.translate(`routes.basic.role.error.gone.${err.error?.propertyName?.toLowerCase()}`));
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

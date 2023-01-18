import { Component, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'table-row-selection',
  templateUrl: './table-row-selection.component.html',
  styleUrls: ['./table-row-selection.component.scss']
})
export class TableRowSelectionComponent {

  private _type: 'header' | 'row' | undefined;
  private _model!: SelectionModel<any>;
  private _data!: any;

  @Input()
  public set model(value: SelectionModel<any>) {
    this._model = value;
  }

  @Input()
  public set data(value: any) {
    this._data = value;
    if (value) {
      this._type = Array.isArray(value) ? 'header' : 'row';
    }
  };

  public get type() {
    return this._type;
  }

  public get model() {
    return this._model;
  }

  public get data() {
    return this._data;
  }


  public get checked() {
    switch (this._type) {
      case 'header':
        return this._model.hasValue();
      case 'row':
        return this._model.isSelected(this._data);
      default:
        return undefined;
    }
  }

  public select(e?: any): void {
    if (e) {
      switch (this._type) {
        case 'header':
          if (this._model.selected.length == this._data.length) {
            this._model.clear();
          }
          else {
            this._data.forEach((item: any) => this._model.select(item));
          }
          break;
        case 'row':
          this._model.toggle(this._data);
          break;
      }
    }
  }
}

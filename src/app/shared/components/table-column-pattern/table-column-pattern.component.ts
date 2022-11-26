import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-column-pattern',
  templateUrl: './table-column-pattern.component.html',
  styleUrls: ['./table-column-pattern.component.scss']
})
export class TableColumnPatternComponent {

  private _columns: TableColumnDefinition<any>;

  @Input()
  public set columns(value: TableColumnDefinition<any>) {
    (this._columns = value)?.forEach(item => item.display ??= true);
  }

  public get columns(): TableColumnDefinition<any> {
    return this._columns;
  }

  public sticky = (index: number): boolean => !this._columns[index].sticky && this._columns[index].header;

  public drop(e: CdkDragDrop<any[]>): void {
    moveItemInArray(this._columns, e.previousIndex, e.currentIndex);
  }
}

export class TableColumnDefinition<T extends {
  id: string;
  header?: string;
  sortable?: boolean;
  sticky?: 'start' | 'end';
  display?: boolean;
}> extends Array<T>{
  constructor(items: T[]) {
    super(...items);
  }

  private _display: string[] = [];

  public get display(): string[] {
    this._display.length = 0;
    this.forEach(item => item.display != false && this._display.push(item.id));
    return this._display;
  }
}

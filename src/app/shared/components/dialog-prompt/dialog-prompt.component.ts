import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-prompt',
  templateUrl: './dialog-prompt.component.html',
  styleUrls: ['./dialog-prompt.component.scss']
})
export class DialogPromptComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: any
  ) { }

  public get text(): string | undefined {
    return this._data.content;
  }

  public get title(): string | undefined {
    return this._data.title;
  }

  public get type(): string {
    return this._data.type || 'text';
  }

  public get required(): boolean {
    return this._data.required || false;
  }

  public get options(): {} | null {
    return this._data.range || null;
  }

  public get min(): number | null {
    return (Array.isArray(this._data.range) && this._data.range[0]) || null;
  }

  public get max(): number | null {
    return (Array.isArray(this._data.range) && this._data.range[1]) || null;
  }

  public get value(): string | null | undefined {
    return this._data.value;
  }

  public set value(value: string | null | undefined) {
    this._data.value = value;
  }
}

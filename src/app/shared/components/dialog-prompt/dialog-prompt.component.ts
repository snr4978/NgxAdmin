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

  public get text(): string {
    return this._data.content;
  }

  public get title(): string {
    return this._data.title;
  }

  public get type(): string {
    return this._data.type || 'text';
  }

  public get required(): boolean {
    return this._data.required;
  }

  public get range(): number[] | {} {
    return this._data.range;
  }

  public get value(): string {
    return this._data.value;
  }

  public set value(value: string) {
    this._data.value = value;
  }
}

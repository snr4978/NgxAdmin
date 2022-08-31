import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: string
  ) { }

  public get content(): string {
    return this._data;
  }
}

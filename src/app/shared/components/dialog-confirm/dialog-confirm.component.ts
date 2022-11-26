import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: any
  ) { }

  public get content(): string {
    return this._data.content;
  }

  public get title(): string {
    return this._data.title;
  }
}

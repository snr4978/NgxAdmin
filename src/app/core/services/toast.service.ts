import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatSnackBar, MatSnackBarRef, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MediaService } from '@app/core/services/media.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _horizontalPosition: MatSnackBarHorizontalPosition;

  constructor(
    private _snackBar: MatSnackBar,
    private _mediaService: MediaService
  ) {
    this._mediaService.onchange.subscribe((e: string) => {
      switch (e) {
        case 'mobile':
          this._horizontalPosition = 'center';
          break;
        default:
          this._horizontalPosition = 'right';
          break;
      }
    });
  }

  public show(message: string | ComponentType<any>): MatSnackBarRef<any> {
    const config = {
      duration: 3000,
      horizontalPosition: this._horizontalPosition
    };
    if (typeof message == 'string') {
      return this._snackBar.open(message, null, config);
    }
    else {
      return this._snackBar.openFromComponent(message, config);
    }
  }
}

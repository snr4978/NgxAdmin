import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { DialogAlertComponent } from '@app/shared/components/dialog-alert/dialog-alert.component';
import { DialogConfirmComponent } from '@app/shared/components/dialog-confirm/dialog-confirm.component';
import { DialogPromptComponent } from '@app/shared/components/dialog-prompt/dialog-prompt.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private _dialog: MatDialog
  ) { }

  public alert(content: string): Promise<any> {
    return new Promise(resolve => {
      const subscription: Subscription = this._dialog.open(DialogAlertComponent, {
        width: '600px',
        data: content
      }).afterClosed().subscribe(() => {
        subscription.unsubscribe();
        resolve(true);
      });
    });
  }

  public confirm(content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const subscription: Subscription = this._dialog.open(DialogConfirmComponent, {
        width: '600px',
        data: content
      }).afterClosed().subscribe(result => {
        subscription.unsubscribe();
        if (result) {
          resolve(true);
        }
        else {
          reject();
        }
      });
    }).catch(() => { });
  }

  public prompt(content: string, value?: string, options?: {
    type?: 'text' | 'select' | 'number' | 'password',
    range?: number[] | {},
    required?: boolean
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      const subscription: Subscription = this._dialog.open(DialogPromptComponent, {
        width: '600px',
        data: {
          content: content,
          value: value,
          type: options?.type,
          range: options?.range,
          required: options?.required
        }
      }).afterClosed().subscribe(result => {
        subscription.unsubscribe();
        if (result && result.submit) {
          resolve(result.data || '');
        }
        else {
          reject();
        }
      });
    }).catch(() => { });;
  }

  public open<T, D = any>(component: ComponentType<T>, config?: MatDialogConfig<D>): Promise<any> {
    if (config) {
      if (config.width === undefined) {
        config.width = '600px';
      }
      if (config.restoreFocus !== true) {
        config.restoreFocus = false;
      }
    }
    else {
      config = {
        width: '600px',
        restoreFocus: false
      }
    }
    return new Promise(resolve => {
      const subscription: Subscription = this._dialog.open(component, config)
        .afterClosed()
        .subscribe(result => {
          subscription.unsubscribe();
          resolve(result);
        });
    });
  }

  public show<T, D = any, R = any>(template: TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R> {
    if (config) {
      if (config.width === undefined) {
        config.width = '600px';
      }
      if (config.restoreFocus !== true) {
        config.restoreFocus = false;
      }
    }
    else {
      config = {
        width: '600px',
        restoreFocus: false
      }
    }
    return this._dialog.open(template, config);
  }

  public close(): void {
    this._dialog.closeAll();
  }
}

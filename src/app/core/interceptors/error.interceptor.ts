import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '@app/core/services/dialog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    // 直接注入某些依赖会引发循环依赖的错误，因此使用 Injector。例如：const router = this.injector.get(Router)
    private _injector: Injector,
    private _translateService: TranslateService,
    private _dialogService: DialogService
  ) { }

  private _status: { [key: number]: boolean } = {};

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((err: HttpErrorResponse): Observable<any> => {
          if (!this._status[err.status]) {
            this._status[err.status] = true;
            switch (err.status) {
              case 0:
                this._dialogService.alert(this._translateService.instant('shared.notification.disconnected')).then(() => {
                  delete this._status[0];
                });
                break;
              case 401:
                // 直接注入 Router 会造成循环依赖，所以：
                const router = this._injector.get(Router);
                if (router.url === '/auth/login') {
                  sessionStorage.setItem('loaded', 'true');
                }
                else {
                  if (sessionStorage.getItem('loaded') === 'true') {
                    this._dialogService.alert(this._translateService.instant('shared.notification.timeout')).then(() => {
                      delete this._status[401];
                      this._dialogService.close();
                      router.navigateByUrl('/auth/login');
                    });
                  }
                  else {
                    delete this._status[401];
                    sessionStorage.setItem('loaded', 'true');
                    router.navigateByUrl('/auth/login');
                  }
                }
                break;
              case 403:
                this._dialogService.alert(this._translateService.instant('shared.notification.unauthorized')).then(() => {
                  delete this._status[403];
                });
                break;
              case 419:
                this._injector.get(Router).navigateByUrl('/auth/expire');
                delete this._status[419];
                break;
              case 428:
                this._injector.get(Router).navigateByUrl('/auth/initial');
                delete this._status[428];
                break;
              case 500:
                this._dialogService.alert(this._translateService.instant('shared.notification.server')).then(() => {
                  delete this._status[500];
                });
                break;
            }
          }
          return throwError(() => err);
        })
      );
  }
}

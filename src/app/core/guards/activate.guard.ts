import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '@app/core/services/http.service';
import { RouterService } from '@app/core/services/router.service';
import { RootComponent } from '@app/layouts/root/root.component';

@Injectable({
  providedIn: 'root'
})
export class ActivateGuard implements CanActivate, CanActivateChild {

  constructor(
    private _httpService: HttpService,
    private _routerService: RouterService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (route.component === RootComponent && state.url !== '/') {
      // 表示浏览器输入 url 直接进入 ChildComponent 时触发的 AdminComponent 守卫， 过一会儿还会触发 canActivateChild，因此直接放行
      return true;
    }
    else {
      // 请求服务，返回 Promise<boolean>
      return new Promise(resolve => {
        this._httpService.get(`users/current/routes/${encodeURIComponent(state.url).toLowerCase()}`).then((res: string[]) => {
          sessionStorage.setItem('loaded', 'true');
          this._routerService.permit(...res);
          resolve(true);
        }, () => {
          resolve(false);
        }
        );
      });
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!childRoute.component || childRoute.data['anymouse']) {
      // childRoute.component === null 时表示守卫 module 级别，过一会儿还会守卫 component，因此直接放行
      // childRoute.data.anymouse === true 时表示匿名，需要在 routing 中设置
      // 这两种情况直接返回 true
      return true;
    }
    else {
      // 请求服务，返回 Promise<boolean>
      return this.canActivate(childRoute, state);
    }
  }
}

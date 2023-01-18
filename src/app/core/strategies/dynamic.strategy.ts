import { ComponentRef } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class DynamicReuseStrategy implements RouteReuseStrategy {

  private _url: { [key: string]: boolean };
  private _cache: { [key: string]: DetachedRouteHandle };

  constructor() {
    this._url = {};
    this._cache = {};
  }

  addUrl(url: string): void {
    this._url[url] = true;
  }

  removeUrl(url: string): void {
    delete this._url[url];
  }

  key(route: ActivatedRouteSnapshot): { url: string, type: string } {
    const snapshot: any = route;
    return {
      url: snapshot._routerState.url,
      type: (snapshot.routeConfig.loadChildren || snapshot.routeConfig.component).name
    };
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.component;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const componentRef = (<any>handle)?.componentRef as ComponentRef<any>;
    if (componentRef) {
      const key = this.key(route);
      delete this._cache[`${key.url}&${key.type}`];
      if (this._url[key.url]) {
        this._cache[`${key.url}&${key.type}`] = handle;
      }
      else {
        componentRef.destroy();
      }
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.key(route);
    return !!this._cache[`${key.url}&${key.type}`];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const key = this.key(route);
    if (!this._url[key.url]) {
      delete this._cache[`${key.url}&${key.type}`];
    }
    return this._cache[`${key.url}&${key.type}`];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
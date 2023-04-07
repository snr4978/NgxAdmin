import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationError, NavigationEnd } from '@angular/router';
import { DynamicReuseStrategy } from '@app/core/strategies/dynamic.strategy';
import { BehaviorSubject, combineLatest, delay, EMPTY, filter, finalize, map, Observable, of, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';

export interface RouterItem {
  id: number;
  parent: number;
  header: string;
  icon?: string;
  url?: string;
  children?: RouterItem[];
  level?: number;
  focus?: boolean;
  active?: boolean;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private _root: RouterItem[] = [];
  private _items: { [key: number]: RouterItem; } = {};
  private _path: { [key: string]: number[]; } = {};
  private _active: number[] = [];
  private _permission: { [key: string]: boolean; } = {};
  private _starting: Subject<string> = new Subject<string>();
  private _executing: Subject<boolean> = new Subject<boolean>();
  private _progressing: BehaviorSubject<{ flag: boolean, value: number }> = new BehaviorSubject<{ flag: boolean, value: number }>({ flag: false, value: 0 });
  private _onprogress: Observable<{ flag: boolean, value: number, url: string }> = combineLatest([this._starting, this._progressing]).pipe(map(r => ({ ...r[1], ...{ url: r[0] } })));

  constructor(
    private _router: Router
  ) {
    this._executing.pipe(
      switchMap(b => {
        if (b) {
          if (!this._progressing.value.flag) {
            this._progressing.next({ flag: true, value: 10 });
          }
          return timer(0, 300).pipe(
            tap(() => {
              let value = this._progressing.value.value;
              if (value >= 0 && value < 20) {
                value += 10;
              }
              else if (value >= 20 && value < 50) {
                value += 4;
              }
              else if (value >= 50 && value < 80) {
                value += 2;
              }
              else if (value >= 80 && value < 99) {
                value += 0.5;
              }
              else {
                value += 0;
              }
              this._progressing.next({ flag: true, value: value });
            })
          );
        }
        else {
          return !this._progressing.value.flag ? EMPTY : of({}).pipe(
            tap(() => this._progressing.next({ flag: true, value: 100 })),
            delay(350),
            tap(() => this._progressing.next({ flag: false, value: 100 })),
            delay(200),
            finalize(() => this._progressing.next({ flag: false, value: 0 })),
            takeUntil(this._starting)
          );
        }
      })
    ).subscribe();
    this._router.events.pipe(
      filter(e =>
        e instanceof NavigationStart ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError ||
        e instanceof NavigationEnd)
    ).subscribe(e => {
      if (e instanceof NavigationStart) {
        if (e.url.split('?')[0] !== this._router.url.split('?')[0]) {
          this._starting.next(e.url);
          this._executing.next(true);
        }
      }
      else {
        setTimeout(() => this._executing.next(false));
        if (e instanceof NavigationEnd) {
          this._active.forEach(i => this._items[i].active = false);
          this._active.length = 0;
          this._path[e.url]?.forEach(i => {
            this._items[i].active = true;
            this._active.push(i);
          });
        }
      }
    });
  }

  public get onprogress() {
    return this._onprogress;
  }

  public get current() {
    return {
      navigation: this._router.getCurrentNavigation(),
      permission: this._permission
    }
  }

  public init(items: RouterItem[]): RouterItem[] {
    items.forEach(item => {
      this._items[item.id] = item;
      if (!item.parent) {
        this._root.push(item);
      }
    });
    const tree: RouterItem[] = [];
    const path = (url: string, item: RouterItem) => {
      this._path[url].unshift(item.id);
      if (this._items[item.parent]) {
        path(url, this._items[item.parent]);
      }
    };
    items.forEach(item => {
      if (item.parent === 0) {
        tree.push(item);
      }
      else {
        const parent = this._items[item.parent];
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(item);
        }
      }
      if (item.url) {
        this._path[item.url] = [];
        path(item.url, item);
      }
    });
    const level = (items: RouterItem[], value: number) => {
      items?.forEach(item => {
        item.level = value;
        if (item.children) {
          level(item.children, value + 1);
        }
      });
    };
    level(tree, 0);
    const height = (ancestor: RouterItem, descendant: RouterItem) => {
      descendant.children?.forEach(child => {
        ancestor.height! += 48;
        height(ancestor, child);
      });
    };
    items.forEach(item => {
      item.height = 0;
      height(item, item);
    });
    this._path[this._router.url]?.forEach(i => {
      this._items[i].active = true;
      this._active.push(i);
    });
    return tree;
  }

  public focus(item: RouterItem): void {
    if (item.focus) {
      item.focus = false;
      item.children?.forEach(child => child.focus = false);
    }
    else {
      const children = (item: RouterItem[]) => {
        item?.forEach(child => {
          child.focus = false;
          if (child.children) {
            children(child.children);
          }
        });
      };
      children(this._items[item.parent] ? this._items[item.parent].children! : this._root);
      item.focus = true;
    }
  }

  public permit(...items: string[]): void {
    this._permission = items.reduce((obj: any, item: any) => { return obj[item] = true, obj }, {});
  }

  public navigate(url: string | any[], params?: { [key: string]: any }): Promise<boolean> {
    return this._router.navigate(
      typeof url === 'string' ? [url] : url,
      params ? { queryParams: params } : undefined
    );
  }

  public reuse(url: string | any[], value: boolean): Promise<void> {
    if (this._router.getCurrentNavigation()) {
      return new Promise(resolve => setTimeout(() => this.reuse(url, value).then(resolve)));
    }
    else {
      let urlTree = this._router.createUrlTree(typeof url === 'string' ? [url] : url);
      urlTree = this._router.urlHandlingStrategy.merge(urlTree, (<any>this._router).rawUrlTree);
      const strategy = this._router.routeReuseStrategy as DynamicReuseStrategy;
      if (value) {
        strategy.addUrl(urlTree.toString());
      }
      else {
        strategy.removeUrl(urlTree.toString());
      }
      return Promise.resolve();
    }
  }
}

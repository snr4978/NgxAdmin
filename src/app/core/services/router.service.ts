import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

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

  constructor(
    private _router: Router
  ) {
    _router.events.subscribe(result => {
      if (result instanceof NavigationEnd) {
        this._active.forEach(i => this._items[i].active = false);
        this._active.length = 0;
        this._path[result.url]?.forEach(i => {
          this._items[i].active = true;
          this._active.push(i);
        });
      }
    });
  }

  private _root: RouterItem[] = [];

  private _items: { [key: number]: RouterItem; } = {};

  private _path: { [key: string]: number[]; } = {};

  private _active: number[] = [];

  public init(items: RouterItem[]): RouterItem[] {
    items.forEach(item => {
      this._items[item.id] = item;
      if (!item.parent) {
        this._root.push(item);
      }
    });
    const tree = [];
    const path = (url: string, item: RouterItem) => {
      this._path[url].unshift(item.id);
      if (this._items[item.parent]) {
        path(url, this._items[item.parent]);
      }
    };
    items.forEach(item => {
      if (item.parent == 0) {
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
        ancestor.height += 48;
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
      item.children.forEach(child => child.focus = false);
    }
    else {
      const children = (item: RouterItem[]) => {
        item.forEach(child => {
          child.focus = false;
          if (child.children) {
            children(child.children);
          }
        });
      };
      children(this._items[item.parent] ? this._items[item.parent].children : this._root);
      item.focus = true;
    }
  }

  public navigate(url: string | any[], params?: { [key: string]: any }): Promise<boolean> {
    return this._router.navigate(
      typeof url == 'string' ? [url] : url,
      params ? { queryParams: params } : undefined
    );
  }
}

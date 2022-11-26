import { Injectable, EventEmitter } from '@angular/core';

export interface ThemeItem {
  theme: string,
  desc: string,
  c1st: string,
  c2nd: string,
}

export const themeItems: ThemeItem[] = [
  {
    theme: "default",
    desc: "theme.default",
    c1st: "#263238",
    c2nd: "#fafafa"
  },
  {
    theme: "colorful",
    desc: "theme.colorful",
    c1st: "#1e88e5",
    c2nd: "#fafafa"
  },
  {
    theme: "light",
    desc: "theme.light",
    c1st: "#e8eaf6",
    c2nd: "#ffffff"
  },
  {
    theme: "dark",
    desc: "theme.dark",
    c1st: "#212121",
    c2nd: "#263238"
  }
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _current: string;

  constructor() {
    this.onchange.emit(this._current = localStorage.getItem('theme') || 'default');
  }

  public get items(): any[] {
    return themeItems;
  }

  public get current(): string {
    return this._current;
  }

  public set current(value: string) {
    localStorage.setItem('theme', value);
    this.onchange.emit(this._current = value);
  }

  public onchange: EventEmitter<string> = new EventEmitter();
}

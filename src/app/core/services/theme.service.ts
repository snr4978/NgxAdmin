import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeItem {
  theme: string,
  desc: string,
  c1st: string,
  c2nd: string,
  cbar: string,
  cbg: string
}

export const themeItems: ThemeItem[] = [
  {
    theme: "default",
    desc: "theme.default",
    c1st: "#263238",
    c2nd: "#fafafa",
    cbar: "#ffffffff",
    cbg: "#fffafafa"
  },
  {
    theme: "colorful",
    desc: "theme.colorful",
    c1st: "#1e88e5",
    c2nd: "#fafafa",
    cbar: "#ff1e88e5",
    cbg: "#fffafafa"
  },
  {
    theme: "light",
    desc: "theme.light",
    c1st: "#e8eaf6",
    c2nd: "#ffffff",
    cbar: "#ffffffff",
    cbg: "#fffafafa"
  },
  {
    theme: "dark",
    desc: "theme.dark",
    c1st: "#212121",
    c2nd: "#263238",
    cbar: "#ff212121",
    cbg: "#ff303030"
  }
];

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _subject: BehaviorSubject<string>;
  private _observable: Observable<string>;
  private _current: string;

  constructor() {
    this._subject = new BehaviorSubject<string>(this._current = localStorage.getItem('theme') || 'default');
    this._observable = this._subject.asObservable();
  }

  public get onchange(): Observable<string> {
    return this._observable;
  }

  public get items(): any[] {
    return themeItems;
  }

  public get current(): string {
    return this._current;
  }

  public set current(value: string) {
    localStorage.setItem('theme', value);
    this._subject.next(this._current = value);
  }
}

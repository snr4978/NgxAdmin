import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

const MEDIA_MOBILE = 'screen and (max-width: 599px)';
const MEDIA_TABLET = 'screen and (min-width: 600px) and (max-width: 959px)';
const MEDIA_MONITOR = 'screen and (min-width: 960px)';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private _observable: Observable<string>;
  private _current: string = '';

  constructor(breakpointObserver: BreakpointObserver) {
    this._observable = breakpointObserver.observe([MEDIA_MOBILE, MEDIA_TABLET, MEDIA_MONITOR]).pipe(
      map(state => {
        if (state.breakpoints[MEDIA_MOBILE]) {
          return this._current = 'mobile';
        }
        else if (state.breakpoints[MEDIA_TABLET]) {
          return this._current = 'tablet';
        }
        else {
          return this._current = 'monitor';
        }
      })
    );
  }

  public get onchange(): Observable<string> {
    return this._observable;
  }

  public get current(): string {
    return this._current;
  }
}

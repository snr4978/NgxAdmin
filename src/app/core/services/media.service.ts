import { Injectable, EventEmitter } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

const MEDIA_MOBILE = 'screen and (max-width: 599px)';
const MEDIA_TABLET = 'screen and (min-width: 600px) and (max-width: 959px)';
const MEDIA_MONITOR = 'screen and (min-width: 960px)';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private _current: string;

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([MEDIA_MOBILE, MEDIA_TABLET, MEDIA_MONITOR]).subscribe(result => {
      if (result.breakpoints[MEDIA_MOBILE]) {
        this.onchange.emit(this._current = 'mobile');
      }
      else if (result.breakpoints[MEDIA_TABLET]) {
        this.onchange.emit(this._current = 'tablet');
      }
      else {
        this.onchange.emit(this._current = 'monitor');
      }
    });
  }

  public get current(): string {
    return this._current;
  }

  public onchange: EventEmitter<string> = new EventEmitter<string>();
}

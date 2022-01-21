import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'url'
})
export class UrlPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(object: string): SafeUrl {
    return object && this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(object));
  }

}

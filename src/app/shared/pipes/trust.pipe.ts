import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'trust'
})
export class TrustPipe implements PipeTransform {

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  transform(object: Blob | MediaSource): SafeUrl {
    return object && this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(object));
  }

}
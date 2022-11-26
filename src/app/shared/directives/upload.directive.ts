import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ɵgetHostElement } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatFileUploadQueueComponent } from 'angular-material-fileupload';
import { webApis } from '@app/core/services/http.service';

@Directive({
  selector: "input[fileUploadFor], div[fileUploadFor]",
})
export class UploadDirective implements AfterViewInit, OnDestroy {

  private _url: string;
  private _queue: MatFileUploadQueueComponent;
  private _element: Element;
  private _override: Subscription;

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this._override = this._queue.fileUploads.changes.subscribe(() => {
      this._queue.fileUploads.forEach((item, index) => {
        item.httpRequestHeaders = this._queue.httpRequestHeaders;
        const element = ɵgetHostElement(item);
        element.classList.add('mat-file-upload');
        element.getElementsByClassName('file-summary')[0].innerHTML = this._queue.files[index].name;
      });
    });
  }

  ngOnDestroy(): void {
    this._override.unsubscribe();
  }

  @Input("fileUploadFor")
  public set fileUploadQueue(value: any) {
    if (value) {
      this._element = ɵgetHostElement(value);
      this._element.classList.add('mat-file-upload-queue');
      this._queue = value;
      const token = localStorage.getItem('token');
      if (token) {
        this._queue.httpRequestHeaders = new HttpHeaders({ 'Token': token });
      }
      if (this._url) {
        this._queue.httpUrl = this._url;
      }
    }
  }

  @Input("url")
  public set fileUploadQueueHttpUrl(value: string | [string, string]) {
    if (value) {
      this._url = typeof value == 'string' ?
        `${webApis['default']}/api/${value}` :
        `${webApis[value[0]]}/${value[1]}`;
      if (this._queue) {
        this._queue.httpUrl = this._url;
      }
    }
  }

  @Output()
  public onFileSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

  @HostListener("change")
  public onChange(): any {
    const files = this.element.nativeElement.files;
    this.onFileSelected.emit(files);
    if (this.element.nativeElement.multiple) {
      for (var i = 0; i < files.length; i++) {
        this._queue.add(files[i]);
      }
    }
    else {
      this._queue.files.length = 0;
      this._queue.add(files[0]);
    }
    this.element.nativeElement.value = "";
  }

  @HostListener("drop", ["$event"])
  public onDrop(event: any): any {
    const files = event.dataTransfer.files;
    this.onFileSelected.emit(files);
    if (this.element.nativeElement.multiple) {
      for (var i = 0; i < files.length; i++) {
        this._queue.add(files[i]);
      }
    }
    else {
      this._queue.files.length = 0;
      this._queue.add(files[0]);
    }
    event.preventDefault();
    event.stopPropagation();
    this.element.nativeElement.value = "";
  }

  @HostListener("dragover", ["$event"])
  public onDropOver(event: any): any {
    event.preventDefault();
  }
}

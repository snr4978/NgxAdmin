import { Component, OnInit, Inject, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpService } from '@app/core/services/http.service';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private _renderer: Renderer2,
    private _element: ElementRef,
    private _dialog: MatDialogRef<ProfileComponent>,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    const img = this._element.nativeElement.querySelector('img');
    this._renderer.setAttribute(img, 'src', this._data);
    this._renderer.setStyle(this._element.nativeElement.parentElement, 'background-color', 'transparent');
    this._renderer.setStyle(this._element.nativeElement.parentElement, 'box-shadow', 'none');
    this._renderer.setStyle(this._element.nativeElement.parentElement, 'padding', '0');
    new Cropper(img, {
      aspectRatio: 1,
      dragMode: 'move',
      minContainerWidth: document.body.clientWidth,
      minContainerHeight: document.body.clientHeight,
      background: false,
      center: false,
      cropBoxMovable: false,
      cropBoxResizable: false,
      guides: false,
      highlight: false,
      toggleDragModeOnDblclick: false,
      ready: () => {
        const button = this._element.nativeElement.querySelector('.crop');
        this._renderer.setStyle(button, 'margin-top', '10px');
        this._renderer.appendChild(this._element.nativeElement.querySelector('.cropper-crop-box'), button);
      }
    });
  }

  public crop(): void {
    const base64 = this._element.nativeElement.querySelector('img')
      .cropper['getCroppedCanvas']('', {
        width: 128,
        height: 128
      })
      .toDataURL('image/jpeg');
    this._httpService.put('users/current/profile', {
      avatar: base64
    })
    this._dialog.close(base64);
  }
}

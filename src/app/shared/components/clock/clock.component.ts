import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'mat-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  host: {
    'class': 'mat-clock'
  }
})
export class ClockComponent implements OnInit, OnChanges {

  private readonly SIZE: number = 256;

  private _view: 'hour' | 'minute' = 'hour';
  private _hours: { value: number, position: { x: number, y: number } }[] = [];
  private _minutes: { value: number, position: { x: number, y: number } }[] = [];
  private _pointer: number = -90;
  private _scale: number = 0;
  private _cache: { hour: number, minute: number } = { hour: 0, minute: 0 };
  private _flag: boolean = false;

  constructor() {
    this._hours = [
      ...Array.apply(null, Array(12)).map((_, index) => ({
        value: 1 + index,
        position: {
          x: (this.SIZE / 2 - 20) * Math.cos(2 * Math.PI * (index - 2) / 12),
          y: (this.SIZE / 2 - 20) * Math.sin(2 * Math.PI * (index - 2) / 12)
        }
      })),
      ...Array.apply(null, Array(12)).map((_, index) => ({
        value: 13 + index,
        position: {
          x: ((this.SIZE - 64) / 2 - 20) * Math.cos(2 * Math.PI * (index - 2) / 12),
          y: ((this.SIZE - 64) / 2 - 20) * Math.sin(2 * Math.PI * (index - 2) / 12)
        }
      }))
    ];
    this._minutes = Array.apply(null, Array(60)).map((_, index) => ({
      value: 1 + index,
      position: {
        x: (this.SIZE / 2 - 20) * Math.cos(2 * Math.PI * (index - 14) / 60),
        y: (this.SIZE / 2 - 20) * Math.sin(2 * Math.PI * (index - 14) / 60)
      }
    }));
  }

  ngOnInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  @Output()
  public hourChange: EventEmitter<number> = new EventEmitter();

  @Output()
  public minuteChange: EventEmitter<number> = new EventEmitter();

  @Output()
  public timeChange: EventEmitter<{ hour: number, minute: number }> = new EventEmitter();

  @Input()
  public set hour(value: number) {
    this._cache.hour = value;
    if (this._view === 'hour') {
      this._scale = value;
    }
  }

  @Input()
  public set minute(value: number) {
    this._cache.minute = value;
    if (this._view === 'minute') {
      this._scale = value;
    }
  }

  public get view() {
    return this._view;
  }

  public get hours() {
    return this._hours;
  }

  public get minutes() {
    return this._minutes;
  }

  public get pointer() {
    return this._pointer;
  }

  public get scale() {
    return this._scale;
  }

  public ontouchstart(): void {
    this._flag = true;
  }

  public ontouchmove(e: any): void {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    this.refresh(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
  }

  public ontouchend(e: any): void {
    this.ontouchmove(e);
    this._flag = false;
    this.complete();
  }

  public onmousedown(): void {
    this._flag = true;
  }

  public onmousemove(e: any): void {
    if ((e.buttons === 1 || e.which === 1) && this._flag) {
      const rect = e.target.getBoundingClientRect();
      this.refresh(e.clientX - rect.left, e.clientY - rect.top);
    }
  }

  public onmouseup(e: any): void {
    this.onmousemove(e);
    this._flag = false;
    this.complete();
  }

  private render(): void {
    switch (this._view) {
      case 'hour': {
        this._pointer = 360 / 12 * (this._scale % 12 - 3);
        break;
      }
      case 'minute': {
        this._pointer = 360 / 60 * (this._scale - 15);
        break;
      }
    }
  }

  private refresh(x: number, y: number): void {
    let pointer = Math.atan2(this.SIZE / 2 - x, this.SIZE / 2 - y) / Math.PI * 180;
    if (pointer < 0) {
      pointer = 360 + pointer;
    }
    let value;
    switch (this._view) {
      case 'hour': {
        const radius = Math.sqrt(Math.pow(this.SIZE / 2 - x, 2) + Math.pow(this.SIZE / 2 - y, 2));
        value = 12 - Math.round(pointer * 12 / 360);
        if (value === 0) {
          value = 12;
        }
        if (radius < this.SIZE / 2 - 32) {
          value = value === 12 ? 0 : value + 12;
        }
        break;
      }
      case 'minute': {
        value = Math.round(60 - 60 * pointer / 360);
        if (value === 60) {
          value = 0;
        }
        break;
      }
    }
    if (value !== this._scale) {
      this._scale = value;
      switch (this._view) {
        case 'hour':
          this._pointer = 360 / 12 * (this._scale % 12 - 3);
          break;
        case 'minute':
          this._pointer = 360 / 60 * (this._scale - 15);
          break;
      }
    }
  }

  private complete(): void {
    switch (this._view) {
      case 'hour': {
        this._cache.hour = this._scale;
        this._scale = this._cache.minute;
        this._view = 'minute';
        this.render();
        this.hourChange.emit(this._cache.hour);
        break;
      }
      case 'minute': {
        this._cache.minute = this._scale;
        this.minuteChange.emit(this._cache.minute);
        this.timeChange.emit({
          hour: this._cache.hour,
          minute: this._cache.minute
        });
        break;
      }
    }
  }
}
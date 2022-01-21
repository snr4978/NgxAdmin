import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';

@Injectable({
  providedIn: 'root'
})
export class EventService extends EventEmitter {

  constructor() {
    super();
  }
}

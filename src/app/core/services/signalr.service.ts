import { Injectable } from '@angular/core';
import * as signalr from '@microsoft/signalr'

export const hubs: { [key: string]: string } = {};

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public connect(hub: string | [string, string], handler?: { [key: string]: (...args: any[]) => void }): Promise<signalr.HubConnection> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (token) {
        const connection: signalr.HubConnection = new signalr.HubConnectionBuilder()
          .withUrl(typeof hub === 'string' ?
            `${hubs['default']}/signalr/${hub}` :
            `${hubs[hub[0]]}/${hub[1]}`, {
            accessTokenFactory: () => token
          })
          .withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 5000 })
          .build();
        for (const item in handler) {
          connection.on(item, handler[item]);
        }
        connection
          .start()
          .then(() => resolve(connection))
          .catch(e => reject(e));
      }
      else {
        reject();
      }
    });
  }
}

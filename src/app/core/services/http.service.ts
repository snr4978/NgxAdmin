import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

export const webApis: { [key: string]: string } = {};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient
  ) { }

  private url(api: string | [string, string]): string {
    return typeof api === 'string' ?
      `${webApis['default']}/api/${api}` :
      `${webApis[api[0]]}/${api[1]}`;
  }

  public join(...request: Promise<any>[]): Promise<any> {
    return Promise.all(request);
  }

  public request(
    method: string,
    api: string | [string, string],
    options?: {
      body?: any;
      headers?: {
        [header: string]: string | string[];
      };
      params?: {
        [param: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      onProgress?: (e: any) => void;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = Object.assign({}, options);
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    let observable = this._http.request(method, this.url(api), httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(() => options!.onProgress));
    }
    return firstValueFrom(observable);
  }

  public get(
    api: string | [string, string],
    params?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      onProgress?: (e: any) => void;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = Object.assign({}, options);
    if (params) {
      httpOptions.params ??= {};
      Object.assign(httpOptions.params, params);
    }
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    let observable = this._http.get(this.url(api), httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(() => options!.onProgress));
    }
    return firstValueFrom(observable);
  }

  public post(
    api: string | [string, string],
    data?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      params?: {
        [param: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      onProgress?: (e: any) => void;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = {
      headers: {}
    };
    Object.assign(httpOptions, options);
    httpOptions.headers['Content-type'] = 'application/json; charset=UTF-8';
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    let observable = this._http.post(this.url(api), data, httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(() => options!.onProgress));
    }
    return firstValueFrom(observable);
  }

  public put(
    api: string | [string, string],
    data?: { [key: string]: any },
    params?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      onProgress?: (e: any) => void;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = {
      headers: {}
    };
    Object.assign(httpOptions, options);
    httpOptions.headers['Content-type'] = 'application/json; charset=UTF-8';
    if (params) {
      Object.assign(httpOptions.params, params);
    }
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    let observable = this._http.put(this.url(api), data, httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(() => options!.onProgress));
    }
    return firstValueFrom(observable);
  }

  public patch(
    api: string | [string, string],
    data?: { [key: string]: any },
    params?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      onProgress?: (e: any) => void;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = {
      headers: {}
    };
    Object.assign(httpOptions, options);
    httpOptions.headers['Content-type'] = 'application/json; charset=UTF-8';
    if (params) {
      Object.assign(httpOptions.params, params);
    }
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    let observable = this._http.patch(this.url(api), data, httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(() => options!.onProgress));
    }
    return firstValueFrom(observable);
  }

  public delete(
    api: string | [string, string],
    params?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      onProgress?: (e: any) => void;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = {};
    Object.assign(httpOptions, options);
    if (params) {
      httpOptions.params = httpOptions.params || {};
      Object.assign(httpOptions.params, params);
    }
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    let observable = this._http.delete(this.url(api), httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(() => options!.onProgress));
    }
    return firstValueFrom(observable);
  }

  public download(
    api: string | [string, string],
    name: string,
    method?: string,
    options?: {
      body?: any;
      headers?: {
        [header: string]: string | string[];
      };
      onProgress?: (e: any) => void;
      params?: {
        [param: string]: string | string[];
      };
      withCredentials?: boolean;
    }): Promise<any> {
    const httpOptions: any = {
      observe: 'events',
      responseType: 'blob'
    };
    Object.assign(httpOptions, options);
    if (httpOptions.onProgress) {
      httpOptions.reportProgress = true;
      delete httpOptions.onProgress;
    }
    return new Promise((resolve, reject) => {
      let observable = this._http.request(method || 'get', this.url(api), httpOptions);
      if (httpOptions.reportProgress) {
        observable = observable.pipe(tap(() => options!.onProgress));
      }
      observable.subscribe({
        next: (res: any) => {
          if (res.type === 4) {
            const url = window.URL.createObjectURL(res.body);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
            resolve(res);
          }
        }, 
        error: (error: any) => reject(error)
      });
    });
  }
}

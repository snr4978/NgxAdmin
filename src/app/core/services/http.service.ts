import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return typeof api == 'string' ?
      `${webApis['default']}/api/${api}` :
      `${webApis[api[0]]}/${api[1]}`;
  }

  public join(...request: Promise<Object>[]): Promise<Object> {
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
    }): Promise<Object> {
    const onProgress = options?.onProgress;
    if (onProgress) {
      options['reportProgress'] = true;
      delete options.onProgress;
    }
    let observable = this._http.request(method, this.url(api), options);
    if (onProgress) {
      observable = observable.pipe(tap(onProgress));
    }
    return observable.toPromise();
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
    }): Promise<Object> {
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
    let observable = this._http.get(this.url(api), httpOptions);
    if (httpOptions.reportProgress) {
      observable = observable.pipe(tap(options.onProgress));
    }
    return observable.toPromise();
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
    }): Promise<Object> {
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
      observable = observable.pipe(tap(options.onProgress));
    }
    return observable.toPromise();
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
    }): Promise<Object> {
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
      observable = observable.pipe(tap(options.onProgress));
    }
    return observable.toPromise();
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
    }): Promise<Object> {
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
      observable = observable.pipe(tap(options.onProgress));
    }
    return observable.toPromise();
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
    }): Promise<Object> {
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
      observable = observable.pipe(tap(options.onProgress));
    }
    return observable.toPromise();
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
    }): Promise<Object> {
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
        observable = observable.pipe(tap(options.onProgress));
      }
      observable.subscribe((res: any) => {
        if (res.type == 4) {
          const url = window.URL.createObjectURL(res.body);
          const a = document.createElement('a');
          a.href = url;
          a.download = name;
          a.click();
          window.URL.revokeObjectURL(url);
          resolve(res);
        }
      }, (error: any) => reject(error));
    });
  }
}

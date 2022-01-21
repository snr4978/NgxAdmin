import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<Object> {
    return this._http.request(method, this.url(api), options).toPromise();
  }

  public get(
    api: string | [string, string],
    params?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<Object> {
    const httpOptions: any = {};
    Object.assign(httpOptions, options);
    if (params) {
      httpOptions.params = httpOptions.params || {};
      Object.assign(httpOptions.params, params);
    }
    return this._http.get(this.url(api), httpOptions).toPromise();
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
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<Object> {
    const httpOptions: any = {
      headers: {}
    };
    Object.assign(httpOptions, options);
    httpOptions.headers['Content-type'] = 'application/json; charset=UTF-8';
    return this._http.post(this.url(api), data, httpOptions).toPromise();
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
      reportProgress?: boolean;
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
    return this._http.put(this.url(api), data, httpOptions).toPromise();
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
      reportProgress?: boolean;
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
    return this._http.patch(this.url(api), data, httpOptions).toPromise();
  }

  public delete(
    api: string | [string, string],
    params?: { [key: string]: any },
    options?: {
      headers?: {
        [header: string]: string | string[];
      };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    }): Promise<Object> {
    const httpOptions: any = {};
    Object.assign(httpOptions, options);
    if (params) {
      httpOptions.params = httpOptions.params || {};
      Object.assign(httpOptions.params, params);
    }
    return this._http.delete(this.url(api), httpOptions).toPromise();
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
      params?: {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      withCredentials?: boolean;
    }): Promise<Object> {
    const httpOptions: any = {
      observe: 'events',
      responseType: 'blob'
    };
    Object.assign(httpOptions, options);
    return new Promise((resolve, reject) => {
      this._http.request(method || 'get', this.url(api), httpOptions)
        .subscribe((res: any) => {
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

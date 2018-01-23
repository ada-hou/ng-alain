import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { ICommonResult } from 'app/interface/common/common-result';

@Injectable()
export class HttpBaseService {

    public readonly loading: boolean;
    constructor(
        public http: HttpClient
    ) { }

    private ajaxHeader() {
        return new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8').set('x-requested-with', 'XMLHttpRequest');
    }

    // private configFormData() {
    //     return new HttpHeaders().set('Content-Type', 'multipart/form-data');//;charset=UTF-8
    // }

    // private configJson() {
    //     return new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8');
    // }

    public _post<T>(url, body = {}, config = {}): Observable<ICommonResult<T>> {
        // TODO
        // 这里特意将ICommonResult暴露出来，可以统一处理错误, 或者在http拦截器哪里实现
        // 这里可以统一所有的loading状态
        return this.http.post<ICommonResult<T>>(url, body, {headers: this.ajaxHeader(), ...config});
    }

    // postFormData<T>(url, body = {}, config = {}): Observable<Result<T>> {
    //     const f = new FormData();
    //     for (let i in body) {
    //         f.append(i, body[i]);
    //     }
    //     return this._http.post<T>(ConfigService.baseUrl + url, f, {...config})
    // }

    // postFormDataUpload<T>(url, body = {}, config = {}): Observable<Result<T>> {
    //     const f = new FormData();
    //     for (let i in body) {
    //         if(body.hasOwnProperty(i)) f.append(i, body[i]);
    //     }
    //     return this._http.post<T>(ConfigService.uploadPath + url, f, {...config})
    // }

    // postJson<T>(url, body = {}, config = {}): Observable<Result<T>> {
    //     return this._http.post<T>(ConfigService.baseUrl + url, body, {headers: this.configJson(), ...config})
    // }

    // get<T>(url, body: any = {}, config = {}): Observable<Result<T>> {
    //     return this._http.get<T>(`${ConfigService.baseUrl + url}?${qs.stringify(body)}`, config)
    // }
}

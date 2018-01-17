import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { ICommonResult } from 'app/interface/common/common-result';
import { HttpBaseService } from 'app/service/http-base.service';


@Injectable()
export class SysEndService extends HttpBaseService{

    private sysConfigUrl = 'sys/config/ajaxConfig'; // 获取系统配置

    private sysConfigSubject: Subject<ICommonResult<String>> = new Subject<ICommonResult<String>>();

    constructor(
        public http: HttpClient
    ) {
        super(http);
    }

    public get sysConfigOb(): Observable<ICommonResult<String>> {
        return this.sysConfigSubject.asObservable();
    }
    public getSysConfig(key: string) {
        const params = new HttpParams()
            .set('key', key);
        this._post<String>(this.sysConfigUrl, { params }).subscribe(
            data => {
                this.sysConfigSubject.next(Object.assign({}, data));
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log('An error occurred:', err.error.message);
                } else {
                    console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            }
        );
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { SessionStorageService } from 'ngx-webstorage';
import { ICommonResult } from 'app/interface/common/common-result';
import { HttpBaseService } from 'app/service/http-base.service';
import { HttpStatus } from 'app/enum/http-status.enum';
import { ISysAppInfoMenu } from 'app/interface/init-interface';


@Injectable()
export class SysEndService extends HttpBaseService {

    private sysInfoUrl = 'sys/config/appInfo';
    private sysConfigUrl = 'sys/config/ajaxConfig'; // 获取系统配置

    constructor(
        public http: HttpClient,
        public sessionSt: SessionStorageService
    ) {
        super(http);
    }

    public getAppInfo() {
        return this._post<ISysAppInfoMenu>(this.sysInfoUrl, {}, {});
    }

    public getSysConfig(key: string, callback: Function) {
        let value: string = this.sessionSt.retrieve(key);
        if (value != null && value != "") {
            callback(value);
        } else {
            const params = new HttpParams()
                .set('key', key);
            this._post<string>(this.sysConfigUrl, {}, { params }).subscribe(
                data => {
                    if (data.statusCode == HttpStatus.OK) {
                        this.sessionSt.store(key, data.entity);
                        callback(data.entity);
                    }
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
}

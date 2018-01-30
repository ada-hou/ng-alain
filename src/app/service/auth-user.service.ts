import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { HttpBaseService } from 'app/service/http-base.service';
import { ISysPlatformUser, ISysPlatformMenu } from '../interface/init-interface'
import { ICommonResult } from 'app/interface/common/common-result';
import { IPlatformUser } from 'app/interface/sys/platform-user';
import { IPlatformMenu } from 'app/interface/sys/platform-menu';
import { HttpStatus } from 'app/enum/http-status.enum';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthUserService extends HttpBaseService{

    public isLoggedIn: boolean = false;

    private defaultUrl = "/";
    private redirectUrl: string = this.defaultUrl; // 登录后跳转链接，默认/

    private userLoginUrl = 'login'; // 登录url
    private userLogoutUrl = 'logout';
    private userIsLoginUrl = 'isLogin'
    private userMenuUrl = 'sys/menu/ajaxList'; // 获取用户菜单

    // 登录状态
    // private userIsLoginSubject: Subject<boolean> = new Subject<boolean>();
    // // 用户信息
    // private userInfoSubject: Subject<ISysPlatformUser> = new Subject<ISysPlatformUser>();
    // // 用户菜单
    // private userMenuSubject: Subject<ISysPlatformMenu> = new Subject<ISysPlatformMenu>();
    // // 登录返回结果
    // private userDoLoginSubject: Subject<ISysPlatformUser> = new Subject<ISysPlatformUser>();
    // // 登出返回结果
    // private userDoLogoutSubject: Subject<ICommonResult<Boolean>> = new Subject<ICommonResult<Boolean>>();

    constructor(
        public http: HttpClient
    ) {
        super(http);
    }

    public getRedirectUrl(): string {
        return this.redirectUrl;
    }
    public setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }

    public reSetRedirectUrl() {
        this.redirectUrl = this.defaultUrl;
    }

    private setLoginState(data) {
        data.statusCode == HttpStatus.OK ? (typeof data.entity == 'boolean' ? this.isLoggedIn = data.entity : this.isLoggedIn = true) : this.isLoggedIn = false;
    }

    public getLoginState(): Observable<ICommonResult<boolean>> {
        return this._post<boolean>(this.userIsLoginUrl, {}).map(
            data => {
                this.setLoginState(data);
                return data;
            }
        ).catch(
            err => {
                this.isLoggedIn = false;
                return of(err);
            }
        );
    }
    // public getLoginState(): Observable<ICommonResult<boolean>> {
    //     // return this._post<boolean>(this.userIsLoginUrl, {});
    //     return this._post<boolean>(this.userIsLoginUrl, {}).map(
    //         data => {
    //             if (data.statusCode == HttpStatus.OK) {
    //                 this.isLoggedIn = data.entity;
    //             }
    //             //     // return data.entity;
    //             //     return Observable.of(false);
    //             // } else {
    //             //     this.isLoggedIn = false;
    //             //     return Observable.of(false);
    //             // }
    //             return data;
    //         }
    //     );
    //     // this._post<boolean>(this.userIsLoginUrl, {}).subscribe(
    //     //     data => {
    //     //         this.isLoggedIn = data.entity;
    //     //     },
    //     //     (err: HttpErrorResponse) => {
    //     //         if (err.error instanceof Error) {
    //     //             console.log('An error occurred:', err.error.message);
    //     //         } else {
    //     //             console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //     //         }
    //     //         this.isLoggedIn = false;
    //     //     }
    //     // );
    // }

    public doLogin(account: string, userPassword: string) {
        const params = new HttpParams()
            .set('username', account)
            .set('password', userPassword);
        return this._post<IPlatformUser>(this.userLoginUrl, {}, { params, withCredentials: true})
            .map(
                data => {
                    this.setLoginState(data);
                    return data;
                }
            );
    }

    public doLogout(): void {
        this.isLoggedIn = false;
        this._post<boolean>(this.userLogoutUrl, {}).subscribe(
            data => {
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



    // public get userDoLoginOb(): Observable<ISysPlatformUser> {
    //     return this.userDoLoginSubject.asObservable();
    // }
    // public doLogin(account: string, userPassword: string) {
    //     const params = new HttpParams()
    //         .set('username', account)
    //         .set('password', userPassword);
    //     this._post<IPlatformUser>(this.userLoginUrl, {}, { params, withCredentials: true}).subscribe(
    //     //this.http.post<UserExtendModel>(this.userLoginUrl, {}, { params, withCredentials: true, headers: this.headers }).subscribe(
    //         data => {
    //             this.userDoLoginSubject.next(Object.assign({}, data));
    //         },
    //         (err: HttpErrorResponse) => {
    //             if (err.error instanceof Error) {
    //                 console.log('An error occurred:', err.error.message);
    //             } else {
    //                 console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //             }
    //         }
    //     );
    // }

    // public get userIsLogin$(): Observable<boolean> {
    //     return this.userIsLoginSubject.asObservable();
    // }
    // public getLoginState() {
    //     this._post<boolean>(this.userIsLoginUrl, {}).subscribe(
    //         data => {
    //             if (data.statusCode == HttpStatus.OK) {
    //                 this.isLoggedIn = data.entity;
    //                 this.userIsLoginSubject.next(Object.assign({}, data.entity));
    //             } else {
    //                 this.isLoggedIn = false;
    //                 this.userIsLoginSubject.next(Object.assign({}, false));
    //             }
    //         },
    //         (err: HttpErrorResponse) => {
    //             if (err.error instanceof Error) {
    //                 console.log('An error occurred:', err.error.message);
    //             } else {
    //                 console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //             }
    //             this.isLoggedIn = false;
    //             this.userIsLoginSubject.next(Object.assign({}, false));
    //         }
    //     );
    // }

    // public doLogout(): void {
    //     this._post<Boolean>(this.userLogoutUrl, {}).subscribe(
    //         data => {
    //         },
    //         (err: HttpErrorResponse) => {
    //             if (err.error instanceof Error) {
    //                 console.log('An error occurred:', err.error.message);
    //             } else {
    //                 console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //             }
    //         }
    //     );
    // }

    // public get userMenuOb(): Observable<ISysPlatformMenu> {
    //     return this.userMenuSubject.asObservable();
    // }
    // public getUserMenuInfo() {
    //     this._post<IPlatformMenu>(this.userMenuUrl, {}, { withCredentials: true }).subscribe(
    //         data => {
    //             this.userMenuSubject.next(Object.assign({}, data));
    //         },
    //         (err: HttpErrorResponse) => {
    //             //Observable.throw(err);
    //             if (err.error instanceof Error) {
    //                 // A client-side or network error occurred. Handle it accordingly.
    //                 console.log('An error occurred:', err.error.message);
    //             } else {
    //                 // The backend returned an unsuccessful response code.
    //                 // The response body may contain clues as to what went wrong,
    //                 console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //             }
    //         }
    //     );
    // }

    // public get currentUserOb(): Observable<ISysPlatformUser> {
    //     return this.userInfoSubject.asObservable();
    // }
    // public getUserInfo() {
    //     this._post<IPlatformUser>('', {}, {}).subscribe(
    //         data => {
    //             this.userInfoSubject.next(Object.assign({}, data));
    //         },
    //         (err: HttpErrorResponse) => {
    //             //Observable.throw(err);
    //             if (err.error instanceof Error) {
    //                 // A client-side or network error occurred. Handle it accordingly.
    //                 console.log('An error occurred:', err.error.message);
    //             } else {
    //                 // The backend returned an unsuccessful response code.
    //                 // The response body may contain clues as to what went wrong,
    //                 console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //             }
    //         }
    //     );
    // }
}

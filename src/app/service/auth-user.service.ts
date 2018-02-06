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
import { SettingsService, MenuService } from '@delon/theme';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class AuthUserService extends HttpBaseService {

    public isLoggedIn: boolean = false;

    private defaultUrl = "/";
    private redirectUrl: string = this.defaultUrl; // 登录后跳转链接，默认/

    private userLoginUrl = 'login'; // 登录url
    private userLogoutUrl = 'logout';
    private userIsLoginUrl = 'isLogin'
    private userInfoUrl = 'sys/user/ajaxInfo';
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
        public http: HttpClient,
        private settingService: SettingsService,
        private menuService: MenuService
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

    private baseInfoInit(data){
        this.setLoginState(data);
        if (this.isLoggedIn == true) {
            this.getCurrentUser();
            this.getUserMenuInfo();
        }
    }

    private setLoginState(data) {
        data.statusCode == HttpStatus.OK ? (typeof data.entity == 'boolean' ? this.isLoggedIn = data.entity : this.isLoggedIn = true) : this.isLoggedIn = false;
    }

    private setCurUser(data) {
        data.statusCode == HttpStatus.OK ? this.settingService.setUser(data.entity):this.settingService.setUser(null);
    }

    private buildMenus(data: Array<IPlatformMenu>):void {
        let menus = [];
        // "text": "主导航",
        // "translate": "main_navigation",
        // "group": true,
        for (let menu of data) {
            if (menu.parentId == '1' && menu.isShow == '1') {
                menus.push({
                    "id": menu.id,
                    "text": menu.name,
                    "translate": menu.name,
                    "group": true,
                    "parentIds": menu.parentIds,
                    "children": []
                });
            }
        }
        for (let menu of data) {
            for (let lev1 of menus) {
                if (menu.parentId == lev1.id && menu.isShow == '1') {
                    if (!(lev1.children instanceof Array)) {
                        lev1.children = [];
                    }
                    lev1.children.push({
                        "id": menu.id,
                        "text": menu.name,
                        "translate": menu.name,
                        "group": true,
                        "parentIds": menu.parentIds,
                        "children": [],
                        "icon": menu.icon
                    });
                }
            }
        }
        for (let menu of data) {
            for (let lev1 of menus) {
                for (let lev2 of lev1.children) {
                    if (menu.parentId == lev2.id && menu.isShow == '1') {
                        if (!(lev2.children instanceof Array)) {
                            lev2.children = [];
                        }
                        lev2.children.push({
                            "id": menu.id,
                            "text": menu.name,
                            "translate": menu.name,
                            "group": true,
                            "parentIds": menu.parentIds,
                            "children": [],
                            "link": menu.href
                        });
                    }
                }
            }
        }
        this.menuService.add(menus);
        console.log(menus);
    }

    public doLogin(account: string, userPassword: string): Observable<ICommonResult<IPlatformUser>> {
        const params = new HttpParams()
            .set('username', account)
            .set('password', userPassword);
        return this._post<IPlatformUser>(this.userLoginUrl, {}, { params, withCredentials: true })
            .map(
            data => {
                this.setLoginState(data);
                this.setCurUser(data);
                this.getUserMenuInfo();
                return data;
            }
            );
    }

    public doLogout(): Observable<ICommonResult<boolean>> {
        return this._post<boolean>(this.userLogoutUrl, {})
            .map(
            data => {
                this.isLoggedIn = false;
                return data;
            }
            );
    }

    public getCurrentUser(): void {
        this._post<IPlatformUser>(this.userInfoUrl, {}).subscribe(
            data => {
                this.setCurUser(data);
            }
        );
    }

    // 初始化菜单
    public getUserMenuInfo(): void {
        this._post<Array<IPlatformMenu>>(this.userMenuUrl, {}).subscribe(
            data => {
                if (data.statusCode == HttpStatus.OK) {
                    this.buildMenus(data.entity);
                }
            }
        );
    }

    public getLoginState(): Observable<ICommonResult<boolean>> {
        return this._post<boolean>(this.userIsLoginUrl, {}).map(
            data => {
                this.baseInfoInit(data);
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

import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs/observable/zip';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MenuService, SettingsService, TitleService, ThemeType, ThemesService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { I18NService } from '../i18n/i18n.service';
import { SysEndService } from 'app/service/sys-end.service';
import { environment } from '@env/environment';
import { AuthUserService } from 'app/service/auth-user.service';
import 'rxjs/add/operator/take';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private translate: TranslateService,
        private i18n: I18NService,
        private settingService: SettingsService,
        private themeServ: ThemesService,
        private aclService: ACLService,
        private titleService: TitleService,
        private httpClient: HttpClient,
        private authUserService: AuthUserService,
        private sysEndService: SysEndService,
        private injector: Injector) {

    }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
                this.httpClient.get(`assets/i18n/${this.i18n.defaultLang}.json`),
                this.httpClient.get('assets/app-data.json'),
                this.sysEndService.getAppInfo(),
                this.authUserService.getLoginState()
            ).pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([langData, appData, appInfo, isLoggedIn]) => {
                    resolve(null);
                    return [langData, appData, appInfo, isLoggedIn];
                })
                ).subscribe(([langData, appData, appInfo, isLoggedIn]) => {
                    // setting language data
                    this.translate.setTranslation(this.i18n.defaultLang, langData);
                    this.translate.setDefaultLang(this.i18n.defaultLang);

                    // application data
                    const res: any = appData;
                    // 应用信息：包括站点名、描述、年份
                    //this.settingService.setApp(res.app);
                    this.settingService.setApp(appInfo['entity']);
                    // 用户信息：包括姓名、头像、邮箱地址
                    // this.settingService.setUser(res.user);
                    // ACL：设置权限为全量
                    this.aclService.setFull(true);
                    // 初始化菜单
                    // this.menuService.add(res.menu);
                    // 设置页面标题的后缀
                    //this.titleService.suffix = res.app.name;
                    this.titleService.suffix = this.settingService.app.productName;
                    // 设置初始theme
                    //let theme: ThemeType = "E";
                    //this.themeServ.setTheme(theme);
                    //this.settingService.setLayout('theme', theme);
                    // redirect
                    this.goToRedirect();
                },
                () => { },
                () => {
                    resolve(null);
                });
        });
    }

    private goToRedirect() {
        let curUrl = location.pathname;
        let index = curUrl.indexOf(environment.login_url);

        if (index > 0 && this.authUserService.isLoggedIn == true) {
            this.injector.get(Router).navigate(['/']);
        } else if (this.authUserService.isLoggedIn != true) {
            this.injector.get(Router).navigate([environment.login_url]);
        }
    }
}

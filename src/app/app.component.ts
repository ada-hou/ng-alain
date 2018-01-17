import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemesService, SettingsService, TitleService, _HttpClient } from '@delon/theme';
import { filter, map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { HttpStatus } from 'app/enum/http-status.enum';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.layout.fixed; }
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.layout.boxed; }
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.layout.collapsed; }

    public userMenuInfoSub: Subscription;

    constructor(
        private http: HttpClient,
        private theme: ThemesService,
        private settings: SettingsService,
        private router: Router,
        private titleSrv: TitleService) {
    }

    ngOnInit() {
        this.router.events.pipe(
            filter(evt => evt instanceof NavigationEnd),
            map(() => this.router.url)
        )
            .subscribe(url => {
                this.titleSrv.setTitleByUrl(url);
            });
        //this.getUserMenuInfo();
    }

    // public getUserMenuInfo() {
    //     this.userService.getUserMenuInfo();
    //     this.userMenuInfoSub = this.userService.userMenu
    //         .debounceTime(100).distinctUntilChanged().subscribe(
    //         data => {
    //             console.log(data);
    //             if (data.statusCode == HttpStatus.OK) {
    //                 // 写入缓存
    //             } else if (data.statusCode == HttpStatus.Unauthorized) {
    //                 // 跳转login
    //                 //this.router.navigate(['passport/login']);
    //             }
    //         },
    //         error => console.error(error)
    //         );
    // }
}

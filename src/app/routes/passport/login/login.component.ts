import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
import { AuthUserService } from '../../../service/auth-user.service';
import { Subscription } from 'rxjs';
import { HttpStatus } from 'app/enum/http-status.enum';
import { ISysPlatformUser } from 'app/interface/init-interface';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: []
})
export class UserLoginComponent implements OnDestroy {

    public form: FormGroup;
    public error: String = '';
    public type: Number = 0;
    public loading: Boolean = false;
    public subDoLogin: Subscription;
    public doLoginResult: ISysPlatformUser;
    public subLoginState: Subscription;
    public isLogin: Boolean;
    public count: number = 0;
    public interval$: any;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private authUserService: AuthUserService,
        //public msg: NzMessageService,
        private settingsService: SettingsService
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required]],
            password: [null, Validators.required],
            // mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
    }

    ngOnInit() {
        this.checkIsLogin();
    }

    public checkIsLogin() {
        this.authUserService.getLoginState();
        this.subLoginState = this.authUserService.userIsLoginOb
            .debounceTime(100).distinctUntilChanged().subscribe(
            data => {
                this.isLogin = data.entity;
                if (this.isLogin == true) {
                    this.router.navigate([this.authUserService.getRedirectUrl()]);
                }
            },
            error => {
                console.error(error);
            }
            );
    }
    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.password.markAsDirty();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.captcha.markAsDirty();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }

        this.loading = true;
        this.authUserService.doLogin(this.userName.value, this.password.value);
        this.subDoLogin = this.authUserService.userDoLoginOb
            .debounceTime(100).distinctUntilChanged().subscribe(
            data => {
                this.loading = false;
                this.doLoginResult = data;
                if (this.doLoginResult.statusCode == HttpStatus.OK) {
                    let res = this.authUserService.getRedirectUrl();
                    //console.log(res);
                    this.authUserService.reSetRedirectUrl();
                    this.router.navigate([res]);
                } else {
                    this.error = this.doLoginResult.message;
                }
            },
            error => {
                this.loading = false;
                console.error(error);
            }
            );
        // setTimeout(() => {
        //     this.loading = false;
        //     if (this.type === 0) {
        //         if (this.userName.value !== 'admin' || this.password.value !== '888888') {
        //             this.error = `账户或密码错误`;
        //             return;
        //         }
        //     }

        //     this.tokenService.set({
        //         token: '123456789',
        //         name: this.userName.value,
        //         email: `cipchk@qq.com`,
        //         id: 10000,
        //         time: +new Date
        //     });
        //     this.router.navigate(['/']);
        // }, 1000);
    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
        if (this.isLogin == false) {
            this.subDoLogin.unsubscribe();
        }
        this.subLoginState.unsubscribe();
    }
}

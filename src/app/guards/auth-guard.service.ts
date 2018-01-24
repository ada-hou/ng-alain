import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthUserService } from 'app/service/auth-user.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authUserService: AuthUserService,
        private router: Router) {}
    canActivate() {
        console.log('AuthGuard#canActivate called');
        return true;
    }

}

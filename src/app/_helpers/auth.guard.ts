import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppConstants } from '@app/_constants/app.constants';
import { AccountService } from '@app/_services/account.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private accountService: AccountService, private constants: AppConstants) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (sessionStorage.getItem('user') !== null) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate([this.constants.LOGIN_ROUTE], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
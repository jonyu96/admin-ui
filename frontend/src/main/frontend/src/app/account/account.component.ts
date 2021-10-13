import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Wrapper component for login and register screens.
 */
@Component({ 
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent { 

    constructor(private router: Router) {
        if (sessionStorage.getItem('user')) {
            this.router.navigate(['/']);
        }
    }
}
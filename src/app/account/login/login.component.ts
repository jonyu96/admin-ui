import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '@app/_services/account.service';
import { ToasterService } from '@app/_services/toaster.service';
import { AppConstants } from '@app/_constants/app.constants';
import { environment } from '@environments/environment';
import { User } from '@app/_models/user.model';
import { delay } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Class initiating SDE internal auth or local dev login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  
  loading: boolean;
  needsAccess: boolean;
  submitted: boolean;
  isDevLogin: boolean;
  
  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private ts: ToasterService,
              private constants: AppConstants) { 
  }

  ngOnInit(): void {
    
    // after successful SDE internal auth
    // if (this.route.snapshot.queryParamMap.has('code') && 
    //     this.route.snapshot.queryParamMap.has('state')) {
        
    //     this.fullAuth();
    // }

    // local dev 
    // if (!environment.production) {
    //   this.isDevLogin = true;

    //   this.loginForm = new FormGroup({
    //     'username': new FormControl('', Validators.required)
    //   });
    // }

  }
  
  onLoginClick(): void {

    this.loading = true;

    this.accountService.demoLogin()
      .pipe(delay(500))
      .subscribe(
        res => {
          this.ts.showSuccess("User successfully verified.");

          if (res) {
            this.accountService.saveUser(new User(res));
          }

          this.router.navigateByUrl("/");
        }
      ).add(x => this.loading = false);

    // if (this.needsAccess) {
    //   return;
    // }

    // if (this.isDevLogin) {
    //   this.devAuth();
    // } else {

    //   // redirect to SDE internal auth
    //   window.location.href = environment.sdeAuthApi + this.constants.SDE_LOGIN + this.constants.REFERER; 
    // }
  }

  /**
   * Authenticate user with backend.
   */
  private fullAuth(): void {
    this.loading = true;
          
    const reqPayload = {
      code: this.route.snapshot.queryParams['code'],
      state: this.route.snapshot.queryParams['state'],
      referer: this.constants.REFERER
    };

    this.accountService.login(reqPayload)
      .pipe(delay(500))
      .subscribe(
        res => { 
          this.ts.showSuccess("User successfully verified.");
          this.accountService.saveUser(new User(res['users'][0]));
          this.router.navigateByUrl("/");
        }
      ).add(x => this.loading = false)
  }


  private devAuth(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.ts.showError('Please fill all required fields.');
      return;
    }
    
    this.loading = true;

    this.accountService.devLogin(this.username.value)
      .pipe(delay(500))
      .subscribe(
        res => {
          this.ts.showSuccess("User successfully verified.");
          this.accountService.saveUser(new User(res['users'][0]));
          this.router.navigateByUrl("/");
        }
      ).add(x => this.loading = false)
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }
}

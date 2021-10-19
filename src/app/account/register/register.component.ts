import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '@app/_services/account.service';
import { CustomError } from '@app/_models/custom-error.model';

import { ToasterService } from '@app/_services/toaster.service';
import { AppConstants } from '@app/_constants/app.constants';
import { environment } from '@environments/environment';
import { User } from '@app/_models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    
  registerForm: FormGroup;

  showPassword: boolean;
  submitted: boolean;

  isPsRegistration: boolean;
  psRegistered: boolean;

  isDevRegistration: boolean;

  constructor(public constants: AppConstants,
              private accountService: AccountService, 
              private route: ActivatedRoute,
              private router: Router, 
              private fb: FormBuilder,
              private ts: ToasterService) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    });


    // select admin level for local dev registration
    if (!environment.production) {
      this.isDevRegistration = true;
      this.registerForm.addControl(
        'admin_level', new FormControl('', Validators.required)
      );
    }

    // registration screen redirected from Slack (for PS Bot registration)
    if (this.route.snapshot.queryParams['slack_id']) {
      this.isPsRegistration = true;

      this.registerForm.addControl('slack_id', new FormControl('', Validators.required));
      this.registerForm.addControl('pier_support_group', new FormControl('', Validators.required));
      this.registerForm.addControl('roles', new FormControl([], Validators.required));

      const slackId = this.route.snapshot.queryParams['slack_id'];
      
      this.slackId.patchValue(slackId);
      this.slackId.disable();
    }
  }

  onRegisterClick(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      throw new CustomError('Please fill out all fields.');
    }

    const reqPayload = Object.assign({}, this.registerForm.getRawValue());


    this.accountService.demoRegister(reqPayload)
      .subscribe(
        res => {

          // save registered user to sessionStorage 
          if (res) {
            this.accountService.saveUser(res);
          }

          this.ts.showSuccess("Successfully registered!");
          
          if (!this.isPsRegistration) {
            this.router.navigate([this.constants.LOGIN_ROUTE], { queryParams: { hasRegistered: true }});
          } else {
            this.psRegistered = true;
          }
        }
      )
  }

  toggle(checked: boolean, role: string) {
    const currentRoles = this.roles.value as string[];

    if (checked) {
      currentRoles.push(role);
    } else {
      currentRoles.splice(currentRoles.indexOf(role), 1);
    }
    this.roles.patchValue(currentRoles);
  }

  get firstName(): FormControl {
    return this.registerForm.get('first_name') as FormControl;
  }

  get lastName(): FormControl {
    return this.registerForm.get('last_name') as FormControl;
  }

  get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get slackId(): FormControl {
    return this.registerForm.get('slack_id') as FormControl;
  }

  get pierSupportGroup(): FormControl {
    return this.registerForm.get('pier_support_group') as FormControl;
  }

  get roles(): FormControl {
    return this.registerForm.get('roles') as FormControl;
  }

  get adminLevel(): FormControl {
    return this.registerForm.get('admin_level') as FormControl;
  }
}

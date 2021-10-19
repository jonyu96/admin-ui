import { Component, Input, OnInit } from '@angular/core';
import { DialogComponent } from '@app/_components/dialog/dialog.component';
import { AppConstants } from '@app/_constants/app.constants';
import { User } from '@app/_models/user.model';
import { AdminService } from '@app/_services/admin.service';
import { ToasterService } from '@app/_services/toaster.service';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { NbDialogService } from '@nebular/theme';
import { PsFormComponent } from './ps-form/ps-form.component';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {
  @Input() username: string;

  faRobot = faRobot;

  icons = {
    'RULE': 'flash',
    'BOT': 'message-square',
    'DATASOURCE': 'layers',
    'ROLE': 'umbrella'
  }

  user: User;
  loading: boolean;

  selectedApp: string;
  availablePermissions: string[] = [];
  permissionsToRequest: string[] = [];

  constructor(private adminService: AdminService,
              private dialogService: NbDialogService,
              private toasterService: ToasterService,
              public constants: AppConstants) { }

  ngOnInit(): void {

    // get latest user permissions
    this.adminService.getUser(this.username).subscribe(
      res => {
        this.user = JSON.parse(JSON.stringify(res['users'][0]));
      }
    );
  }

  onAppClick(app: string): void {
    if (this.selectedApp == app) {
      this.selectedApp = null;
    } else {
      this.selectedApp = app;

      // get available permission(s) to request for selected app
      let permissions = this.constants.APPS[this.selectedApp];

      if (this.user.permissions[this.selectedApp]) {
        permissions = [ ...permissions.filter(p => !this.user.permissions[this.selectedApp].includes(p)) ];
      } 

      if (this.user.requested_permissions && this.user.requested_permissions[this.selectedApp]) {
        permissions = [ ...permissions.filter(p => !this.user.requested_permissions[this.selectedApp].includes(p)) ];
      }

      this.availablePermissions = [ ...permissions ];
      this.permissionsToRequest = [];
    }
  }

  // add to permissions to request
  onPermissionClick(permission: string) {
    if (this.permissionsToRequest.includes(permission)) {
      this.permissionsToRequest.splice(this.permissionsToRequest.indexOf(permission), 1);
    } else {
      this.permissionsToRequest.push(permission);
    }
  }

  requestPermissions(): void {
    if (this.permissionsToRequest.length === 0) {
      this.toasterService.showError('Please select permission(s) to request.');
      return;
    }

    if (this.selectedApp==='BOT') {
      this.requestPsBotAccess();
      return;
    }

    this.dialogService.open(DialogComponent, {
      context: {
        message: `Request the following permissions?`,
        app: this.selectedApp,
        permissions: this.permissionsToRequest,
        admin: 'basic'
      }
    }).onClose.subscribe(yes => {
      if (yes) {
        const reqPayload = this.createPayload(this.selectedApp, this.permissionsToRequest);
        this.adminService.requestPermissions(reqPayload).subscribe(res => {
          this.toasterService.showSuccess('Successfully requested permissions.');
          this.updateUser();
        })
      }
    });
  }

  private requestPsBotAccess(): void {
    this.dialogService.open(PsFormComponent).onClose.subscribe(psFormValue => {
      if (psFormValue) {
        const payload = this.createPayload(this.selectedApp, ['access']);
        payload.apps.push({ name: 'ROLE', permissions: psFormValue['roles']});

        this.adminService.requestPsBotAccess(payload, psFormValue['slack_id'], psFormValue['pier_support_group'])
          .subscribe(
            res => {
              this.toasterService.showSuccess('Successfully registered PS Bot access.');
              this.updateUser();
              this.permissionsToRequest = [];
            }
          );
      }
    })
  }

  private updateUser() {
    if (!this.user.requested_permissions) {
      this.user.requested_permissions = {};
    }

    if (!this.user.requested_permissions[this.selectedApp]) {
      this.user.requested_permissions[this.selectedApp] = this.permissionsToRequest;
    } else {
      this.user.requested_permissions[this.selectedApp] = [ ...this.user.requested_permissions[this.selectedApp].concat(this.permissionsToRequest) ];
    }

    this.availablePermissions = [ ...this.availablePermissions.filter(permission => !this.permissionsToRequest.includes(permission)) ];
    this.permissionsToRequest = [];
  }

  private createPayload(app: string, permissions: string[]) {
    return {
      username: this.user.username,
      apps: [{
        name: app,
        permissions: [ ...permissions ]
      }]
    }
  }

}

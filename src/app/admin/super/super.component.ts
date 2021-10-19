import { Component, Input, OnInit } from '@angular/core';
import { DialogComponent } from '@app/_components/dialog/dialog.component';
import { AppConstants } from '@app/_constants/app.constants';
import { CustomError } from '@app/_models/custom-error.model';
import { User } from '@app/_models/user.model';
import { AdminService } from '@app/_services/admin.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogService, NbTagComponent } from '@nebular/theme';


@Component({
  selector: 'app-super',
  templateUrl: './super.component.html',
  styleUrls: ['./super.component.scss']
})
export class SuperComponent implements OnInit {
  @Input() username: string;
  @Input() users: any[];

  selectedUser: User;

  permissions: Object;
  requestedPermissions: Object;

  unapprovedRequests: Object;

  constructor(private adminService: AdminService,
              private dialogService: NbDialogService,
              private toasterService: ToasterService,
              public constants: AppConstants) { }

  ngOnInit(): void {}

  onUserClick(user: User): void {

    if (this.selectedUser && this.selectedUser.username === user.username) {
      this.clearCurrentUser();
    } else {
      this.selectedUser = user;
      
      this.permissions = Object.assign({}, this.selectedUser.permissions);
      
      if (this.selectedUser['requested_permissions']) {
        this.requestedPermissions = Object.assign({}, this.selectedUser.requested_permissions);
      } else {
        this.requestedPermissions = {};
      }

      this.unapprovedRequests = {};
    }
  }

  onAction(action: string) {
    if (action === 'delete-user') {
      this.deleteUser();
    } else if (action === 'update-permissions') {
      this.updatePermissions();
    } else {
      this.approveRequests();
    }
  }

  getSize(body: Object) {
    if (body) {
      let size = 0;
      Object.keys(body).forEach(
        app => size += body[app].length
      )
      return size;
    }
  }

  hasPermission(app_name: string, permission: string) {
    if (this.permissions && this.permissions[app_name] && this.permissions[app_name].includes(permission)) {
      return 'info';
    } else {
      return 'basic';
    }
  }

  onPermissionToggle(app_name: string, permission: string) {
    if (this.permissions) {
      if (this.permissions[app_name]) {
        
        if (this.permissions[app_name].includes(permission)) {
          this.permissions[app_name] = this.permissions[app_name].filter(x => x !== permission);
        } else {
          if (app_name === 'ADMIN') {
            this.permissions[app_name] = [ permission ];
          } else {
            this.permissions[app_name].push(permission);
          }
        }
      } else { // permissions doesn't contain app
        
        this.permissions[app_name] = [ permission ];
      }
    }
  }

  onRequestedPermissionsTagRemove(tagToRemove: NbTagComponent, app: string) {
    let index = this.requestedPermissions[app].indexOf(tagToRemove.text);
    this.requestedPermissions[app].splice(index, 1);

    if (this.unapprovedRequests[app]) {
      this.unapprovedRequests[app].push(tagToRemove.text);
    } else {
      this.unapprovedRequests[app] = [ tagToRemove.text ];
    }
  }

  getActionTitle(action: string) {
    return action.replace('-', ' ').toUpperCase();
  }

  private deleteUser(): void {
    this.dialogService.open(DialogComponent, {
        context: {
          message: `Permanently delete user?`
        }
      }).onClose.subscribe(yes => {
        if (yes) {
          this.adminService.deleteUser(this.selectedUser.username, this.username)
            .subscribe(
              res => {
                this.toasterService.showSuccess(res['message']);
                this.users = this.users.filter(user => user.username !== this.selectedUser.username);
                this.clearCurrentUser();
              }
            )
        }
      });
  }

  private updatePermissions(): void {

    this.dialogService.open(DialogComponent, {
      context: {
        admin: 'super',
        message: 'Update permissions to the following?',
        permissions: this.permissions
      }
    }).onClose.subscribe(
      yes => {
        if (yes) {
          const reqPayload = this.createPayload(this.permissions);

          this.adminService.updatePermissions(reqPayload, this.selectedUser.username)
            .subscribe(
              res => {
                this.updateUserPermissions();
                this.toasterService.showSuccess(res['message']);
              }
            );
        }
      }
    )
  }

  private approveRequests(): void {
    if (!this.requestedPermissions || this.getSize(this.requestedPermissions) === 0) {
      throw new CustomError('No requests to approve!');
    }

    this.dialogService.open(DialogComponent, {
      context: {
        message: 'Approve following permissions?',
        action: 'approve',
        admin: 'super',
        permissions: this.requestedPermissions
      }
    }).onClose.subscribe(
      yes => {
        if (yes) {
          const reqPayload = this.createPayload(this.requestedPermissions);

          this.adminService.approveRequestedPermissions(reqPayload, this.username)
            .subscribe(
              res => {
                this.updateUserRequestedPermissions();
                this.toasterService.showSuccess(res['message']);
              }
            );
        }
      }
    );
  }

  private createPayload(permissionsRequest: any): Object {

    const reqPayload = {
      username: this.selectedUser.username,
      apps: []
    };

    for (let [appName, appPermissions] of Object.entries(permissionsRequest)) {
      reqPayload['apps'].push({
        name: appName,
        permissions: appPermissions
      });
    }
    return reqPayload;
  }

  private updateUserPermissions(): void {
    this.users.find((user: User) => {
      if (user.username === this.selectedUser.username) {
        user.permissions = JSON.parse(JSON.stringify(this.permissions));

        for (let [appName, permissions] of Object.entries(user.permissions)) {
          if (user.requested_permissions && user.requested_permissions[appName]) {
            user.requested_permissions[appName] = user.requested_permissions[appName].filter(p => !permissions.includes(p));
          }
        }
                
        this.requestedPermissions = JSON.parse(JSON.stringify(user.requested_permissions));
        this.permissions = JSON.parse(JSON.stringify(user.permissions));
      }
    });

    // for (let [appName, permissions] of Object.entries(this.removedPermissions)) {      
    //   userRef.permissions[appName] = userRef.permissions[appName].filter(
    //     permission => !permissions.includes(permission));
    // }

    // this.permissions = JSON.parse(JSON.stringify(userRef.permissions)); 
  }

  private updateUserRequestedPermissions(): void {

    this.users.find((user: User) => {
      if (user.username === this.selectedUser.username) {
        
        for (let [appName, permissions] of Object.entries(this.requestedPermissions)) {
          
          // remove approved requests from requestedPermissions
          user.requested_permissions[appName] = user.requested_permissions[appName].filter(p => !permissions.includes(p));

          if (user.requested_permissions[appName].length === 0) {
            delete user.requested_permissions[appName];
          }

          // add approved requests to permissions
          if (user.permissions[appName]) {
            user.permissions[appName].push(...permissions);
          } else {
            user.permissions[appName] = [ ...permissions ];
          }

          this.requestedPermissions = JSON.parse(JSON.stringify(user.requested_permissions));
          this.permissions = JSON.parse(JSON.stringify(user.permissions));
        }
      }
    });

    console.log(this.permissions);
  }

  private clearCurrentUser(): void {
    this.selectedUser = null;
    this.permissions = null;
  }
}

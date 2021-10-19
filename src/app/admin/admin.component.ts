import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models/user.model';
import { AccountService } from '@app/_services/account.service';
import { AdminService } from '@app/_services/admin.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {


  user: User;
  adminLevel: string;

  // for SUPER admin only
  users: User[];


  constructor(private accountService: AccountService,
              private adminService: AdminService) { }
  
  ngOnInit(): void {
    
    this.user = this.accountService.getUser();

    if (this.user.permissions['ADMIN'].includes('super')) {
      this.adminLevel = 'super';  

      this.adminService.getAllUsers(this.user.username)
        .pipe(delay(500))
        .subscribe(res => {
            this.users = res['users'].map(user => new User(user));
          });
    } else {
      this.adminLevel = 'basic';
    }
  }
}

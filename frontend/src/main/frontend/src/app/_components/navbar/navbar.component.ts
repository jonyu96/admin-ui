import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppConstants } from '@app/_constants/app.constants';
import { User } from '@app/_models/user.model';
import { AccountService } from '@app/_services/account.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() user: User; 

  currentRoute: string;

  constructor(public constants: AppConstants,
              private accountService: AccountService,
              private router: Router,
              private dialogService: NbDialogService,
              private ts: ToasterService) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event['url'];
    });
  }

  onRouteClick(route: string): void {
    if (route === this.constants.ADMIN_ROUTE || this.hasReadPermission(route)) {
      this.router.navigateByUrl(route);
    } else {
      this.ts.showError('READ access required.')
    }
  }

  openLogoutDialog(): void {
    if (this.accountService.logout()) {
      this.router.navigateByUrl(this.constants.LOGIN_ROUTE);
    }
  }

  hasReadPermission(route: string) {
    const app = (route === '/pv') ? 'PV_RULE' : 'DATASOURCE';
    return (this.user.isSuperAdmin) || (this.user && this.user['permissions'][app] && this.user['permissions'][app].includes('read'));
  }
}

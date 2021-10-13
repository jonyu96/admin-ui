import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@app/_models/user.model';
import { AccountService } from '@app/_services/account.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  PAGE_TITLES = {
    "/": {
      title: 'Home',
      description: 'Manage admin profile and user permissions.',
      icon: 'home-outline'
    },
    "/admin": {
      title: 'Home',
      description: 'Manage admin profile and user permissions.',
      icon: 'home-outline'
    },
    "/pv": {
      title: "PV Rule",
      description: "View and manage Provision Validation rules.",
      icon: 'flash-outline'
    },
    "/datasource": {
      title: "Datasource",
      description: "View and onboard datasources.",
      icon: 'layers-outline'
    },
    "/pier-issues": {
      title: "Pier Issues",
      description: "View and manage Pier incident tickets.",
      icon: 'alert-circle-outline'
    }
  }

  user: User;
  currentRoute: string;

  constructor(private accountService: AccountService,
              private router: Router) { 
    
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event['url'];
        console.log(this.currentRoute);
    });

    this.accountService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {}
  
}

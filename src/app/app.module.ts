import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RulesModule } from './rules/rules.module';
import { AdminModule } from './admin/admin.module';
import { AccountModule } from './account/account.module';

import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandler } from '@app/_helpers/global-error-handler';
import { NotFoundComponent } from './_components/not-found/not-found.component';
import { DatasourceModule } from './datasource/datasource.module';
import { DialogComponent } from './_components/dialog/dialog.component';
import { AppConstants } from './_constants/app.constants';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { PierIssuesModule } from './pier-issues/pier-issues.module';

@NgModule({
  declarations: [   
    AppComponent,
    NotFoundComponent,
    DialogComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    RulesModule,
    AdminModule,
    AccountModule,
    DatasourceModule,
    PierIssuesModule
  ],
  providers: [
    AppConstants,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
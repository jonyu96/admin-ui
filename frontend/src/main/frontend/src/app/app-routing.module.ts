import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from '@app/account/account.component';
import { LoginComponent } from '@app/account/login/login.component';
import { RegisterComponent } from '@app/account/register/register.component';
import { AuthGuard } from '@app/_helpers/auth.guard';
import { PVComponent } from '@app/pv/pv.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './_components/not-found/not-found.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { PierIssuesComponent } from './pier-issues/pier-issues.component';

export const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full'},
  { path: '404', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'pv', component: PVComponent, canActivate: [AuthGuard] },
  { path: 'datasource', component: DatasourceComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  ] },
  { path: 'pier-issues', component: PierIssuesComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/404' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
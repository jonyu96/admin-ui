import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { PierIssuesComponent } from './pier-issues.component';
import { PierService } from '@app/_services/pier.service';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [PierIssuesComponent, FormComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [PierService]
})
export class PierIssuesModule { }
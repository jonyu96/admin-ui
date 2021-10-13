import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { AdminService } from '@app/_services/admin.service';
import { SuperComponent } from './super/super.component';
import { BasicComponent } from './basic/basic.component';
import { AdminComponent } from './admin.component';
import { PsFormComponent } from './basic/ps-form/ps-form.component';
import { CustomPipe } from './custom.pipe';

@NgModule({
  declarations: [AdminComponent, SuperComponent, BasicComponent, PsFormComponent, CustomPipe],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [AdminService]
})
export class AdminModule { }
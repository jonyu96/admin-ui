import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PVComponent } from './pv.component';
import { FormComponent } from './form/form.component';

import { ToolsComponent } from './tools/tools.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RuleService } from '@app/_services/rule.service';


@NgModule({
  declarations: [PVComponent, FormComponent, ToolsComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxJsonViewerModule,
  ],
  providers: [RuleService]
})
export class PVModule { }

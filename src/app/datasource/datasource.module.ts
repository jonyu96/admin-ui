import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared/shared.module";
import { DatasourceService } from "@app/_services/datasource.service";
import { BodyContentBuilderComponent } from "./body-content-builder/body-content-builder.component";
import { ManualUploadComponent } from "./manual-upload/manual-upload.component";
import { DatasourceComponent } from "./datasource.component";
import { PropFormComponent } from './prop-form/prop-form.component';
import { SwaggerUploadComponent } from './swagger-upload/swagger-upload.component';
import { DatasourceViewComponent } from './datasource-view/datasource-view.component';
import { EndpointFormComponent } from './form-components/endpoint-form/endpoint-form.component';
import { DatasourceFormComponent } from "./form-components/datasource-form/datasource-form.component";

@NgModule({
    declarations: [
      DatasourceComponent,
      ManualUploadComponent,
      BodyContentBuilderComponent,
      PropFormComponent,
      SwaggerUploadComponent,
      DatasourceViewComponent,
      DatasourceFormComponent,
      EndpointFormComponent,
    ],
    imports: [
      CommonModule,
      SharedModule
    ],
    providers: [DatasourceService]
  })
  export class DatasourceModule { }
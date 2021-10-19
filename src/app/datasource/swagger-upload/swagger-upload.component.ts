import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { Datasource } from '@app/_models/datasource.model';
import { DatasourceService } from '@app/_services/datasource.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogRef } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { DatasourceFormComponent } from '../form-components/datasource-form/datasource-form.component';
import { EndpointFormComponent } from '../form-components/endpoint-form/endpoint-form.component';

@Component({
  selector: 'app-swagger-upload',
  templateUrl: './swagger-upload.component.html',
  styleUrls: ['./swagger-upload.component.scss']
})
export class SwaggerUploadComponent implements OnInit {
  @ViewChild(DatasourceFormComponent) datasourceFormChild: DatasourceFormComponent;
  @ViewChild(EndpointFormComponent) endpointFormChild: EndpointFormComponent;


  step: number;

  file: File;
  datasource: Datasource;
  selectedEndpoint: string;

  loading: boolean;
  submitted: boolean;

  constructor(protected ref: NbDialogRef<SwaggerUploadComponent>,
              private fb: FormBuilder,
              private ds: DatasourceService,
              private ts: ToasterService,
              public constants: AppConstants) {}


  ngOnInit(): void { 
    this.step = 0;
  }

  onNext() {
    this.submitted = true;

    switch(this.step) {
      case 0:
        if (this.file) {
          this.parseSwagger(); 
        } else {
          this.ts.showError('Please upload a Swagger file to continue.');
        }
        break;
      case 1:
        const datasourcePayload = this.datasourceFormChild.getPayload();
        if (datasourcePayload) {
          this.updateDatasource(datasourcePayload);
        }
        break;
      case 2:
        const endpointPayload = this.endpointFormChild.getPayload();
        if (endpointPayload) {
          this.updateEndpoints(endpointPayload);
        }
        break;
      case 3:
        this.addDatasource();
        break;
    }
  }

  onUploadFileClick(event: any) {

    const file : File = event.target.files[0];
    
    if (file.type === 'application/json') {
      this.file = file;
    } else {
      this.file = null;
      this.ts.showError('Swagger file must be a JSON file.');
    }
  }

  getStepStatus(step: number) {
    if (step === this.step || step < this.step) {
      return 'text-alternate';
    } else {
      return 'text-hint';
    }
  }

  onSelectEndpoint(endpoint: string, accordionItem: any) {
    this.selectedEndpoint = endpoint;
  }

  onHardcodedChange(value: string, parameterGroup: FormGroup) {
    parameterGroup.get('value').reset();
    parameterGroup.updateValueAndValidity();
  }

  onPrevious() {
    this.step -= 1;
  }

  getJsonView(bodyContentGroup: FormGroup) {
    return bodyContentGroup.getRawValue();
  }

  private parseSwagger() {
    this.loading = true;
    this.ds.uploadSwagger(this.file)
      .subscribe(res => {
        this.ts.showSuccess('Successfully processed Swagger file.');

        this.datasource = new Datasource(res['datasources'][0]);
        console.log(this.datasource);
        this.step += 1;
      })
      .add(x => { this.loading = false; this.submitted = false; });
  }

  private updateDatasource(payload: any) {
    this.datasource.encodedCredentials = payload['encodedCredentials'];
    this.datasource.hostUrl = payload['hostUrl'];
    this.datasource.noDataCodes = [ ...payload['noDataCodes'] ];
    this.datasource.noDataStrings = Object.assign({}, payload['noDataStrings']);

    this.step += 1;
  }

  private updateEndpoints(payload: any) {
    this.datasource.dataSource = Object.assign(payload, {});
    this.step += 1;
  }

  private addDatasource() {
    this.loading = true;
    this.ds.addDatasource(this.datasource)
      .pipe(delay(500))
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.ref.close(res['datasources'][0]);
      })
      .add(x => this.loading = false);
  }
}

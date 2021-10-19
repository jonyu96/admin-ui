import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { Datasource, EndpointData } from '@app/_models/datasource.model';
import { DatasourceService } from '@app/_services/datasource.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogRef } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { DatasourceFormComponent } from '../form-components/datasource-form/datasource-form.component';
import { EndpointFormComponent } from '../form-components/endpoint-form/endpoint-form.component';

@Component({
  selector: 'app-manual-upload',
  templateUrl: './manual-upload.component.html',
  styleUrls: ['./manual-upload.component.scss']
})
export class ManualUploadComponent implements OnInit {

  @ViewChild(DatasourceFormComponent) datasourceFormChild: DatasourceFormComponent;
  @ViewChild(EndpointFormComponent) endpointFormChild: EndpointFormComponent;
  
  @Input() datasource: Datasource;
  @Input() endpoint: EndpointData;
  @Input() intent: string;

  submitted: boolean;
  loading: boolean;
    
  constructor(protected ref: NbDialogRef<ManualUploadComponent>,
              private fb: FormBuilder,
              private ds: DatasourceService,
              private ts: ToasterService,
              public constants: AppConstants,
              private cdRef: ChangeDetectorRef) {}
  
  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    
    if (this.intent === 'Add-Datasource') {

      const datasourcePayload = this.datasourceFormChild.getPayload();
      const endpointPayload = this.endpointFormChild.getPayload();

      if (!datasourcePayload || !endpointPayload) { return; }

      datasourcePayload['dataSource'] = endpointPayload;
      this.addDatasource(datasourcePayload);

    } else if (this.intent === 'Edit-Datasource') {
      
      const datasourcePayload = this.datasourceFormChild.getPayload();
      if (!datasourcePayload) { return; }
      this.editDatasource(datasourcePayload);

    } else if (this.intent === 'Add-Endpoint') {

      const endpointPayload = this.endpointFormChild.getPayload();
      if (!endpointPayload) { return; }


      this.addEndpoint(Object.values(endpointPayload)[0]);

    } else if ('Edit-Endpoint') {
      
      const endpointPayload = this.endpointFormChild.getPayload();
      if (!endpointPayload) { return; }

      this.editEndpoint(Object.values(endpointPayload)[0]);

    }

  }

  onCancel() {
    this.ref.close();
  }

  private addDatasource(reqPayload: any) {
    
    this.loading = true;
    this.ds.addDatasource(reqPayload).pipe(
      delay(500)
    ).subscribe(
      res => {
        if (res['datasources'] && Array.isArray(res['datasources'])) {
          this.ref.close(res['datasources'][0]);
        }
      }
    ).add(() => this.loading = false);
  }

  private addEndpoint(reqPayload: any) {
    this.loading = true;
    this.ds.addEndpoint(this.datasource.name, reqPayload)
      .pipe(delay(500))
      .subscribe(
        res => {
          this.ref.close(new EndpointData(reqPayload));
        }
      ).add(() => this.loading = false);
  }

  private editDatasource(reqPayload: any) {

    this.loading = true;
    this.ds.modifyDatasource(reqPayload).pipe(
      delay(500)
    ).subscribe(
      res => {
        this.ref.close(reqPayload);
      }
    ).add(() => this.loading = false);
  }

  private editEndpoint(reqPayload: any) {
    this.loading = true;
    this.ds.modifyEndpoint(this.datasource.name, reqPayload).pipe(
      delay(500)
    ).subscribe(
      res => {
        this.ref.close(new EndpointData(reqPayload));
      }
    ).add(() => this.loading = false);
  }
}


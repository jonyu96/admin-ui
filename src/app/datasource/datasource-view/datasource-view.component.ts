import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DialogComponent } from '@app/_components/dialog/dialog.component';
import { Datasource, EndpointBody, EndpointData } from '@app/_models/datasource.model';
import { User } from '@app/_models/user.model';
import { DatasourceService } from '@app/_services/datasource.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { ManualUploadComponent } from '../manual-upload/manual-upload.component';

@Component({
  selector: 'app-datasource-view',
  templateUrl: './datasource-view.component.html',
  styleUrls: ['./datasource-view.component.scss']
})
export class DatasourceViewComponent {

  @Input() datasource: Datasource;
  @Input() showActions: boolean;
  @Input() user: User;

  @Output() datasourceModified: EventEmitter<Datasource> = new EventEmitter<Datasource>();
  @Output() datasourceDeleted: EventEmitter<Datasource> = new EventEmitter<Datasource>();

  @Output() updateDatasource: EventEmitter<Datasource> = new EventEmitter<Datasource>();

  endpoint: EndpointData;
  bodyContent: any;

  httpMethodStatus: Object = {
    "GET": "info",
    "POST": "success",
    "PUT": "warning",
    "DELETE": "danger"
  }

  constructor(private datasourceService: DatasourceService,
              private dialogService: NbDialogService,
              private toasterService: ToasterService) { }

  // prep bodyContent to display when endpoint selected
  onSelectEndpoint(selectedEndpoint: EndpointData) {
    this.bodyContent = null;

    if (selectedEndpoint.body.bodyContent && Object.keys(selectedEndpoint.body.bodyContent).length > 0) {
      this.bodyContent = new FormGroup({});

      const content = {};
      const temp = Object.values(selectedEndpoint.body.bodyContent)[0];
      console.log(selectedEndpoint.body.bodyContent);

      for (let [k, v] of Object.entries(temp)) {
        content[k] = JSON.parse(v);
      }
      this.createBodyContent(content, this.bodyContent);
    }
    this.endpoint = selectedEndpoint; 
  }
  
  onEditDatasource() {
    if (!this.datasource) {
      this.toasterService.showError('Please SELECT a datasource to edit.');
      return;
    }

    if (!this.hasPermission('edit')) {
      this.toasterService.showError('EDIT access required.');
      return;
    }

    this.dialogService.open(
      ManualUploadComponent, {
        context: {
          datasource: this.datasource,
          intent: 'Edit-Datasource'
        }
      }
    ).onClose.subscribe(modifiedDatasource => {
      if (modifiedDatasource) {
        this.toasterService.showSuccess('Successfully modified datasource.');

        this.datasource.encodedCredentials = modifiedDatasource['encodedCredentials'];
        this.datasource.hostUrl = modifiedDatasource['hostUrl'];
        this.datasource.noDataCodes = [ ...modifiedDatasource['noDataCodes'] ];
        this.datasource.noDataStrings = Object.assign({}, modifiedDatasource['noDataStrings']);

        this.datasourceModified.emit(modifiedDatasource);
      }
    });

  }

  onAddEndpoint() {
    if (!this.datasource) {
      this.toasterService.showError('Please SELECT a datasource to add endpoint to.')
      return;
    }

    if (!this.hasPermission('delete')) {
      this.toasterService.showError('EDIT access required.');
      return;
    }

    this.dialogService.open(
      ManualUploadComponent, {
        context: {
          intent: 'Add-Endpoint',
          datasource: this.datasource
        }
      }
    ).onClose.subscribe((newEndpoint: EndpointData) => {
      if (newEndpoint) {
        this.toasterService.showSuccess('Successfully added endpoint.');
        this.datasource.dataSource[newEndpoint.operationId] = Object.assign({}, newEndpoint);
        this.updateDatasource.emit(this.datasource);
      }
    });
  }

  onDeleteDatasource() {
    if (!this.datasource) {
      this.toasterService.showError('Please SELECT a datasource to delete.')
      return;
    }

    if (!this.hasPermission('delete')) {
      this.toasterService.showError('DELETE access required.');
      return;
    }

    this.dialogService.open(
      DialogComponent, { context: { message: 'Permanently delete datasource?' } }
    ).onClose.subscribe(deleted => {
      if (deleted) {
        this.datasourceService.deleteDatasource(this.datasource.name).subscribe(
          res => {
            this.toasterService.showSuccess('Successfully deleted datasource.');
            this.datasourceDeleted.emit(this.datasource); 
          }
        )
      }
    });
  }

  onEditEndpoint(event: any, endpointData: EndpointData) {
    event.stopPropagation();
    
    if (this.hasPermission('edit')) {
      this.dialogService.open(
        ManualUploadComponent, {
          context: {
            intent: 'Edit-Endpoint',
            datasource: this.datasource,
            endpoint: endpointData
          }
        }
      ).onClose.subscribe(modifiedEndpoint => {
        if (modifiedEndpoint) {
          this.toasterService.showSuccess('Successfully edited datasource.');
          this.datasource.dataSource[endpointData.operationId] = Object.assign({}, modifiedEndpoint);
          this.updateDatasource.emit(this.datasource);
        }
      });
    } else {
      this.toasterService.showError('EDIT access required.');
    }

  }

  onEndpointDelete(event: any, endpointName: string) {
    event.stopPropagation();

    if (this.hasPermission('edit')) {
      this.dialogService.open(
        DialogComponent, {
          context: {
            message: 'Permanently delete endpoint?'
          }
        }
      ).onClose.subscribe(yes => {
        if (yes) {
          this.datasourceService.deleteEndpoint(this.datasource.name, endpointName)
            .subscribe(
              res => {
                this.toasterService.showSuccess('Successfully deleted endpoint.');
                delete this.datasource.dataSource[endpointName];
                this.updateDatasource.emit(this.datasource);
              }
            );
        }
      });
    } else {
      this.toasterService.showError('EDIT access required.');
    }

  }

  hasPermission(action: string): boolean {
    return this.user.permissions['ADMIN'].includes('super') ||
      this.user.permissions['DATASOURCE'].includes(action);
  }

  private createBodyContent(content: Object, bodyContent: FormGroup) {
    for (let [k, v] of Object.entries(content)) {

      if (Array.isArray(v) && v[0] instanceof Object) {
        const temp = new FormGroup({});

        bodyContent.addControl(k, new FormArray([ temp ]));
        this.createBodyContent(v[0], temp);

      } else if (v instanceof Object && !Array.isArray(v)) {
        const temp = new FormGroup({});

        bodyContent.addControl(k, temp);
        this.createBodyContent(v, temp);

      } else {
        bodyContent.addControl(k, new FormControl(v));
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '@app/_components/dialog/dialog.component';
import { Datasource, EndpointData } from '@app/_models/datasource.model';
import { User } from '@app/_models/user.model';
import { AccountService } from '@app/_services/account.service';
import { DatasourceService } from '@app/_services/datasource.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { ManualUploadComponent } from './manual-upload/manual-upload.component';
import { SwaggerUploadComponent } from './swagger-upload/swagger-upload.component';

@Component({
  selector: 'app-datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.scss']
})
export class DatasourceComponent implements OnInit {
  datasources: Datasource[];
  datasource: Datasource;

  user: User;

  constructor(private datasourceService: DatasourceService,
              private dialogService: NbDialogService,
              private toasterService: ToasterService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.user = this.accountService.getUser();
    
    this.datasourceService.getDatasources()
      .pipe(delay(500))
      .subscribe( res => {
        if (res['datasources']) {
          this.datasources = [ ...res['datasources'].map(ds => new Datasource(ds)) ];
        }
      });
  }

  onClickDatasource(event: Datasource) {
    if (this.datasource && this.datasource.name === event.name) {
      this.datasource = null;
    } else {
      this.datasource = Object.assign({}, event);
    }
  }

  onAddDatasource() {
    if (!this.hasPermission('create')) {
      this.toasterService.showError('CREATE access required.');
      return;
    }

    this.dialogService.open(
      ManualUploadComponent, { context: { intent: 'Add-Datasource' } }
    ).onClose.subscribe(yes => {
      if (yes) {
        this.toasterService.showSuccess('Successfully configured new datasource.');
        const newDatasource = new Datasource(yes);
        this.datasources = [ newDatasource, ...this.datasources ];
      }
    });
  }


  onUploadSwagger() {
    if (!this.hasPermission('create')) {
      this.toasterService.showError('CREATE access required.');
      return;
    }

    this.dialogService.open(
      SwaggerUploadComponent 
    ).onClose.subscribe((newDatasource: Datasource) => {
      if (newDatasource) {
        this.toasterService.showSuccess('Successfully onboarded datasource from Swagger file.');
        this.datasources = [ newDatasource, ...this.datasources ];
      }
    });

  }

  onDatasourceModified(modifiedDatasource: Datasource) {
    this.datasources = [ ...this.datasources.map((d: Datasource) => {
      if (d.name === modifiedDatasource.name) {
        d.encodedCredentials = modifiedDatasource['encodedCredentials'];
        d.hostUrl = modifiedDatasource['hostUrl'];
        d.noDataCodes = [ ...modifiedDatasource['noDataCodes'] ];
        d.noDataStrings = Object.assign({}, modifiedDatasource['noDataStrings']);
      }
      return d;
    })];
  }

  onDatasourceDeleted(deletedDatasource: Datasource) {
    this.datasources = [ ...this.datasources.filter((d: Datasource) => d.name !== deletedDatasource.name) ];
    this.datasource = null;
  }

  // update datasource where endpoint has been added, modified, or deleted
  onUpdateDatasource(updatedDatasource: Datasource) {
    this.datasources.find((d: Datasource) => {
      if (d.name === updatedDatasource.name) {
        d.dataSource = Object.assign({}, updatedDatasource.dataSource);
        return true;
      }
    });
  }

  hasPermission(action: string): boolean {
    return this.user.permissions['ADMIN'].includes('super') ||
      this.user.permissions['DATASOURCE'].includes(action);
  }

}

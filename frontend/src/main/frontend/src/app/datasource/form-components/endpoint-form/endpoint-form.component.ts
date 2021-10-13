import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { Datasource, EndpointBody, EndpointData, EndpointParameter } from '@app/_models/datasource.model';
import { ToasterService } from '@app/_services/toaster.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-endpoint-form',
  templateUrl: './endpoint-form.component.html',
  styleUrls: ['./endpoint-form.component.scss']
})
export class EndpointFormComponent implements OnInit {

  @Input() datasource: Datasource;  
  @Input() endpoint: EndpointData;

  @Input() submitted: boolean;
  @Input() intent: string;
  
  endpointData: FormArray;
  edited: boolean;

  PARAMETER_FIELDS = ['Parameter Name', 'In', 'Type', 'Hardcoded', 'Value', 'Required'];
  
  constructor(public constants: AppConstants,
              private ts: ToasterService) { }

  ngOnInit(): void {
    this.endpointData = new FormArray([]);

    switch(this.intent) {
      case 'Populate-Values':
        Object.values(this.datasource.dataSource).forEach((endpoint: EndpointData) => {
          this.endpointData.push(this.addEndpointGroup(endpoint));
        });
        break;
      case 'Edit-Endpoint':
        this.endpointData.push(this.addEndpointGroup(this.endpoint));
        break;
      default: // Add-Datasource and Add-Endpoint
        this.endpointData.push(this.addEndpointGroup());
        break;
    }
  }

  onAddEndpointData() {
    this.endpointData.push(this.addEndpointGroup());
    this.endpointData.updateValueAndValidity(); 
  }

  onDeleteEndpointData(index: number) {
    this.endpointData.controls.splice(index, 1);
    this.endpointData.updateValueAndValidity();
  }

  onAddParameter(endpointDataGroup: FormGroup) {
    this.getParameters(endpointDataGroup).push(this.createParameterGroup());
  }

  onDeleteParameter(endpointDataGroup: FormGroup, index: number) {
    this.getParameters(endpointDataGroup).controls.splice(index, 1);
    this.getParameters(endpointDataGroup).updateValueAndValidity();

    if (this.endpoint) {
      this.edited = true;
    }
  }

  getPayload() {
    if (!this.endpointData.valid) {
      this.ts.showError('Please fill all required fields.');
      return null;
    }

    if (this.intent !== 'Populate-Values' && this.endpointData.pristine && !this.edited) {
      this.ts.showError('Please make an edit.');
      return null;
    }

    const result = {};

    this.endpointData.controls.forEach((endpoint: FormGroup) => {
      const operationId = this.getOperationId(endpoint).value;

      result[operationId] = {};

      result[operationId]['operationId'] = operationId;
      result[operationId]['endpoint'] = '/' + this.getEndpoint(endpoint).value;
      result[operationId]['httpMethod'] = this.getHttpMethod(endpoint).value;
      result[operationId]['parameter'] = this.getParameterPayload(this.getParameters(endpoint));
      result[operationId]['body'] = this.getBodyPayload(this.getBody(endpoint));
    });

    return result;
  }

  bodyContentToPopulate(bodyContent: FormGroup) {
    return bodyContent && Object.keys(bodyContent.get('ROOT').value).length > 0;
  } 

  private getParameterPayload(parameter: FormArray) {
    let result = [];

    parameter.controls.forEach(param => {
      let temp = {};

      temp['parameterName'] = param.get('parameterName').value ? param.get('parameterName').value : null;
      temp['in'] = param.get('in').value ? param.get('in').value : null;
      temp['type'] = param.get('type').value ? param.get('type').value : null;
      temp['required'] = param.get('required').value === 'true';
      temp['hardcoded'] = param.get('hardcoded').value === 'true';
      temp['value'] = param.get('value').value ? param.get('value').value : null;

      result.push(temp);
    });

    return result;
  } 

  private getBodyPayload(body: FormGroup) {
    let result = {
      type: body.get('type').value ? body.get('type').value : null,
      required: body.get('required').value ? body.get('required').value==='true' : false,
    };

    if (Object.keys(body.get('bodyContent').get('ROOT').value).length > 0) {
      result['bodyContent'] = { 'application/json': {} };

      const bodyContent = {};

      for (let [k, v] of Object.entries(body.get('bodyContent').get('ROOT').value)) {
        bodyContent[k] = JSON.stringify(v).replace(/"/g, '\"'); 
      }

      for (let contentType of body.get('contentTypes').value as Array<string>) {
        result['bodyContent'][contentType] = bodyContent;
      }
    } else {
      result['bodyContent'] = {};
    }

    return result;
  }

  private addEndpointGroup(endpoint?: EndpointData) {
    const temp = new FormGroup({
      operationId: new FormControl(endpoint ? endpoint.operationId : '', Validators.required),
      endpoint: new FormControl(endpoint ? endpoint.endpoint.replace('/', '') : '', Validators.required),
      httpMethod: new FormControl(endpoint ? endpoint.httpMethod : '', Validators.required),
      parameter: new FormArray((endpoint && endpoint['parameter']) ? endpoint['parameter'].map(param => this.createParameterGroup(param) ) : []),
      body: endpoint ? this.createBodyGroup(endpoint.body) : this.createBodyGroup()
    });

    if (this.intent === 'Edit-Endpoint' || this.intent === 'Populate-Values') {
      temp.get('operationId').disable();
    }

    return temp;
  }

  private createParameterGroup(param?: EndpointParameter) {
    return new FormGroup({
      parameterName: new FormControl(param ? param.parameterName : ''),
      in: new FormControl(param ? param.in : ''),
      required: new FormControl(param ? String(param.required) : ''),
      type: new FormControl(param ? param.type : ''),
      hardcoded: new FormControl(param ? String(param.hardcoded) : ''),
      value: new FormControl(param ? param.value : ''),
    });
  }

  private createBodyGroup(endpointBody?: EndpointBody) {

    const bodyGroup = new FormGroup({
      type: new FormControl(endpointBody && endpointBody.type ? endpointBody.type : null),
      contentTypes: new FormControl(['application/json']),
      required: new FormControl(endpointBody ? String(endpointBody.required) : null),
      bodyContent: new FormGroup({ 'ROOT': new FormGroup({}) })
    });

    if (endpointBody && endpointBody.bodyContent && Object.keys(endpointBody.bodyContent).length > 0) {

      const content = {};
      const temp = Object.values(endpointBody.bodyContent)[0];
      bodyGroup.get('contentTypes').patchValue(Object.keys(endpointBody.bodyContent));
      
      for (let [k, v] of Object.entries(temp)) {
        content[k] = JSON.parse(v);
      }
      
      this.createBodyContent(content, bodyGroup.get('bodyContent').get('ROOT') as FormGroup);
    }

    bodyGroup.get('bodyContent').valueChanges
      .pipe(distinctUntilChanged())
      .subscribe( x => {
        this.edited = true;
      });

    return bodyGroup;
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

  getOperationId(endpointDataGroup: FormGroup): FormControl {
    return endpointDataGroup.get('operationId') as FormControl;
  }

  getEndpoint(endpointDataGroup: FormGroup): FormControl {
    return endpointDataGroup.get('endpoint') as FormControl;
  }

  getHttpMethod(endpointDataGroup: FormGroup): FormControl {
    return endpointDataGroup.get('httpMethod') as FormControl;
  }

  getParameters(endpointDataGroup: FormGroup): FormArray {
    return endpointDataGroup.get('parameter') as FormArray;
  }

  getBody(endpointDataGroup: FormGroup): FormGroup {
    return endpointDataGroup.get('body') as FormGroup;
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomError } from '@app/_models/custom-error.model';
import { Datasource } from '@app/_models/datasource.model';
import { NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-datasource-form',
  templateUrl: './datasource-form.component.html',
  styleUrls: ['./datasource-form.component.scss']
})
export class DatasourceFormComponent implements OnInit {
  
  edited: boolean;

  @Input() submitted: boolean;
  @Input() datasource: Datasource;

  datasourceForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.datasourceForm = new FormGroup({
      'name': new FormControl(this.datasource ? this.datasource.name : '', Validators.required),
      'encodedCredentials': new FormControl(this.datasource ? this.datasource.encodedCredentials : '', Validators.required),
      'hostUrl': new FormControl(this.datasource ? this.datasource.hostUrl : '', Validators.required),
      'noDataHandle': this.createNoDataHandle()
    });

    this.noDataHandle.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(x => this.edited = true);

    if (this.datasource) {
      this.name.disable();
    }
  }

  onAddNoDataHandle() {
    this.noDataHandle.push(this.createNoDataHandleGroup());
  }

  onDeleteNoDataHandle(index: number) {
    this.noDataHandle.controls.splice(index, 1);
    this.noDataHandle.updateValueAndValidity();
  }

  onAddString({ value, input }: NbTagInputAddEvent, noDataHandleGroup: FormGroup) {
    const responseStrings: FormControl = noDataHandleGroup.get('responseStrings') as FormControl;

    responseStrings.value.push(value);
    responseStrings.updateValueAndValidity();
    input.nativeElement.value = '';
  }

  onRemoveString(tagToRemove: NbTagComponent, noDataHandleGroup: FormGroup) {
    const responseStrings: FormControl = noDataHandleGroup.get('responseStrings') as FormControl;

    responseStrings.value.splice(responseStrings.value.indexOf(tagToRemove.text), 1);
    responseStrings.updateValueAndValidity();
  }

  getPayload() {
    if (!this.datasourceForm.valid) {
      throw new CustomError('Please fill all required fields.');
    }

    if (this.datasource && (this.datasourceForm.pristine && !this.edited)) {
      throw new CustomError('Please make an edit.');
    }

    const result = {};

    result['name'] = this.name.value;
    result['encodedCredentials'] = this.encodedCredentials.value;
    result['hostUrl'] = this.hostUrl.value;
    result['noDataCodes'] = [];
    result['noDataStrings'] = {};

    this.noDataHandle.controls.forEach((noDataHandleGroup: FormGroup) => {
      const httpCode = noDataHandleGroup.get('httpCode').value;
      const responseStrings: string[] = noDataHandleGroup.get('responseStrings').value;

      result['noDataCodes'].push(httpCode);
      result['noDataStrings'][httpCode] = [ ...responseStrings ];
    });

    return result;
  }

  private createNoDataHandle() {
    const formArray = this.fb.array([]);

    if (this.datasource && this.datasource.noDataStrings) {
      for (let [k, v] of Object.entries(this.datasource.noDataStrings)) {
        formArray.push(this.createNoDataHandleGroup(Number(k), v));
      }
    }
    return formArray;
  }

  private createNoDataHandleGroup(httpCode?: number, responseStrings?: string[]) {
    return new FormGroup({
      httpCode: new FormControl(httpCode ? Number(httpCode) : '', [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern('[0-9]*') ]),
      responseStrings: new FormControl(responseStrings ? [ ...responseStrings ] : [], Validators.required)
    })
  }

  get name(): FormControl {
    return this.datasourceForm.get('name') as FormControl;    
  }

  get encodedCredentials(): FormControl {
    return this.datasourceForm.get('encodedCredentials') as FormControl;
  }

  get hostUrl(): FormControl {
    return this.datasourceForm.get('hostUrl') as FormControl;
  }

  get endpointData(): FormArray {
    return this.datasourceForm.get('endpointData') as FormArray;
  }

  get noDataHandle(): FormArray {
    return this.datasourceForm.get('noDataHandle') as FormArray;
  }

}

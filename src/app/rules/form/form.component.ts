// form.component.ts
/**
 * Component responsible for displaying selected rule as well as adding/editing/deleting rule. 
 * 
 * Utilizes Nebular's Reactive Form for adding/editing/deleting rule. 
 */

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';

import { Rule } from '../../_models/rule.model';
import { RuleService } from '@app/_services/rule.service';
import { User } from '@app/_models/user.model';
import { ToasterService } from '@app/_services/toaster.service';
import { CustomError } from '@app/_models/custom-error.model';
import { AppConstants } from '@app/_constants/app.constants';
import { NbDialogRef, NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { Datasource } from '@app/_models/datasource.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() rule: Rule;
  @Input() userAction: string;
  @Input() user: User;
  @Input() datasources: Datasource[];

  ruleForm: FormGroup;

  valuesDisabled: boolean;
  externalDataKeyDisabled: boolean;
  endpoints: string[];
  
  submitted: boolean;
  formEdited: boolean;
  loading: boolean;

  
  constructor(protected ref: NbDialogRef<FormComponent>,
              private fb: FormBuilder,
              private rs: RuleService,
              private cdRef: ChangeDetectorRef,
              private ts: ToasterService,
              public constants: AppConstants) { }
  

  ngOnInit() {
    this.ruleForm = this.fb.group({
      rule_id: [this.rule ? this.rule.rule_id : '', Validators.required],
      rule_name: [this.rule ? this.rule.rule_name : '', Validators.required],
      active: [this.rule ? String(this.rule.active) : '', Validators.required],
      features: [this.rule ? [ ...this.rule.features ] : [], Validators.required],
      data_type: [this.rule ? this.rule.data_type : '', Validators.required],
      datasource: [this.rule ? this.rule.data_source.split(',')[0] : '', Validators.required ],
      endpoint: [this.rule ? this.rule.data_source.split(',')[1] : '', Validators.required], 
      result_text: [this.rule ? this.rule.result_text : '', Validators.required],
      system: [this.rule ? this.rule.system : '', Validators.required],
      event_types: [this.rule ? [ ...this.rule.event_types] : [], Validators.required],
      default_response: [this.rule ? this.rule.default_response: '', Validators.required],
      method: [this.rule ? this.rule.method : '', Validators.required],
      validate_external_data: [this.rule ? String(this.rule.validate_external_data) : '', Validators.required],
      customer_issue: [this.rule ? this.rule.customer_issue : '']
    });

    this.ruleForm.addControl('sdkGroup', this.createSdkGroup());
    
    if (this.userAction === 'Add') {
      this.endpoint.disable();
    } else {
      this.populateEndpoints(this.datasource.value);
    }

    this.cdRef.detectChanges();
  }

  private createSdkGroup() {
    const sdkGroup = this.fb.array([]);

    if (this.rule) {
      this.rule.subscription_data_keys.forEach(sdk => {
        sdkGroup.push(this.addSdkGroupForm(sdk));
      });
    } else {
      sdkGroup.push( this.addSdkGroupForm() );
    }
    return sdkGroup;
  }

  private addSdkGroupForm(sdk?: string, ) {
    const groupForm = this.fb.group({
      subscription_data_key: [sdk ? sdk : '', Validators.required],
      values: [sdk && this.rule.values && this.rule.values[sdk].length > 0 ? [ ...this.rule.values[sdk] ] : [], Validators.required],
      external_data_key: [sdk && this.rule.external_data_key && this.rule.external_data_key[sdk] ? this.rule.external_data_key[sdk] : '', Validators.required],
      criteria: sdk && this.rule.criteria && Object.keys(this.rule.criteria[sdk]).length > 0 ? this.fb.group({
        key: Object.keys(this.rule.criteria[sdk])[0],
        value: Object.values(this.rule.criteria[sdk])[0]
      }) : this.fb.group({ key: '', value: ''})
    });

    if (this.method.value && this.method.value === 'exists') {
      groupForm.get('values').disable();
      groupForm.get('external_data_key').disable();
    } else if (this.validateExternalData.value) {
      if (this.validateExternalData.value === 'true') {
        groupForm.get('values').disable();
      } else {
        groupForm.get('external_data_key').disable();
      }
    }

    return groupForm;
  }

  onAdd(): void {
    this.submitted = true;

    if (this.ruleForm.valid) {
      const reqPayload = this.createReqPayload();
      reqPayload['create_user'] = this.user.username;

      this.addRule(reqPayload);
    } else {
      throw new CustomError('Please fill out all required fields.');
    }
  }

  onEdit(): void {
    this.submitted = true;

    if (this.ruleForm.pristine && !this.formEdited) {
      throw new CustomError('Please make an edit.');
    }

    if (this.ruleForm.valid) {
      const reqPayload = this.createReqPayload();
      reqPayload['mod_user'] = this.user.username;

      reqPayload['create_user'] = this.rule.create_user;
      reqPayload['create_dttm'] = this.rule.create_dttm;

      this.modifyRule(reqPayload);
    } else {
      throw new CustomError('Please fill out all required fields.');
    }
  }

  onNo(): void {
    this.ref.close();
  }

  onAddFeature({ value, input }: NbTagInputAddEvent) {
    if (!this.features.value.includes(value)) {
      (this.features.value as string[]).push(value);
      this.features.updateValueAndValidity();
      input.nativeElement.value = '';
      this.formEdited = true;
    }
  }

  onRemoveFeature(tagToRemove: NbTagComponent) {
    const currentFeatures = this.features.value as string[];
    currentFeatures.splice(currentFeatures.indexOf(tagToRemove.text), 1);
    this.features.updateValueAndValidity();
    this.features.markAsDirty();
    this.formEdited = true;
  }

  onDatasourceChange(name: string) {
    this.endpoint.reset();
    
    this.populateEndpoints(name);
    this.endpoint.enable();
  }

  onAddValue({ value, input }: NbTagInputAddEvent, sdkGroup: FormGroup) {
    const values = this.getValues(sdkGroup).value as string[];
    if (!values.includes(value)) {
      values.push(value);
      this.getValues(sdkGroup).updateValueAndValidity();
      input.nativeElement.value = '';
      this.formEdited = true;
    }
  }

  onRemoveValue(tagToRemove: NbTagComponent, sdkGroup: FormGroup) {
    const currentValues = this.getValues(sdkGroup).value as string[];
    currentValues.splice(currentValues.indexOf(tagToRemove.text), 1);
    this.getValues(sdkGroup).markAsDirty();
    this.getValues(sdkGroup).updateValueAndValidity();
    this.formEdited = true;
  }

  onMethodChange(value: string) {
    if (value === 'exists') {
      this.sdkGroup.controls.forEach((c: FormGroup) => {
        c.get('values').reset([]);
        c.get('values').disable();

        c.get('external_data_key').reset();
        c.get('external_data_key').disable();
      });

      this.validateExternalData.patchValue('false');
      this.validateExternalData.disable();
    } else {
      this.validateExternalData.reset();
      this.validateExternalData.enable();
      this.sdkGroup.controls.forEach((c: FormGroup) => c.enable());
    }
  }

  onValidateExternalDataChange(value: string) {
    if (value === 'true') {
      this.sdkGroup.controls.forEach((c: FormGroup) => {
        c.get('values').patchValue([]);
        c.get('values').disable();

        c.get('external_data_key').enable();
      });   
    } else {
      this.sdkGroup.controls.forEach((c: FormGroup) => {
        c.get('external_data_key').patchValue('');
        c.get('external_data_key').disable();

        c.get('values').enable();
      });
    }
  }

  onAddSdkGroup() {
    this.sdkGroup.push( this.addSdkGroupForm() );
  }

  onRemoveSdkGroup(index: number) {
    if (index !== 0) {
      this.sdkGroup.controls.splice(index, 1);
    }
  }

  private addRule(reqPayload: Object) {
    this.loading = true;
    this.rs.addRule(reqPayload, this.user.username)
      .pipe(delay(200))
      .subscribe(
        res => {
          this.ts.showSuccess('Successfully added new rule.');
          this.ref.close(reqPayload);
        }
      )
      .add(() => this.loading = false);
  }

  private modifyRule(reqPayload: Object) {
    this.loading = true;
    this.rs.modifyRule(reqPayload, this.user.username)
    .pipe(delay(200))
    .subscribe(
      res => {
        this.ts.showSuccess('Successfully modified rule.');
        this.ref.close(reqPayload);
      }
    ).add(() => this.loading = false);
  }

  private createReqPayload() {

    const payload = Object.assign({}, this.ruleForm.getRawValue());
    
    payload['data_source'] = payload['datasource'] + ',' + payload['endpoint'];
    delete payload['datasource'];
    delete payload['endpoint'];

    payload['active'] = payload['active'] === 'true';
    payload['validate_external_data'] = payload['validate_external_data'] === 'true';
    delete payload['sdkGroup'];
    
    const sdk = [];
    const values = {};
    const edk = {};
    const criteria = {};

    this.sdkGroup.controls.forEach((c: FormGroup, index: number) => {
      let sdkRef = c.get('subscription_data_key').value;

      sdk.push(sdkRef);
      values[sdkRef] = c.get('values').value;
      edk[sdkRef] = c.get('external_data_key').value ? c.get('external_data_key').value : '';
      
      if (c.get('criteria').get('key').value && c.get('criteria').get('value').value) {
        criteria[sdkRef] = { [c.get('criteria').get('key').value ]: c.get('criteria').get('value').value };
      } else {
        criteria[sdkRef] = {};
      }
    });

    payload['subscription_data_keys'] = sdk;
    payload['values'] = values; 
    payload['external_data_key'] = edk;
    payload['criteria'] = criteria;

    return payload;
  }

  private populateEndpoints(datasourceName: string) {
    this.endpoints = [];

    this.datasources.find(datasource => {
      if (datasource.name === datasourceName) {
        for (let [k, v] of Object.entries(datasource.dataSource)) {
          this.endpoints.push(k);
        }
      }
    });
  }

  get ruleId() {
      return this.ruleForm.get('rule_id') as FormControl;
  }

  get ruleName() {
      return this.ruleForm.get('rule_name') as FormControl;
  }

  get active() {
      return this.ruleForm.get('active') as FormControl;
  }

  get features() {
      return this.ruleForm.get('features') as FormControl;
  }

  get dataType() {
      return this.ruleForm.get('data_type') as FormControl;
  }

  get datasource() {
      return this.ruleForm.get('datasource') as FormControl;
  }

  get endpoint() {
    return this.ruleForm.get('endpoint') as FormControl;
  }

  get resultText() {
      return this.ruleForm.get('result_text') as FormControl;
  }

  get system() {
      return this.ruleForm.get('system') as FormControl;
  }

  get eventTypes() {
      return this.ruleForm.get('event_types') as FormControl;
  }

  get defaultResponse() {
    return this.ruleForm.get('default_response') as FormControl;
  }

  get method() {
      return this.ruleForm.get('method') as FormControl;
  }

  get validateExternalData() {
      return this.ruleForm.get('validate_external_data') as FormControl;
  }

  get customerIssue() {
    return this.ruleForm.get('customer_issue') as FormControl;
  }

  get sdkGroup() {
    return this.ruleForm.get('sdkGroup') as FormArray;
  }

  getSdk(index: number) {
    return this.sdkGroup.controls[index].get('subscription_data_key') as FormControl;
  }

  getValues(sdkGroup: FormGroup) {
    return sdkGroup.get('values') as FormControl;
  }

  getEdk(sdkGroup: FormGroup) {
    return sdkGroup.get('external_data_key') as FormControl;
  }

  getCriteria(sdkGroup: FormGroup) {
    return sdkGroup.get('criteria') as FormControl;
  }
}

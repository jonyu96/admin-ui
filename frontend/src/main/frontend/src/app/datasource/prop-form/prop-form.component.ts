import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { CustomError } from '@app/_models/custom-error.model';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-prop-form',
  templateUrl: './prop-form.component.html',
  styleUrls: ['./prop-form.component.scss']
})
export class PropFormComponent implements OnInit {

  @Input() parent: string;

  @Input() propKey: string;
  @Input() propValue: any;
    
  propForm: FormGroup;
  submitted: boolean;

  STRING_PATTERN: string = '^[a-zA-Z]*$';
  INTEGER_PATTERN: string = '^[0-9]*$';
  BOOLEAN_PATTERN: string = 'true|false';

  VALUE_TYPES = ['integer', 'string', 'boolean', 'object'];


  constructor(protected ref: NbDialogRef<PropFormComponent>,
              private fb: FormBuilder,
              public constants: AppConstants) { }

  ngOnInit(): void {
    this.propForm = this.fb.group({
        key: [{ value: this.propKey ? this.propKey : '', disabled: this.propKey ? true : false }, Validators.required],
        hardCoded: ['', Validators.required],
        value: [''],
        valueType: [ !Array.isArray(this.propValue) && this.VALUE_TYPES.includes(String(this.propValue).toLowerCase()) ? String(this.propValue).toLowerCase() : '', Validators.required],
        isArray: ['', Validators.required],
    });

    this.value.setValidators(this.getValidators(this.valueType.value));
  }

  onCancel() {
    this.ref.close();
  }

  onSubmit() {
    this.submitted = true;
    
    if (!this.propForm.valid) {
      throw new CustomError('Please fill all required fields.');
    } 
    const prop = this.buildProp();

    this.ref.close(prop);    
  }

  private buildProp() {
    const prop = {};
    
    prop['key'] = this.key.value;
    prop['value'] = this.hardCoded.value === 'true' ? this.createHardcodedValue() : this.createLocationValue();
    prop['valueType'] = this.valueType.value;
    prop['isArray'] = this.isArray.value;

    return prop;
  }

  private createLocationValue() {
    let result;

    switch(this.valueType.value) {
      case 'string':
        result = "$$";
        break;
      case 'integer':
        result = "##";
        break;
      case 'boolean':
        result = "&&";
        break;
    }

    return result + this.value.value;
  }

  private createHardcodedValue() {
    let result = this.value.value;

    switch(this.valueType.value) {
      case 'integer':
        result = Number(result);
        break;
      case 'boolean':
        result = result === 'true';
        break;
    }

    if (this.isArray.value === 'true') {
      result = [ result ];
    }

    return result;
  }

  onHardcodedChange(isHardcoded: string) {

    // for manual upload, valueType options changes for hardcoded or not hardcoded
    if (!this.propValue) {
      this.valueType.reset();
    }

    this.value.reset();
    this.value.enable();

    if (isHardcoded === 'true') { // set validators depending on valueType 
      this.value.setValidators(this.getValidators(this.valueType.value));

      this.isArray.reset();
      this.isArray.enable();
    } else { // disable isArray selection
      this.value.setValidators(Validators.required);

      this.isArray.patchValue('false');
      this.isArray.disable();
    }
  }

  // if hardcoded and valueType is set to 'object', set value to '{}'
  // else, clear value and set validators depending on valueType
  onValueTypeChange(valueType: string) {
    if (this.hardCoded.value === 'true') {
      
      if (valueType === 'object') {
        this.value.setValue('{}');
        this.value.disable();
      } else {
        this.value.reset();
        this.value.setValidators(this.getValidators(valueType));
        this.value.enable();
      }
    }
  }

  // return specific valiators depending on valueType
  getValidators(valueType: string) {
    const validators = [ Validators.required ];

    switch(valueType) {
      case 'string': {
        validators.push(Validators.pattern('^[a-zA-Z]*$'));
        break;
      };
      case 'integer': {
        validators.push(Validators.pattern('^[0-9]*$'));
        break;
      };
      case 'boolean': {
        validators.push(Validators.pattern('true|false'));
        break;
      };
    }

    return validators;
  }

  get key(): FormControl {
      return this.propForm.get('key') as FormControl;
  }

  get hardCoded(): FormControl {
    return this.propForm.get('hardCoded') as FormControl;
  }

  get value(): FormControl {
    return this.propForm.get('value') as FormControl;
  }

  get valueType(): FormControl {
    return this.propForm.get('valueType') as FormControl;
  }

  get isArray(): FormControl {
    return this.propForm.get('isArray') as FormControl;
  }

  get location(): FormControl {
    return this.propForm.get('location') as FormControl;
  }

}
import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { PropFormComponent } from '../prop-form/prop-form.component';


@Component({
  selector: 'body-content-builder',
  templateUrl: './body-content-builder.component.html',
  styleUrls: ['./body-content-builder.component.scss']
})
export class BodyContentBuilderComponent {

  @Input() bodyContent: FormGroup | FormArray;
  @Input() intent: string;

  constructor(private dialogService: NbDialogService) {}

  getSegmentType(control: AbstractControl) {
    if (control instanceof FormGroup) {
      return 'object';
    }

    if (control instanceof FormArray) {
      return 'array-object';
    }

    // control is FormControl
    let value;
    if (Array.isArray(control.value)) {
      value = control.value[0];
    } else {
      value = control.value;
    }

    switch(typeof value) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
    }
  }

  getSegmentDescription(control: AbstractControl) {
    if (control instanceof FormGroup) {
      return 'Object';
    } else if (control instanceof FormArray) {
      return '[ Object ]';
    } else {
      if (Array.isArray(control.value)) {
        return '[' + control.value + ']';
      } else {
        return control.value;
      }
    }
  }

  isObject(control: AbstractControl) {
    return control instanceof FormGroup || control instanceof FormArray;
  }
  
  isArrayObject(control: AbstractControl) {
    return control instanceof FormArray;
  }

  onPopulateSegment(key: string, control: FormControl) {
    this.dialogService
      .open(PropFormComponent, {
        context: { propKey: key, propValue: control.value }
      })
      .onClose.subscribe(prop => {
        if (prop) {
          control.patchValue(prop['value']);
        }
      })
  }

  onAddSegment(parentKey: string, control: AbstractControl) {
    this.dialogService
    .open(PropFormComponent, { 
      context: {
        parent: parentKey
      }
    })
    .onClose.subscribe(prop => {
      if (prop) {
        const key = prop['key'];
        let newControl: AbstractControl;

        if (prop['valueType'] === 'object') {
          if (prop['isArray'] === 'true') {
            newControl = new FormArray([ new FormGroup({}) ]);
          } else {
            newControl = new FormGroup({});
          }
        } else {
          newControl = new FormControl(prop['value'], Validators.required);
        }

        if (control instanceof FormGroup) {
          control.setControl(key, newControl);
        } else if (control instanceof FormArray) {
          (control.controls[0] as FormGroup).setControl(key, newControl);
        }
      }
    });
  }

  onDeleteSegment(key: string, control: AbstractControl) {
    (control.parent as FormGroup).removeControl(key);
  }
}
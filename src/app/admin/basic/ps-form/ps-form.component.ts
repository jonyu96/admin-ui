import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-ps-form',
  templateUrl: './ps-form.component.html',
  styleUrls: ['./ps-form.component.scss']
})
export class PsFormComponent implements OnInit {
    
  psForm: FormGroup;
  submitted: boolean;

  constructor(protected ref: NbDialogRef<PsFormComponent>,
              private fb: FormBuilder,
              public constants: AppConstants) { }

  ngOnInit(): void {
      this.psForm = this.fb.group({
          slack_id: ['', Validators.required],
          pier_support_group: ['', Validators.required],
          roles: [[], Validators.required]
      })
  }

  onNo(): void {
    this.ref.close();
}

  onYes(): void {
      if (this.psForm.valid) {
          this.ref.close(this.psForm.getRawValue());    
      }

      this.submitted = true;
  }

  toggle(checked: boolean, role: string) {
    const currentRoles = this.roles.value as string[];

    if (checked) {
      currentRoles.push(role);
    } else {
      currentRoles.splice(currentRoles.indexOf(role), 1);
    }
    this.roles.patchValue(currentRoles);
  }

  get slackId(): FormControl {
      return this.psForm.get('slack_id') as FormControl;
  }

  get pierSupportGroup(): FormControl {
      return this.psForm.get('pier_support_group') as FormControl;
  }

  get roles(): FormControl {
    return this.psForm.get('roles') as FormControl;
  }

}

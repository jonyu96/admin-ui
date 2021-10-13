import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomError } from '@app/_models/custom-error.model';
import { PierData, PierIssue } from '@app/_models/pier-issue.model';
import { PierService } from '@app/_services/pier.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogRef, NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() userAction: string;
  @Input() pierIssue: PierIssue;
  @Input() username: string;

  form: FormGroup;

  loading: boolean;
  submitted: boolean;
  edited: boolean;

  constructor(protected ref: NbDialogRef<FormComponent>,
              private pierService: PierService,
              private ts: ToasterService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      issue: new FormControl(this.pierIssue ? this.pierIssue.issue : ''),
      errorCode: new FormControl(this.pierIssue ? this.pierIssue.errorCode : ''),
      pierDetails: this.addPierDetailsGroup()
    });

    if (this.userAction === 'Edit') {
      this.form.get('issue').disable();
    }
  }

  private addPierDetailsGroup() {
    const pierDetails = this.pierIssue && this.pierIssue.pierDetails ? this.pierIssue.pierDetails : null;

    return new FormGroup({
      configItem: new FormControl(pierDetails ? pierDetails.configItem : '', Validators.required),
      cause: new FormControl(pierDetails ? pierDetails.cause : [], Validators.required),
      resolution: new FormControl(pierDetails ? pierDetails.resolution : '', Validators.required),
      resolutionDescription: new FormControl(pierDetails ? pierDetails.resolutionDescription : '', Validators.required),
      status: new FormControl(pierDetails ? pierDetails.status : '', Validators.required)
    });
  }

  onAddTag({ value, input }: NbTagInputAddEvent) {
    if (!this.cause.value.includes(value)) {
      (this.cause.value as string[]).push(value);
      this.cause.updateValueAndValidity();

      input.nativeElement.value = '';
      this.edited = true;
    }
  }

  onRemoveTag(tagToRemove: NbTagComponent) {
    const currentFeatures = this.cause.value as string[];
    currentFeatures.splice(currentFeatures.indexOf(tagToRemove.text), 1);

    this.cause.updateValueAndValidity();
    this.cause.markAsDirty();
    this.edited = true;
  }

  onCancel() {
    this.ref.close();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.ts.showError('Please fill out all required fields.');
      return;
    }

    if (this.userAction === 'Edit' && this.form.pristine) {
      this.ts.showError('Please make an edit.');
      return;
    }
    
    const reqPayload = this.form.value;
    this.loading = true;

    switch (this.userAction) {
      case 'Add':
        this.addIssue(reqPayload);
        break;
      case 'Edit':
        reqPayload['issue'] = this.form.get('issue').value;
        this.editIssue(reqPayload);
        break;
    }
  }

  private addIssue(reqPayload: any) {
    this.pierService.addIssue(this.username, reqPayload)
      .pipe(delay(200))
      .subscribe(res => {
        this.ts.showSuccess('Successfully added Pier Issue.');
        this.ref.close(new PierIssue(reqPayload));
      })
      .add(x => this.loading = false);
  }

  private editIssue(reqPayload: any) {
    this.pierService.editIssue(this.username, reqPayload)
      .pipe(delay(200))
      .subscribe(res => {
        this.ts.showSuccess('Successfully updated Pier Issue.');
        this.ref.close(reqPayload);
      })
      .add(x => this.loading = false);
  }

  get cause(): FormControl {
    return this.form.get('pierDetails').get('cause') as FormControl;
  }

  getControl(controlName: string) : FormControl {
    if (this.form) {
      return this.form.get('pierDetails').get(controlName) as FormControl;
    }
    return null;
  }

}

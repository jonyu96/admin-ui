import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { Rule } from '@app/_models/rule.model';
import { RuleService } from '@app/_services/rule.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, OnChanges {

  @Input() rules: Rule[];

  activeTab: string;
  loading = false;

  nsmForm: FormGroup;
  selectedSystem: string;
  nsmSubmitted: boolean;
  nsmResponse: any = {};

  testForm: FormGroup;
  features: string[];
  testSubmitted: boolean;
  testResponse: any = {};
  
  constructor(private fb: FormBuilder, private rs: RuleService, public constants: AppConstants) { 
    this.activeTab = "tab1";
  }

  ngOnInit() {
    this.buildNsmForm();
    this.buildTestForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.rules && this.rules) {
      this.rules.sort((a, b) => a.rule_id.localeCompare(b.rule_id));
    }
  }

  buildNsmForm(): void {
    this.nsmForm = this.fb.group({
      system: ['', Validators.required],
      api: [{value: '', disabled: true}, Validators.required],
      msisdn: [{value: '', disabled: true}, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*')
      ])]
    });
  }

  buildTestForm() {
    this.testForm = this.fb.group({
      ruleId: ['', Validators.required],
      featureList: [{value: [], disabled: true}, Validators.required],
      subscriptionIds: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*')
      ])]
    });
  }
  
  getNsmResponse(): void {

    this.nsmSubmitted = true;
    
    if (this.nsmForm.invalid) {
      return;
    }

    this.nsmResponse = {};
    this.loading = true;

    this.rs.nsmQuery(this.nsmForm.value)
        .subscribe(
          res => {
            this.nsmResponse = res['body'];
          },
          err => {
            this.nsmResponse = err['error']['baseError'];
          }
        ).add(x => this.loading = false);
  }

  getTestResponse(): void {
    this.testSubmitted = true;

    if (this.testForm.invalid) {
      return;
    }

    this.testResponse = {};
    this.loading = true;

    this.rs.testRule(this.testForm.value)
      .subscribe(
        res => {
          this.testResponse = res;
        },
        err => {
          this.testResponse = err['error']['baseError'];
        }
      ).add(x => this.loading = false);
  }

  onSystemSelected(selected: any): void {
    this.selectedSystem = String(selected);

    this.api.enable();
    this.api.patchValue('');
    this.msisdn.enable();
  }

  onRuleSelect(ruleId: string) {
    this.rules.find(rule => {
      if (rule.rule_id === ruleId) {
        this.features = [ ...rule.features];
      }
    });

    this.featureList.reset({ value: [], disabled: false });
  }

  get system(): FormControl {
    return this.nsmForm.get('system') as FormControl;
  }

  get api(): FormControl {
    return this.nsmForm.get('api') as FormControl;
  }

  get msisdn(): FormControl {
    return this.nsmForm.get('msisdn') as FormControl;
  }

  get ruleId(): FormControl {
    return this.testForm.get('ruleId') as FormControl;
  }

  get featureList(): FormControl {
    return this.testForm.get('featureList') as FormControl;
  }

  get subscriptionIds(): FormControl {
    return this.testForm.get('subscriptionIds') as FormControl;
  }

}

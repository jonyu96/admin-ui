import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@app/_constants/app.constants';
import { Rule } from '@app/_models/rule.model';
import { RuleService } from '@app/_services/rule.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, OnChanges {

  @Input() rules: Rule[];

  activeTab: string;
  loading = false;
  submitted: boolean;

  dataForm: FormGroup;
  selectedSystem: string;
  dataResponse: any = {};

  testForm: FormGroup;
  features: string[];
  testResponse: any = {};
  
  constructor(private fb: FormBuilder, private rs: RuleService, public constants: AppConstants) { 
    this.activeTab = "tab1";
  }

  ngOnInit() {
    this.buildDataForm();
    this.buildTestForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.rules && this.rules) {
      this.rules.sort((a, b) => a.rule_id.localeCompare(b.rule_id));
    }
  }

  buildDataForm(): void {
    this.dataForm = this.fb.group({
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
  
  getDataResponse(): void {

    this.submitted = true;
    
    if (this.dataForm.invalid) {
      return;
    }

    this.dataResponse = {};
    this.loading = true;

    this.rs.dataQuery(this.dataForm.value)
      .pipe(delay(1000))
      .subscribe(
        res => {
          // dummy response
          this.dataResponse = {
            msisdn: 12533069511,
            profile: {
              first_name: 'Jonathan',
              last_name: 'Yu',
              email: 'jonathanjyu96@gmail.com'
            },
            hobbies: [ 'tennis', 'golf', 'running', 'piano' ],
            petType: 'Australian Shepherd'
          }
        },
        err => {
          // this.dataResponse = err['error']['baseError'];
        }
      ).add(x => { this.loading = false; this.submitted = false });
  }

  getTestResponse(): void {
    this.submitted = true;

    if (this.testForm.invalid) {
      return;
    }

    this.testResponse = {};
    this.loading = true;

    this.rs.testRule(this.testForm.value)
      .subscribe(
        res => {
          // dummy response
          this.testResponse = {
            rule_id: this.ruleId.value,
            pass: false
          };
        },
        err => {
          // this.testResponse = err['error']['baseError'];
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
    return this.dataForm.get('system') as FormControl;
  }

  get api(): FormControl {
    return this.dataForm.get('api') as FormControl;
  }

  get msisdn(): FormControl {
    return this.dataForm.get('msisdn') as FormControl;
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

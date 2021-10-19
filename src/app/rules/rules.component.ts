import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Rule } from '@app/_models/rule.model';
import { RuleService } from '@app/_services/rule.service';
import { delay, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AccountService } from '@app/_services/account.service';
import { User } from '@app/_models/user.model';
import { FormComponent } from './form/form.component';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '@app/_services/toaster.service';
import { DialogComponent } from '@app/_components/dialog/dialog.component';
import { DatasourceService } from '@app/_services/datasource.service';
import { Datasource } from '@app/_models/datasource.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent implements OnInit {

  user: User;

  rules: Rule[];
  filteredRules: Rule[];
  datasources: Datasource[];

  rulesFilter: FormControl;
  alphaSortOn: boolean = false;

  constructor(private rs: RuleService,
              private accountService: AccountService,
              private dialogService: NbDialogService,
              private ts: ToasterService,
              private ds: DatasourceService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.user = this.accountService.getUser();

    this.rs.queryAllRules(this.user.username)
      .pipe(
        delay(500),
        filter(res => res['rules'] !== undefined),
        map(res => res['rules'].map(obj => new Rule(obj)))
      )
      .subscribe(rules => {
        this.rules = rules;
        this.filteredRules = [ ...this.rules ];
      });
    
    this.ds.getDatasources()
      .subscribe(res => {
        this.datasources = res['datasources'];
      });
    
    this.rulesFilter = new FormControl('', Validators.pattern('^[a-zA-Z]*$'));
    this.setupRulesFilter();
  }

  private setupRulesFilter() {
    if (this.rulesFilter) {
      this.rulesFilter.valueChanges
        .pipe(
          distinctUntilChanged(),
          map(x => x.toLowerCase())
        )
        .subscribe(
          search => {
            this.filteredRules = [ ...this.rules.filter(rule => rule.rule_id.includes(search)) ];
            this.alphaSortOn = false;
          }
        )
    }
  }

  onToggleAlphaSort() {
    if (!this.alphaSortOn) {
      this.alphaSortOn = true;
      this.filteredRules.sort((a, b) => a.rule_id.localeCompare(b.rule_id));
    };
  }

  onAddClick(): void {
    if (this.hasPermission('add')) {

      this.dialogService.open(
        FormComponent, {
          context: {
            rule: null,
            userAction: 'Add',
            user: this.user,
            datasources: this.datasources
          }
        }
      ).onClose.subscribe(yes => {
        if (yes) {
          const newRule = new Rule(yes);
          this.rules = [ ...this.rules, newRule ];
          this.filteredRules.push(newRule);
        }
      });
    } else {
      this.ts.showError('CREATE access required.')
    }
  }

  onEditClick(event: MouseEvent, rule: Rule, accordionItem: any): void {
    event.stopPropagation();

    if (this.hasPermission('edit')) {
      this.dialogService.open(
        FormComponent, {
          context: {
            rule: rule,
            userAction: 'Edit',
            user: this.user,
            datasources: this.datasources
          }
        }
      ).onClose.subscribe(modifiedRule => {
        if (modifiedRule) {
          // const editedRule = new Rule(yes);
          this.rules.find(rule => {
            if (rule.rule_id === modifiedRule['rule_id']) {
              rule = Object.assign({}, modifiedRule);
            }
          });
          rule.update(modifiedRule);
        }
      });
    } else {
      this.ts.showError('EDIT access required.')
    }
  }

  onDeleteClick(event: any, ruleId: string): void {
    event.stopPropagation();

    if (this.hasPermission('delete')) {
      this.dialogService
        .open(DialogComponent, { 
          context: {
            message: `Permanently delete rule?`
          }
        })
        .onClose.subscribe(yes => {
          if (yes) {
            this.rs.deleteRule(ruleId, this.user.username).subscribe(
              res => {
                this.ts.showSuccess('Successfully deleted rule.');
                this.rules = [ ...this.rules.filter(rule => rule.rule_id !== ruleId)];
                this.filteredRules = [ ...this.filteredRules.filter(rule => rule.rule_id !== ruleId)];
              }
            )
          }
        });
    } else {
      this.ts.showError('DELETE access required.')
    }
  }

  hasCriteria(criteria: Object) {
    return Object.keys(criteria).length > 0;
  }

  private hasPermission(action: string): boolean {
    return this.user.permissions['ADMIN'].includes('super') ||
      this.user.permissions['RULE'].includes(action);
  }
}

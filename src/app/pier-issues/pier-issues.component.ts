import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '@app/_components/dialog/dialog.component';
import { CustomError } from '@app/_models/custom-error.model';
import { PierIssue } from '@app/_models/pier-issue.model';
import { User } from '@app/_models/user.model';
import { AccountService } from '@app/_services/account.service';
import { PierService } from '@app/_services/pier.service';
import { ToasterService } from '@app/_services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-pier-issues',
  templateUrl: './pier-issues.component.html',
  styleUrls: ['./pier-issues.component.scss']
})
export class PierIssuesComponent implements OnInit {
  user: User;

  pierIssues: PierIssue[];
  pierIssue: PierIssue;

  constructor(private as: AccountService,
              private pierService: PierService,
              private dialogService: NbDialogService,
              private ts: ToasterService) { }

  ngOnInit(): void {
    this.user = this.as.getUser();

    this.pierService.getAllIssues(this.user.username)
      .pipe(delay(500))
      .subscribe(
        res => {
          if (Array.isArray(res['issues'])) {
            this.pierIssues = res['issues'].map(issue => new PierIssue(issue));
          }
        }
      )
  }

  onAddIssueClick() {
    this.dialogService.open(FormComponent, {
      context: {
        userAction: 'Add',
        username: this.user.username
      }
    }).onClose.subscribe((newIssue: PierIssue) => {
      if (newIssue) {
        this.pierIssues = [ ...this.pierIssues, newIssue ];
      }
    })
  }

  onIssueClick(issue: PierIssue) {
    if (this.pierIssue && this.pierIssue.issue === issue.issue) {
      this.pierIssue = null;
    } else {
      this.pierIssue = Object.assign({}, issue);
    }
  }

  onEditIssueClick() {
    if (!this.pierIssue) {
      throw new CustomError('Please select an issue to edit.');
    }

    this.dialogService.open(FormComponent, {
      context: {
        userAction: 'Edit',
        pierIssue: this.pierIssue,
        username: this.user.username
      }
    }).onClose.subscribe(updatedIssue => {
      // this.pierIssue = Object.assign({}, updatedIssue);
      this.pierIssues = [ ...this.pierIssues.map(issue => {
        if (issue.issue === this.pierIssue.issue) {
          issue = Object.assign({}, updatedIssue);
          this.pierIssue = issue;
        }
        return issue;
      }) ];
    });
  }

  onDeleteIssueClick() {
    if (!this.pierIssue) {
      throw new CustomError('Please select an issue to delete');
    }

    this.dialogService.open(DialogComponent, {
      context: {
        message: 'Permanently delete Pier Issue?'
      }
    }).onClose.subscribe(yes => {
      if (yes) {
        this.pierService.deleteIssue(this.user.username, this.pierIssue.issue)
          .subscribe(res => {
            this.ts.showSuccess('Successfully deleted Pier Issue.');
            this.pierIssues = [ ...this.pierIssues.filter(issue => issue.issue !== this.pierIssue.issue )];
            this.pierIssue = null;
          })
      }
    })
  }
}

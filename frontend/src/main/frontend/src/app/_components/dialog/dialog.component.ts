import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() message: string;


  @Input() permissions: any;
  @Input() app: string;
  @Input() action: string;

  @Input() admin: string;
  
  constructor(protected ref: NbDialogRef<DialogComponent>) { }

  ngOnInit(): void {}

  onNo(): void {
    this.ref.close();
  }

  onYes(): void {
    this.ref.close(true);
  }

}

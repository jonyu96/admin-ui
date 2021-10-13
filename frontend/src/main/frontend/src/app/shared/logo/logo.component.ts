import { Component, Input, OnInit } from '@angular/core';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() light: boolean;
  
  faRobot = faRobot;
  
  constructor() { }

  ngOnInit(): void {
  }

}
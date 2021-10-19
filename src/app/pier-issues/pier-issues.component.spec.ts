import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PierIssuesComponent } from './pier-issues.component';

describe('PierIssuesComponent', () => {
  let component: PierIssuesComponent;
  let fixture: ComponentFixture<PierIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PierIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PierIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

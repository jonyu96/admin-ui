import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsFormComponent } from './ps-form.component';

describe('PsFormComponent', () => {
  let component: PsFormComponent;
  let fixture: ComponentFixture<PsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

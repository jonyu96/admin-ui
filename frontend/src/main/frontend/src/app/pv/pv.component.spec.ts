import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PVComponent } from './pv.component';

describe('AdminComponent', () => {
  let component: PVComponent;
  let fixture: ComponentFixture<PVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PVComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

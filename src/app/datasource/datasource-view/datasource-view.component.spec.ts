import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceViewComponent } from './datasource-view.component';

describe('DatasourceViewComponent', () => {
  let component: DatasourceViewComponent;
  let fixture: ComponentFixture<DatasourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasourceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

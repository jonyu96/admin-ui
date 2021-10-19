import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwaggerUploadComponent } from './swagger-upload.component';

describe('SwaggerUploadComponent', () => {
  let component: SwaggerUploadComponent;
  let fixture: ComponentFixture<SwaggerUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwaggerUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwaggerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

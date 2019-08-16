import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConselorFormPage } from './conselor-form.page';

describe('ConselorFormPage', () => {
  let component: ConselorFormPage;
  let fixture: ComponentFixture<ConselorFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConselorFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConselorFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

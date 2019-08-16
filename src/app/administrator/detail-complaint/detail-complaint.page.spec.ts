import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailComplaintPage } from './detail-complaint.page';

describe('DetailComplaintPage', () => {
  let component: DetailComplaintPage;
  let fixture: ComponentFixture<DetailComplaintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailComplaintPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComplaintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

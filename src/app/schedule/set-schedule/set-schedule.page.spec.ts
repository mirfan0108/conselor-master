import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSchedulePage } from './set-schedule.page';

describe('SetSchedulePage', () => {
  let component: SetSchedulePage;
  let fixture: ComponentFixture<SetSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

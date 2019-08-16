import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteComplaintPage } from './note-complaint.page';

describe('NoteComplaintPage', () => {
  let component: NoteComplaintPage;
  let fixture: ComponentFixture<NoteComplaintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteComplaintPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteComplaintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

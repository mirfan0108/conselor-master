import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidcallPage } from './vidcall.page';

describe('VidcallPage', () => {
  let component: VidcallPage;
  let fixture: ComponentFixture<VidcallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VidcallPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VidcallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

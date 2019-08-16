import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChatPage } from './list-chat.page';

describe('ListChatPage', () => {
  let component: ListChatPage;
  let fixture: ComponentFixture<ListChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

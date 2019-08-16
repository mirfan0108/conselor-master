import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appListChat]'
})
export class ListChatDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

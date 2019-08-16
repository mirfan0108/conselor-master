import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAdministrator]'
})
export class AdministratorDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

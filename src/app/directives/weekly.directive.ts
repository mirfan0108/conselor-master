import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appWeekly]'
})
export class WeeklyDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

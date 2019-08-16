import { TestBed } from '@angular/core/testing';

import { ScheduleServicesService } from './schedule-services.service';

describe('ScheduleServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleServicesService = TestBed.get(ScheduleServicesService);
    expect(service).toBeTruthy();
  });
});

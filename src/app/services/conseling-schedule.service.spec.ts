import { TestBed } from '@angular/core/testing';

import { ConselingScheduleService } from './conseling-schedule.service';

describe('ConselingScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConselingScheduleService = TestBed.get(ConselingScheduleService);
    expect(service).toBeTruthy();
  });
});

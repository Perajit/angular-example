import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingService
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#isLoading$', () => {
    it('should emit current loading status when the value is changed', () => {
      const loadingStatus$ = cold('--a-b--c', {
        a: true,
        b: true,
        c: false
      });
      const expectedLoadingStatuses$ = cold('a-b-c--d', {
        a: false,
        b: true,
        c: true,
        d: false
      });

      loadingStatus$.subscribe((isLoading: boolean) => {
        service.isLoading = isLoading;
      });

      expect(service.isLoading$).toBeObservable(expectedLoadingStatuses$);
    });
  });
});

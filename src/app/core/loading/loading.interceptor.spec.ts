import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { cold } from 'jasmine-marbles';

import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from './loading.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LoadingInterceptor', () => {
  let mockHttp: HttpTestingController;
  let httpClient: HttpClient;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        LoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    mockHttp = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    loadingService = TestBed.get(LoadingService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should update loading status according to pending requests', fakeAsync(() => {
    const testRequests = [
      { method: 'GET', url: 'http://example-1.com' },
      { method: 'POST', url: 'http://example-2.com' },
      { method: 'GET', url: 'http://example-3.com' }
    ];
    const testRequest$ = cold('a---bc', {
      a: testRequests[0],
      b: testRequests[1],
      c: testRequests[2]
    });
    const testResponse$ = cold('--a--b-c', {
      a: testRequests[0].url,
      b: testRequests[1].url,
      c: testRequests[2].url
    });
    const expectedLoadingStatus$ = cold('p-q-r--s', {
      p: true,
      q: false,
      r: true,
      s: false,
    });

    testRequest$.subscribe(({ method, url }) => {
      httpClient.request(new HttpRequest(method, url, null)).subscribe();
    });

    testResponse$.subscribe((url) => {
      const testReq = mockHttp.expectOne(url);
      testReq.flush(null);
    });

    expect(loadingService.isLoading$).toBeObservable(expectedLoadingStatus$);
  }));
});

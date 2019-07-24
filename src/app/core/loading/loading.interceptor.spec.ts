import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';

import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from './loading.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { cold } from 'jasmine-marbles';

xdescribe('LoadingInterceptor', () => {
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

  it('should update isLoading status of loading service according to pending request', () => {
    const mockRequests = [
      { method: 'GET', url: 'http://example-1.com' },
      { method: 'PUT', url: 'http://example-2.com' },
      { method: 'GET', url: 'http://example-3.com' }
    ];
    const mockRequest$ = cold('a--bc', {
      a: mockRequests[0],
      b: mockRequests[1],
      c: mockRequests[2]
    });
    const mockResponse$ = cold('-a--bc', {
      a: 0,
      b: 1,
      c: 2
    });
    const testReqs: TestRequest[] = [];

    mockRequest$.subscribe((mockReq: { method: 'GET' | 'POST', url: string }) => {
      const req = new HttpRequest(mockReq.method, mockReq.url, null);
      httpClient.request(req).subscribe();

      const testReq = mockHttp.expectOne(mockReq.url);
      // testReq.flush(null);
      testReqs.push(testReq);
    });

    mockResponse$.subscribe((index: number) => {
      testReqs[index].flush(null);
    });

    const expectedLoadingStatus$ = cold('ab-c-d', {
      a: true,
      b: false,
      c: true,
      d: false
    });
    expect(loadingService.isLoading$).toBeObservable(expectedLoadingStatus$);
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.model';

describe('AuthInterceptor', () => {
  let mockHttp: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  const mockReqUrl = 'http://example.com';
  const mockAuthToken = 'mock-token';
  const mockUsername = 'mock-username';
  const mockUser: User = {
    token: mockAuthToken,
    username: mockUsername,
    profile: {
      firstname: 'mock-firstname',
      lastname: 'mock-lastname'
    }
  };
  const mockWindow = {
    sessionStorage: jasmine.createSpyObj(['getItem', 'setItem', 'removeItem'])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: 'Window',
          useValue: mockWindow
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    mockHttp = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    authService = TestBed.get(AuthService);
  });

  beforeEach(() => {
    spyOnProperty(authService, 'currentUser', 'get').and.returnValue(mockUser);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should set Authorization header to request', () => {
    httpClient.get(mockReqUrl).subscribe();

    const testReq = mockHttp.expectOne(mockReqUrl);

    expect(testReq.request.headers.get('Authorization')).toEqual(`Bearer ${mockAuthToken}`);
  });
});

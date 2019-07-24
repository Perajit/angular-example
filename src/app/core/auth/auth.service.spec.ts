import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { cold } from 'jasmine-marbles';

import { AuthService } from './auth.service';
import { User } from './user.model';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttp: HttpTestingController;

  const mockAuthToken = 'mock-token';
  const mockUsername = 'mock-username';
  const mockPassword = 'mock-password';
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
  const getItemSpy = mockWindow.sessionStorage.getItem as jasmine.Spy;
  const setItemSpy = mockWindow.sessionStorage.setItem as jasmine.Spy;
  const removeItemSpy = mockWindow.sessionStorage.removeItem as jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClientTestingModule,
        {
          provide: 'Window',
          useFactory: () => mockWindow
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
    mockHttp = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
    getItemSpy.calls.reset();
    setItemSpy.calls.reset();
    removeItemSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#currentUser$', () => {
    it('should emit current logged user', () => {
      const mockUsers = [
        { ...mockUser },
        null,
        { ...mockUser, username: 'another-mock-username' }
      ];
      const mockUser$ = cold('a-b-c', {
        a: mockUsers[0],
        b: mockUsers[1],
        c: mockUsers[2]
      });

      mockUser$.subscribe((user: User) => {
        service.currentUser = user;
      });

      expect(service.currentUser$).toBeObservable(mockUser$);
    });
  });

  describe('#isLoggedIn()', () => {
    it('should return true if use is logged in', () => {
      service.currentUser = mockUser;

      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false if use is not logged in', () => {
      service.currentUser = null;

      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('#login()', () => {
    let testReq: TestRequest;
    let currentUser: User;
    let returnedValue: any;

    const setupLoginCondition = (username: string, password: string, user?: User) => {
      service.login(username, password).subscribe((res: any) => {
        currentUser = service.currentUser;
        returnedValue = res;
      });

      const loginApiUrl = `${service.authApiUrl}/login`;

      testReq = mockHttp.expectOne(loginApiUrl);
      testReq.flush(user);
    };

    it('should login user with username and password', () => {
      setupLoginCondition(mockUsername, mockPassword, mockUser);

      expect(testReq.request.method).toEqual('POST', 'call POST request');
      expect(testReq.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded', 'with encoded content');
      expect(testReq.request.body).toEqual({ username: mockUsername, password: mockPassword }, 'with username and password');

      expect(currentUser).toEqual(mockUser, 'update current user');
    });

    it('should return current user', () => {
      setupLoginCondition(mockUsername, mockPassword, mockUser);

      expect(returnedValue).toEqual(mockUser, 'return current user');
    });
  });

  describe('#logout()', () => {
    let testReq: TestRequest;
    let returnedError: any;

    const setupLogoutCondition = (errorRes?: any) => {
      service.currentUser = mockUser; // Force logged user to exists
      service.logout().subscribe(
        () => { },
        (error: any) => {
          returnedError = error;
        }
      );

      const logoutApiUrl = `${service.authApiUrl}/logout`;

      testReq = mockHttp.expectOne(logoutApiUrl);
      testReq.flush(null, errorRes);
    };

    it('should return false', () => {
      expect(false).toBe(false);
    });

    it('should logout user', () => {
      setupLogoutCondition();

      expect(service.currentUser).toBe(undefined);
    });

    describe('when logout API request fails', () => {
      it('should catch error', () => {
        setupLogoutCondition({ status: 500, statusText: 'Internal Server Error' });

        expect(returnedError).toBe(undefined);
      });
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { cold } from 'jasmine-marbles';

import { AuthService } from './auth.service';
import { User } from './user.model';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttp: HttpTestingController;
  let mockWindow: Window;

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

  const mockWindowFactory = () => ({
    sessionStorage: {
      getItem: jasmine.createSpy().withArgs(AuthService.userStorageKey).and.returnValue(JSON.stringify(mockUser)),
      setItem: jasmine.createSpy(),
      removeItem: jasmine.createSpy()
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: 'Window',
          useValue: mockWindowFactory()
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
    mockHttp = TestBed.get(HttpTestingController);
    mockWindow = TestBed.get('Window');
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#currentUser', () => {
    it('should get initial value from session storage', () => {
      const storedValue = mockWindow.sessionStorage.getItem(AuthService.userStorageKey);
      const expectedValue = JSON.parse(storedValue);

      expect(service.currentUser).toEqual(expectedValue);
    });

    it('should get / set value correctly', () => {
      service.currentUser = mockUser;

      expect(service.currentUser).toBe(mockUser);
    });

    it('should store current user to session storage', () => {
      service.currentUser = mockUser;

      const setItemSpy = mockWindow.sessionStorage.setItem as jasmine.Spy;
      const expectedValue = JSON.stringify(mockUser);

      expect(setItemSpy).toHaveBeenCalledWith(AuthService.userStorageKey, expectedValue);
    });
  });

  describe('#currentUser$', () => {
    it('should emit current user when the value is set', () => {
      const user$ = cold('a-b-c', {
        a: { ...mockUser },
        b: null,
        c: { ...mockUser, username: 'another-mock-username' }
      });

      user$.subscribe((user: User) => {
        service.currentUser = user;
      });

      expect(service.currentUser$).toBeObservable(user$);
    });
  });

  describe('#isLoggedIn()', () => {
    it('should return true if use is logged in', () => {
      service.currentUser = mockUser;

      expect(service.isLoggedIn()).toEqual(true);
    });

    it('should return false if use is not logged in', () => {
      service.currentUser = null;

      expect(service.isLoggedIn()).toEqual(false);
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

      const loginApiUrl = `${AuthService.authApiUrl}/login`;

      testReq = mockHttp.expectOne(loginApiUrl);
      testReq.flush(user);
    };

    it('should call api to login user with username and password', () => {
      setupLoginCondition(mockUsername, mockPassword, mockUser);

      expect(testReq.request.method).toEqual('POST', 'call POST request');
      expect(testReq.request.headers.get('Content-Type')).toEqual('application/x-www-form-urlencoded', 'with encoded content');
      expect(testReq.request.body).toEqual({ username: mockUsername, password: mockPassword }, 'with username and password');
    });

    it('should set and return current user', () => {
      setupLoginCondition(mockUsername, mockPassword, mockUser);

      expect(currentUser).toEqual(mockUser, 'set current user');
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

      const logoutApiUrl = `${AuthService.authApiUrl}/logout`;

      testReq = mockHttp.expectOne(logoutApiUrl);
      testReq.flush(null, errorRes);
    };

    it('should call api to logout user', () => {
      setupLogoutCondition();

      expect(testReq.request.method).toEqual('POST', 'call POST request');
    });

    it('should clear current user', () => {
      setupLogoutCondition();

      expect(service.currentUser).toBeFalsy();
    });

    describe('when logout request fails', () => {
      it('should catch error and clear current user', () => {
        setupLogoutCondition({ status: 500, statusText: 'Internal Server Error' });

        expect(returnedError).toBeFalsy();
      });
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  const mockWindow = {
    sessionStorage: jasmine.createSpyObj(['getItem', 'setItem', 'removeItem'])
  };
  const getItemSpy = mockWindow.sessionStorage.getItem as jasmine.Spy;
  const setItemSpy = mockWindow.sessionStorage.setItem as jasmine.Spy;
  const removeItemSpy = mockWindow.sessionStorage.removeItem as jasmine.Spy;

  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientTestingModule, { provide: 'Window', useFactory: () => mockWindow }]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
  });

  afterEach(() => {
    getItemSpy.calls.reset();
    setItemSpy.calls.reset();
    removeItemSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

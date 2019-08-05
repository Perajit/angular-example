import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HeaderUserMenuComponent } from './header-user-menu.component';
import { User } from 'src/app/core/auth/user.model';

describe('HeaderUserMenuComponent', () => {
  let component: HeaderUserMenuComponent;
  let fixture: ComponentFixture<HeaderUserMenuComponent>;
  let rootEl: DebugElement;

  const mockUser: User = {
    token: 'mock-token',
    username: 'mock-username',
    profile: {
      firstname: 'mock-firstname',
      lastname: 'mock-lastname'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderUserMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderUserMenuComponent);
    component = fixture.componentInstance;
    rootEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when current user is available', () => {
    beforeEach(() => {
      component.currentUser = mockUser;
      fixture.detectChanges();
    });

    describe('user greeting', () => {
      let userGreetingEl: DebugElement;

      beforeEach(() => {
        userGreetingEl = rootEl.query(By.css('.user-greeting'));
      });

      it('should exist', () => {
        expect(userGreetingEl).toBeTruthy();
      });

      it('should contain username', () => {
        const greetingMessage = userGreetingEl.nativeElement.textContent;

        expect(greetingMessage).toMatch(new RegExp(`${component.currentUser.username}$`));
      });
    });

    describe('logout button', () => {
      let logoutButtonEl: DebugElement;

      beforeEach(() => {
        logoutButtonEl = rootEl.query(By.css('button'));
      });

      it('should exist', () => {
        expect(logoutButtonEl).toBeTruthy();
      });

      it('should call onClickLogout() on click', () => {
        spyOn(component, 'onClickLogout');

        logoutButtonEl.triggerEventHandler('click', { });

        expect(component.onClickLogout).toHaveBeenCalled();
      });
    });
  });

  describe('when current user is unavailable', () => {
    beforeEach(() => {
      component.currentUser = null;
      fixture.detectChanges();
    });

    it('should hide content', () => {
      expect(rootEl.children.length).toBe(0);
    });
  });

  describe('#onClickLogout()', () => {
    it('should emit logout', () => {
      let isLogoutEmitted = false;

      component.logout.subscribe(() => {
        isLogoutEmitted = true;
      });

      component.onClickLogout();

      expect(isLogoutEmitted).toBe(true);
    });
  });
});

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { PokeballSpinnerComponent } from './pokeball-spinner.component';

describe('PokeballSpinnerComponent', () => {
  let component: PokeballSpinnerComponent;
  let fixture: ComponentFixture<PokeballSpinnerComponent>;
  let rootEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PokeballSpinnerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokeballSpinnerComponent);
    component = fixture.componentInstance;
    rootEl = fixture.debugElement;
    component.size = 100;
    component.color = 'red';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when loading status is true', () => {
    beforeEach(() => {
      component.isLoading$ = of(true);
      fixture.detectChanges();
    });

    it('should show pokeball spinner with overlay', () => {
      const overlayLayerEl = rootEl.query(By.css('.overlay-layer'));
      const spinerLayerEl = rootEl.query(By.css('.spinner-layer'));

      expect(overlayLayerEl).toBeTruthy();
      expect(spinerLayerEl).toBeTruthy();
    });

    describe('ball element', () => {
      let nativeEl: HTMLElement;

      beforeEach(() => {
        const el = rootEl.query(By.css('.spinner-layer .ball'));
        nativeEl = el.nativeElement;
      });

      it('should set correct size', () => {
        expect(nativeEl.clientWidth).toEqual(component.size, 'pokeball width');
        expect(nativeEl.clientHeight).toEqual(component.size, 'pokeball height');
      });

      it('should set correct color', () => {
        expect(nativeEl.style.backgroundColor).toEqual(component.color);
      });
    });

    describe('core element', () => {
      let nativeEl: HTMLElement;

      beforeEach(() => {
        const el = rootEl.query(By.css('.spinner-layer .core'));
        nativeEl = el.nativeElement;
      });

      it('should set correct outline width', () => {
        const expectedOutlineWidth = `${component.size * component.coreOutlineRatio}px`;

        expect(nativeEl.style.borderWidth).toEqual(expectedOutlineWidth);
      });
    });
  });

  describe('when loading status is false', () => {
    beforeEach(() => {
      component.isLoading$ = of(false);
      fixture.detectChanges();
    });

    it('should hide content', () => {
      expect(rootEl.children.length).toBe(0);
    });
  });
});

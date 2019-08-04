import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PokemonFormComponent } from './pokemon-form.component';
import { PokemonsModule } from '../../pokemons.module';
import { PokemonFormField } from './pokemon-form.model';

describe('PokemonFormComponent', () => {
  let component: PokemonFormComponent;
  let fixture: ComponentFixture<PokemonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PokemonsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pokemon form', () => {
    let pokemonFormEl: DebugElement;

    beforeEach(() => {
      pokemonFormEl = fixture.debugElement.query(By.css('form'));
    });

    it('should exist', () => {
      expect(component.pokemonForm).toBeTruthy();
    });

    it('should contain name input as text input', () => {
      const inputSelector = 'input[formControlName="name"]';
      const nameInputEl = pokemonFormEl.query(By.css(inputSelector));

      expect(nameInputEl).toBeTruthy();
    });

    it('should contain class input as select dropdown', () => {
      const inputSelector = 'select[formControlName="class"]';
      const classInputEl = pokemonFormEl.query(By.css(inputSelector));

      expect(classInputEl).toBeTruthy();
    });

    it('should contain CP input as numeric input', () => {
      const inputSelector = 'input[formControlName="cp"][type="number"][appNumericInput]';
      const cpInputEl = pokemonFormEl.query(By.css(inputSelector));

      expect(cpInputEl).toBeTruthy();
    });

    it('should call onSubmit() when form is submitted', () => {
      spyOn(component, 'onSubmit');

      pokemonFormEl.triggerEventHandler('submit', { });

      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    describe('name input', () => {
      const testCases = [
        { input: 'My Pikachu', expectedValidStatus: true },
        { input: 'x'.repeat(50), expectedValidStatus: true },
        { input: 'x'.repeat(51), expectedValidStatus: false },
        { input: '', expectedValidStatus: false }
      ];

      testCases.forEach(({ input, expectedValidStatus }) => {
        const validationStatus = expectedValidStatus ? 'valid' : 'invalid';

        it(`should set as ${validationStatus} for "${input}"`, () => {
          const nameControl = component.pokemonForm.controls.name;
          nameControl.setValue(input);
          fixture.detectChanges();

          expect(nameControl.valid).toBe(expectedValidStatus);
        });
      });
    });

    describe('class input', () => {
      const testCases = [
        { input: 'Pikachu', expectedValidStatus: true },
        { input: '', expectedValidStatus: false }
      ];

      testCases.forEach(({ input, expectedValidStatus }) => {
        const validationStatus = expectedValidStatus ? 'valid' : 'invalid';

        it(`should set status as ${validationStatus} for "${input}"`, () => {
          const classControl = component.pokemonForm.controls.class;
          classControl.setValue(input);
          fixture.detectChanges();

          expect(classControl.valid).toBe(expectedValidStatus);
        });
      });
    });

    describe('cp input', () => {
      const testCases = [
        { input: '3000', expectedValidStatus: true },
        { input: '11', expectedValidStatus: true },
        { input: '10', expectedValidStatus: true },
        { input: '9', expectedValidStatus: false },
        { input: '', expectedValidStatus: false }
      ];

      testCases.forEach(({ input, expectedValidStatus }) => {
        const validationStatus = expectedValidStatus ? 'valid' : 'invalid';

        it(`should set as ${validationStatus} for "${input}"`, () => {
          const cpControl = component.pokemonForm.controls.cp;
          cpControl.setValue(input);
          fixture.detectChanges();

          expect(cpControl.valid).toBe(expectedValidStatus);
        });
      });
    });
  });

  describe('#onSubmit()', () => {
    beforeEach(() => {
      spyOn(component.savePokemon, 'emit');
    });

    describe('when pokemon form is valid', () => {
      const pokemonInput = {
        name: 'My Pikachu',
        class: 'Pikachu',
        cp: 100
      };

      beforeEach(() => {
        component.pokemonForm.controls.name.setValue(pokemonInput.name);
        component.pokemonForm.controls.class.setValue(pokemonInput.class);
        component.pokemonForm.controls.cp.setValue(pokemonInput.cp);
      });

      it('should not show error message', () => {
        expect(component.shouldShowError('name')).toBe(false);
        expect(component.shouldShowError('class')).toBe(false);
        expect(component.shouldShowError('cp')).toBe(false);
      });

      it('should emit savePokemon event', () => {
        component.onSubmit();

        expect(component.savePokemon.emit).toHaveBeenCalledWith({ data: pokemonInput });
      });
    });

    describe('when pokemon form is invalid', () => {
      beforeEach(() => {
        component.pokemonForm.controls.name.setErrors({
          required: true
        });
        component.pokemonForm.controls.class.setErrors({
          maxLength: { requiredLength: 50, actualLength: 51 }
        });
        component.pokemonForm.controls.cp.setErrors({
          min: { min: 10, actual: 1 }
        });
      });

      it('should show error message', () => {
        component.onSubmit();

        expect(component.shouldShowError('name')).toBe(true, 'show name error');
        expect(component.shouldShowError('class')).toBe(true, 'show class error');
        expect(component.shouldShowError('cp')).toBe(true, 'show cp error');
      });

      it('should not emit savePokemon event', () => {
        component.onSubmit();

        expect(component.savePokemon.emit).not.toHaveBeenCalled();
      });
    });
  });

  describe('#onCancel()', () => {
    beforeEach(() => {
      spyOn(component.cancel, 'emit');
    });

    it('should emit cancel event', () => {
      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });

  describe('#getErrorMessage()', () => {
    it('should return error message when input has required error', () => {
      const mockRequiredError = { required: true };

      component.pokemonForm.controls.name.setErrors(mockRequiredError);

      expect(component.getErrorMessage('name')).toBeTruthy();
    });

    it('should return error message containing max length when input has maxLength error', () => {
      const mockMaxLengthError = { maxLength: { requiredLength: 50, actualLength: 51 } };

      component.pokemonForm.controls.name.setErrors(mockMaxLengthError);

      expect(component.getErrorMessage('name')).toBeTruthy();
      expect(component.getErrorMessage('name')).toContain(mockMaxLengthError.maxLength.requiredLength + '');
    });

    it('should return error message containing min value when input has min error', () => {
      const mockMinError = { min: { min: 10, actual: 1 } };

      component.pokemonForm.controls.cp.setErrors(mockMinError);

      expect(component.getErrorMessage('cp')).toBeTruthy();
      expect(component.getErrorMessage('cp')).toContain(mockMinError.min.min + '');
    });

    it('should not return error message when input has no error', () => {
      component.pokemonForm.controls.name.setErrors(null);

      expect(component.getErrorMessage('name')).toBeFalsy();
    });
  });
});

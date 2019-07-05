import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Pokemon } from '../../../core/pokemons/pokemon.model';

export type PokemonField = 'name' | 'species' | 'cp';
export type PokemonFieldError = Record<PokemonField, string>;

@Component({
  selector: 'app-pokemon-form',
  templateUrl: './pokemon-form.component.html',
  styleUrls: ['./pokemon-form.component.scss']
})
export class PokemonFormComponent implements OnInit {
  @Input() pokemon: Pokemon;
  @Output() savePokemon: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  pokemonForm: FormGroup;
  errors: PokemonFieldError = {} as PokemonFieldError;

  constructor(private formBuilder: FormBuilder) {}

  get formControls() {
    return this.pokemonForm.controls;
  }

  get isFormInvalid() {
    return this.pokemonForm.invalid;
  }

  get pokemonData() {
    return this.pokemon || ({} as Partial<Pokemon>);
  }

  ngOnInit() {
    const pokemonData = this.pokemonData;

    this.pokemonForm = this.formBuilder.group({
      species: [pokemonData.cp, [Validators.required, Validators.maxLength(50)]],
      name: [pokemonData.name, [Validators.required, Validators.maxLength(50)]],
      cp: [pokemonData.cp, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  onSubmit() {
    if (this.isFormInvalid) {
      this.errors = {
        species: this.getErrorMessage('species'),
        name: this.getErrorMessage('name'),
        cp: this.getErrorMessage('cp')
      } as PokemonFieldError;

      return;
    }

    const data = this.serializeData();
    this.savePokemon.emit({ data });
  }

  onCancel() {
    this.cancel.emit();
  }

  hasError(fieldName: PokemonField) {
    const control = this.formControls[fieldName];

    if (!control) {
      return;
    }

    return control.dirty && control.invalid;
  }

  getErrorMessage(fieldName: PokemonField) {
    const control = this.formControls[fieldName];
    const errors = control ? control.errors : null;

    if (!errors) {
      return;
    }

    if (errors.required) {
      return `This field is required`;
    }

    if (errors.maxLength) {
      return `This field must not be longer than ${errors.maxLength.requiredLegth}`;
    }

    if (errors.min) {
      return `This field must not be less than ${errors.min.min}`;
    }

    if (errors.max) {
      return `This field must not be greater than ${errors.max.max}`;
    }
  }

  private serializeData() {
    const form = this.pokemonForm;
    const formData = form.value;

    return { ...formData };
  }
}

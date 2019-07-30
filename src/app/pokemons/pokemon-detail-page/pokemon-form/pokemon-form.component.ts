import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pokemon, PokemonInput } from 'src/app/core/pokemons/pokemon.model';
import { PokemonClass } from 'src/app/core/pokemons/pokemon-class.model';
import { PokemonFormField } from './pokemon-form.model';

@Component({
  selector: 'app-pokemon-form',
  templateUrl: './pokemon-form.component.html',
  styleUrls: ['./pokemon-form.component.scss']
})
export class PokemonFormComponent implements OnInit {
  @Input() pokemon: Pokemon;
  @Input() pokemonClasses: PokemonClass[];
  @Output() savePokemon: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  pokemonForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  get formControls() {
    return this.pokemonForm.controls;
  }

  get isFormInvalid() {
    return this.pokemonForm.invalid;
  }

  get pokemonData() {
    return this.pokemon || ({ } as PokemonInput);
  }

  ngOnInit() {
    const pokemonData = this.pokemonData;

    this.pokemonForm = this.formBuilder.group({
      name: [pokemonData.name, [Validators.required, Validators.maxLength(50)]],
      class: [pokemonData.class, [Validators.required, Validators.maxLength(50)]],
      cp: [pokemonData.cp, [Validators.required, Validators.min(10)]]
    });
  }

  onSubmit() {
    if (this.isFormInvalid) {
      this.markAllFieldAsDirty();
      return;
    }

    const data = this.serializeData();
    this.savePokemon.emit({ data });
  }

  onCancel() {
    this.cancel.emit();
  }

  hasError(fieldName: PokemonFormField) {
    const control = this.formControls[fieldName];

    if (!control) {
      return;
    }

    return control.dirty && control.invalid;
  }

  getErrorMessage(fieldName: PokemonFormField) {
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

  private markAllFieldAsDirty() {
    const formControls = this.formControls;
    const fieldNames = Object.keys(formControls);

    fieldNames.forEach((fieldName) => {
      formControls[fieldName].markAsDirty();
    });
  }
}

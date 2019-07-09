import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NumericInputDirective } from './numeric-input.directive';
import { PokeballSpinnerComponent } from './pokeball-spinner/pokeball-spinner.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NumericInputDirective, PokeballSpinnerComponent],
  declarations: [NumericInputDirective, PokeballSpinnerComponent]
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumericInputDirective } from './numeric-input.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NumericInputDirective],
  declarations: [NumericInputDirective]
})
export class SharedModule {}

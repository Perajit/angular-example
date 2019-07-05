import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericInput]'
})
export class NumericInputDirective {
  constructor() {}

  @HostListener('keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {
    const key = e.key;
    const isNumeric = this.isNumericValue(key);

    if (!isNumeric) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    const clipboardData = event.clipboardData;
    const value = clipboardData ? clipboardData.getData('text') : '';
    const isNumeric = this.isNumericValue(value);

    if (!isNumeric) {
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    const dataTransfer = event.dataTransfer;
    const value = dataTransfer ? dataTransfer.getData('text') : '';
    const isNumeric = this.isNumericValue(value);

    if (!isNumeric) {
      event.preventDefault();
    }
  }

  private isNumericValue(value: string) {
    return /^\d*$/.test(value);
  }
}

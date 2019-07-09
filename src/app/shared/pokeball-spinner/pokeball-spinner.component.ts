import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pokeball-spinner',
  templateUrl: './pokeball-spinner.component.html',
  styleUrls: ['./pokeball-spinner.component.scss']
})
export class PokeballSpinnerComponent implements OnInit {
  @Input() size: number;
  @Input() color: string;

  constructor() {}

  get holderStyle() {
    const sizeText = `${this.size}px`;

    return {
      width: sizeText,
      height: sizeText
    };
  }

  get innerStyle() {
    return {
      borderWidth: `${this.size / 20}px`
    };
  }

  ngOnInit() {}
}

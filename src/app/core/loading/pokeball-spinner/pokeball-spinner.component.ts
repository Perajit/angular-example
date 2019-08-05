import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokeball-spinner',
  templateUrl: './pokeball-spinner.component.html',
  styleUrls: ['./pokeball-spinner.component.scss']
})
export class PokeballSpinnerComponent implements OnInit {
  @Input() isLoading$: Observable<boolean>;
  @Input() size = 80;
  @Input() color: string;

  readonly coreOutlineRatio = 1 / 16;

  constructor() { }

  get ballSizeWithUnit() {
    return `${this.size}px`;
  }

  get coreOutlineWithUnit() {
    return `${this.size * this.coreOutlineRatio}px`;
  }

  ngOnInit() { }
}

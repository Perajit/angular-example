import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-pokeball-spinner',
  templateUrl: './pokeball-spinner.component.html',
  styleUrls: ['./pokeball-spinner.component.scss']
})
export class PokeballSpinnerComponent implements OnInit {
  @Input() isLoading$: Observable<boolean>;
  @Input() size = 80;
  @Input() color: string;

  constructor() {}

  get styleSize() {
    return `${this.size}px`;
  }

  get dividerWidth() {
    return `${this.size / 16}px`;
  }

  ngOnInit() {}
}

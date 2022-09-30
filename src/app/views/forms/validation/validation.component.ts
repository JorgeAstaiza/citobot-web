import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent implements OnInit {
  customStylesValidated = false;
  browserDefaultsValidated = false;
  tooltipValidated = false;

  constructor() {}

  ngOnInit(): void {}

  onSubmit1() {
    this.customStylesValidated = true;
  }

  onReset1() {
    this.customStylesValidated = false;
  }

  onSubmit2() {
    this.browserDefaultsValidated = true;
  }

  onReset2() {
    this.browserDefaultsValidated = false;
  }

  onSubmit3() {
    this.tooltipValidated = true;
  }

  onReset3() {
    this.tooltipValidated = false;
  }
}

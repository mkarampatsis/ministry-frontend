import { Component, inject } from '@angular/core';
import {  FormGroup, FormControl, ReactiveFormsModule  } from '@angular/forms';

@Component({
  selector: 'app-diataxeis',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './diataxeis.component.html',
  styleUrl: './diataxeis.component.css'
})
export class DiataxeisComponent {

  diatajeisForm = new FormGroup({
    legalActCode : new FormControl(''),
    legalProvisionNumber: new FormControl(''),
    legalProvisionText: new FormControl(''),
    abolishingLegalProvisionCode: new FormControl('')     
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.diatajeisForm.value);
  }
}

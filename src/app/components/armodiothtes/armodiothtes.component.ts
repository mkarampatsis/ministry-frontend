import { Component, inject } from '@angular/core';
import {  FormGroup, FormControl, ReactiveFormsModule  } from '@angular/forms';
import { ConstService } from 'src/app/shared/services/const.service';

@Component({
  selector: 'app-armodiothtes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './armodiothtes.component.html',
  styleUrl: './armodiothtes.component.css'
})
export class ArmodiothtesComponent {
  
  constService = inject(ConstService);
  remitTypes = this.constService.REMIT_TYPES;

  armodiotitesForm = new FormGroup({
    remitText : new FormControl(''),
    remitTypes: new FormControl(''),
    COFOG_1stLevel: new FormControl(''),
    COFOG_2ndLevel: new FormControl(''),
    thematic_3rdLevel: new FormControl(''),
    status: new FormControl(''),
    legalProvisionsCodes: new FormControl(''), 
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.armodiotitesForm.value);
  }
}

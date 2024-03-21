import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule  } from '@angular/forms';
import { ConstService } from 'src/app/shared/services/const.service';

@Component({
  selector: 'app-nomikes-praxeis',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nomikes-praxeis.component.html',
  styleUrl: './nomikes-praxeis.component.css'
})
export class NomikesPraxeisComponent {
  
  constService = inject(ConstService);
  actTypes = this.constService.ACT_TYPES;

  nomikesPrajeisForm = new FormGroup({
    legalActType : new FormControl(''),
    legalActNumber: new FormControl(''),
    legalActDate: new FormControl(''),
    FEKref: new FormGroup({
      FEKnumber: new FormControl(''),
      FEKissue: new FormControl(''),
      FEKdate: new FormControl(''),
    }),
    DiavgeiaNumber: new FormControl('') 
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.nomikesPrajeisForm.value);
  }

}

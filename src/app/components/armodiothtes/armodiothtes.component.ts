import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ICofog2 } from 'src/app/shared/interfaces/cofog/cofog2.interface';
import { ICofog3 } from 'src/app/shared/interfaces/cofog/cofog3.interface';
import { ConstService } from 'src/app/shared/services/const.service';

@Component({
    selector: 'app-armodiothtes',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './armodiothtes.component.html',
    styleUrl: './armodiothtes.component.css',
})
export class ArmodiothtesComponent implements OnInit, OnDestroy {
    constService = inject(ConstService);
    remitTypes = this.constService.REMIT_TYPES;
    cofog1 = this.constService.COFOG;
    cofog2: ICofog2[] = [];
    cofog3: ICofog3[] = [];
    cofog1_selected: boolean = false;
    cofog2_selected: boolean = false;

    form = new FormGroup({
        remitText: new FormControl('', Validators.required),
        remitTypes: new FormControl('', Validators.required),
        cofog1: new FormControl('', Validators.required),
        cofog2: new FormControl('', Validators.required),
        cofog3: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),
        legalProvisionsCodes: new FormControl('', Validators.required),
    });
    formSubscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.formSubscriptions.push(
            this.form.get('cofog1').valueChanges.subscribe((value) => {
                if (value) {
                    this.form.get('cofog2').setValue('');
                    this.cofog1_selected = true;
                    this.cofog2_selected = false;
                    this.cofog2 = this.constService.COFOG.find((cofog) => cofog.code === value)?.cofog2 || [];
                }
            }),
        );

        this.formSubscriptions.push(
            this.form.get('cofog2').valueChanges.subscribe((value) => {
                if (value) {
                    this.form.get('cofog3').setValue('');
                    this.cofog2_selected = true;
                    this.cofog3 = this.cofog2.find((cofog) => cofog.code === value)?.cofog3 || [];
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.formSubscriptions.forEach((sub) => sub.unsubscribe());
    }

    onSubmit() {
        // TODO: Use EventEmitter with form value
        console.warn(this.form.value);
    }
}

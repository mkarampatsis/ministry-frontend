import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConstService } from 'src/app/shared/services/const.service';
import { IOrganizationUnit } from 'src/app/shared/interfaces/organization-unit';
import { OrganizationUnitService } from 'src/app/shared/services/organization-unit.service';
import { Subscription, take } from 'rxjs';
import { ICofog2 } from 'src/app/shared/interfaces/cofog/cofog2.interface';
import { ICofog3 } from 'src/app/shared/interfaces/cofog/cofog3.interface';

@Component({
    selector: 'app-new-remit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './new-remit.component.html',
    styleUrl: './new-remit.component.css',
})
export class NewRemitComponent implements OnInit, OnDestroy {
    constService = inject(ConstService);
    organizationUnitService = inject(OrganizationUnitService);
    remitTypes = this.constService.REMIT_TYPES;
    cofog1 = this.constService.COFOG;
    cofog2: ICofog2[] = [];
    cofog3: ICofog3[] = [];
    cofog1_selected: boolean = false;
    cofog2_selected: boolean = false;

    modalRef: any;
    monada_id: string;
    organizationalUnit: IOrganizationUnit;
    organizationCode: string;
    organizationPrefferedLabel: string;

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
        this.organizationUnitService
            .getOrganizationalUnitDetails(this.monada_id)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizationalUnit = data;
                this.organizationCode = data.organizationCode;
                this.organizationPrefferedLabel = this.constService.getOrganizationPrefferedLabelByCode(
                    data.organizationCode,
                );
            });

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
        console.log(this.form.value);
    }
}

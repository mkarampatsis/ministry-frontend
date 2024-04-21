import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConstService } from 'src/app/shared/services/const.service';
import { OrganizationUnitService } from 'src/app/shared/services/organization-unit.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ICofog2 } from 'src/app/shared/interfaces/cofog/cofog2.interface';
import { ICofog3 } from 'src/app/shared/interfaces/cofog/cofog3.interface';
import { Subscription, take } from 'rxjs';
import { ILegalProvisionSpecs } from '../../interfaces/legal-provision/legal-provision-specs.interface';

@Component({
    selector: 'app-new-remit',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './new-remit.component.html',
    styleUrl: './new-remit.component.css',
})
export class NewRemitComponent implements OnInit, OnDestroy {
    // The following two are injected by the modal service
    modalRef: any;
    organizationUnit: { preferredLabel: string; code: string };
    // Some useful services
    constService = inject(ConstService);
    organizationUnitService = inject(OrganizationUnitService);
    modalService = inject(ModalService);
    // Populate organization OnInit
    organization: { preferredLabel: string; code: string };

    legalProvisionSpecs: ILegalProvisionSpecs;
    legalActKey: string;

    remitTypes = this.constService.REMIT_TYPES;
    cofog1 = this.constService.COFOG;
    cofog2: ICofog2[] = [];
    cofog3: ICofog3[] = [];
    cofog1_selected: boolean = false;
    cofog2_selected: boolean = false;

    get canAddLegalProvision() {
        return (
            this.form.get('remitType').value &&
            this.form.get('cofog1').value &&
            this.form.get('cofog2').value &&
            this.form.get('cofog3').value
        );
    }

    form = new FormGroup({
        remitText: new FormControl('', Validators.required),
        remitType: new FormControl('', Validators.required),
        cofog1: new FormControl('', Validators.required),
        cofog2: new FormControl('', Validators.required),
        cofog3: new FormControl('', Validators.required),

        legalActKey: new FormControl({ value: '', disabled: true }, Validators.required),
        legalProvisionSpecs: new FormGroup({
            meros: new FormControl({ value: '', disabled: true }),
            arthro: new FormControl({ value: '', disabled: true }),
            paragrafos: new FormControl({ value: '', disabled: true }),
            edafio: new FormControl({ value: '', disabled: true }),
            pararthma: new FormControl({ value: '', disabled: true }),
        }),
    });
    formSubscriptions: Subscription[] = [];

    ngOnInit(): void {
        // Get the organization code from the organization unit
        this.organizationUnitService
            .getOrganizationalUnitDetails(this.organizationUnit.code)
            .pipe(take(1))
            .subscribe((data) => {
                const organizationCode = data.organizationCode;
                this.organization = {
                    preferredLabel: this.constService.ORGANIZATION_CODES_MAP.get(organizationCode) || '',
                    code: organizationCode,
                };
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
        this.form.get('legalProvision').enable();
        this.form.get('legalAct').enable();
        console.log(this.form.value);
    }

    addLegalProvision() {
        this.modalService
            .newLegalProvision
            //     this.organization, this.organizationUnit, {
            //     remitType: this.form.get('remitType').value,
            //     cofog1: this.form.get('cofog1').value,
            //     cofog2: this.form.get('cofog2').value,
            //     cofog3: this.form.get('cofog3').value,
            // }
            ()
            .subscribe((data) => {
                this.legalProvisionSpecs = data.legalProvisionSpecs;
                this.legalActKey = data.legalActKey;
                this.form.get('legalActKey').setValue(this.legalActKey);
                this.form.get('legalProvisionSpecs').setValue(this.legalProvisionSpecs);
                console.log(data);
            });
    }

    selectLegalProvision() {
        this.modalService.selectLegalProvision().subscribe((data) => {
            console.log(data);
        });
    }
}

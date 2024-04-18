import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { LegalProvisionService } from 'src/app/shared/services/legal-provision.service';
import { IDiataxi } from '../../interfaces/legal-provision/diataxi.interface';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';

@Component({
    selector: 'app-new-legal-provision',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './new-legal-provision.component.html',
    styleUrl: './new-legal-provision.component.css',
})
export class NewLegalProvisionComponent implements OnInit {
    // The following three are injected by the modal service
    organization: { preferredLabel: string; code: string };
    organizationUnit: { preferredLabel: string; code: string };
    remit: { remitType: string; cofog1: string; cofog2: string; cofog3: string };
    // Some useful services
    modalService = inject(ModalService);
    constService = inject(ConstService);
    legalProvisionService = inject(LegalProvisionService);
    // Cofog Names will populate onInit
    cofog1: string = '';
    cofog2: string = '';
    cofog3: string = '';

    modalRef: any;

    selectedLegalAct = '';

    form = new FormGroup(
        {
            legalProvision: new FormGroup({
                meros: new FormControl(''),
                arthro: new FormControl(''),
                paragrafos: new FormControl(''),
                edafio: new FormControl(''),
                pararthma: new FormControl(''),
            }),
            legalAct: new FormControl('', Validators.required),
        },
        this.checkLegalProvision,
    );

    checkLegalProvision(form: FormGroup): { [key: string]: boolean } | null {
        if (
            form.get('legalProvision').get('meros').value.trim() !== '' ||
            form.get('legalProvision').get('arthro').value.trim() !== '' ||
            form.get('legalProvision').get('paragrafos').value.trim() !== '' ||
            form.get('legalProvision').get('edafio').value.trim() !== '' ||
            form.get('legalProvision').get('pararthma').value.trim() !== ''
        ) {
            return null;
        } else {
            return { emptyLegalProvision: true };
        }
    }

    ngOnInit(): void {
        [this.cofog1, this.cofog2, this.cofog3] = this.constService.getCofogNames(
            this.remit.cofog1,
            this.remit.cofog2,
            this.remit.cofog3,
        );
    }

    selectLegalAct() {
        this.modalService.selectLegalAct().subscribe((data) => {
            console.log(data);
            this.selectedLegalAct = data;
            this.form.get('legalAct').setValue(data);
        });
    }

    onSubmit() {
        console.log(this.form.value);
        const legalProvision = this.form.get('legalProvision').value as ILegalProvision;
        const regulatedObject = {
            foreas: this.organization.code,
            monada: this.organizationUnit.code,
        };
        const legalAct = this.form.get('legalAct').value;
        const diataxi = { legalProvision, legalAct, regulatedObject } as IDiataxi;
        this.legalProvisionService.newLegalProvision(diataxi).subscribe((data) => {
            const { msg, index } = data;
            console.log(msg);
            this.modalRef.close(index);
        });
    }
}

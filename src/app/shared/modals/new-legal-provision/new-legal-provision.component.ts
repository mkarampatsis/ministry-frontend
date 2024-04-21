import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { LegalProvisionService } from 'src/app/shared/services/legal-provision.service';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { ILegalProvisionSpecs } from '../../interfaces/legal-provision/legal-provision-specs.interface';

@Component({
    selector: 'app-new-legal-provision',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './new-legal-provision.component.html',
    styleUrl: './new-legal-provision.component.css',
})
export class NewLegalProvisionComponent {
    // Some useful services
    modalService = inject(ModalService);
    constService = inject(ConstService);
    legalProvisionService = inject(LegalProvisionService);
    // Cofog Names will populate onInit
    cofog1: string = '';
    cofog2: string = '';
    cofog3: string = '';

    modalRef: any;

    selectedLegalActKey = '';

    form = new FormGroup(
        {
            legalProvisionSpecs: new FormGroup({
                meros: new FormControl(''),
                arthro: new FormControl(''),
                paragrafos: new FormControl(''),
                edafio: new FormControl(''),
                pararthma: new FormControl(''),
            }),
            legalActKey: new FormControl({ value: '', disabled: true }, Validators.required),
        },
        this.checkLegalProvision,
    );

    checkLegalProvision(form: FormGroup): { [key: string]: boolean } | null {
        if (
            form.get('legalProvisionSpecs').get('meros').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('arthro').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('paragrafos').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('edafio').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('pararthma').value.trim() !== ''
        ) {
            return null;
        } else {
            return { emptyLegalProvision: true };
        }
    }

    selectLegalAct() {
        this.modalService.selectLegalAct().subscribe((data) => {
            console.log(data);
            this.selectedLegalActKey = data;
            this.form.get('legalActKey').setValue(data);
        });
    }

    onSubmit() {
        console.log(this.form.value);
        const legalProvisionSpecs = this.form.get('legalProvisionSpecs').value as ILegalProvisionSpecs;

        const legalActKey = this.form.get('legalActKey').value;
        const diataxi = { legalProvisionSpecs, legalActKey } as ILegalProvision;
        this.legalProvisionService.newLegalProvision(diataxi).subscribe((data) => {
            const { msg, index } = data;
            console.log(msg);
            this.modalRef.close(index);
        });
    }
}

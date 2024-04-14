import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { ConstService } from '../../services/const.service';

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
    // Cofog Names will populate onInit
    cofog1: string = '';
    cofog2: string = '';
    cofog3: string = '';

    modalRef: any;

    canAddLegalAct = true;

    form = new FormGroup({
        legalProvisionCode: new FormGroup({
            meros: new FormControl('', Validators.required),
            arthro: new FormControl('', Validators.required),
            paragrafos: new FormControl('', Validators.required),
            edafio: new FormControl('', Validators.required),
            pararthma: new FormControl('', Validators.required),
        }),
        legalAct: new FormControl('', Validators.required),
    });

    ngOnInit(): void {
        [this.cofog1, this.cofog2, this.cofog3] = this.constService.getCofogNames(
            this.remit.cofog1,
            this.remit.cofog2,
            this.remit.cofog3,
        );
    }

    addLegalAct() {
        this.modalService.newLegalAct(this.organization, this.organizationUnit, this.remit);
    }
}

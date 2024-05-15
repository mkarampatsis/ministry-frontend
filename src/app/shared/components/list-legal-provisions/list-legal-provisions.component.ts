import { Component, Input, inject } from '@angular/core';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-list-legal-provisions',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './list-legal-provisions.component.html',
    styleUrl: './list-legal-provisions.component.css',
})
export class ListLegalProvisionsComponent {
    @Input() legalProvisions: ILegalProvision[] = [];
    modalService = inject(ModalService);

    displayLegalProvision(provision: ILegalProvision) {
        this.modalService.showLegalProvision(provision);
    }

    removeLegalProvision(i: number) {
        this.legalProvisions.splice(i, 1);
    }
}

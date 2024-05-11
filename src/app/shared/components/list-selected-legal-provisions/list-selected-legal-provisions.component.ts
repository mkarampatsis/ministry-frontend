import { Component, Input, inject } from '@angular/core';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-list-selected-legal-provisions',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './list-selected-legal-provisions.component.html',
    styleUrl: './list-selected-legal-provisions.component.css',
})
export class ListSelectedLegalProvisionsComponent {
    @Input() legalProvisions: ILegalProvision[] = [];
    modalService = inject(ModalService);

    displayLegalProvision(provision: ILegalProvision) {
        this.modalService.showLegalProvision(provision);
    }
}

import { Component, Input, inject } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { ModalService } from '../../services/modal.service';
import { LegalProvisionService } from '../../services/legal-provision.service';

@Component({
    selector: 'app-list-legal-provisions',
    standalone: true,
    imports: [ClipboardModule],
    templateUrl: './list-legal-provisions.component.html',
    styleUrl: './list-legal-provisions.component.css',
})
export class ListLegalProvisionsComponent {
    @Input() legalProvisions: ILegalProvision[] = [];
    @Input() code = '';
    @Input() provisionType: 'organization' | 'ogranizationalUnit' | 'remit' | null = null;
    @Input() actionColumnVisible = false;
    modalService = inject(ModalService);
    legalProvisionService = inject(LegalProvisionService);

    displayLegalProvision(provision: ILegalProvision) {
        this.modalService.showLegalProvision(provision);
    }

    removeLegalProvision(i: number) {
        console.log(this.legalProvisions[i]);
        this.modalService
            .getUserConsent(
                `Πρόκειται να διαγράψετε τη διάταξη που βασίζεται στο <strong>${this.legalProvisions[i].legalActKey}</strong>. Παρακαλούμε επιβεβαιώστε ότι επιθυμείτε να συνεχίσετε.`,
            )
            .subscribe((result) => {
                if (result) {
                    this.legalProvisionService
                        .deleteLegalProvision(this.provisionType, this.code, this.legalProvisions[i])
                        .subscribe((response) => {
                            this.legalProvisions.splice(i, 1);
                        });
                }
            });
        // this.legalProvisions.splice(i, 1);
    }
}

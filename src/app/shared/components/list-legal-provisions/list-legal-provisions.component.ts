import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
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
export class ListLegalProvisionsComponent implements OnChanges {
    @Input() legalProvisions: ILegalProvision[] = [];
    @Input() code = '';
    @Input() provisionType: 'organization' | 'ogranizationalUnit' | 'remit' | null = null;
    @Input() actionColumnVisible = false;
    modalService = inject(ModalService);
    legalProvisionService = inject(LegalProvisionService);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.legalProvisions) {
            this.legalProvisions = changes.legalProvisions.currentValue;
            this.sortLegalProvisions();
        }
    }

    sortLegalProvisions() {
        const legalProvisions = this.legalProvisions;

        const sortedData = legalProvisions.map((obj) => {
            const dateStr = obj.legalActKey.match(/\d{2}-\d{2}-\d{4}$/)?.[0]; // Extract date in format DD-MM-YYYY
            if (dateStr) {
                const [day, month, year] = dateStr.split('-');
                const isoDateStr = `${year}-${month}-${day}`;
                const date = new Date(isoDateStr);
                return { ...obj, date };
            } else {
                return { ...obj, date: null };
            }
        });

        // Sort the array by date in descending order
        sortedData.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
        this.legalProvisions = sortedData;
    }

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

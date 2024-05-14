import { Component, inject } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardRowRightLeftComponent } from 'src/app/shared/components/card-row-right-left/card-row-right-left.component';
import { ForeasService } from '../../services/foreas.service';
import { LegalProvisionService } from '../../services/legal-provision.service';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { IForeas } from '../../interfaces/foreas/foreas.interface';
import { ListSelectedLegalProvisionsComponent } from '../../components/list-selected-legal-provisions/list-selected-legal-provisions.component';

@Component({
    selector: 'app-organization-details',
    standalone: true,
    imports: [CommonModule, NgbModalModule, CardRowRightLeftComponent, ListSelectedLegalProvisionsComponent],
    templateUrl: './organization-details.component.html',
    styleUrl: './organization-details.component.css',
})
export class OrganizationDetailsComponent {
    organizationService = inject(OrganizationService);
    foreasService = inject(ForeasService);
    legalProvisionService = inject(LegalProvisionService);

    organizationCode: string | null = null;
    organization: IOrganization | null = null;
    modalRef: any;

    legalProvisions: ILegalProvision[] = [];
    foreas: IForeas;
    level: string;

    ngOnInit() {
        this.organizationService
            .getOrganizationDetails(this.organizationCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organization = data;

                this.foreasService
                    .getForeas(this.organization.code)
                    .pipe(take(1))
                    .subscribe((data) => {
                        this.foreas = data;
                        this.level = this.foreas.level;
                        this.legalProvisionService
                            .getLegalProvisionsByRegulatedObject(this.foreas._id['$oid'])
                            .subscribe((data) => {
                                this.legalProvisions = data;
                            });
                    });
            });
    }

    descriptionMap(entry: { description: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.description);
    }

    fullAddressMap(entry: { fullAddress: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.fullAddress);
    }
}

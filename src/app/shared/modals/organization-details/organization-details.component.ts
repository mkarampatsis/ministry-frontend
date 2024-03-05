import { Component, inject } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardRowRightLeftComponent } from 'src/app/shared/components/card-row-right-left/card-row-right-left.component';

@Component({
    selector: 'app-organization-details',
    standalone: true,
    imports: [CommonModule, NgbModalModule, CardRowRightLeftComponent],
    templateUrl: './organization-details.component.html',
    styleUrl: './organization-details.component.css',
})
export class OrganizationDetailsComponent {
    organizationService = inject(OrganizationService);

    organizationCode: string | null = null;
    organization: IOrganization | null = null;
    modalRef: any;

    ngOnInit() {
        this.organizationService
            .getOrganizationDetails(this.organizationCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organization = data;
            });
    }

    descriptionMap(entry: { description: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.description);
    }

    fullAddressMap(entry: { fullAddress: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.fullAddress);
    }
}

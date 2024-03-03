import { Component, inject } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { IOrganizationList } from 'src/app/shared/interfaces/organization/organization-list.interface';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-organization-details',
    standalone: true,
    imports: [CommonModule, NgbModalModule],
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
}

import { Component, inject } from '@angular/core';
import { OrganizationUnitService } from 'src/app/shared/services/organization-unit.service';
import { IOrganizationUnit } from 'src/app/shared/interfaces/organization-unit';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CardRowRightLeftComponent } from 'src/app/shared/components/card-row-right-left/card-row-right-left.component';
import { ConstService } from 'src/app/shared/services/const.service';

@Component({
    selector: 'app-organization-unit-details',
    standalone: true,
    imports: [CommonModule, NgbModalModule, CardRowRightLeftComponent],
    templateUrl: './organization-unit-details.component.html',
    styleUrl: './organization-unit-details.component.css',
})
export class OrganizationUnitDetailsComponent {
    organizationUnitService = inject(OrganizationUnitService);
    constService = inject(ConstService);

    organizationUnitCode: string | null = null;
    organizationUnit: IOrganizationUnit | null = null;
    modalRef: any;

    ngOnInit() {
        this.organizationUnitService
            .getOrganizationalUnitDetails(this.organizationUnitCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizationUnit = data;
            });
    }

    descriptionMap(entry: { description: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.description);
    }

    fullAddressMap(entry: { fullAddress: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.fullAddress);
    }

    organizationPrefferedLabel(code: string) {
        return this.constService.getOrganizationPrefferedLabelByCode(code);
    }

    organizationUnitPrefferedLabel(code: string) {
        return this.constService.getOrganizationUnitPrefferedLabelByCode(code);
    }
}

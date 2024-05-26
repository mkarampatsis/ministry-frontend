import { Component, inject } from '@angular/core';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';
import { IOrganizationUnit } from 'src/app/shared/interfaces/organization-unit';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CardRowRightLeftComponent } from 'src/app/shared/components/card-row-right-left/card-row-right-left.component';
import { ConstService } from 'src/app/shared/services/const.service';
import { RemitService } from '../../services/remit.service';
import { IRemit } from '../../interfaces/remit/remit.interface';
import { ListLegalProvisionsComponent } from '../../components/list-legal-provisions/list-legal-provisions.component';

@Component({
    selector: 'app-organization-unit-details',
    standalone: true,
    imports: [
        CommonModule,
        NgbModalModule,
        CardRowRightLeftComponent,
        ListLegalProvisionsComponent,
        NgbAccordionModule,
        NgbAlertModule,
    ],
    templateUrl: './organization-unit-details.component.html',
    styleUrl: './organization-unit-details.component.css',
})
export class OrganizationUnitDetailsComponent {
    organizationUnitService = inject(OrganizationalUnitService);
    constService = inject(ConstService);
    remitService = inject(RemitService);

    remits: IRemit[] = [];

    organizationalUnitCode: string | null = null;
    organizationalUnit: IOrganizationUnit | null = null;
    modalRef: any;

    ngOnInit() {
        this.organizationUnitService
            .getOrganizationalUnitDetails(this.organizationalUnitCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizationalUnit = data;
            });

        this.remitService
            .getRemitsByCode(this.organizationalUnitCode)
            .pipe(take(1))
            .subscribe((data) => {
                // console.log(data);
                this.remits = data;
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

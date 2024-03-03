import { Component, OnInit, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { IOrganization } from 'src/app/shared/interfaces/organization/organization.interface';
import { ConstService } from 'src/app/shared/services/const.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';

@Component({
    selector: 'app-foreis',
    standalone: true,
    imports: [AgGridAngular],
    templateUrl: './foreis.component.html',
    styleUrl: './foreis.component.css',
})
export class ForeisComponent implements OnInit {
    constService = inject(ConstService);
    organizationCodesMap = this.constService.ORGANIZATION_CODES_MAP;
    organizationTypesMap = this.constService.ORGANIZATION_TYPES_MAP;

    organizationService = inject(OrganizationService);

    foreis: IOrganization[] = [];
    colDefs: ColDef[] = [
        {
            field: 'code',
            headerName: 'Κωδικός',
            sortable: true,
            filter: true,
        },
        {
            field: 'preferredLabel',
            headerName: 'Ονομασία',
            sortable: true,
            filter: true,
        },
        {
            field: 'subOrganizationOf',
            headerName: 'Υποοργανισμός',
            sortable: true,
            filter: true,
        },
        {
            field: 'organizationType',
            headerName: 'Τύπος',
            sortable: true,
            filter: true,
        },
    ];

    ngOnInit(): void {
        this.organizationService
            .getAllOrganizations()
            .pipe(
                take(1),
                map((data) => {
                    return data.map((org) => {
                        return {
                            ...org,
                            organizationType: this.organizationTypesMap.get(
                                parseInt(String(org.organizationType)),
                            ),
                            subOrganizationOf: this.organizationCodesMap.get(
                                org.subOrganizationOf,
                            ),
                        };
                    });
                }),
            )
            .subscribe((data) => {
                console.log(data);
                this.foreis = data;
            });
    }
}

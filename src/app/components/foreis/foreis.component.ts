import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { ForeisActionIconsComponent } from 'src/app/shared/foreis-action-icons/foreis-action-icons.component';
import { IOrganization } from 'src/app/shared/interfaces/organization/organization.interface';
import { GridLoadingOverlayComponent } from 'src/app/shared/modals/grid-loading-overlay/grid-loading-overlay.component';
import { ConstService } from 'src/app/shared/services/const.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';

@Component({
    selector: 'app-foreis',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './foreis.component.html',
    styleUrl: './foreis.component.css',
})
export class ForeisComponent {
    constService = inject(ConstService);
    organizationCodesMap = this.constService.ORGANIZATION_CODES_MAP;
    organizationTypesMap = this.constService.ORGANIZATION_TYPES_MAP;

    organizationService = inject(OrganizationService);

    foreis: IOrganization[] = [];
    gridApi: GridApi<IOrganization>;
    // prettier-ignore
    colDefs: ColDef[] = [
        { field: 'code', headerName: 'Κωδικός', sortable: true, filter: true },
        { field: 'preferredLabel', headerName: 'Ονομασία', sortable: true, filter: true, },
        { field: 'subOrganizationOf', headerName: 'Εποπτεύουσα Αρχή', sortable: true, filter: true, },
        { field: 'organizationType', headerName: 'Τύπος', sortable: true, filter: true, },
        { field: 'actionCell', headerName: 'Ενέργειες', cellRenderer: ForeisActionIconsComponent, sortable: false, editable: false, filter: false, resizable: false, },
    ];

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση φορέων...' };

    onGridReady(params: GridReadyEvent<IOrganization>): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
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
                this.gridApi.hideOverlay();
                this.foreis = data;
            });
    }
}

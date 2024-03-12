import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { ForeisActionIconsComponent } from 'src/app/shared/components/foreis-action-icons/foreis-action-icons.component';
import { IOrganizationList } from 'src/app/shared/interfaces/organization/organization-list.interface';
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
    organizationService = inject(OrganizationService);
    foreis: IOrganizationList[] = [];

    organizationCodesMap = this.constService.ORGANIZATION_CODES_MAP;
    organizationTypesMap = this.constService.ORGANIZATION_TYPES_MAP;

    defaultColDef = this.constService.defaultColDef;
    // prettier-ignore
    colDefs: ColDef[] = [
        { field: 'code', headerName: 'Κωδικός', width: 90, maxWidth: 90, minWidth: 90},
        { field: 'preferredLabel', headerName: 'Ονομασία', flex: 1 },
        { field: 'subOrganizationOf', headerName: 'Εποπτεύουσα Αρχή', flex: 1 },
        { field: 'organizationType', headerName: 'Τύπος', flex: 1 },
        { field: 'actionCell', headerName: 'Ενέργειες', cellRenderer: ForeisActionIconsComponent,  filter: false, sortable: false, floatingFilter:false, flex: 1, resizable: false},
    ];
    autoSizeStrategy = this.constService.autoSizeStrategy;

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση φορέων...' };

    gridApi: GridApi<IOrganizationList>;

    onGridReady(params: GridReadyEvent<IOrganizationList>): void {
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

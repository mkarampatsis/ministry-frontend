import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { MonadesActionIconsComponent } from 'src/app/shared/components/monades-action-icons/monades-action-icons.component';
import { IOrganizationUnitList } from 'src/app/shared/interfaces/organization-unit';
import { GridLoadingOverlayComponent } from 'src/app/shared/modals/grid-loading-overlay/grid-loading-overlay.component';
import { ConstService } from 'src/app/shared/services/const.service';
import { OrganizationUnitService } from 'src/app/shared/services/organization-unit.service';

@Component({
    selector: 'app-monades',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './monades.component.html',
    styleUrl: './monades.component.css',
})
export class MonadesComponent {
    constService = inject(ConstService);
    organizationUnitService = inject(OrganizationUnitService);
    monades: IOrganizationUnitList[] = [];

    organizationUnitCodesMap = this.constService.ORGANIZATION_UNIT_CODES_MAP;
    organizationUnitTypesMap = this.constService.ORGANIZATION_UNIT_TYPES_MAP;

    defaultColDef = this.constService.defaultColDef;
    // prettier-ignore
    colDefs: ColDef[] = [
        { field: 'code', headerName: 'Κωδικός', width: 90, maxWidth: 90, minWidth: 90},
        { field: 'preferredLabel', headerName: 'Ονομασία', flex: 1 },
        { field: 'subOrganizationOf', headerName: 'Προϊστάμενη Μονάδα', flex: 1 },
        { field: 'organizationType', headerName: 'Τύπος', flex: 1 },
        { field: 'actionCell', headerName: 'Ενέργειες', cellRenderer: MonadesActionIconsComponent,  filter: false, sortable: false, floatingFilter:false, flex: 1, resizable: false},
    ]
    autoSizeStrategy = this.constService.autoSizeStrategy;

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση μονάδων...' };

    gridApi: GridApi<IOrganizationUnitList>;

    onGridReady(params: GridReadyEvent<IOrganizationUnitList>): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
        this.organizationUnitService
            .getAllOrganizationalUnits()
            .pipe(
                take(1),
                map((data) => {
                    return data.map((org) => {
                        return {
                            ...org,
                            organizationType: this.organizationUnitTypesMap.get(
                                parseInt(String(org.unitType)),
                            ),
                            subOrganizationOf:
                                this.organizationUnitCodesMap.get(
                                    org.supervisorUnitCode,
                                ),
                        };
                    });
                }),
            )
            .subscribe((data) => {
                this.gridApi.hideOverlay();
                this.monades = data;
            });
    }
}

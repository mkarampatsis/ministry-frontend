import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { MonadesActionIconsComponent } from 'src/app/shared/components/monades-action-icons/monades-action-icons.component';
import { IOrganizationUnitList } from 'src/app/shared/interfaces/organization-unit';
import { GridLoadingOverlayComponent } from 'src/app/shared/modals/grid-loading-overlay/grid-loading-overlay.component';
import { ConstService } from 'src/app/shared/services/const.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';

@Component({
    selector: 'app-monades',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './monades.component.html',
    styleUrl: './monades.component.css',
})
export class MonadesComponent {
    constService = inject(ConstService);
    organizationalUnitService = inject(OrganizationalUnitService);
    modalService = inject(ModalService);
    monades: IOrganizationUnitList[] = [];

    organizationCodesMap = this.constService.ORGANIZATION_CODES_MAP;
    organizationUnitCodesMap = this.constService.ORGANIZATION_UNIT_CODES_MAP;
    organizationUnitTypesMap = this.constService.ORGANIZATION_UNIT_TYPES_MAP;

    defaultColDef = this.constService.defaultColDef;
    // prettier-ignore
    colDefs: ColDef[] = this.constService.ORGANIZATION_UNITS_COL_DEFS
    autoSizeStrategy = this.constService.autoSizeStrategy;

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση μονάδων...' };

    gridApi: GridApi<IOrganizationUnitList>;

    onGridReady(params: GridReadyEvent<IOrganizationUnitList>): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
        this.organizationalUnitService
            .getAllOrganizationalUnits()
            .pipe(
                take(1),
                map((data) => {
                    return data.map((org) => {
                        return {
                            ...org,
                            organizationType: this.organizationUnitTypesMap.get(parseInt(String(org.unitType))),
                            organization: this.organizationCodesMap.get(org.organizationCode),
                            subOrganizationOf: this.organizationUnitCodesMap.get(org.supervisorUnitCode),
                        };
                    });
                }),
            )
            .subscribe((data) => {
                // console.log(data);
                this.gridApi.hideOverlay();
                this.monades = data;
            });
    }

    onRowDoubleClicked(event: any): void {
        console.log(event);
        this.modalService.showOrganizationUnitDetails(event.data.code);
    }
}

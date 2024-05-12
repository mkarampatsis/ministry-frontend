import { Component, OnInit, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { ForeisActionIconsComponent } from 'src/app/shared/components/foreis-action-icons/foreis-action-icons.component';
import { IOrganization, IOrganizationList } from 'src/app/shared/interfaces/organization';
import { IOrganizationUnit } from 'src/app/shared/interfaces/organization-unit';
import { GridLoadingOverlayComponent } from 'src/app/shared/modals';
import { ConstService } from 'src/app/shared/services/const.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';

import { UserService } from 'src/app/shared/services/user.service';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
    userService = inject(UserService);
    constService = inject(ConstService);
    modalService = inject(ModalService);
    organizationService = inject(OrganizationService);
    organizationUnitsService = inject(OrganizationalUnitService);

    organizations: IOrganization[] = [];
    organizations_loading = false;
    organizationCodesMap = this.constService.ORGANIZATION_CODES_MAP;

    organizational_units: IOrganizationUnit[] = [];
    organizational_units_loading = false;
    organizationalUnitCodesMap = this.constService.ORGANIZATION_UNIT_CODES_MAP;

    organizationTypesMap = this.constService.ORGANIZATION_TYPES_MAP;

    defaultColDef = this.constService.defaultColDef;
    // prettier-ignore
    foreisColDefs: ColDef[] = [
        { field: 'code', headerName: 'Κωδικός', flex: 1},
        { field: 'preferredLabel', headerName: 'Ονομασία', flex: 4 },
        { field: 'subOrganizationOf', headerName: 'Εποπτεύουσα Αρχή', flex: 2 },
        { field: 'organizationType', headerName: 'Τύπος', flex: 2 },
        { field: 'actionCell', headerName: '', cellRenderer: ForeisActionIconsComponent,  filter: false, sortable: false, floatingFilter:false, flex: 1, resizable: false},
    ];
    autoSizeStrategy = this.constService.autoSizeStrategy;
    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση προσβάσεων...' };

    gridApi: GridApi<IOrganizationList>;

    ngOnInit() {
        this.userService.getMyOrganizations().subscribe((data) => {
            if (data.organizations.length === 0) {
                this.organizations_loading = false;
            } else {
                data.organizations.forEach((org) => {
                    this.getOrganizationDetails(org);
                });
            }
            if (data.organizational_units.length === 0) {
                this.organizational_units_loading = false;
            } else {
                data.organizational_units.forEach((ou) => {
                    this.getOrganizationalUnitDetails(ou);
                });
            }
        });
    }

    creationRegulation() {
        alert('Δεν είναι υλοποιημένο ακόμη!');
    }

    editForeas(code: string) {
        this.modalService.foreasEdit(code);
    }

    newRemit(organizationalUnit: IOrganizationUnit) {
        this.modalService.newRemit({
            code: organizationalUnit.code,
            preferredLabel: organizationalUnit.preferredLabel,
        });
    }

    getOrganizationDetails(code: string) {
        this.organizations_loading = true;
        return this.organizationService
            .getOrganizationDetails(code)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizations.push(data);
                this.organizations_loading = false;
            });
    }

    getOrganizationalUnitDetails(code: string) {
        this.organizational_units_loading = true;
        return this.organizationUnitsService
            .getOrganizationalUnitDetails(code)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizational_units.push(data);
                this.organizational_units_loading = false;
            });
    }

    onGridReady(params: any): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
        this.userService.getMyOrganizations().subscribe((data) => {
            data.organizations.forEach((org) => {
                console.log(org);
                this.getOrganizationDetails(org);
            });
            this.gridApi.hideOverlay();
        });
    }
}

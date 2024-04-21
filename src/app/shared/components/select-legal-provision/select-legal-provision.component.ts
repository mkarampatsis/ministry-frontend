import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { LegalActsActionsComponent } from 'src/app/shared/components/legal-acts-actions/legal-acts-actions.component';

import { ILegalProvision } from 'src/app/shared/interfaces/legal-provision/legal-provision.interface';

import { GridLoadingOverlayComponent } from 'src/app/shared/modals';
import { ConstService } from 'src/app/shared/services/const.service';
import { LegalActService } from 'src/app/shared/services/legal-act.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { LegalProvisionService } from 'src/app/shared/services/legal-provision.service';

@Component({
    selector: 'app-select-legal-provision',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './select-legal-provision.component.html',
    styleUrl: './select-legal-provision.component.css',
})
export class SelectLegalProvisionComponent {
    @Output() selectedLegalProvisions = new EventEmitter<ILegalProvision[]>();
    constService = inject(ConstService);
    legalProvisionsService = inject(LegalProvisionService);
    modalService = inject(ModalService);
    legalProvisions: ILegalProvision[] = [];

    defaultColDef = this.constService.defaultColDef;
    rowSelection: 'single' | 'multiple' = 'multiple';

    colDefs: ColDef[] = [
        { field: 'legalActKey', headerName: 'Νομική Πράξη', flex: 6 },
        { field: 'legalProvisionSpecs.meros', headerName: 'Μέρος', flex: 1 },
        { field: 'legalProvisionSpecs.arthro', headerName: 'Άρθρο', flex: 1 },
        { field: 'legalProvisionSpecs.paragrafos', headerName: 'Παράγραφος', flex: 1 },
        { field: 'legalProvisionSpecs.edafio', headerName: 'Εδάφιο', flex: 1 },
        { field: 'legalProvisionSpecs.pararthma', headerName: 'Παράρτημα', flex: 1 },
        {
            field: 'actionCell',
            headerName: '',
            cellRenderer: LegalActsActionsComponent,
            filter: false,
            sortable: false,
            floatingFilter: false,
            resizable: false,
            flex: 0.5,
        },
    ];

    currentLegalProvisions: ILegalProvision[] = [];

    autoSizeStrategy = this.constService.autoSizeStrategy;

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση διατάξεων...' };

    gridApi: GridApi<ILegalProvision>;

    onGridReady(params: GridReadyEvent<ILegalProvision>): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
        this.legalProvisionsService
            .getAllLegalProvisions()
            .pipe(
                take(1),
                map((data) => {
                    return data.map((legalAct) => {
                        return {
                            ...legalAct,
                        };
                    });
                }),
            )
            .subscribe((data) => {
                this.legalProvisions = data;
                this.gridApi.hideOverlay();
            });
    }

    onSelectionChanged(): void {
        this.currentLegalProvisions = this.gridApi.getSelectedRows();
    }

    onSelectedLegalProvisions(): void {
        this.selectedLegalProvisions.emit(this.currentLegalProvisions);
    }

    newLegalProvision(): void {
        this.modalService.newLegalProvision().subscribe((data) => {
            if (data) {
                this.gridApi.showLoadingOverlay();
                this.legalProvisionsService
                    .getAllLegalProvisions()
                    .pipe(
                        take(1),
                        map((data) => {
                            return data.map((legalAct) => {
                                return {
                                    ...legalAct,
                                };
                            });
                        }),
                    )
                    .subscribe((data) => {
                        this.legalProvisions = data;
                        this.gridApi.hideOverlay();
                    });
            }
        });
    }
}

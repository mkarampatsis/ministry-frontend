import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';
import { LegalActsActionsComponent } from 'src/app/shared/components/legal-acts-actions/legal-acts-actions.component';

import { ILegalAct } from 'src/app/shared/interfaces/nomiki-praji/legal-act.interface';

import { GridLoadingOverlayComponent } from 'src/app/shared/modals';
import { ConstService } from 'src/app/shared/services/const.service';
import { LegalActService } from 'src/app/shared/services/legal-act.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
    selector: 'app-select-legal-action',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './select-legal-action.component.html',
    styleUrl: './select-legal-action.component.css',
})
export class SelectLegalActionComponent {
    @Output() selectedLegalAct = new EventEmitter<string>();
    constService = inject(ConstService);
    legalActService = inject(LegalActService);
    modalService = inject(ModalService);
    legalActs: ILegalAct[] = [];

    defaultColDef = this.constService.defaultColDef;
    rowSelection: 'single' | 'multiple' = 'single';

    colDefs: ColDef[] = [
        {
            valueGetter: function (params) {
                if (params.data.legalActType === 'ΑΛΛΟ') {
                    return params.data.legalActTypeOther;
                } else {
                    return params.data.legalActType;
                }
            },
            field: 'legalActType',
            headerName: 'Τύπος',
            flex: 1,
        },
        { field: 'legalActNumber', headerName: 'Αριθμός', flex: 1 },
        { field: 'fek.number', headerName: 'ΦΕΚ (Αριθμός)', flex: 1 },
        { field: 'fek.issue', headerName: 'ΦΕΚ (Τεύχος)', flex: 1 },
        { field: 'fek.date', headerName: 'ΦΕΚ (Ημερομηνία)', flex: 1 },
        { field: 'ada', headerName: 'ΑΔΑ', flex: 1 },
        {
            field: 'actionCell',
            headerName: 'Ενέργειες',
            cellRenderer: LegalActsActionsComponent,
            filter: false,
            sortable: false,
            floatingFilter: false,
            flex: 1,
            resizable: false,
        },
    ];

    currentLegalAct: ILegalAct;

    autoSizeStrategy = this.constService.autoSizeStrategy;

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση νομικών πράξεων...' };

    gridApi: GridApi<ILegalAct>;

    onGridReady(params: GridReadyEvent<ILegalAct>): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
        this.legalActService
            .getAllLegalActs()
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
                console.log(data);
                this.legalActs = data;
                this.gridApi.hideOverlay();
            });
    }

    onSelectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.currentLegalAct = selectedRows[0];
        console.log(selectedRows);
    }

    onSelectedLegalAct(): void {
        this.selectedLegalAct.emit(this.currentLegalAct.legalActKey);
    }

    newLegalAct(): void {
        this.modalService.newLegalAct().subscribe((data) => {
            if (data) {
                this.gridApi.showLoadingOverlay();
                this.legalActService
                    .getAllLegalActs()
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
                        console.log(data);
                        this.legalActs = data;
                        this.gridApi.hideOverlay();
                    });
            }
        });
    }
}

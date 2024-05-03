import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, take } from 'rxjs';

import { IRemit } from 'src/app/shared/interfaces/remit/remit.interface';
import { GridLoadingOverlayComponent } from 'src/app/shared/modals/grid-loading-overlay/grid-loading-overlay.component';
import { ConstService } from 'src/app/shared/services/const.service';
import { RemitService } from 'src/app/shared/services/remit.service';

export interface IRemitExtended extends IRemit {
    organizationLabel: string;
    organizationUnitLabel: string;
}

@Component({
    selector: 'app-armodiothtes',
    standalone: true,
    imports: [AgGridAngular, GridLoadingOverlayComponent],
    templateUrl: './armodiothtes.component.html',
    styleUrl: './armodiothtes.component.css',
})
export class ArmodiothtesComponent {
    constService = inject(ConstService);
    remitsService = inject(RemitService);
    remits: IRemitExtended[] = [];

    organizationCodesMap = this.constService.ORGANIZATION_CODES_MAP;
    organizationUnitCodesMap = this.constService.ORGANIZATION_UNIT_CODES_MAP;

    defaultColDef = this.constService.defaultColDef;
    // prettier-ignore
    colDefs: ColDef[] = [
        { field: 'organizationLabel', headerName: 'Φορέας', flex: 1 },
        { field: 'organizationUnitLabel', headerName: 'Μονάδα', flex: 1 },
        { field: 'remitType', headerName: 'Τύπος', flex: 1 },
        { field: 'remitText', headerName: 'Κείμενο', flex: 6, 
            // cellRenderer: function(params) {
            //     return params.value ? params.value : '';
            // },
            cellRenderer: HtmlCellRenderer,
          autoHeight: true, cellStyle: { 'white-space': 'normal' },
        }
    ];

    autoSizeStrategy = this.constService.autoSizeStrategy;

    loadingOverlayComponent = GridLoadingOverlayComponent;
    loadingOverlayComponentParams = { loadingMessage: 'Αναζήτηση αρμοδιοτήτων...' };

    gridApi: GridApi<IRemitExtended>;

    onGridReady(params: GridReadyEvent<IRemitExtended>): void {
        this.gridApi = params.api;
        this.gridApi.showLoadingOverlay();
        this.remitsService
            .getAllRemits()
            .pipe(
                take(1),
                map((data) => {
                    return data.map((remit) => {
                        return {
                            ...remit,
                            organizationLabel: this.organizationCodesMap.get(remit.regulatedObject.organization),
                            organizationUnitLabel: this.organizationUnitCodesMap.get(
                                remit.regulatedObject.organizationalUnit,
                            ),
                        };
                    });
                }),
            )
            .subscribe((data) => {
                this.gridApi.hideOverlay();
                this.remits = data;
            });
    }
}

@Component({
    selector: 'app-html-cell-renderer',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            [innerHTML]="shortText"
            *ngIf="!showFullText"></div>
        <div
            [innerHTML]="params.value"
            *ngIf="showFullText"></div>
        <button
            class="btn btn-info btn-sm mb-2"
            *ngIf="isLongText"
            (click)="toggleText()">
            {{ showFullText ? 'Σύμπτυξη' : 'Περισσότερα' }}
        </button>
    `,
})
export class HtmlCellRenderer implements ICellRendererAngularComp {
    params: any;
    showFullText = false;
    shortText = '';
    isLongText = false;

    agInit(params: any): void {
        this.params = params;
        if (this.params.value.length > 500) {
            this.shortText = this.params.value.substr(0, 500);
            this.isLongText = true;
        } else {
            this.shortText = this.params.value;
        }
    }

    refresh(params: any): boolean {
        this.params = params;
        if (this.params.value.length > 500) {
            this.shortText = this.params.value.substr(0, 500);
            this.isLongText = true;
        } else {
            this.shortText = this.params.value;
        }
        this.showFullText = false; // Reset the text display state
        return true;
    }

    toggleText(): void {
        this.showFullText = !this.showFullText;
    }
}

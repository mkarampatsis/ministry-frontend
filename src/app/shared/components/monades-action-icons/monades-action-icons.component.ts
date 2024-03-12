import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
    selector: 'app-monades-action-icons',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './monades-action-icons.component.html',
    styleUrl: './monades-action-icons.component.css',
})
export class MonadesActionIconsComponent implements ICellRendererAngularComp {
    modalService = inject(ModalService);
    params: ICellRendererParams;

    agInit(params: ICellRendererParams<any, any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false;
    }

    showOrganizationUnitDetails(): void {
        this.modalService.showOrganizationUnitDetails(this.params.data.code);
    }

    showOrganizationUnitTree(): void {}
}

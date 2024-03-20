import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
    selector: 'app-foreis-action-icons',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './foreis-action-icons.component.html',
    styleUrl: './foreis-action-icons.component.css',
})
export class ForeisActionIconsComponent implements ICellRendererAngularComp {
    modalService = inject(ModalService);
    params: ICellRendererParams;

    agInit(params: ICellRendererParams<any, any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false;
    }

    showOrganizationDetails(): void {
        this.modalService.showOrganizationDetails(this.params.data.code);
    }

    showOrganizationTree(): void {
        this.modalService.showOrganizationTree(this.params.data.code);
    }

    showUpload(): void {
        this.modalService.uploadFile();
    }

    editForeas(): void {
        this.modalService.foreasEdit(this.params.data.code);
    }
}

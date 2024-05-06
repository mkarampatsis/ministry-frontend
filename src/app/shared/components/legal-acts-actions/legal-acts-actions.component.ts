import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ModalService } from 'src/app/shared/services/modal.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-legal-acts-actions',
    standalone: true,
    imports: [MatIconModule, NgbTooltipModule],
    templateUrl: './legal-acts-actions.component.html',
    styleUrl: './legal-acts-actions.component.css',
})
export class LegalActsActionsComponent implements ICellRendererAngularComp {
    modalService = inject(ModalService);
    uploadService = inject(FileUploadService);
    params: ICellRendererParams;

    agInit(params: ICellRendererParams<any, any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false;
    }

    displayFEK() {
        this.uploadService
            .getUploadByID(this.params.data.legalActFile.$oid)
            .pipe(take(1))
            .subscribe((data) => {
                const url = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.download = this.params.data.legalActKey + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }
}

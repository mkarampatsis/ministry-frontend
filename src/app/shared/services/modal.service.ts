import { Injectable, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationDetailsComponent } from 'src/app/shared/modals/organization-details/organization-details.component';
import { OrganizationTreeComponent } from 'src/app/shared/modals/organization-tree/organization-tree.component';
import { FileUploadComponent } from 'src/app/shared/modals/file-upload/file-upload.component';
import { OrganizationUnitDetailsComponent } from '../modals/organization-unit-details/organization-unit-details.component';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    modalService = inject(NgbModal);

    showOrganizationDetails(organizationCode: string) {
        const modalRef = this.modalService.open(OrganizationDetailsComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.organizationCode = organizationCode;
        modalRef.componentInstance.modalRef = modalRef;
    }

    showOrganizationUnitDetails(organizationUnitCode: string) {
        const modalRef = this.modalService.open(
            OrganizationUnitDetailsComponent,
            {
                size: 'xl',
                centered: true,
            },
        );
        modalRef.componentInstance.organizationUnitCode = organizationUnitCode;
        modalRef.componentInstance.modalRef = modalRef;
    }

    showOrganizationTree(organizationCode: string) {
        const modalRef = this.modalService.open(OrganizationTreeComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.organizationCode = organizationCode;
        modalRef.componentInstance.modalRef = modalRef;
    }

    uploadFile() {
        const modalRef = this.modalService.open(FileUploadComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
    }
}

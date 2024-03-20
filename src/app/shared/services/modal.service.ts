import { Injectable, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FileUploadComponent,
    ForeasEditComponent,
    OrganizationDetailsComponent,
    OrganizationTreeComponent,
    OrganizationUnitDetailsComponent,
} from 'src/app/shared/modals';

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

    foreasEdit(foreas_id: string) {
        const modalRef = this.modalService.open(ForeasEditComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.foreas_id = foreas_id;
        modalRef.componentInstance.modalRef = modalRef;
    }
}

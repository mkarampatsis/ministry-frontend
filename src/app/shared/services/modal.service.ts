import { Injectable, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IOrganizationList } from 'src/app/shared/interfaces/organization/organization-list.interface';
import { OrganizationDetailsComponent } from 'src/app/shared/modals/organization-details/organization-details.component';

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
}

import { Injectable, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    BackendErrorComponent,
    FileUploadComponent,
    ForeasEditComponent,
    OrganizationDetailsComponent,
    OrganizationTreeComponent,
    OrganizationUnitDetailsComponent,
    NewLegalActComponent,
    NewRemitComponent,
    NewLegalProvisionComponent,
} from 'src/app/shared/modals';
import { SelectLegalActionComponent } from '../components/select-legal-action/select-legal-action.component';
import { SelectLegalActionModalComponent } from '../modals/select-legal-action-modal/select-legal-action-modal.component';
import { Observable, take } from 'rxjs';

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
        const modalRef = this.modalService.open(OrganizationUnitDetailsComponent, {
            size: 'xl',
            centered: true,
        });
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

    showBackendError(message: string) {
        const modalRef = this.modalService.open(BackendErrorComponent, {
            size: 'md',
            centered: true,
        });
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.modalRef = modalRef;
    }

    newRemit(organizationUnit: { preferredLabel: string; code: string }) {
        const modalRef = this.modalService.open(NewRemitComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
        modalRef.componentInstance.organizationUnit = organizationUnit;
    }

    newLegalProvision(
        organization: { preferredLabel: string; code: string },
        organizationUnit: { preferredLabel: string; code: string },
        remit: { remitType: string; cofog1: string; cofog2: string; cofog3: string },
    ) {
        const modalRef = this.modalService.open(NewLegalProvisionComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
        modalRef.componentInstance.organization = organization;
        modalRef.componentInstance.organizationUnit = organizationUnit;
        modalRef.componentInstance.remit = remit;
        return modalRef.closed.pipe(take(1)) as Observable<boolean>;
    }

    newLegalAct() {
        const modalRef = this.modalService.open(NewLegalActComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
        return modalRef.dismissed.pipe(take(1)) as Observable<boolean>;
    }

    selectLegalAct() {
        const modalRef = this.modalService.open(SelectLegalActionModalComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
        return modalRef.dismissed.pipe(take(1)) as Observable<string>;
    }
}

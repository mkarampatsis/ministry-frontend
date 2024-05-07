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
import { ILegalProvisionSpecs } from '../interfaces/legal-provision/legal-provision-specs.interface';
import { SelectLegalProvisionModalComponent } from '../modals/select-legal-provision-modal/select-legal-provision-modal.component';
import { ILegalProvision } from '../interfaces/legal-provision/legal-provision.interface';
import { ShowLegalProvisionComponent } from '../modals/show-legal-provision/show-legal-provision.component';

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

    showLegalProvision(legalProvision: ILegalProvision) {
        const modalRef = this.modalService.open(ShowLegalProvisionComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.legalProvision = legalProvision;
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

    newLegalProvision() {
        const modalRef = this.modalService.open(NewLegalProvisionComponent, {
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;

        return modalRef.closed.pipe(take(1)) as Observable<{
            legalActKey: string;
            legalProvisionSpecs: ILegalProvisionSpecs;
            regulatedObject: { foreas: string; monada: string };
        }>;
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
            fullscreen: 'lg',
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
        return modalRef.dismissed.pipe(take(1)) as Observable<string>;
    }

    selectLegalProvision() {
        const modalRef = this.modalService.open(SelectLegalProvisionModalComponent, {
            fullscreen: 'lg',
            size: 'xl',
            centered: true,
        });
        modalRef.componentInstance.modalRef = modalRef;
        return modalRef.dismissed.pipe(take(1)) as Observable<ILegalProvision[]>;
    }
}

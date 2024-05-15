import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { ConstService } from 'src/app/shared/services/const.service';
import { take } from 'rxjs';
import { IForeasDTO } from 'src/app/shared/interfaces/foreas/foreas.interface';
import { ForeasService } from 'src/app/shared/services/foreas.service';
import { Toast, ToastService } from 'src/app/shared/services/toast.service';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { ModalService } from '../../services/modal.service';
import { ListLegalProvisionsComponent } from '../../components/list-legal-provisions/list-legal-provisions.component';
import { LegalProvisionService } from '../../services/legal-provision.service';
import { IReguLatedObject } from '../../interfaces/legal-provision/regulated-object.interface';
import { cloneDeep, isEqual, uniqWith, reverse } from 'lodash-es';

@Component({
    selector: 'app-foreas-edit',
    standalone: true,
    imports: [FormsModule, ListLegalProvisionsComponent],
    templateUrl: './foreas-edit.component.html',
    styleUrl: './foreas-edit.component.css',
})
export class ForeasEditComponent implements OnInit {
    ognanizationService = inject(OrganizationService);
    foreasService = inject(ForeasService);
    constService = inject(ConstService);
    // toastService = inject(ToastService);
    modalService = inject(ModalService);
    legalProvisionService = inject(LegalProvisionService);

    // @ViewChild('successTpl') successTpl: TemplateRef<any>;

    foreas_id: string;
    level: string;
    originalLevel: string;

    organization: IOrganization;
    modalRef: any;

    foreas: IForeasDTO;

    organizationLevels = this.constService.ORGANIZATION_LEVELS;

    legalProvisions: ILegalProvision[] = [];
    originalLegalProvisions: ILegalProvision[] = [];

    ngOnInit() {
        this.ognanizationService
            .getOrganizationDetails(this.foreas_id)
            .pipe(take(1))
            .subscribe((data) => {
                this.organization = data;
            });

        this.foreasService
            .getForeas(this.foreas_id)
            .pipe(take(1))
            .subscribe((data) => {
                this.foreas = data;
                this.level = this.foreas.level;
                this.originalLevel = this.foreas.level;
                this.legalProvisionService
                    .getLegalProvisionsByRegulatedOrganization(this.foreas.code)
                    .pipe(take(1))
                    .subscribe((data) => {
                        this.legalProvisions = data;
                        this.originalLegalProvisions = cloneDeep(this.legalProvisions);
                    });
                // this.legalProvisionService
                //     .getLegalProvisionsByRegulatedObject(this.foreas._id['$oid'])
                //     .subscribe((data) => {
                //         this.legalProvisions = data;
                //         this.originalLegalProvisions = cloneDeep(this.legalProvisions);
                //     });
            });
    }

    onSubmit() {
        const organization = {
            code: this.foreas.code,
            level: this.level,
            legalProvisions: this.legalProvisions,
        } as IForeasDTO;

        console.log(organization);

        this.foreasService
            .updateForeas(organization)
            .pipe(take(1))
            .subscribe((response) => {
                console.log(response);
            });

        // this.foreasService
        //     .updateForeas(organization)
        //     .pipe(take(1))
        //     .subscribe(() => {
        //         this.modalRef.dismiss();
        //         // this.showSuccess(this.successTpl);
        //     });
    }

    // showSuccess(template: TemplateRef<any>) {
    //     const toast: Toast = {
    //         component: ToastMessageComponent,
    //         inputs: {
    //             message: `Ο φορέας <strong>${this.organization.preferredLabel}</strong> ενημερώθηκε επιτυχώς!`,
    //         },
    //         classname: 'bg-success text-light',
    //     };
    //     this.toastService.show(toast);
    // }

    newLegalProvision(): void {
        this.modalService.newLegalProvision().subscribe((data) => {
            if (data) {
                const tempLegalProvision = [data.legalProvision, ...this.legalProvisions];
                this.legalProvisions = uniqWith(tempLegalProvision, (a, b) => {
                    return a.legalActKey === b.legalActKey && isEqual(a.legalProvisionSpecs, b.legalProvisionSpecs);
                });
            }
        });
    }

    hasChanges(): boolean {
        return this.level !== this.originalLevel || !isEqual(this.legalProvisions, this.originalLegalProvisions);
    }

    dismiss() {
        if (this.hasChanges()) {
            this.modalService
                .getUserConsent(
                    `Αν κλείσετε το παράθυρο οι αλλαγές του Φορέα <strong>${this.organization.preferredLabel}</strong>  δεν θα αποθηκευτούν! Παρακαλούμε επιβεβαιώστε την ενέργεια.`,
                )
                .pipe(take(1))
                .subscribe((consent) => {
                    if (consent) {
                        this.modalRef.dismiss();
                    }
                });
        } else {
            this.modalRef.dismiss();
        }
    }
}

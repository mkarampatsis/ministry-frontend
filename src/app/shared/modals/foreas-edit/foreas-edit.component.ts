import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { ConstService } from 'src/app/shared/services/const.service';
import { take } from 'rxjs';
import { IForeas } from 'src/app/shared/interfaces/foreas/foreas.interface';
import { ForeasService } from 'src/app/shared/services/foreas.service';
import { Toast, ToastService } from 'src/app/shared/services/toast.service';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { ModalService } from '../../services/modal.service';
import { ListLegalProvisionsComponent } from '../../components/list-legal-provisions/list-legal-provisions.component';
import { LegalProvisionService } from '../../services/legal-provision.service';
import { IReguLatedObject } from '../../interfaces/legal-provision/regulated-object.interface';

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
    toastService = inject(ToastService);
    modalService = inject(ModalService);
    legalProvisionService = inject(LegalProvisionService);

    @ViewChild('successTpl') successTpl: TemplateRef<any>;

    foreas_id: string;
    level: string;

    organization: IOrganization;
    modalRef: any;

    foreas: IForeas;

    organizationLevels = this.constService.ORGANIZATION_LEVELS;

    legalProvisions: ILegalProvision[] = [];

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
                this.legalProvisionService
                    .getLegalProvisionsByRegulatedObject(this.foreas._id['$oid'])
                    .subscribe((data) => {
                        this.legalProvisions = data;
                    });
            });
    }

    onSubmit() {
        console.log(this.level);

        const organization = {
            code: this.foreas.code,
            level: this.level,
        } as IForeas;

        this.foreasService
            .updateForeas(organization)
            .pipe(take(1))
            .subscribe(() => {
                this.modalRef.dismiss();
                this.showSuccess(this.successTpl);
            });
    }

    showSuccess(template: TemplateRef<any>) {
        const toast: Toast = {
            component: ToastMessageComponent,
            inputs: {
                message: `Ο φορέας <strong>${this.organization.preferredLabel}</strong> ενημερώθηκε επιτυχώς!`,
            },
            classname: 'bg-success text-light',
        };
        this.toastService.show(toast);
    }

    newLegalProvision(): void {
        const regulatedObject: IReguLatedObject = {
            regulatedObjectType: 'organization',
            regulatedObjectObjectId: this.foreas._id['$oid'],
        };
        this.modalService.newLegalProvision(regulatedObject).subscribe((data) => {
            if (data) {
                console.log(data);
                this.legalProvisions.push(data.legalProvision);
            }
        });
    }
}

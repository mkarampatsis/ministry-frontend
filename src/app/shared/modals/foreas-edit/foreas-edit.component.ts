import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ListSelectedLegalProvisionsComponent } from '../../components/list-selected-legal-provisions/list-selected-legal-provisions.component';
import { LegalProvisionService } from '../../services/legal-provision.service';
import { IReguLatedObject } from '../../interfaces/legal-provision/regulated-object.interface';

@Component({
    selector: 'app-foreas-edit',
    standalone: true,
    imports: [ReactiveFormsModule, ListSelectedLegalProvisionsComponent],
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

    form = new FormGroup({
        level: new FormControl(''),
        legalProvisions: new FormControl({ value: [], disabled: true }),
    });
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
                if (this.foreas.legalProvisions) {
                    this.legalProvisionService
                        .fromListOfIds(this.foreas.legalProvisions)
                        .pipe(take(1))
                        .subscribe((data) => {
                            this.legalProvisions = data;
                            this.form.get('level').setValue(this.foreas.level);
                            this.form.get('legalProvisions').setValue(data);
                        });
                }
            });
    }

    onSubmit() {
        this.form.controls.legalProvisions.enable();

        const legalProvisionsIDs = this.legalProvisions.map((provision) => provision['_id']['$oid']);
        const legalProvisionsKeys = this.legalProvisions.map((provision) => {
            return { legalActKey: provision.legalActKey, legalProvisionSpecs: provision.legalProvisionSpecs };
        });
        const regulatedObject: IReguLatedObject = {
            regulatedObjectType: 'organization',
            regulatedObjectCode: this.foreas.code,
        };
        this.level = this.form.value.level;
        const organization = {
            code: this.foreas.code,
            level: this.level,
            legalProvisions: legalProvisionsIDs,
        } as IForeas;
        console.log(organization);
        console.log(legalProvisionsKeys, regulatedObject);

        this.foreasService
            .updateForeas(organization)
            .pipe(take(1))
            .subscribe(() => {
                this.modalRef.dismiss();
                this.showSuccess(this.successTpl);
            });

        this.legalProvisionService
            .fromListOfKeysUpdateRegulatedObject(legalProvisionsKeys, regulatedObject)
            .pipe(take(1))
            .subscribe((response) => {
                console.log(response);
                // this.modalRef.dismiss();
                this.showSuccessLegalProvisions(this.successTpl);
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

    showSuccessLegalProvisions(template: TemplateRef<any>) {
        const toast: Toast = {
            component: ToastMessageComponent,
            inputs: {
                message: `Ο φορέας <strong>${this.organization.preferredLabel}</strong> ενσωματώθηκε στις διατάξεις πρόβλεψής του!`,
            },
            classname: 'bg-success text-light',
        };
        this.toastService.show(toast);
    }

    selectLegalProvision() {
        this.modalService
            .selectLegalProvision()
            .pipe(take(1))
            .subscribe((data) => {
                if (data) {
                    this.legalProvisions = data;
                    this.form.get('legalProvisions').setValue(data);
                }
            });
    }
}

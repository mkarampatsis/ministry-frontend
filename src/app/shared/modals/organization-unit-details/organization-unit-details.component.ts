import { Component, effect, inject } from '@angular/core';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';
import { IOrganizationUnit } from 'src/app/shared/interfaces/organization-unit';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbAccordionModule, NgbAlertModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CardRowRightLeftComponent } from 'src/app/shared/components/card-row-right-left/card-row-right-left.component';
import { ConstService } from 'src/app/shared/services/const.service';
import { RemitService } from '../../services/remit.service';
import { IRemit } from '../../interfaces/remit/remit.interface';
import { ListLegalProvisionsComponent } from '../../components/list-legal-provisions/list-legal-provisions.component';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { LegalProvisionService } from '../../services/legal-provision.service';
import { ICofog } from '../../interfaces/cofog/cofog.interface';

@Component({
    selector: 'app-organization-unit-details',
    standalone: true,
    imports: [
        CommonModule,
        NgbModalModule,
        CardRowRightLeftComponent,
        ListLegalProvisionsComponent,
        NgbAccordionModule,
        NgbAlertModule,
    ],
    templateUrl: './organization-unit-details.component.html',
    styleUrl: './organization-unit-details.component.css',
})
export class OrganizationUnitDetailsComponent {
    organizationUnitService = inject(OrganizationalUnitService);
    constService = inject(ConstService);
    remitService = inject(RemitService);
    modalService = inject(ModalService);
    authService = inject(AuthService);
    legalProvisionService = inject(LegalProvisionService);

    legalProvisionsNeedUpdate = this.legalProvisionService.legalProvisionsNeedUpdate;
    remitsNeedUpdate = this.remitService.remitsNeedUpdate;

    remits: IRemit[] = [];

    organizationalUnitCode: string | null = null;
    organizationalUnit: IOrganizationUnit | null = null;
    modalRef: any;

    ngOnInit() {
        this.organizationUnitService
            .getOrganizationalUnitDetails(this.organizationalUnitCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizationalUnit = data;
            });

        this.remitService
            .getRemitsByCode(this.organizationalUnitCode)
            .pipe(take(1))
            .subscribe((data) => {
                console.log(data);
                this.remits = data;
            });
    }

    constructor() {
        effect(
            () => {
                if (this.legalProvisionsNeedUpdate()) {
                    this.remitService
                        .getRemitsByCode(this.organizationalUnitCode)
                        .pipe(take(1))
                        .subscribe((data) => {
                            this.remits = data;
                        });
                    this.legalProvisionsNeedUpdate.set(false);
                }

                if (this.remitsNeedUpdate()) {
                    this.remitService
                        .getRemitsByCode(this.organizationalUnitCode)
                        .pipe(take(1))
                        .subscribe((data) => {
                            this.remits = data;
                        });
                    this.remitsNeedUpdate.set(false);
                }
            },
            { allowSignalWrites: true },
        );
    }

    descriptionMap(entry: { description: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.description);
    }

    fullAddressMap(entry: { fullAddress: string }[] | undefined) {
        if (entry) return entry.map((entry) => entry.fullAddress);
    }

    organizationPrefferedLabel(code: string) {
        return this.constService.getOrganizationPrefferedLabelByCode(code);
    }

    organizationUnitPrefferedLabel(code: string) {
        return this.constService.getOrganizationUnitPrefferedLabelByCode(code);
    }

    updateRemit(remit: IRemit) {
        console.log(this.organizationalUnitCode, this.organizationUnitPrefferedLabel(this.organizationalUnitCode));
        this.modalService.editRemit(
            {
                preferredLabel: this.organizationUnitPrefferedLabel(this.organizationalUnitCode),
                code: this.organizationalUnitCode,
            },
            remit,
        );
    }

    newRemit() {
        this.modalService.newRemit({
            code: this.organizationalUnit.code,
            preferredLabel: this.organizationalUnit.preferredLabel,
        });
    }

    canEdit(code: string) {
        return this.authService.canEdit(code);
    }

    getCofogNames(cofog: { cofog1: string; cofog2: string; cofog3: string }) {
        const { cofog1, cofog2, cofog3 } = cofog;
        return this.constService.getCofogNames(cofog1, cofog2, cofog3);
    }
}

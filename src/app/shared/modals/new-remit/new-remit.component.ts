import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConstService } from 'src/app/shared/services/const.service';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ICofog2 } from 'src/app/shared/interfaces/cofog/cofog2.interface';
import { ICofog3 } from 'src/app/shared/interfaces/cofog/cofog3.interface';
import { Subscription, take } from 'rxjs';
import { ILegalProvision } from 'src/app/shared/interfaces/legal-provision/legal-provision.interface';
import { IRemit } from 'src/app/shared/interfaces/remit/remit.interface';
import { RemitService } from 'src/app/shared/services/remit.service';
import { Toast, ToastService } from 'src/app/shared/services/toast.service';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';
import { DEFAULT_TOOLBAR, Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { ListLegalProvisionsComponent } from '../../components/list-legal-provisions/list-legal-provisions.component';
import { IReguLatedObject } from '../../interfaces/legal-provision/regulated-object.interface';
import { cloneDeep, isEqual, uniqWith } from 'lodash-es';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-new-remit',
    standalone: true,
    imports: [ReactiveFormsModule, NgxEditorModule, ListLegalProvisionsComponent, NgbAlertModule],
    templateUrl: './new-remit.component.html',
    styleUrl: './new-remit.component.css',
    encapsulation: ViewEncapsulation.None,
})
export class NewRemitComponent implements OnInit, OnDestroy {
    // The following two are injected by the modal service
    modalRef: any;
    organizationalUnit: { preferredLabel: string; code: string };
    // Some useful services
    constService = inject(ConstService);
    organizationalUnitService = inject(OrganizationalUnitService);
    remitService = inject(RemitService);
    modalService = inject(ModalService);
    toastService = inject(ToastService);

    editor: Editor = new Editor();
    toolbar: Toolbar = DEFAULT_TOOLBAR;

    @ViewChild('successTpl') successTpl: TemplateRef<any>;

    // Populate organization OnInit
    organization: { preferredLabel: string; code: string };

    remitTypes = this.constService.REMIT_TYPES;
    cofog1 = this.constService.COFOG;
    cofog2: ICofog2[] = [];
    cofog3: ICofog3[] = [];
    cofog1_selected: boolean = false;
    cofog2_selected: boolean = false;

    legalProvisions: ILegalProvision[] = [];
    originalLegalProvisions: ILegalProvision[] = [];

    get canAddLegalProvision() {
        return (
            this.form.get('remitType').value &&
            this.form.get('cofog1').value &&
            this.form.get('cofog2').value &&
            this.form.get('cofog3').value
        );
    }

    form = new FormGroup({
        remitText: new FormControl(
            '<strong>Το κείμενο θα ενημερώνεται αυτόματα όσο προσθέτετε διατάξεις</strong>',
            Validators.required,
        ),
        remitType: new FormControl('', Validators.required),
        cofog1: new FormControl('', Validators.required),
        cofog2: new FormControl('', Validators.required),
        cofog3: new FormControl('', Validators.required),
        legalProvisions: new FormControl([], Validators.required),
    });
    formSubscriptions: Subscription[] = [];

    ngOnInit(): void {
        // Get the organization code from the organization unit
        this.organizationalUnitService
            .getOrganizationalUnitDetails(this.organizationalUnit.code)
            .pipe(take(1))
            .subscribe((data) => {
                const organizationCode = data.organizationCode;
                this.organization = {
                    preferredLabel: this.constService.ORGANIZATION_CODES_MAP.get(organizationCode) || '',
                    code: organizationCode,
                };
            });

        this.formSubscriptions.push(
            this.form.get('cofog1').valueChanges.subscribe((value) => {
                if (value) {
                    this.form.get('cofog2').setValue('');
                    this.cofog1_selected = true;
                    this.cofog2_selected = false;
                    this.cofog2 = this.constService.COFOG.find((cofog) => cofog.code === value)?.cofog2 || [];
                }
            }),
        );

        this.formSubscriptions.push(
            this.form.get('cofog2').valueChanges.subscribe((value) => {
                if (value) {
                    this.form.get('cofog3').setValue('');
                    this.cofog2_selected = true;
                    this.cofog3 = this.cofog2.find((cofog) => cofog.code === value)?.cofog3 || [];
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.formSubscriptions.forEach((sub) => sub.unsubscribe());
        this.editor.destroy();
    }

    onSubmit() {
        this.form.get('legalProvisions').enable();
        // const remit = this.form.value as IRemit;
        const remit = {
            regulatedObject: {
                organization: this.organization.code,
                organizationalUnit: this.organizationalUnit.code,
            },
            remitText: this.form.get('remitText').value,
            remitType: this.form.get('remitType').value,
            cofog: {
                cofog1: this.form.get('cofog1').value,
                cofog2: this.form.get('cofog2').value,
                cofog3: this.form.get('cofog3').value,
            },
            legalProvisions: this.form.get('legalProvisions').value,
        } as IRemit;
        console.log(remit);
        this.remitService.newRemit(remit).subscribe((data) => {
            console.log(data);
            this.modalRef.dismiss();
            this.showSuccess(this.successTpl);
        });
    }

    // selectLegalProvision() {
    //     this.modalService.selectLegalProvision().subscribe((data) => {
    //         if (data) {
    //             this.legalProvisions = data;
    //             this.form.get('legalProvisions').setValue(data);
    //         }
    //     });
    // }

    showSuccess(template: TemplateRef<any>) {
        const toast: Toast = {
            component: ToastMessageComponent,
            inputs: {
                message: `Επιτυχής εισαγωγή νέας Αρμοδιότητας.`,
            },
            classname: 'bg-success text-light',
        };
        this.toastService.show(toast);
    }

    newLegalProvision(): void {
        this.modalService.newLegalProvision().subscribe((data) => {
            if (data) {
                const tempLegalProvision = [data.legalProvision, ...this.legalProvisions];
                this.legalProvisions = uniqWith(tempLegalProvision, (a, b) => {
                    return a.legalActKey === b.legalActKey && isEqual(a.legalProvisionSpecs, b.legalProvisionSpecs);
                });
                this.form.get('legalProvisions').setValue(this.legalProvisions);
                this.updateRemitTextfromLegalProvisions();
            }
        });
    }

    updateRemitTextfromLegalProvisions() {
        if (this.legalProvisions.length >= 1) {
            let remitText = this.legalProvisions.reduce((acc, legalProvision) => {
                return acc + this.legalProvisionHeader(legalProvision);
            }, '');
            remitText = `<p style="color:red"><strong>
            Το κείμενο ενημερώνεται αυτόματα όσο προσθέτετε Διατάξεις.<br>
            Ελέγξτε και τροποποιήστε το συνολικό κείμενο της Αρμοδιότητας μετά την τελευταία προσθήκη Διάταξης.
            </strong></p>${remitText}`;
            this.form.get('remitText').setValue(remitText);
        }
    }

    legalProvisionHeader(legalProvision: ILegalProvision): string {
        let html = `${legalProvision.legalActKey}`;
        let specs = '';
        if (legalProvision.legalProvisionSpecs.meros) specs += `Μέρος ${legalProvision.legalProvisionSpecs.meros}, `;
        if (legalProvision.legalProvisionSpecs.arthro) specs += `Άρθρο ${legalProvision.legalProvisionSpecs.arthro}, `;
        if (legalProvision.legalProvisionSpecs.paragrafos)
            specs += `Παράγραφος ${legalProvision.legalProvisionSpecs.paragrafos}, `;
        if (legalProvision.legalProvisionSpecs.edafio) specs += `Εδάφιο ${legalProvision.legalProvisionSpecs.edafio}, `;
        if (legalProvision.legalProvisionSpecs.pararthma)
            specs += `Παράρτημα ${legalProvision.legalProvisionSpecs.pararthma}`;
        html = `<strong>${html} (${specs.slice(0, -2)})</strong> ${legalProvision.legalProvisionText}`;

        return html;
    }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modal.service';
import { ConstService } from 'src/app/shared/services/const.service';
import { LegalProvisionService } from 'src/app/shared/services/legal-provision.service';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';
import { ILegalProvisionSpecs } from '../../interfaces/legal-provision/legal-provision-specs.interface';
import { DEFAULT_TOOLBAR, Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { IReguLatedObject } from '../../interfaces/legal-provision/regulated-object.interface';
import { take } from 'rxjs';

@Component({
    selector: 'app-new-legal-provision',
    standalone: true,
    imports: [ReactiveFormsModule, NgxEditorModule],
    templateUrl: './new-legal-provision.component.html',
    styleUrl: './new-legal-provision.component.css',
})
export class NewLegalProvisionComponent implements OnDestroy {
    // Some useful services
    modalService = inject(ModalService);
    constService = inject(ConstService);
    // legalProvisionService = inject(LegalProvisionService);

    modalRef: any;

    selectedLegalActKey: string | undefined = undefined;

    editor: Editor = new Editor();
    toolbar: Toolbar = DEFAULT_TOOLBAR;

    form = new FormGroup(
        {
            legalActText: new FormControl('', Validators.required),
            legalProvisionSpecs: new FormGroup({
                meros: new FormControl(''),
                arthro: new FormControl(''),
                paragrafos: new FormControl(''),
                edafio: new FormControl(''),
                pararthma: new FormControl(''),
            }),
            legalActKey: new FormControl({ value: '', disabled: true }, Validators.required),
        },
        this.checkLegalProvision,
    );

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    checkLegalProvision(form: FormGroup): { [key: string]: boolean } | null {
        if (
            form.get('legalProvisionSpecs').get('meros').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('arthro').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('paragrafos').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('edafio').value.trim() !== '' ||
            form.get('legalProvisionSpecs').get('pararthma').value.trim() !== ''
        ) {
            return null;
        } else {
            return { emptyLegalProvision: true };
        }
    }

    selectLegalAct() {
        this.modalService.selectLegalAct().subscribe((data) => {
            console.log(data);
            this.selectedLegalActKey = data;
            this.form.get('legalActKey').setValue(data);
        });
    }

    onSubmit() {
        // console.log(this.form.value);
        const legalProvisionSpecs = this.form.get('legalProvisionSpecs').value as ILegalProvisionSpecs;

        const legalActKey = this.form.get('legalActKey').value;
        const legalProvisionText = this.form.get('legalActText').value;
        const legalProvision = {
            legalProvisionSpecs,
            legalActKey,
            legalProvisionText,
        } as ILegalProvision;
        // this.legalProvisionService.newLegalProvision(legalProvision).subscribe((data) => {
        //     const { message, legalProvision } = data;
        //     console.log(message);
        //     this.modalRef.dismiss({ legalProvision });
        // });
        this.modalRef.dismiss({ legalProvision });
    }

    dismiss() {
        if (this.form.dirty) {
            this.modalService
                .getUserConsent(
                    `Αν κλείσετε το παράθυρο οι αλλαγές στη διάταξη δεν θα αποθηκευτούν! Παρακαλούμε επιβεβαιώστε την ενέργεια.`,
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

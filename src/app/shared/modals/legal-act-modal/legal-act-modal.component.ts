import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IFek } from 'src/app/shared/interfaces/legal-act/fek.interface';
import { ConstService } from 'src/app/shared/services/const.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';
import { ILegalAct } from 'src/app/shared/interfaces/legal-act/legal-act.interface';
import { LegalActService } from 'src/app/shared/services/legal-act.service';

function dateDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
@Component({
    selector: 'app-new-legal-act',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgbAlertModule, NgbTooltipModule],
    templateUrl: './legal-act-modal.component.html',
    styleUrl: './legal-act-modal.component.css',
})
export class LegalActModalComponent implements OnInit {
    legalAct: ILegalAct | null = null;
    // Some useful services
    constService = inject(ConstService);
    uploadService = inject(FileUploadService);
    organizationUnitService = inject(OrganizationalUnitService);
    legalActService = inject(LegalActService);

    modalRef: any;

    years: number[] = [];
    currentYear: number = new Date().getFullYear();

    progress = 0;
    currentFile: File;
    uploadObjectID: string | null = null;

    fek: IFek;

    moreThan30 = false;

    actTypes = this.constService.ACT_TYPES;

    form = new FormGroup({
        legalActType: new FormControl(null, Validators.required),
        legalActTypeOther: new FormControl(null),
        legalActNumber: new FormControl(null, Validators.required),
        legalActDateOrYear: new FormControl(null, Validators.required),
        fek: new FormGroup({
            number: new FormControl(null),
            issue: new FormControl(null),
            date: new FormControl(null),
        }),
        ada: new FormControl(null, Validators.pattern(/^[Α-Ω,0-9]{10}-[Α-Ω,0-9]{3}$/)),
        legalActFile: new FormControl(null, Validators.required),
    });

    formSubscriptions: Subscription[] = [];
    showOtherLegalActType = false;

    ngOnInit(): void {
        if (this.legalAct) {
            this.form.controls.legalActType.setValue(this.legalAct.legalActType);
            this.form.controls.legalActTypeOther.setValue(this.legalAct.legalActTypeOther);
            this.form.controls.legalActNumber.setValue(this.legalAct.legalActNumber);
            this.form.controls.legalActDateOrYear.setValue(this.legalAct.legalActDateOrYear);
            if (this.legalAct.ada.startsWith('ΜΗ ΑΝΑΡΤΗΤΕΑ ΠΡΑΞΗ')) {
                this.form.controls.ada.setValue(null);
            } else {
                this.form.controls.ada.setValue(this.legalAct.ada);
            }
            this.form.controls.legalActFile.setValue(this.legalAct.legalActFile);
            if (this.legalAct.fek.number.startsWith('ΜΗ ΔΗΜΟΣΙΕΥΤΕΑ ΠΡΑΞΗ')) {
                this.form.controls.fek.setValue({
                    number: null,
                    issue: null,
                    date: null,
                });
            } else {
                this.form.controls.fek.setValue({
                    number: this.legalAct.fek?.number,
                    issue: this.legalAct.fek?.issue,
                    date: this.legalAct.fek?.date,
                });
            }
        }

        for (let i = this.currentYear; i >= 1846; i--) {
            this.years.push(i);
        }

        this.formSubscriptions.push(
            this.form.controls.legalActType.valueChanges.subscribe((value) => {
                this.form.controls.legalActDateOrYear.setValue('');
                this.form.controls.legalActDateOrYear.updateValueAndValidity();
                if (value === 'ΑΛΛΟ') {
                    this.showOtherLegalActType = true;
                    this.form.controls.legalActTypeOther.setValidators(Validators.required);
                    this.form.controls.legalActTypeOther.updateValueAndValidity();
                } else {
                    this.form.controls.legalActTypeOther.setValue('');
                    this.form.controls.legalActTypeOther.clearValidators();
                    this.form.controls.legalActTypeOther.updateValueAndValidity();
                    this.showOtherLegalActType = false;
                }
            }),
        );

        this.formSubscriptions.push(
            this.form.controls.fek.controls.number.valueChanges.subscribe((value: string) => {
                if (value && value.trim() === '' && value.length > 0) {
                    this.form.controls.fek.controls.number.setErrors({ empty: true });
                }
            }),
        );

        this.formSubscriptions.push(
            this.form.controls.legalActDateOrYear.valueChanges.subscribe((value) => {
                if (value) {
                    if (!this.emptyFEK()) {
                        this.moreThan30 = this.formDatesDifference();
                    } else {
                        this.moreThan30 = false;
                    }
                }
            }),
        );

        this.formSubscriptions.push(
            this.form.controls.fek.valueChanges.subscribe((value) => {
                if (value) {
                    if (!this.emptyFEK()) {
                        this.moreThan30 = this.formDatesDifference();
                    } else {
                        this.moreThan30 = false;
                    }
                }
            }),
        );
    }

    formDatesDifference() {
        const legalType = this.form.controls.legalActType.value;
        if (legalType && !['ΝΟΜΟΣ', 'ΠΡΟΕΔΡΙΚΟ ΔΙΑΤΑΓΜΑ'].includes(legalType)) {
            const dateFek = new Date(this.form.get('fek.date').value);
            const dateAct = new Date(this.form.get('legalActDateOrYear').value);
            const diffDays = dateDifference(dateFek, dateAct);
            // console.log('Days difference', diffDays);
            return diffDays > 30;
        }
        return false;
    }

    ngOnDestroy(): void {
        this.formSubscriptions.forEach((sub) => sub.unsubscribe());
    }

    onSubmit() {
        let data = {
            ...this.form.value,
        } as ILegalAct;

        console.log('Subject', this.legalAct);

        if (this.legalAct === null) {
            console.log('POST DATA', data);
            this.legalActService.newLegalAct(data).subscribe((data) => {
                console.log('Data', data);
                this.modalRef.dismiss(true);
            });
        } else {
            const id = this.legalAct._id.$oid;
            console.log('PUT DATA', data);
            this.legalActService.updateLegalAct(id, data).subscribe((data) => {
                console.log('Data', data);
                this.modalRef.dismiss(data);
            });
        }
    }

    selectFile(event: any): void {
        if (event.target.files.length === 0) {
            console.log('No file selected!');
            return;
        }
        this.currentFile = event.target.files[0];
        this.uploadService.upload(this.currentFile).subscribe({
            next: (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progress = Math.round((100 * event.loaded) / event.total);
                } else if (event instanceof HttpResponse) {
                    this.uploadObjectID = event.body.id;
                    this.form.controls.legalActFile.setValue(this.uploadObjectID);
                }
            },
            error: (err: any) => {
                console.log(err);
            },
            complete: () => {
                console.log(this.form.errors);
                console.log(this.form.valid);
                console.log(this.form.value);
            },
        });
    }

    emptyADA() {
        return this.form.get('ada').value === null;
    }

    emptyFEK() {
        return (
            this.form.get('fek.number').value === null ||
            this.form.get('fek.issue').value === null ||
            this.form.get('fek.date').value === null ||
            this.form.get('fek.number').value.trim() === '' ||
            this.form.get('fek.issue').value === '' ||
            this.form.get('fek.date').value === ''
        );
    }

    getOrganizationPrefferedLabelByCode(code: string): string | undefined {
        return this.constService.ORGANIZATION_CODES.find((x) => x.code === code)?.preferredLabel;
    }

    hideLegalActDateOrYear(): boolean {
        return this.form.controls.legalActType.value === null;
    }

    actNeedsOnlyYear(): boolean {
        const legalType = this.form.controls.legalActType.value;
        return ['ΝΟΜΟΣ', 'ΠΡΟΕΔΡΙΚΟ ΔΙΑΤΑΓΜΑ'].includes(legalType);
    }
}

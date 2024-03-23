import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
    FormGroup,
    FormControl,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, take } from 'rxjs';
import { IFek } from 'src/app/shared/interfaces/nomiki-praji/fek.interface';
import { ConstService } from 'src/app/shared/services/const.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

function dateDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

@Component({
    selector: 'app-nomikes-praxeis',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgbAlertModule],
    templateUrl: './nomikes-praxeis.component.html',
    styleUrl: './nomikes-praxeis.component.css',
})
export class NomikesPraxeisComponent implements OnInit, OnDestroy {
    constService = inject(ConstService);
    uploadService = inject(FileUploadService);

    progress = 0;
    currentFile: File;
    uploadUUID: string | null = null;

    fek: IFek;

    moreThan30 = false;

    actTypes = this.constService.ACT_TYPES;

    form = new FormGroup({
        legalActType: new FormControl('', Validators.required),
        legalActTypeOther: new FormControl(''),
        legalActNumber: new FormControl('', Validators.required),
        legalActDate: new FormControl('', Validators.required),
        fek: new FormGroup({
            number: new FormControl(''),
            issue: new FormControl(''),
            date: new FormControl(''),
        }),
        ada: new FormControl(''),
        fileUpload: new FormControl('', Validators.required),
    });

    formSubscriptions: Subscription[] = [];
    showOtherLegalActType = false;

    ngOnInit(): void {
        this.formSubscriptions.push(
            this.form.controls.legalActType.valueChanges.subscribe((value) => {
                if (value === 'ΑΛΛΟ') {
                    this.showOtherLegalActType = true;
                    this.form.controls.legalActTypeOther.setValidators(
                        Validators.required,
                    );
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
            this.form.controls.legalActDate.valueChanges.subscribe((value) => {
                if (value) {
                    if (!this.checkFEK()) {
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
                    if (!this.checkFEK()) {
                        this.moreThan30 = this.formDatesDifference();
                    } else {
                        this.moreThan30 = false;
                    }
                }
            }),
        );
    }

    formDatesDifference() {
        const dateFek = new Date(this.form.get('fek.date').value);
        const dateAct = new Date(this.form.get('legalActDate').value);
        const diffDays = dateDifference(dateFek, dateAct);
        return diffDays > 30;
    }

    ngOnDestroy(): void {
        this.formSubscriptions.forEach((sub) => sub.unsubscribe());
    }

    onSubmit() {
        const ada = this.form.get('ada').value
            ? this.form.get('ada').value
            : 'ΜΗ ΑΝΑΡΤΗΤΕΑ ΠΡΑΞΗ';
        const fek =
            this.form.get('fek.number').value === '' ||
            this.form.get('fek.issue').value === '' ||
            this.form.get('fek.date').value === ''
                ? { number: 'ΜΗ ΔΗΜΟΣΙΕΥΤEΑ ΠΡΑΞΗ', issue: '', date: '' }
                : this.form.get('fek').value;
        const data = {
            ...this.form.value,
            ada,
            fek,
        };
        console.log(data);
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
                    this.progress = Math.round(
                        (100 * event.loaded) / event.total,
                    );
                } else if (event instanceof HttpResponse) {
                    console.log(event.body.file_id);
                    this.uploadUUID = event.body.file_id;
                    this.form.controls.fileUpload.setValue(this.uploadUUID);
                }
            },
            error: (err: any) => {
                console.log(err);
            },
            complete: () => {
                console.log('Upload completed!');
            },
        });
    }

    checkADA() {
        return this.form.get('ada').value === '';
    }

    checkFEK() {
        return (
            this.form.get('fek.number').value === '' ||
            this.form.get('fek.issue').value === '' ||
            this.form.get('fek.date').value === ''
        );
    }
}

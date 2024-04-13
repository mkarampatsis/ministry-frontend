import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { ConstService } from 'src/app/shared/services/const.service';
import { take } from 'rxjs';
import { IForeas } from 'src/app/shared/interfaces/foreas/foreas.interface';
import { ForeasService } from 'src/app/shared/services/foreas.service';
import { Toast, ToastService } from 'src/app/shared/services/toast.service';
import { ToastMessageComponent } from '../../components/toast-message/toast-message.component';

@Component({
    selector: 'app-foreas-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './foreas-edit.component.html',
    styleUrl: './foreas-edit.component.css',
})
export class ForeasEditComponent implements OnInit {
    ognanizationService = inject(OrganizationService);
    foreasService = inject(ForeasService);
    constService = inject(ConstService);
    toastService = inject(ToastService);

    @ViewChild('successTpl') successTpl: TemplateRef<any>;

    foreas_id: string;
    level: string;

    organization: IOrganization;
    modalRef: any;

    foreas: IForeas;

    form: FormGroup;
    organizationLevels = this.constService.ORGANIZATION_LEVELS;

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
            });

        this.form = new FormGroup({
            level: new FormControl('', [Validators.required]),
        });
    }

    onSubmit() {
        console.log(this.form.value);
        if (this.form.valid) {
            this.level = this.form.value.level;
            const data: IForeas = {
                ...this.form.value,
                code: this.foreas.code,
            };
            this.foreasService
                .updatePoluepipedhForeas(data)
                .pipe(take(1))
                .subscribe(() => {
                    this.modalRef.dismiss();
                    this.showSuccess(this.successTpl);
                });
        }
    }

    showSuccess(template: TemplateRef<any>) {
        const toast: Toast = {
            component: ToastMessageComponent,
            inputs: {
                message: `Το επίπεδο του φορέα ενημερώθηκε σε <strong>${this.level}</strong>.`,
            },
            classname: 'bg-success text-light',
        };
        this.toastService.show(toast);
    }
}

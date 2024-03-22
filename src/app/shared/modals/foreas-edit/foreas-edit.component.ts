import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganization } from 'src/app/shared/interfaces/organization';
import { ConstService } from 'src/app/shared/services/const.service';
import { take } from 'rxjs';
import { IForeas } from 'src/app/shared/interfaces/foreas/foreas.interface';
import { ForeasService } from 'src/app/shared/services/foreas.service';

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

    foreas_id: string;

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
        if (this.form.valid) {
            const data: IForeas = {
                ...this.form.value,
                code: this.foreas.code,
            };
            this.foreasService
                .updatePoluepipedhForeas(data)
                .subscribe((data) => {
                    this.modalRef.dismiss();
                });
        }
    }
}

import { Component, OnInit, inject } from '@angular/core';
import { take } from 'rxjs';
import { IOrganization } from 'src/app/shared/interfaces/organization/organization.interface';
import { ConstService } from 'src/app/shared/services/const.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';

@Component({
    selector: 'app-foreis',
    standalone: true,
    imports: [],
    templateUrl: './foreis.component.html',
    styleUrl: './foreis.component.css',
})
export class ForeisComponent implements OnInit {
    constService = inject(ConstService);
    organizationService = inject(OrganizationService);

    foreis: IOrganization[] = [];

    ngOnInit(): void {
        this.organizationService
            .getAllOrganizations()
            .pipe(take(1))
            .subscribe((data) => {
                this.foreis = data;
            });
    }
}

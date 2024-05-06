import { Component } from '@angular/core';
import { ILegalProvision } from '../../interfaces/legal-provision/legal-provision.interface';

@Component({
    selector: 'app-show-legal-provision',
    standalone: true,
    imports: [],
    templateUrl: './show-legal-provision.component.html',
    styleUrl: './show-legal-provision.component.css',
})
export class ShowLegalProvisionComponent {
    legalProvision: ILegalProvision;
    modalRef: any;
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-yes-no',
    standalone: true,
    imports: [],
    templateUrl: './yes-no.component.html',
    styleUrl: './yes-no.component.css',
})
export class YesNoComponent {
    @Input() prompt = 'A question with yes/no answer';

    modalRef: any;

    onClick(userConsent: boolean) {
        this.modalRef.dismiss(userConsent);
    }
}

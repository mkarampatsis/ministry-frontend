import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { IRemit } from 'src/app/shared/interfaces/remit/remit.interface';
import { RemitService } from 'src/app/shared/services/remit.service';

interface IRemitExtended extends IRemit {
    showFullText?: boolean;
}

@Component({
    selector: 'app-armodiothtes',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './armodiothtes.component.html',
    styleUrl: './armodiothtes.component.css',
})
export class ArmodiothtesComponent implements OnInit {
    remitsService = inject(RemitService);
    remits: IRemitExtended[] = [];

    ngOnInit(): void {
        this.remitsService.getAllRemits().subscribe((remits) => {
            this.remits = remits;
            this.remits = remits.map((remit) => ({ ...remit, showFullText: false }));
        });
    }
}

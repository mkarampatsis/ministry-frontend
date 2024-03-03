import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'app-foreis-action-icons',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './foreis-action-icons.component.html',
    styleUrl: './foreis-action-icons.component.css',
})
export class ForeisActionIconsComponent implements ICellRendererAngularComp {
    params: ICellRendererParams;

    agInit(params: ICellRendererParams<any, any, any>): void {
        this.params = params;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false;
    }
}

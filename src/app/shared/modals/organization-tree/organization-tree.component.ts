import { Component, OnInit, inject } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import {
    IOrganization,
    IOrganizationTreeNode,
} from 'src/app/shared/interfaces/organization';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

interface FlatNode extends IOrganizationTreeNode {
    isExpanded?: boolean;
}

@Component({
    selector: 'app-organization-tree',
    standalone: true,
    imports: [CdkTreeModule, MatIconModule, MatButtonModule, NgbAlertModule],
    templateUrl: './organization-tree.component.html',
    styleUrl: './organization-tree.component.css',
})
export class OrganizationTreeComponent implements OnInit {
    organizationService = inject(OrganizationService);
    modalRef: any;

    organizationCode: string | null = null;
    organization: IOrganization | null = null;
    organizationTree: IOrganizationTreeNode[] | null = null;

    dataSource: ArrayDataSource<FlatNode> | null = null;
    treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level,
        (node) => node.expandable,
    );
    hasChild = (_: number, node: FlatNode) => node.expandable;

    ngOnInit(): void {
        this.organizationService
            .getOrganizationDetails(this.organizationCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organization = data;
            });

        this.organizationService
            .getOrganizationTree(this.organizationCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizationTree = data as FlatNode[];
                this.dataSource = new ArrayDataSource(this.organizationTree);
            });
    }

    getParentNode(node: FlatNode): FlatNode | null {
        const nodeIndex = this.organizationTree.indexOf(node);

        for (let i = nodeIndex - 1; i >= 0; i--) {
            if (this.organizationTree[i].level === node.level - 1) {
                return this.organizationTree[i];
            }
        }

        return null;
    }

    shouldRender(node: FlatNode) {
        let parent = this.getParentNode(node);
        while (parent) {
            if (!parent.isExpanded) {
                return false;
            }
            parent = this.getParentNode(parent);
        }
        return true;
    }
}

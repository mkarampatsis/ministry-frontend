import { Component, OnInit, inject } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkTreeModule, FlatTreeControl } from '@angular/cdk/tree';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { IOrganizationTreeNode } from 'src/app/shared/interfaces/organization/organization-tree-node.interface';
import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface FlatNode extends IOrganizationTreeNode {
    // expandable: boolean;
    // monada: {
    //     preferredLabel: string;
    //     code: string;
    // };
    // level: number;
    isExpanded?: boolean;
}

@Component({
    selector: 'app-organization-tree',
    standalone: true,
    imports: [CdkTreeModule, MatIconModule, MatButtonModule],
    templateUrl: './organization-tree.component.html',
    styleUrl: './organization-tree.component.css',
})
export class OrganizationTreeComponent implements OnInit {
    organizationService = inject(OrganizationService);
    modalRef: any;

    organizationCode: string | null = null;
    organizationTree: IOrganizationTreeNode[] | null = null;

    dataSource: ArrayDataSource<FlatNode> | null = null;
    treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level,
        (node) => node.expandable,
    );
    hasChild = (_: number, node: FlatNode) => node.expandable;

    ngOnInit(): void {
        this.organizationService
            .getOrganizationTree(this.organizationCode)
            .pipe(take(1))
            .subscribe((data) => {
                this.organizationTree = data as FlatNode[];
                console.log(this.organizationTree);
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
            // if any parent is not expanded, don't render but render if there are no children
            if (!parent) {
                return true;
            }
            if (!parent.isExpanded) {
                return false;
            }
            parent = this.getParentNode(parent);
        }
        return true;
    }
}

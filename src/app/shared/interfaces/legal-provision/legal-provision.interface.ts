import { ILegalProvisionSpecs } from './legal-provision-specs.interface';
import { IReguLatedObject } from './regulated-object.interface';

export interface ILegalProvision {
    legalProvisionSpecs: ILegalProvisionSpecs;
    legalActKey: string;
    regulatedObject: IReguLatedObject;
}

import { ILegalProvision } from './legal-provision.interface';
import { IReguLatedObject } from './regulated-object.interface';

export interface IDiataxi {
    legalProvision: ILegalProvision;
    legalAct: string;
    regulatedObject: IReguLatedObject;
}

import { IFek } from './fek.interface';

export interface ILegalAct {
    ada: string;
    fek: IFek;
    legalActFile: string;
    legalActNumber: string;
    legalActType: string;
    legalActTypeOther: string;
    legalActYear: string;
}

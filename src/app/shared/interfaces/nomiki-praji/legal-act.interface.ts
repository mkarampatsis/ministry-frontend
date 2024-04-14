import { IFek } from './fek.interface';

export interface ILegalAct {
    ada: string;
    fek: IFek;
    legalActKey: string;
    legalActFile: string;
    legalActNumber: string;
    legalActType: string;
    legalActTypeOther: string;
    legalActYear: string;
}

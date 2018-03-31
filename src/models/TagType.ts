import { Record } from 'immutable';

export interface TagType {
    id: string;
    name: string;
    cardTypeReferenceName: string;
    showQuantity: boolean;
    showUnit: boolean;
    showAmount: boolean;
    showRate: boolean;
}

export class TagTypeRecord extends Record<TagType>({
    id: '',
    name: '',
    cardTypeReferenceName: '',
    showQuantity: true,
    showUnit: true,
    showAmount: true,
    showRate: true
}) { }
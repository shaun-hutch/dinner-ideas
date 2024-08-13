export interface BaseItem {
    id: string;
    typeAndId: string;
    createdBy: number;
    lastModifiedBy: number;
    createdDate: Date;
    lastModifiedDate: Date;
    version: number;
}
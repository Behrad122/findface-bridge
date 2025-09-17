export interface IHumanCardDto {
    name: string;
}

export interface IHumanCardRow extends IHumanCardDto {
    id: string;
    createdDate: string;
    modifiedDate: string;
}

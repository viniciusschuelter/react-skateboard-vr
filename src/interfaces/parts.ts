
export enum PartsEnum {
    deck = 'deck',
    grip = 'grip',
    truck = 'truck',
    wheel = 'wheel',
    bearing = 'bearing'
}

export enum PartsType {
    mesh = 'mesh'
}

export class PartInterface {
    part: PartsEnum;
    type: PartsType;
    collection: PartCollectionItem[];
}

export class PartCollectionItem {
    id: string;
    name: string;
    directory: string;
    thumbnail: string;
}
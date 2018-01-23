export interface IPlatformMenu {
    readonly id : string;
    readonly isNewRecord : boolean;
    readonly createDate : Date;
    readonly updateDate : Date;
    readonly parentIds : string;
    readonly name : string;
    readonly sort : number;
    readonly isShow : string;
    readonly parentId : string;
}

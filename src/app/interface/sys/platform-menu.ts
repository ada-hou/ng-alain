export interface IPlatformMenu {
    readonly id : string;
    readonly isNewRecord : boolean;
    readonly createDate : Date;
    readonly updateDate : Date;
    readonly parentIds : string;
    readonly name : string;
    readonly href : string,
    readonly target : string,
    readonly icon : string,
    readonly sort : number;
    readonly isShow : string;
    readonly permission : string,
    readonly parentId : string;
    children : Array<IPlatformMenu>;
}

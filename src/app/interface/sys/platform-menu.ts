import { ICommonResult } from "app/interface/common/common-result";

export var ISysPlatformMenu : ICommonResult<IPlatformMenu>;

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

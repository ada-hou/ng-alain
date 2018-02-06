export interface IPlatformUser {
    readonly id : string;
    readonly loginName : string;
    readonly no : string;
    readonly name : string;
    readonly email : string;
    readonly phone : string;
    readonly mobile : string;
    readonly userType : string;
    readonly loginIp : string;
    readonly loginDate : Date;
    readonly loginFlag : string;
    readonly photo : string;
    readonly oldLoginIp : string;
    readonly oldLoginDate : Date;
    readonly admin : boolean;
    readonly roleNames : string;
}

export interface ICommonResult<T> {
//export interface ICommonResult {
    readonly message? : string;
    readonly statusCode : number;
    readonly entity : T;
}

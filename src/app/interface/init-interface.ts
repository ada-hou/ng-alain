import { ICommonResult } from "app/interface/common/common-result";
import { IPlatformMenu } from "app/interface/sys/platform-menu";
import { IPlatformUser } from "app/interface/sys/platform-user";
import { IAppInfo } from "app/interface/sys/app-info";

export interface ISysAppInfoMenu extends ICommonResult<IAppInfo>{}
export interface ISysPlatformMenu extends ICommonResult<IPlatformMenu>{}
export interface ISysPlatformUser extends ICommonResult<IPlatformUser>{}

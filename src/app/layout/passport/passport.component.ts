import { Component } from '@angular/core';
import { SysEndService } from 'app/service/sys-end.service';
import { SettingsService } from '@delon/theme';

@Component({
    selector: 'layout-passport',
    templateUrl: './passport.component.html',
    styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent {
    links = [
    ];
    constructor(
        private sysEndService: SysEndService,
        private settingService: SettingsService,
    ) {
    }

    ngOnInit() {
        //this.initProductName();
    }

    // public initProductName() {
    //     this.sysEndService.getSysConfig('productName', this.renderEl.bind(this));
    // }

    // public renderEl(this, value: string) {
    //     this.productName = value;
    //     console.log(this.productName);
    // }
}

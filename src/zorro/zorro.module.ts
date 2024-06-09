import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  exports: [
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzAlertModule,
    NzMessageModule,
    NzSpinModule,
    NzDrawerModule,
    NzBackTopModule,
    NzProgressModule,
    NzTypographyModule,
    NzDividerModule,
    NzToolTipModule,
    NzGridModule,
    NzLayoutModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzSliderModule,
    NzSwitchModule,
    NzSelectModule,
    NzTransferModule,
    NzAvatarModule,
    NzEmptyModule,
    NzCalendarModule,
    NzListModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzNotificationModule,
    NzPopconfirmModule,
  ],
})
export class ZorroModule {}

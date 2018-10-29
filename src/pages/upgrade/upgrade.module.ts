import { UpgradePage } from './upgrade';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      UpgradePage,
    ],
    imports: [
      IonicPageModule.forChild(UpgradePage),
    ],
    exports: [
      UpgradePage
    ],
  })

  export class UpgradePageModule {}
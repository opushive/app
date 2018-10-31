import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SellEquityPage } from './sell-equity';

@NgModule({
    declarations: [
      SellEquityPage,
    ],
    imports: [
      IonicPageModule.forChild(SellEquityPage),
    ],
    exports: [
        SellEquityPage
    ],
    providers: [
        FingerprintAIO
    ]
  })

  export class SellBitPageModule {}
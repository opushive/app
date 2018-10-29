import { ExchangePage } from './exchange';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      ExchangePage,
    ],
    imports: [
      IonicPageModule.forChild(ExchangePage),
    ],
    exports: [
        ExchangePage
    ],
    providers: [
        FingerprintAIO
    ]
  })

  export class ExchangePageModule {}
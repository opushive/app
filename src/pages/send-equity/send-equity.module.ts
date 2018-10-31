import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { SendEquityPage } from './send-equity';

@NgModule({
    declarations: [
      SendEquityPage,
    ],
    imports: [
      IonicPageModule.forChild(SendEquityPage),
    ],
    exports: [
      SendEquityPage
    ],
    providers: [
        FingerprintAIO,
        BarcodeScanner
    ]
  })

  export class SendBitPageModule {}
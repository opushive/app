import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SendBitPage } from './send-bit';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      SendBitPage,
    ],
    imports: [
      IonicPageModule.forChild(SendBitPage),
    ],
    exports: [
        SendBitPage
    ],
    providers: [
        FingerprintAIO,
        BarcodeScanner
    ]
  })

  export class SendBitPageModule {}
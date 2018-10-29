import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DonatePage } from './donate';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      DonatePage,
    ],
    imports: [
      IonicPageModule.forChild(DonatePage),
    ],
    exports: [
        DonatePage
    ],
    providers: [
        FingerprintAIO,
        BarcodeScanner
    ]
  })

  export class DonatePageModule {}
import { BuyBitPage } from './buy-bit';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      BuyBitPage,
    ],
    imports: [
      IonicPageModule.forChild(BuyBitPage),
    ],
    exports: [
      BuyBitPage
    ],
  })

  export class BuyBitPageModule {}
import { BuyWithBankAccountPage } from './buy-with-bank-account';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      BuyWithBankAccountPage,
    ],
    imports: [
      IonicPageModule.forChild(BuyWithBankAccountPage),
    ],
    exports: [
        BuyWithBankAccountPage
    ],
  })

  export class BuyWithBankAccountPageModule {}
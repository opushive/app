import { ShowBankPaymentPage } from './show-bank-payment';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      ShowBankPaymentPage,
    ],
    imports: [
      IonicPageModule.forChild(ShowBankPaymentPage),
    ],
    exports: [
      ShowBankPaymentPage
    ],
  })

  export class ShowBankPaymentPageModule {}
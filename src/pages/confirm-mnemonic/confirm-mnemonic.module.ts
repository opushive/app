import { ConfirmMnemonicPage } from './confirm-mnemonic';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      ConfirmMnemonicPage,
    ],
    imports: [
      IonicPageModule.forChild(ConfirmMnemonicPage),
    ],
    exports: [
      ConfirmMnemonicPage
    ],
  })

  export class ConfirmMnemonicPageModule {}
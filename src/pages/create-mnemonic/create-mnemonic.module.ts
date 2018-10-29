import { CreateMnemonicPage } from './create-mnemonic';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      CreateMnemonicPage,
    ],
    imports: [
      IonicPageModule.forChild(CreateMnemonicPage),
    ],
    exports: [
        CreateMnemonicPage
    ],
  })

  export class CreateMnemonicPageModule {}
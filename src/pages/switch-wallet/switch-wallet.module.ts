import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchWalletPage } from './switch-wallet';

@NgModule({
  declarations: [
    SwitchWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchWalletPage),
  ],
  exports: [
    SwitchWalletPage
  ]
})
export class SwitchWalletPageModule { }

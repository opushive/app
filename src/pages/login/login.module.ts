import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      LoginPage,
    ],
    imports: [
      IonicPageModule.forChild(LoginPage),
    ],
    exports: [
      LoginPage
    ],
    providers: [
      FingerprintAIO
    ]
  })

  export class LoginPageModule {}
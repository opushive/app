import { PasswordPage } from './password';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      PasswordPage,
    ],
    imports: [
      IonicPageModule.forChild(PasswordPage),
    ],
    exports: [
        PasswordPage
    ],
  })

  export class PasswordPageModule {}
import { SettingsPage } from './settings';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      SettingsPage,
    ],
    imports: [
      IonicPageModule.forChild(SettingsPage),
    ],
    exports: [
        SettingsPage
    ],
  })

  export class SettingsPageModule {}
import { WarningPage } from './warning';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      WarningPage,
    ],
    imports: [
      IonicPageModule.forChild(WarningPage),
    ],
    exports: [
      WarningPage
    ],
  })

  export class WarningPageModule {}
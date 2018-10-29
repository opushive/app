import { LandingPage } from './landing';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      LandingPage,
    ],
    imports: [
      IonicPageModule.forChild(LandingPage),
    ],
    exports: [
        LandingPage
    ],
  })

  export class LandingPageModule {}
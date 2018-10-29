import { GettingStartedPage } from './getting-started';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      GettingStartedPage,
    ],
    imports: [
      IonicPageModule.forChild(GettingStartedPage),
    ],
    exports: [
        GettingStartedPage
    ],
  })

  export class GettingStartedPageModule {}
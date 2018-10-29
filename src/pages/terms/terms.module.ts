import { TermsPage } from './terms';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      TermsPage,
    ],
    imports: [
      IonicPageModule.forChild(TermsPage),
    ],
    exports: [
        TermsPage
    ],
  })

  export class TermsPageModule {}
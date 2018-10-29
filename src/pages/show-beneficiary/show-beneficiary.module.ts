import { ShowBeneficiaryPage } from './show-beneficiary';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      ShowBeneficiaryPage,
    ],
    imports: [
      IonicPageModule.forChild(ShowBeneficiaryPage),
    ],
    exports: [
      ShowBeneficiaryPage
    ],
  })

  export class ShowBeneficiaryPageModule {}
import { ViewBeneficiariesPage } from './view-beneficiaries';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      ViewBeneficiariesPage,
    ],
    imports: [
      IonicPageModule.forChild(ViewBeneficiariesPage),
    ],
    exports: [
      ViewBeneficiariesPage
    ],
  })

  export class ViewBeneficiariesPageModule {}
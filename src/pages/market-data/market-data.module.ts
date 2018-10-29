import { MarketDataPage } from './market-data';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      MarketDataPage,
    ],
    imports: [
      IonicPageModule.forChild(MarketDataPage),
    ],
    exports: [
        MarketDataPage
    ],
  })

  export class MarketDataPageModule {}
import { MyOrdersPage } from './my-orders';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      MyOrdersPage,
    ],
    imports: [
      IonicPageModule.forChild(MyOrdersPage),
    ],
    exports: [
        MyOrdersPage
    ],
  })

  export class MyOrdersPageModule {}
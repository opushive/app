import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Clipboard } from '@ionic-native/clipboard';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      HomePage,
    ],
    imports: [
      IonicPageModule.forChild(HomePage),
      NgxQRCodeModule
    ],
    exports: [
        HomePage
    ],
    providers: [
        LocalNotifications,
        Clipboard
    ]
  })

  export class HomePageModule {}
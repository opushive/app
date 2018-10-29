import { ImageResizer } from '@ionic-native/image-resizer';
import { MediaCapture } from '@ionic-native/media-capture';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Base64 } from '@ionic-native/base64';
import { RegisterPage } from './register';
import { IonicPageModule } from 'ionic-angular';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      RegisterPage,
    ],
    imports: [
      IonicPageModule.forChild(RegisterPage),
    ],
    exports: [
        RegisterPage
    ],
    providers: [
        FileTransfer,
        Base64,
        MediaCapture,
        ImageResizer        
    ]
  })

  export class RegisterPageModule {}
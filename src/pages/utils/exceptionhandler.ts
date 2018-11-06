import { IonicErrorHandler } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';


@Injectable()
export class MyExceptionHandler extends IonicErrorHandler {
    constructor(public alertCtrl: AlertController) {
        super();
    }

    handleError(error: any) {
        console.log(error);
        if ((error.message.indexOf('FingerprintAIO') >= 0) || (error.message.indexOf("Cannot read property") >= 0)) {
            error.message = "phem";
            return;
        } else {
            let options = {
                title: "Error Occured.",
                message: error.message,
            };

            let alert = this.alertCtrl.create(options);
            alert.present();
        }
        super.handleError(error);
    }

    // humanReadable(errorMessage: string) {
    //     if (errorMessage.indexOf('No Provider for FingerprintAIO') > 0) {
    //         return "phem";
    //     } 
    //     return errorMessage;
    // }
}
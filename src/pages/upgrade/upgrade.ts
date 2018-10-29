import { Storage } from '@ionic/storage';
import { FileTransferObject } from '@ionic-native/file-transfer';
import { StorageService } from './../utils/storageservice';
import { FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';
import { ImageResizerOptions, ImageResizer } from '@ionic-native/image-resizer';
import { CaptureImageOptions, MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Loading, LoadingController, AlertController, IonicPage } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Constants } from '../utils/constants';
import { Console } from '../utils/console';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Generated class for the UpgradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage() 
@Component({
  selector: 'page-upgrade',
  templateUrl: 'upgrade.html',
})
export class UpgradePage {

  registerForm: FormGroup;
  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  banks = [];
  idTypes = [];
  idImagePath: string;
  loading: Loading;
  ls: StorageService;
  emailAddress: string;

  constructor(public alertCtrl: AlertController, private http: Http, private storage: Storage, private loadingCtrl: LoadingController, private mediaCapture: MediaCapture, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private imageResizer: ImageResizer, private toastCtrl: ToastController, private transfer: FileTransfer) {
    this.registerForm = this.formBuilder.group({      
      phoneNumber: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['',Validators.required],
      fullName: ['', Validators.required],
      country: ['', Validators.required],
      bank: ['', Validators.required],
      accountNumber: ['', Validators.required]
    });

    this.banks = Constants.properties['banks'];
    this.idTypes = Constants.properties['id.types'];

    this.ls = new StorageService(this.storage);
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    let app = this;
    setTimeout(function () {
      //Wait for sometimes for storage to be ready
      app.emailAddress = app.ls.getItem("emailAddress");
      app.registerForm.controls.fullName.setValue(app.ls.getItem("fullName"));  
      app.loading.dismiss();
    }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);    
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad UpgradePage');
  }

  capturePassport() {
    let options: CaptureImageOptions = { limit: 1 };
    let app = this;
    this.mediaCapture.captureImage(options)
      .then(
        (data: MediaFile[]) => {
          app.resizeImage(data[0]['fullPath']);
        },
        (err: CaptureError) => { }
      );
  }

  resizeImage(uri) {
    let options: ImageResizerOptions = {
      uri: uri,
      folderName: 'XendID',
      quality: 100,
      width: 400,
      height: 400
    };

    this.imageResizer.resize(options).then((filePath: string) => {
      this.idImagePath = filePath;
    }).catch(e => {
    });
  }

  register() {
    let isValid = false;
    let rf = this.registerForm.value;

    if (this.registerForm.valid) {
      isValid = true;
    } else {
      if (rf.fullName === '') {
        Constants.showLongToastMessage("Please enter your full name", this.toastCtrl);
        return;
      }

      if (rf.country === '') {
        Constants.showLongToastMessage("Please enter your Country", this.toastCtrl);
        return;
      }      

      if (rf.idNumber === '') {
        Constants.showLongToastMessage("Please enter  ID Number", this.toastCtrl);
        return;
      }

      if (rf.accountNumber === '') {
        Constants.showLongToastMessage("Please enter Account Number", this.toastCtrl);
        return;
      }

      if (rf.bank === '') {
        Constants.showLongToastMessage("Please enter Bank Name", this.toastCtrl);
        return;
      }

    }

    if (isValid) {
      //this.idImagePath = 'data:image/jpeg;base64,' + "1011001";
      if (this.idImagePath === undefined) {
        Constants.showLongToastMessage("Picture of ID not found, Please upload one", this.toastCtrl);
        return;
      }      

      this.loading = Constants.showLoading(this.loading, this.loadingCtrl, "Please wait");
      this.uploadFile();
    } else {
      Constants.showLongToastMessage("Please fill form properly", this.toastCtrl);
    }
  }

  completeUpgrade(filePath) {
    let rf = this.registerForm.value;

    let postData = {
      password: this.ls.getItem('password'),
      phoneNumber: rf.phoneNumber,
      emailAddress: this.ls.getItem('emailAddress'),
      fullname: rf.fullName,
      idType: rf.idType,
      idNumber: rf.idNumber,
      idImage: filePath,
      walletType: "trader",
      accountType: "ADVANCED",
      country: rf.country,
      bank: rf.bank,
      accountNumber: rf.accountNumber
    };

    let url = Constants.UPGRADE_USER_URL;

    this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(
      responseData => {
        if (responseData.response_text === "success") {     
          this.loading.dismiss();
          let ls = this.ls;
          ls.setItem("phoneNumber", rf.phoneNumber);
          ls.setItem("fullName", rf.fullName);
          StorageService.ACCOUNT_TYPE = "ADVANCED";
          Constants.showPersistentToastMessage("Upgrade Successfull. Please log out and log back in to activate new settings", this.toastCtrl);
          this.navCtrl.popToRoot();
        } else {
          Constants.showPersistentToastMessage(responseData.result, this.toastCtrl);
          this.loading.dismiss();
        }
      },
      error => {
        this.loading.dismiss();
        Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
      });
  }

  uploadFile() {
    let options: FileUploadOptions = {
      fileKey: 'uploadedFile',
      fileName: 'name.jpg'
      // headers: {
      //   'apiKey':'oalkuisnetgauyno',
      //   'Content-Disposition': 'form-data; name="file"; filename="name.jpg"'        
      // }
    }


    let fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.upload(this.idImagePath, Constants.UPLOAD_URL, options)
      .then((data) => {
        let filePath = data['response'];
        if (filePath.startsWith("file_")) {          
          this.completeUpgrade(filePath);
        } else {
          this.loading.dismiss();
          Constants.showLongerToastMessage("Can not complete registration. Please try again later: " + filePath, this.toastCtrl);
        }
      }, (err) => {
        this.loading.dismiss();
        Constants.showLongerToastMessage("Can not complete registration. Please try again later: " + err, this.toastCtrl);
      });
  }
}
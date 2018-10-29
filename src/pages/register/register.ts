import { Base64 } from '@ionic-native/base64';
import { FileTransfer } from '@ionic-native/file-transfer';
import { MediaCapture, CaptureImageOptions, MediaFile, CaptureError } from '@ionic-native/media-capture';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { Console } from './../utils/console';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { StorageService } from '../utils/storageservice';


/*
 Generated class for the Register page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  mnemonic: string;
  registerForm;
  loading: Loading;
  ls;

  pageTitle: string;
  cbnWarning: string;
  emailAddressText: string;
  phoneNumberText: string;

  bvnText: string;
  nextText: string;
  idImagePath: string = undefined;
  idImage: string;
  kycInformationText: string;
  formOfIdText: string;
  passportText: string;
  driversLicenceText: string;
  nationalIdText: string;
  idTypeText: string;
  idNumberText: string;
  idTypes = [];
  banks = [];
  idImageText: string;
  country: number;
  isTrader = true;
  isBasic = true;

  emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

  constructor(public base64: Base64, public imageResizer: ImageResizer, public storage: Storage, private loadingCtrl: LoadingController, private navCtrl: NavController, private navParams: NavParams, private formBuilder: FormBuilder, private toastCtrl: ToastController, private http: Http, private mediaCapture: MediaCapture, private transfer: FileTransfer) {
    this.mnemonic = this.navParams.get("mnemonic");

    this.isTrader = Constants.properties['walletType'] === 'trader';
    this.banks = Constants.properties['banks'];
    this.pageTitle = Constants.properties['register.page.title'];
    this.cbnWarning = Constants.properties['cbn.warning'];
    this.emailAddressText = Constants.properties['email'];
    this.phoneNumberText = Constants.properties['phonenumber'];
    this.bvnText = Constants.properties['bvn'];
    this.nextText = Constants.properties['next'];
    this.kycInformationText = Constants.properties['kyc.information'];
    this.formOfIdText = Constants.properties['form.of.identification'];
    this.passportText = Constants.properties['passport'];
    this.driversLicenceText = Constants.properties['drivers.licence'];
    this.nationalIdText = Constants.properties['national.identity.card'];
    this.idTypeText = Constants.properties['id.type'];
    this.idNumberText = Constants.properties['id.number'];
    this.idTypes = Constants.properties['id.types'];
    this.idImageText = Constants.properties['id.image'];
    this.country = 1;

    Constants.registrationData['fileTransferObject'] = this.transfer.create();

    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(255), Validators.pattern(this.emailRegex), Validators.required])],
      phoneNumber: [''],
      idType: ['',],
      idNumber: ['',],
      surName: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      country: [''],
      bank: [''],
      accountNumber: [''],
      isBeneficiary: ['false']
    });

    this.isBasic = false;
    this.ls = new StorageService(this.storage);
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    let app = this;
    setTimeout(function () {
      //Wait for sometimes for storage to be ready
      app.loading.dismiss();
      app.isBasic = StorageService.ACCOUNT_TYPE === "BASIC";
    }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);
  }

  ionViewDidEnter() {
    this.isBasic = StorageService.ACCOUNT_TYPE === "BASIC";
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad RegisterPage');
  }

  capturePassport() {
    let options: CaptureImageOptions = { limit: 1 };
    this.mediaCapture.captureImage(options)
      .then(
        (data: MediaFile[]) => {
          this.resizeImage(data[0]['fullPath']);
        },
        (err: CaptureError) => { }
      );
  }

  resizeImage(uri) {
    let options: ImageResizerOptions = {
      uri: uri,
      folderName: 'XendBit',
      quality: 100,
      width: 400,
      height: 400
    };

    this.imageResizer.resize(options).then((filePath: string) => {
      this.idImagePath = filePath;
      this.base64.encodeFile(filePath).then((base64File: string) => {
        this.idImage = base64File;
      }, (err) => {
        Console.log(err);
      });
    }).catch(e => {
      Console.log(e)
    });
  }

  register() {
    let isValid = false;
    let rf = this.registerForm.value;

    if (this.registerForm.valid) {
      isValid = true;
    } else {
      if (rf.email.match(this.emailRegex) === null) {
        Constants.showLongToastMessage("Enter valid email address", this.toastCtrl);
        return;
      }

      if (rf.surName === '') {
        Constants.showLongToastMessage("Please enter your surname", this.toastCtrl);
        return;
      }

      if (rf.firstName === '') {
        Constants.showLongToastMessage("Please enter your first name", this.toastCtrl);
        return;
      }      

      if (rf.country === '') {
        Constants.showLongToastMessage("Please enter your Country", this.toastCtrl);
        return;
      }

      if (rf.idNumber === '' && !this.isBasic) {
        //Constants.showLongToastMessage("Please enter  ID Number", this.toastCtrl);
        //return;
        rf.idNumber = "UNDEFINED";
      }
    }

    if (isValid) {
      //this.idImagePath = 'data:image/jpeg;base64,' + "1011001";
      if (this.idImagePath === undefined && !this.isBasic) {
        //Constants.showLongToastMessage("Picture of ID not found, Please upload one", this.toastCtrl);
        //return;
        this.idImagePath = "UNDEFINED";
        this.idImage = "UNDEFINED";
      }

      let url = Constants.RESTORE_USER_URL;
      url = Constants.NEW_USER_URL;
      let registrationType = "NEW";

      Constants.registrationData['loading'] = this.loading;
      Constants.registrationData['loadingCtrl'] = this.loadingCtrl;
      Constants.registrationData['navCtrl'] = this.navCtrl;
      Constants.registrationData['rf'] = rf;
      Constants.registrationData['http'] = this.http;
      Constants.registrationData['ls'] = this.ls;
      Constants.registrationData['toastCtrl'] = this.toastCtrl;
      Constants.registrationData['obv'] = Observable;
      Constants.registrationData['navCtrl'] = this.navCtrl;
      Constants.registrationData['tp'] = 'LoginPage';
      Constants.registrationData['idImage'] = this.idImage;
      Constants.registrationData['url'] = url;
      Constants.registrationData['registrationType'] = registrationType;

      this.navCtrl.push('PasswordPage');

      Constants.passwordPadSuccessCallback = this.passwordPadSuccess;
    } else {
      Constants.showLongToastMessage("Please fill form properly", this.toastCtrl);
    }
  }

  checkValue() {
    Console.log(this.registerForm.value.isBeneficiary);
  }

  passwordPadSuccess() {
    let rf = Constants.registrationData['rf'];

    for(let bank in this.banks) {
      if(this.banks[bank]['bankCode'] === rf.bank) {
        Constants.registrationData['bankName'] = this.banks[bank]['bankName'];
        break;
      }
    }
    
    Constants.registrationData['email'] = rf.email;
    Constants.registrationData['phoneNumber'] = rf.phoneNumber;
    Constants.registrationData['surName'] = rf.surName;
    Constants.registrationData['firstName'] = rf.firstName;
    Constants.registrationData['middleName'] = rf.middleName;
    Constants.registrationData['bvn'] = rf.bvn;
    Constants.registrationData['idType'] = rf.idType;
    Constants.registrationData['idNumber'] = rf.idNumber;
    Constants.registrationData['country'] = rf.country;
    if(rf.bank !== undefined && rf.bank !== "") {
      Constants.registrationData['bankCode'] = rf.bank;
    } else {
      Constants.registrationData['bankCode'] = "000";
    }
    Constants.registrationData['accountNumber'] = rf.accountNumber;
    Constants.registrationData['isBeneficiary'] = rf.isBeneficiary;
    StorageService.IS_BENEFICIARY = rf.isBeneficiary;
    
    Constants.registerOnServer();
  }
}

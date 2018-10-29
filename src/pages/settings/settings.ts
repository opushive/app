import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { Console } from '../utils/console';
import { ToastController, Loading, LoadingController, NavController, NavParams, Platform, AlertController, IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StorageService } from '../utils/storageservice';
import { FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

 pageTitle: string;
 restoreWalletText: string;
 logoutText: string;
 showMnemonicText: string;
 updgradeAccountText: string;
 afterUpgradeWarningText: string;
 accountType;
 ls;
 loading: Loading;
 showMnemonicForm;
 passwordText: string;
 revealText: string;
 isAdvanced = false;
 isBeneficiary = false;

  constructor(public http: Http, public toastCtrl: ToastController, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController, public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
    this.showMnemonicForm = formBuilder.group({
      password: ['', Validators.required]
    });
    this.passwordText = Constants.properties['wallet.password'];
    this.pageTitle = Constants.properties['settings.page.title'];
    this.restoreWalletText = Constants.properties['restore.wallet'];
    this.logoutText = Constants.properties['logout'];
    this.updgradeAccountText = Constants.properties['upgrade.account'];
    this.showMnemonicText = Constants.properties['show.recovery.words'];
    this.revealText = Constants.properties['reveal'];    
    this.ls = new StorageService(this.storage);
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    let app = this;
    setTimeout(function () {
      //Wait for sometimes for storage to be ready
      app.loading.dismiss();
    }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);
    this.accountType = StorageService.ACCOUNT_TYPE;
    this.isBeneficiary = StorageService.IS_BENEFICIARY;
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad SettingsPage');
  }

  ionViewDidEnter() {
    Console.log('ionViewDidEnter SettingsPage');
    if(StorageService.ACCOUNT_TYPE === "ADVANCED") {
      this.isAdvanced = true;
    }    
    this.afterUpgradeWarningText = Constants.AFTER_UPGRADE_WARNING;
    this.accountType = StorageService.ACCOUNT_TYPE;
    this.isBeneficiary = StorageService.IS_BENEFICIARY;
  }
  
  logout() {
    if (Constants.AFTER_UPGRADE_WARNING !== "") {
      Constants.AFTER_UPGRADE_WARNING = "";
    }
    this.showConfirm();
  }

  becomeBeneficiary() {
    let postData = {
      password: this.ls.getItem("password"),
      emailAddress: this.ls.getItem("emailAddress"),
      beneficiary: true      
    };
    
    let loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    this.http.post(Constants.BECOME_BENEFICIARY_URL, postData, Constants.getHeader())
      .map(res => res.json())
      .subscribe(responseData => {
        loading.dismiss();
        if(responseData.result === "successfull") {
          StorageService.IS_BENEFICIARY = true;
          this.isBeneficiary = true;
          Constants.showLongerToastMessage("You are now a beneficiary, you will show up in donor searches.", this.toastCtrl);
        } else {
          Constants.showLongerToastMessage(responseData.result, this.toastCtrl);
        }
      }, error => {
        loading.dismiss();
        Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
      });    
    
  }

  upgrade() {
    this.navCtrl.push('UpgradePage');
  }

  showMnemonic() {
    let bv = this.showMnemonicForm.value;
    let password = bv.password;
    if (password !== this.ls.getItem("password")) {
      Constants.showLongToastMessage(Constants.properties['password.invalid.message'], this.toastCtrl);
    } else {
      this.showMnemonicForm.controls.password.setValue("");
      let sm = this.ls.getItem('mnemonic').split(' ').splice(0, 12).join(' ');

      let alert = this.alertCtrl.create({
        title: Constants.properties['recovery.words'],
        message: sm,
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Logout?',
      message: 'Are you sure you want to logout? The App will quit.',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.ls.setItem("lastLoginTime", "");
            this.platform.exitApp();
          }
        }
      ]
    });
    confirm.present();
  }
  
}

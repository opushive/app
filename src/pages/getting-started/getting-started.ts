import { Component } from '@angular/core';
import { Console } from '../utils/console';
import { NavController, NavParams, ToastController, IonicPage } from 'ionic-angular';
import { Constants } from '../utils/constants';
import { Storage } from '@ionic/storage';
import { StorageService } from '../utils/storageservice';

/*
  Generated class for the GettingStarted page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-getting-started',
  templateUrl: 'getting-started.html'
})
export class GettingStartedPage {
  pageTitle: string;
  basicWalletText: string;
  canSendCoinsText: string;
  canNotConvertCashText: string;
  canNotConvertCoinsText: string;
  createBasicWalletText: string;
  advancedWalletText: string;
  canConvertCashText: string;
  canConvertCoinsText: string;
  createAdvancedWalletText: string;
  restoreText: string;
  restoreWalletText: string;
  doesNotRequireKYCText: string;
  requireKYCText: string;
  recoverText: string;
  walletType: string = 'trader';
  email = "";
  showDetailsBasic = false;
  showDetailsAdvanced = false;
  detailsAdvanced = "Details...";
  detailsBasic = "Details...";

  ls;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.pageTitle = Constants.properties['getting.started.page.title'];
    this.restoreText = Constants.properties['restore'];
    this.restoreWalletText = Constants.properties['restore.wallet'];
    this.basicWalletText = Constants.properties['basic.wallet'];
    this.canSendCoinsText = Constants.properties['can.send.coins'];
    this.canNotConvertCashText = Constants.properties['can.not.convert.cash'];
    this.canNotConvertCoinsText = Constants.properties['can.not.convert.coins'];
    this.createBasicWalletText = Constants.properties['create.basic.wallet'];
    this.advancedWalletText = Constants.properties['advanced.wallet'];
    this.canConvertCashText = Constants.properties['can.convert.cash'];
    this.canConvertCoinsText = Constants.properties['can.convert.coins'];
    this.createAdvancedWalletText = Constants.properties['create.advanced.wallet'];
    this.doesNotRequireKYCText = Constants.properties['does.not.require.kyc'];
    this.requireKYCText = Constants.properties['require.kyc'];
    this.recoverText = Constants.properties['recover.or.migrate.wallet'];

    this.ls = new StorageService(this.storage);
  }

  toggleShowDetailsAdvanced() {
    this.showDetailsAdvanced = !this.showDetailsAdvanced;
    this.detailsAdvanced = this.showDetailsAdvanced ? "Hide" : "Details...";
  }

  toggleShowDetailsBasic() {
    this.showDetailsBasic = !this.showDetailsBasic;
    this.detailsBasic = this.showDetailsBasic ? "Hide" : "Details...";
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad GettingStartedPage');
  }

  openBasicWallet() {
    Constants.registrationData['walletType'] = this.walletType;
    StorageService.ACCOUNT_TYPE = "BASIC";
    StorageService.IS_BENEFICIARY = false;
    this.ls.setItem("accountType", "BASIC");
    this.navCtrl.push('WarningPage');
  }

  openAdvancedWallet() {
    Constants.registrationData['walletType'] = this.walletType;
    StorageService.ACCOUNT_TYPE = "ADVANCED";
    StorageService.IS_BENEFICIARY = false;
    this.ls.setItem("accountType", "ADVANCED");
    this.navCtrl.push('WarningPage');
  }

  restoreWallet() {
    if (this.email === '') {
      Constants.showLongerToastMessage('Please enter your email address', this.toastCtrl);
    } else {
      this.navCtrl.push('ConfirmMnemonicPage', { mnemonic: '', type: 'restore', 'email': this.email, 'shouldRegister': 'false' });
    }
  }
}

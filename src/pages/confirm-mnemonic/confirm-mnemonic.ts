import { networks } from 'bitcoinjs-lib';
import { mnemonicToSeed } from 'bip39';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { Console } from '../utils/console';
import { ActionSheetController, NavController, NavParams, ToastController, Loading, LoadingController, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { StorageService } from '../utils/storageservice';
import { HDNode } from 'bitcoinjs-lib';
/*
  Generated class for the CreateMnemonic page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-confirm-mnemonic',
  templateUrl: 'confirm-mnemonic.html'
})
export class ConfirmMnemonicPage {

  passphrase: string;
  confirmMnemonic = "";
  shouldRegister: string;
  buttonText: string;
  description: string;

  wallet: any;
  isRestore = false;
  isNew = false;
  isUpgrade = false;
  loading: Loading;
  email: string;
  ls: StorageService;

  pageTitle: string;
  createWalletText: string;
  restorWalletText: string;
  mnemonicArray = [];
  disableButton = false;

  FB_APP_ID: number = 1900836276861220;

  constructor(public storage: Storage, public actionSheetCtrl: ActionSheetController, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams) {
    this.pageTitle = Constants.properties['confirm.mnemonic.page.title'];
    this.email = navParams.get('email');
    this.passphrase = navParams.get('mnemonic');
    let splitted = this.passphrase.split(" ");

    let pushed = [];
    while (true) {
      let x = Math.ceil(Math.random() * 12) - 1;
      if (x < 12 && pushed.indexOf(x) < 0) {
        this.mnemonicArray.push(splitted[x]);
        pushed.push(x);
      }

      if (pushed.length === 12) {
        break;
      }
    }

    this.shouldRegister = navParams.get("shouldRegister");
    this.isRestore = navParams.get("type") == "restore";
    this.isUpgrade = navParams.get("type") == "upgrade";
    this.isNew = navParams.get("type") == "new";
    this.ls = new StorageService(this.storage);

    if (this.shouldRegister === 'true') {
      this.buttonText = Constants.properties['create.wallet'];
      this.description = Constants.properties['lets.confirm'];
    } else {
      this.buttonText = Constants.properties['restore.wallet'];
      this.description = Constants.properties['enter.words'];
    }

    if (this.isUpgrade) {
      this.buttonText = Constants.properties['upgrade.account'];
    }
  }

  disableAndSave(ma) {
    this.confirmMnemonic += ma + " ";
  }

  isEnabled(ma) {
    return this.confirmMnemonic.split(" ").indexOf(ma) < 0;
  }

  ionViewDidEnter() {
    this.disableButton = false;
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad ConfirmMnemonicPage');
  }

  createWallet() {
    this.confirmMnemonic = this.confirmMnemonic.toLowerCase().trim();

    if (this.isRestore) {
      this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
      let postData = {
        passphrase: this.confirmMnemonic
      };

      this.http.post(Constants.GET_13TH_WORD, postData, Constants.getHeader()).map(res => res.json()).subscribe(
        responseData => {
          this.loading.dismiss();
          if (responseData.response_code == 0) {
            this.ls.clear();
            let lastWord = responseData.result;
            this.passphrase = this.confirmMnemonic + " " + lastWord;
            var hd = HDNode.fromSeedBuffer(mnemonicToSeed(this.passphrase), Constants.NETWORKS.BTCTEST).derivePath("m/0/0/0");

            Constants.registrationData['networkAddress'] = hd.getAddress();
            this.ls.setItem('BTCAddress', hd.getAddress());
            this.ls.setItem('mnemonic', this.passphrase);
            Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'XND');
            Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'NXT');
            Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'ARDR');
            Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'IGNIS');
            Constants.tokenWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, "NGNT");
            Constants.ethWallet(this.ls);

            //import private key
            let privKey = hd.keyPair.toWIF();
            let address = hd.getAddress();
            console.log(privKey);
            console.dir(hd);
            console.dir(hd.keyPair);
            let url = Constants.RPC_PROXY + "/importprivkey/" + privKey + "/" + address + "/ALL";
            this.http.get(url).map(res => res.json()).subscribe(_success => { }, _error => { });

            this.ls.setItem('emailAddress', this.email);
            Constants.showLongToastMessage("Restore Successful. Now login", this.toastCtrl);
            this.navCtrl.push('LoginPage');
          } else {
            throw (responseData.response_text);
          }
        },
        error => {
          this.loading.dismiss();
          throw (error);
        }
      );
    } else {
      this.ls.clear();
      Console.log(this.passphrase)
      var hd = HDNode.fromSeedBuffer(mnemonicToSeed(this.passphrase), Constants.NETWORKS.BTCTEST).derivePath("m/0/0/0");
      Console.log("Got HD NODE: " + hd);
      Constants.registrationData['networkAddress'] = hd.getAddress();
      Console.log("Got HD Address: ");
      this.ls.setItem('BTCAddress', hd.getAddress());
      Console.log("Set HD Address Into ls: ");
      this.ls.setItem('mnemonic', this.passphrase);
      Console.log("Set Passphrase into ls: ");
      Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'XND');
      Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'NXT');
      Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'ARDR');
      Constants.xndWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, 'IGNIS');            
      Constants.tokenWallet(this.ls, this.loading, this.loadingCtrl, this.http, this.toastCtrl, "NGNT");
      Constants.ethWallet(this.ls);

      //import private key
      let privKey = hd.keyPair.toWIF();
      let address = hd.getAddress();
      console.log(privKey);
      let url = Constants.RPC_PROXY + "/importprivkey/" + privKey + "/" + address + "/ALL";
      this.http.get(url).map(res => res.json()).subscribe(_success => { }, _error => { });

      if (this.isRestore) {
        return;
      } else {
        Constants.registrationData['loadingCtrl'] = this.loadingCtrl;
        Constants.registrationData['isRestore'] = this.isRestore;
        Constants.registrationData['isNew'] = this.isNew;
        Constants.registrationData['isUpgrade'] = this.isUpgrade;
        Constants.registrationData['http'] = this.http;
        Constants.registrationData['ls'] = this.ls;
        Constants.registrationData['toastCtrl'] = this.toastCtrl;
        Constants.registrationData['obv'] = Observable;
        Constants.registrationData['navCtrl'] = this.navCtrl;
        Constants.registrationData['passwordPadSuccess'] = this.passwordPadSuccess;

        let url = Constants.RESTORE_USER_URL;
        if (this.isNew) {
          url = Constants.NEW_USER_URL;
        }

        Constants.registrationData['url'] = url;

        let minus13thWord = this.passphrase.split(" ").splice(0, 12).join(' ');

        if (this.isRestore) {
          //this.getAccountType();
          //do nothing the code will never get here.
        } else {
          if (this.confirmMnemonic === undefined) {
            Constants.showLongToastMessage(Constants.properties['type.words'], this.toastCtrl);
            return;
          } else if (minus13thWord !== this.confirmMnemonic) {
            Constants.showLongToastMessage(Constants.properties['words.dont.match'], this.toastCtrl);
            this.confirmMnemonic = "";
            return;
          }

          Constants.registrationData['mnemonic'] = this.passphrase;
          this.presentActionSheet();
        }
      }
    }
  }

  passwordPadSuccess() {
    Constants.registrationData['tp'] = 'LoginPage';
    Constants.registrationData['idImage'] = "";
    Constants.registrationData['phoneNumber'] = "";
    Constants.registrationData['password'] = "password";
    Constants.registrationData['bvn'] = "";
    Constants.registrationData['idType'] = "";
    Constants.registrationData['idNumber'] = "";

    let loading = Constants.showLoading(Constants.registrationData['loading'], Constants.registrationData['loadingCtrl'], Constants.properties['loading.dialog.text']);
    Constants.registrationData['loading'] = loading;
    Constants.registerOnServer();
  }

  presentActionSheet() {
    this.disableButton = true;
    this.navCtrl.push('RegisterPage', { "mnemonic": this.confirmMnemonic, "type": "new" });
  }
}
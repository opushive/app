import { mnemonicToSeed } from 'bip39';
import { HDNode } from 'bitcoinjs-lib';
import { HomePage } from './../home/home';
import { Console } from './../utils/console';
import { Storage } from '@ionic/storage';
import { StorageService } from './../utils/storageservice';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SwitchWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-switch-wallet',
  templateUrl: 'switch-wallet.html',
})
export class SwitchWalletPage {
  wallets = [];
  ls: StorageService;
  home: HomePage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.ls = new StorageService(this.storage);
    this.home = this.navParams.get('home');
    console.log(this.home);
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad SwitchWalletPage');
  }

  ionViewDidEnter() {
    let allWallets = Constants.properties['wallets'];
    let count = 0;
    let by3 = [];
    for (let w of allWallets) {
      if (count % 3 == 0) {
        if (by3.length > 0) {
          this.wallets.push(by3);
        }
        by3 = [];
      }
      by3.push(w);
      count++;
    }

    if (by3.length > 0) {
      this.wallets.push(by3);
    }

    Console.log(this.wallets);
  }

  switchWallet(wallet) {
    this.navCtrl.pop();
    Constants.WORKING_WALLET = wallet['value'];
    if (Constants.WORKING_WALLET.indexOf("ETH") >= 0) {
      this.home.showXendBalance = false;
      Console.log("Switching Wallet to " + Constants.WORKING_WALLET);
      Constants.ethWallet(this.ls);
      let app = this;
      setTimeout(function () {
        app.home.refresh(true);
      }, 2500);
    } else if (Constants.WORKING_WALLET === 'XND' || Constants.WORKING_WALLET === 'NXT' || Constants.WORKING_WALLET === 'ARDR' || Constants.WORKING_WALLET === 'IGNIS') {
      Console.log("Switching Wallet to " + Constants.WORKING_WALLET);
      this.home.showXendBalance = false;
      Constants.xndWallet(this.ls, this.home.loading, this.home.loadingCtrl, this.home.http, this.home.toastCtrl, Constants.WORKING_WALLET);
      let app = this;
      setTimeout(function () {
        app.home.refresh(true);
      }, 2500);
    } else if (wallet['currencyId'] !== undefined) {
      Constants.tokenWallet(this.ls, this.home.loading, this.home.loadingCtrl, this.home.http, this.home.toastCtrl, Constants.WORKING_WALLET);
      let app = this;
      setTimeout(function () {
        app.home.refresh(true);
      }, 2500);
    } else {
      Constants.NETWORK = Constants.NETWORKS[Constants.WORKING_WALLET];
      Console.log(Constants.WORKING_WALLET);
      Console.log(Constants.NETWORK);      
      let mnemonic = this.ls.getItem('mnemonic').trim();

      var hd = HDNode.fromSeedBuffer(mnemonicToSeed(mnemonic), Constants.NETWORK).derivePath("m/0/0/0");
      console.dir(hd);
      var key = Constants.WORKING_WALLET + 'Address';
      this.ls.setItem(key, hd.getAddress());
      this.home.refresh(true);
    }
  }
}

import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { Constants } from '../utils/constants';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { StorageService } from '../utils/storageservice';

@Component({
  templateUrl: 'equities-exchange.html'
})

export class EquitiesExchangePage {
 homeText: string;
 buyText: string;
 sendText: string;
 send2BankText: string;
 settingsText: string;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = 'LandingPage';
  tab2Root: any = 'SendBitPage';
  tab3Root: any = 'SettingsPage';

 isAdvanced: boolean = false;

  constructor(public storage: Storage, public http: Http, public alertCtrl: AlertController, public platform: Platform) {
    if(Constants.properties === undefined) {
      //do nothing
    } else {
      this.initProps();
    }
    new StorageService(this.storage);
  }

  ionViewDidEnter() {
    this.isAdvanced = false;
    if(StorageService.ACCOUNT_TYPE === "ADVANCED") {
      this.isAdvanced = true;
    }    
  }

  initProps() {
    this.homeText = Constants.properties['home'];
    this.buyText = Constants.properties['buy'];
    this.sendText = "Transfer";
    this.send2BankText = Constants.properties['send.to.bank'];
    this.settingsText = Constants.properties['settings'];    
  }
}

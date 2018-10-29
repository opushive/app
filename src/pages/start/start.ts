import { Component } from '@angular/core';
import { Console } from '../utils/console';
import { Platform, AlertController, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../utils/constants';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TabsPage } from '../tabs/tabs';
import { StorageService } from '../utils/storageservice';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Login page.
  
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})

export class StartPage {

  //public loading: Loading;
  pageTitle: string;
  ss: StorageService;
  appVersion: string;

  constructor(public storage: Storage, public alertCtrl: AlertController, public platform: Platform, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.ss = new StorageService(storage);
  }

  ionViewDidLoad() {
    this.appVersion = Constants.APP_VERSION;
    Console.log('ionViewDidLoad StartPage');
  }

  ionViewDidEnter() {
    this.loadSettings();
  }

  register() {
    this.navCtrl.push('TermsPage');
  }

  openLogin() {
    this.navCtrl.push("LoginPage");
  }

  loadSettings() {
    Console.log(Constants.SETTINGS_URL);
    this.http.get(Constants.SETTINGS_URL).map(res => res.json()).subscribe(data => {
      Constants.properties = data;
    }, error => {
      Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
      Console.log("Can not pull data from server");
      //this.platform.exitApp();
    });
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController, IonicPage } from 'ionic-angular';
import { Constants } from '../utils/constants';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Console } from '../utils/console';

/**
 * Generated class for the MarketDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-market-data',
  templateUrl: 'market-data.html',
})
export class MarketDataPage {

  tickerData = [];
  globalData = {};
  loading: Loading;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad MarketDataPage');    
  }

  ionViewDidEnter(){
    this.loadMarketData();
  }

  loadMarketData() {
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, "Please wait while we load market data");
    let url = Constants.GET_MARKET_DATA_URL;
    this.http.get(url).map(res => res.json()).subscribe(responseData => {
      this.tickerData = responseData.tickers;
      this.globalData = responseData.globalData;
      this.loading.dismiss();
    }, error => {
      Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
      this.loading.dismiss();
    });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}

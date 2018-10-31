import { CoinsSender } from './../utils/coinssender';
import { Storage } from '@ionic/storage';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController, AlertController, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { StorageService } from '../utils/storageservice';
import { Console } from '../utils/console';

/**
 * Generated class for the ShowBankPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-bank-payment',
  templateUrl: 'show-bank-payment.html',
})
export class ShowBankPaymentPage {
  pageTitle: string;
  usdRate: number = 0;
  btcRate: number = 0;
  btcToNgn = 0;
  btcText: string;
  currencyText: string;
  buyBitFormHeaderText: string;
  banks = [];
  bankName: string;
  accountNumber: string;
  totalAmount = 0;
  amountToSend = 0;

  referenceCode: string;
  buyerAddress: string;
  ls: StorageService;
  loading: Loading;
  sellOrder: any;
  disableButton = false;
  brokerAccount = "";

  constructor(public alertCtrl: AlertController, public storage: Storage, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController) {
    this.pageTitle = Constants.properties['buy.bit.with.cc.page.title'];
    this.currencyText = Constants.properties['currency'];
    this.buyBitFormHeaderText = this.pageTitle;
    this.btcText = Constants.properties['btc'];
    this.banks = Constants.properties['banks'];

    this.sellOrder = this.navParams.get('sellOrder');
    Console.log(this.sellOrder);

    let data = this.sellOrder;
    let sellerToAddress = data['sellerToAddress'];
    let splitted = sellerToAddress.split(":");

    for (let bank in this.banks) {
      if (this.banks[bank]['bankCode'] === splitted[0]) {
        this.bankName = this.banks[bank]['bankName'];
        break;
      }
    }

    this.accountNumber = splitted[1];
    this.totalAmount = data['amountToRecieve']
    this.referenceCode = data['trxId'];
    this.buyerAddress = data['buyerFromAddress'];
    this.amountToSend = data['amountToSell'];
    this.brokerAccount = data['brokerAccount'];

    this.ls = new StorageService(this.storage);
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    let app = this;
    //let pageTitle = Constants.properties['select.payment.method.title'];
    setTimeout(function () {
      //Wait for sometimes for storage to be ready
      app.loading.dismiss();
    }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);

  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad ShowBankPaymentPage');
  }

  successCall(data) {
    let app:ShowBankPaymentPage = data['page'];
    app.disableButton = true;
    //ok, we need to call server "update-exchange-status";
    let url = Constants.UPDATE_TRADE_URL;
    let requestData = {
      "sellOrderTransactionId": app.sellOrder['trxId'],
      "status": "SUCCESS",
      emailAddress: app.ls.getItem("emailAddress"),
      password: app.ls.getItem("password")      
    };

    app.http.post(url, requestData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
      //doNothing
    }, error => {
      Constants.showLongerToastMessage("We have released coins to the buyer, but we can't update the status of your transaction. Please speak to an admin immediately", app.toastCtrl);
    })
  }

  errorCall(data) {
    //doNothing
  }

  confirmBankPayment() {
    let data = {};
    data['amount'] = this.amountToSend
    data['recipientAddress'] = this.buyerAddress;
    data['loading'] = this.loading;
    data['loadingCtrl'] = this.loadingCtrl;
    data['ls'] = this.ls;
    data['toastCtrl'] = this.toastCtrl;
    data['http'] = this.http;
    data['page'] = this;
    data['trxId'] = this.sellOrder;
    data['brokerAccount'] = this.brokerAccount;
  
    let fees = Constants.getCurrentWalletProperties();
    
    if (Constants.WORKING_WALLET.indexOf('ETH') >= 0) {
      CoinsSender.sendCoinsEth(data, this.successCall, this.errorCall, Constants.WORKING_WALLET);
    } else if (Constants.WORKING_WALLET === 'XND' || Constants.WORKING_WALLET === "NXT" || Constants.WORKING_WALLET === "ARDR" || Constants.WORKING_WALLET === "IGNIS") {
      CoinsSender.sendCoinsXnd(data, this.successCall, this.errorCall, fees);
    } else if (fees.currencyId !== undefined) {
      CoinsSender.sendCoinsXnd(data, this.successCall, this.errorCall, fees);
    } else if (fees.equityId !== undefined) {
      CoinsSender.sendCoinsXnd(data, this.successCall, this.errorCall, fees);
    } else {
      let key = Constants.WORKING_WALLET + "Address";
      CoinsSender.sendCoinsBtc(data, this.successCall, this.errorCall, Constants.WORKING_WALLET, this.ls.getItem(key), Constants.NETWORK);
    }
  }

  updateOrder(transactionId) {
    let url = Constants.UPDATE_USER_SELL_ORDERS_TX_URL;
    let postData = {
      emailAddress: this.ls.getItem("emailAddress"),
      sellOrderTransactionId: transactionId,
      status: "sold",
      password: this.ls.getItem("password")
    };

    this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
      //doNothing
    }, error => {
      Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
    });
  }

  loadRate() {
    let fees = Constants.getCurrentWalletProperties();
    let tickerSymbol = fees.tickerSymbol;
    let url = Constants.GET_USD_RATE_URL + tickerSymbol;

    this.http.get(url, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
      this.usdRate = responseData.result.buy;
      this.btcRate = responseData.result.rate;
      this.btcToNgn = this.btcRate / this.usdRate;
    }, error => {
      //doNothing
    });
  }
}
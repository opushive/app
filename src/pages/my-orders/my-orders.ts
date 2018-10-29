import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { StorageService } from './../utils/storageservice';
import { Console } from './../utils/console';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController, AlertController, IonicPage } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

/**
 * Generated class for the BuyBitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-my-orders',
    templateUrl: 'my-orders.html',
})
export class MyOrdersPage {

    currentWallet = {};
    usdRate: number = 0;
    btcRate: number = 0;
    btcToNgn = 0;

    ls: StorageService;
    loading: Loading;

    sellersText: string;
    sellers = [];
    priceText: string;
    buyerOtherAddress: string;
    currencyPairs = [];
    currencyPair: string;
    sellersPairs = [];
    fromCoin: string;
    toCoin: string;
    showHeaders = false;

    constructor(public storage: Storage, public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController) {
        let fees = Constants.getCurrentWalletProperties();
        this.currentWallet = fees;

        this.loadRate();

        this.ls = new StorageService(this.storage);

        //let pageTitle = Constants.properties['select.payment.method.title'];
        setTimeout(function () {
        }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);
    }

    ionViewDidLoad() {
        Console.log('ionViewDidLoad BuyBitNgntPage');
    }

    ionViewDidEnter() {
        this.loadSellers();
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

    pairSelected(value) {
        this.showHeaders = false;
        Console.log("Selected Pair");
        let selectedPair = value;
        this.sellersPairs = [];
        for (let seller of this.sellers) {
            let splitted = selectedPair.split(" -> ");
            this.toCoin = splitted[1];
            this.fromCoin = splitted[0];
            if (seller.toCoin == this.toCoin) {
                this.sellersPairs.push(seller);
            }
        }

        this.showHeaders = this.sellersPairs.length > 0;
    }

    loadSellers() {
        this.currencyPairs = [];        
        this.sellersPairs = [];
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
        let wallets = Constants.properties['wallets'];
        for (let w in wallets) {
            let wallet = wallets[w];
            if (wallet['value'] !== Constants.WORKING_WALLET) {
                let pair = Constants.WORKING_WALLET + " -> " + wallets[w].value;
                this.currencyPairs.push(pair);
            }
        }

        for (let bpm of Constants.properties['payment.methods']) {
            let pair = Constants.WORKING_WALLET + " -> " + bpm.value;
            this.currencyPairs.push(pair);
        }

        Console.log(this.currencyPairs);

        let url = Constants.GET_USER_SELL_ORDERS_TX_URL;

        let postData = {
            emailAddress: this.ls.getItem("emailAddress"),
            password: this.ls.getItem("password")
        };

        this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            this.sellers = responseData.result;
            this.loading.dismiss();
            if(this.currencyPair !== undefined && this.currencyPair !== "") {
                this.pairSelected(this.currencyPair);
            }
        }, _error => {
            this.loading.dismiss();
            Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
        });
    }

    finalizeSale(sellOrder) {
        this.navCtrl.push('ShowBankPaymentPage', { "sellOrder": sellOrder });
    }

    deleteOrder(transactionId) {
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
        let url = Constants.UPDATE_USER_SELL_ORDERS_TX_URL;
        let postData = {
            emailAddress: this.ls.getItem("emailAddress"),
            sellOrderTransactionId: transactionId,
            status: "delete",
            password: this.ls.getItem("password")
        };

        this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            this.loading.dismiss();
            let deletedId = responseData.result;
            if (deletedId > 0) {                
                Constants.showLongToastMessage("Order Deleted Successfully", this.toastCtrl);
                this.loadSellers();
            } else {
                Constants.showLongToastMessage("Error Deleting your order, please try again", this.toastCtrl)
            }
        }, _error => {
            this.loading.dismiss();
            Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
        });
    }
}

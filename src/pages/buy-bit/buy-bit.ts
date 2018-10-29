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
    selector: 'page-buy-bit',
    templateUrl: 'buy-bit.html',
})
export class BuyBitPage {

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

    ionViewDidEnter(){
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
            if(seller.toCoin == this.toCoin) {
                this.sellersPairs.push(seller);
            }
        }
        
        this.showHeaders = this.sellersPairs.length > 0;
    } 

    loadSellers() {
        this.currencyPairs = [];
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
        let wallets = Constants.properties['wallets'];
        for (let w in wallets) {
            let wallet = wallets[w];
            if (wallet['value'] !== Constants.WORKING_WALLET) {
                let pair = Constants.WORKING_WALLET + " -> " + wallets[w].value;
                this.currencyPairs.push(pair);
            }
        }

        for(let bpm of Constants.properties['payment.methods']) {
            let pair = Constants.WORKING_WALLET + " -> " + bpm.value;
            this.currencyPairs.push(pair);
        }        

        Console.log(this.currencyPairs);

        let url = Constants.GET_SELL_ORDERS_TX_URL;    

        let postData = {
            emailAddress: this.ls.getItem("emailAddress"),
            password: this.ls.getItem("password")
        };

        this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            this.sellers = responseData.result;
            this.loading.dismiss();
        }, _error => {
            this.loading.dismiss();
            Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
        });
    }

    buyBit(seller) {
        Console.log("buyBit");
        this.presentAlert(seller);
    }

    presentAlert(seller) {
        let message = 'Do you want to buy '
            + seller.amountToSell + ' '
            + seller.fromCoin + ' @ '
            + seller.rate + ' per coin? You will be paying '
            + seller.amountToRecieve + ' in '
            + seller.toCoin;

        let alert = this.alertCtrl.create({
            title: 'Confirm purchase',
            message: message,
            buttons: [
                {
                    text: "Don't Buy",
                    role: 'cancel',
                    handler: () => {
                        //doNothing
                    }
                },
                {
                    text: 'Buy',
                    handler: () => {
                        this.getBuyerOtherAddress(seller);
                    }
                }
            ]
        });
        alert.present();
    }

    getBuyerOtherAddress(seller) {
        Console.log("getBuyerOtherAddress");
        let coin = seller.toCoin;
        if (coin === "Naira") {
            this.sendTradeStartMessage(seller);
        } else {
            let key = coin + "Address";
            this.buyerOtherAddress = this.ls.getItem(key);
            this.checkCoinBalance(coin, seller);
        }
    }

    sendTradeStartMessage(seller) {
        let ws = Constants.properties['ws_connection'];
        let coin = seller.toCoin;

        if (coin === "Naira") {
            //this is a hack. we don't need the buyerAddress for NGNT Transactions
            this.buyerOtherAddress = "0000000000";
        } else {
            let key = coin + "Address";
            this.buyerOtherAddress = this.ls.getItem(key);
        }

        let key = Constants.WORKING_WALLET + "Address";
        let buyerAddress = this.ls.getItem(key);
        let trxId = seller.trxId;

        let data = {
            "buyerAddress": buyerAddress,
            "buyerOtherAddress": this.buyerOtherAddress,
            "buyerEmailAddress": this.ls.getItem("emailAddress"),
            "action": "startTrade",
            "trxId": trxId
        };

        ws.send(Constants.encryptData(JSON.stringify(data))).subscribe((data) => {
        }, (error) => {
        }, () => {
        });

        Constants.properties['spmNavCtrl'] = this.navCtrl;
        this.showPleaseWait();
    }

    showPleaseWait() {
        let timer = 120;
        let running = Observable.interval(1000).subscribe(x => {
            timer = timer - 1;
            if (timer <= 0) {
                running.unsubscribe();
                //Constants.showAlert(this.alertCtrl, "Trade Cancelled", "Time out before User could respond.");
            }
        });
        Constants.properties['startTradeObservable'] = running;
    }

    checkCoinBalance(coin, seller) {
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, "Checking your current balance...");
        let amountToSend = +seller.amountToRecieve;
        let fees = Constants.getWalletProperties(coin);

        let postData = {
            password: this.ls.getItem("password"),
            networkAddress: this.buyerOtherAddress,
            emailAddress: this.ls.getItem("emailAddress"),
            currencyId: fees.currencyId
        };

        this.http.post(Constants.GET_TX_URL, postData, Constants.getWalletHeader(coin))
            .map(res => res.json())
            .subscribe(responseData => {
                this.loading.dismiss();
                let confirmedAccountBalance = +responseData.result.balance;
                
                let xendFees = amountToSend * +fees.xendFees;
                let totalAmount: number = amountToSend + +fees.blockFees + xendFees;
                if (confirmedAccountBalance < totalAmount) {
                    Constants.showLongerToastMessage("Insufficient " + coin + " balance", this.toastCtrl);
                } else {
                    //if buyerOtherAddress starts with XND, then it's a colored coin
                    //so we must check if they have XND balance of 1       
                    Console.log(this.buyerOtherAddress);
                    if (this.buyerOtherAddress.indexOf("XND") === 0) {
                        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, "Checking your Xendcoin balance...");
                        this.http.post(Constants.GET_TX_URL, postData, Constants.getWalletHeader("XND"))
                            .map(res => res.json())
                            .subscribe(responseData => {
                                this.loading.dismiss();
                                let confirmedAccountBalance = +responseData.result.balance;
                                if (confirmedAccountBalance < 1) {
                                    Constants.showLongerToastMessage("Insufficient Xendcoin balance. You need at least one Xendcoin to participate", this.toastCtrl);
                                } else {
                                    this.sendTradeStartMessage(seller);
                                }
                            }, error => {
                                this.loading.dismiss();
                                Constants.showLongerToastMessage("Can not retreive your Xendcoin balance. Please try again later", this.toastCtrl);
                            });
                    } else {
                        this.sendTradeStartMessage(seller);
                    }
                }
            }, error => {
                this.loading.dismiss();
                Constants.showLongerToastMessage("Can not retreive your " + coin + " balance. Please try again later", this.toastCtrl);
            });
    }
}

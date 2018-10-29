import {Storage} from '@ionic/storage';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio';
import {StorageService} from './../utils/storageservice';
import {Constants} from './../utils/constants';
import {Component} from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Loading, AlertController, IonicPage } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';
import {FormBuilder, Validators} from '@angular/forms';
import { Console } from '../utils/console';

/**
 * Generated class for the ExchangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-exchange',
    templateUrl: 'exchange.html',
})
export class ExchangePage {

    ls: StorageService;
    usdRate = 0;
    btcRate = 0;
    btcToNgn = 0;
    sellForm;
    btcText: string;
    currencyText: string;
    priceText: string;
    numberOfBTCText: string;
    paymentMethods = [];
    bankPaymentMenthods = [];
    amountToRecieve: number;
    recipientOtherAddress: string;
    loading: Loading;
    selectedPaymentMethod: string;
    rate = 0;

    constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public formBuilder: FormBuilder, public toastCtrl: ToastController, public storage: Storage, public loadingCtrl: LoadingController) {
        this.sellForm = this.formBuilder.group({
            numberOfBTC: ['', Validators.required],
            pricePerBTC: ['', Validators.required],
            password: ['', Validators.required],
            acceptedPaymentMethod: ['', Validators.required],
            amountToRecieve: ['', Validators.required],
            recipientOtherAddress: ['', Validators.required]
        });

        this.numberOfBTCText = Constants.properties['number.of.coins'];
        this.priceText = Constants.properties['price.per.coin'];

        let fees = Constants.getCurrentWalletProperties();
        this.currencyText = fees.currencyText;
        this.btcText = fees.btcText;
        this.priceText = this.priceText.replace('Coin', this.btcText);
        this.numberOfBTCText = this.numberOfBTCText.replace('Coin', this.btcText);

        let wallets = Constants.properties['wallets'];
        for (let w in wallets) {
            let wallet = wallets[w];
            if (wallet['value'] !== Constants.WORKING_WALLET) {
                this.paymentMethods.push(wallets[w]);
            }
        }

        // this.bankPaymentMenthods = Constants.properties['payment.methods'];
        // for(let bpm of this.bankPaymentMenthods) {
        //     this.paymentMethods.push(bpm);
        // }        

        this.ls = new StorageService(this.storage);
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
        let app = this;
        //let pageTitle = Constants.properties['select.payment.method.title'];
        setTimeout(function () {
            //Wait for sometimes for storage to be ready
            app.loading.dismiss();
            app.loadRate();
        }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);
    }

    ionViewDidLoad() {
        Console.log('ionViewDidLoad ExchangePage');
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

    sellBit() {
        let isValid = false;
        let sb = this.sellForm.value;
        let balance = +this.ls.getItem(Constants.WORKING_WALLET + "confirmedAccountBalance");
        let rate = +sb.pricePerBTC;
        let password = sb.password;
        let coinAmount = +sb.numberOfBTC;
        let amountToRecieve = +sb.amountToRecieve;
        let sellerToAddress = sb.recipientOtherAddress;

        let fees = Constants.getCurrentWalletProperties();

        let xendFees = coinAmount * +fees.xendFees;
        let blockFees = fees.blockFees;

        if (coinAmount === 0) {
            Constants.showLongToastMessage("Please enter amount to sell", this.toastCtrl);
        } else if (rate === 0) {
            Constants.showLongToastMessage("Please enter rate", this.toastCtrl);
        } else if (password !== this.ls.getItem("password")) {
            Constants.showLongToastMessage(Constants.properties['password.invalid.message'], this.toastCtrl);
        } else if (coinAmount + xendFees + blockFees > balance) {
            Constants.showPersistentToastMessage(Constants.properties['insufficient.bitcoin.balance'], this.toastCtrl);
        } else if (sb.acceptedPaymentMethods === "") {
            Constants.showPersistentToastMessage("Please specify accepted payment method", this.toastCtrl);
        } else if (this.sellForm.valid) {
            isValid = true;
        }

        if (isValid) {
            let amountToSell = coinAmount;
            let key = Constants.WORKING_WALLET + "Address";
            let sellerFromAddress = this.ls.getItem(key);

            this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
            let postData = {
                amountToSell: amountToSell,
                amountToRecieve: amountToRecieve,
                sellerFromAddress: sellerFromAddress,
                sellerToAddress: sellerToAddress,
                fromCoin: Constants.WORKING_WALLET,
                toCoin: this.selectedPaymentMethod,
                rate: rate,
                emailAddress: this.ls.getItem("emailAddress"),
                password: password,
                networkAddress: sellerFromAddress,
                currencyId: fees.currencyId
            }

            let url = Constants.POST_TRADE_URL;
            this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(
                responseData => {
                    Constants.showLongerToastMessage(responseData.result, this.toastCtrl);
                    this.clearForm();
                    this.loading.dismiss();
                }, error => {
                    this.loading.dismiss();
                    Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
                    //doNothing
                })
        }
    }

    clearForm() {
        this.sellForm.controls.numberOfBTC.setValue('');
        this.sellForm.controls.amountToRecieve.setValue('');
        //this.sellForm.controls.pricePerBTC.setValue('');
        //this.sellForm.controls.recipientOtherAddress.setValue('');
        this.sellForm.controls.password.setValue('');
    }

    sellBitFingerprint() {
        let faio: FingerprintAIO = new FingerprintAIO();
        faio.show({
            clientId: "Fingerprint-Demo",
            clientSecret: "password", //Only necessary for Android
            disableBackup: true  //Only for Android(optional)
        })
            .then((result: any) => {
                this.sellForm.controls.password.setValue(this.ls.getItem("password"));
                this.sellBit();
            })
            .catch((error: any) => {
                Constants.showLongToastMessage(Constants.properties['fingerprint.invalid'], this.toastCtrl);
            });
    }

    paymentMethodSelected(value) {
        this.selectedPaymentMethod = value;
        let key = value + "Address";
        this.sellForm.controls.recipientOtherAddress.setValue(this.ls.getItem(key));
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, "Calculating Exchange Rates. Please Wait....");
        let f1 = Constants.getWalletProperties(Constants.WORKING_WALLET);
        let f2 = Constants.getWalletProperties(value);

        let url = Constants.GET_EXCHANGE_RATE_URL + f1.tickerSymbol + "/" + f2.tickerSymbol;

        this.http.get(url, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            this.loading.dismiss();
            this.rate = responseData.result['t1_t2'];
            this.sellForm.controls.pricePerBTC.setValue(this.rate.toFixed(10));
            let toSell = this.sellForm.value.numberOfBTC;
            if (toSell > 0) {
                let amount = toSell * this.rate;
                this.sellForm.controls.amountToRecieve.setValue(amount.toFixed(3));
            }
        }, error => {
            this.loading.dismiss();
            Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
        });
    }

    calculateHowMuchToRecieve() {
        this.rate = this.sellForm.value.pricePerBTC;
        let toSell = +this.sellForm.value.numberOfBTC;
        if (this.rate !== 0 && toSell !== 0) {
            let toRecieve = toSell * this.rate;
            this.sellForm.controls.amountToRecieve.setValue(toRecieve.toFixed(3));
        }
    }

}

import {FingerprintAIO} from '@ionic-native/fingerprint-aio';
import {FormBuilder, Validators} from '@angular/forms';
import {Console} from './../utils/console';
import {Storage} from '@ionic/storage';
import {StorageService} from './../utils/storageservice';
import {Constants} from './../utils/constants';
import {Component} from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController, ActionSheetController, AlertController, IonicPage } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';

/**
 * Generated class for the SellBitPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sell-bit',
    templateUrl: 'sell-bit.html',
})
export class SellBitPage {

    networkAddress: string;
    confirmedAccountBalance: string;
    ls: any;
    sellForm: any;
    loading: Loading;
    usdRate: number = 0;
    btcRate: number = 0;
    btcToNgn = 0;
    pageTitle: string;
    btcText: string;
    currencyText: string;
    rate = 1;

    priceText: string;
    numberOfBTCText: string;
    sendBitText: string;
    beneficiaryNameText: string;
    beneficiaryAccountNumberText: string;
    beneficiaryBankText: string;
    banks = [];
    beneficiaryName: string;
    passwordText: string;
    placeOrderText: string;
    paymentMethods = [];
    isOwner = false;
    beneficiaryData = {
        beneficiaryBank: "",
        beneficiaryAccountNumber: ""
    };

    constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public storage: Storage, public http: Http, public formBuilder: FormBuilder, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {
        this.banks = Constants.properties['banks'];
        this.paymentMethods = Constants.properties['payment.methods'];
        this.pageTitle = Constants.properties['sell.bit.page.title']
        this.priceText = Constants.properties['price.per.coin'];
        this.numberOfBTCText = Constants.properties['number.of.coins'];
        this.sendBitText = Constants.properties['sell.bit'];
        this.placeOrderText = Constants.properties['place.order'];
        this.beneficiaryNameText = Constants.properties['beneficiary.name'];
        this.beneficiaryAccountNumberText = Constants.properties['beneficiary.account.number'];
        this.beneficiaryBankText = Constants.properties['beneficiary.bank'];
        this.passwordText = Constants.properties['wallet.password'];
        this.isOwner = this.navParams.get('isOwner') === undefined ? false : true;

        let fees = Constants.getCurrentWalletProperties();
        this.currencyText = fees.currencyText;
        this.btcText = fees.btcText;
        this.priceText = this.priceText.replace('Coin', this.btcText);
        this.numberOfBTCText = this.numberOfBTCText.replace('Coin', this.btcText);

        this.sellForm = this.formBuilder.group({
            numberOfBTC: ['', Validators.required],
            pricePerBTC: ['', Validators.required],
            amountToRecieve: ['', Validators.required],
            beneficiaryAccountNumber: ['', Validators.required],
            beneficiaryBank: ['', Validators.required],
            password: ['', Validators.required],
            acceptedPaymentMethods: ['', Validators.required]
        });

        this.ls = new StorageService(this.storage);
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
        let app = this;
        setTimeout(function () {
            //Wait for sometimes for storage to be ready
            app.loading.dismiss();

        }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);
    }

    ionViewDidLoad() {
        Console.log('ionViewDidLoad SellBitPage');
        this.loadRate();
        this.loadBalanceFromStorage();
        this.populateBeneficiaryInformation();
    }

    populateBeneficiaryInformation() {
        this.sellForm.controls.beneficiaryAccountNumber.setValue(this.ls.getItem('accountNumber'));
        this.sellForm.controls.beneficiaryBank.setValue(this.ls.getItem("bank"));
    }

    sellBit() {
        let isValid = false;
        let sb = this.sellForm.value;
        let balance = +this.ls.getItem(Constants.WORKING_WALLET + "confirmedAccountBalance");
        let price = +sb.pricePerBTC;
        let password = sb.password;
        let coinAmount = +sb.numberOfBTC;

        let fees = Constants.getCurrentWalletProperties();

        let xendFees = coinAmount * +fees.xendFees;
        let blockFees = fees.blockFees;

        if (coinAmount === 0) {
            Constants.showLongToastMessage(Constants.properties['amount.zero.info'], this.toastCtrl);
        } else if (!this.isOwner && sb.beneficiaryBank === "") {
            Constants.showLongToastMessage(Constants.properties['beneficiary.bank.warning'], this.toastCtrl);
        } else if (price === 0) {
            Constants.showLongToastMessage(Constants.properties['price.zero.info'], this.toastCtrl);
        } else if (!this.isOwner && sb.beneficiaryAccountNumber === '') {
            Constants.showLongToastMessage(Constants.properties['beneficiary.account.number.invalid.message'], this.toastCtrl);
        } else if (password !== this.ls.getItem("password")) {
            Constants.showLongToastMessage(Constants.properties['password.invalid.message'], this.toastCtrl);
        } else if (coinAmount + xendFees + blockFees > balance) {
            Constants.showPersistentToastMessage(Constants.properties['insufficient.bitcoin.balance'], this.toastCtrl);
        } else if (sb.acceptedPaymentMethods === "") {
            Constants.showPersistentToastMessage("Please specify accepted payment methods", this.toastCtrl);
        } else {
            isValid = true;
        }

        if (isValid) {            
            let beneficiaryAccountNumber = this.isOwner ? this.ls.getItem('accountNumber') : sb.beneficiaryAccountNumber;
            let beneficiaryBank = this.isOwner ? this.ls.getItem('bankCode') : sb.beneficiaryBank;

            this.beneficiaryData.beneficiaryBank = beneficiaryBank;
            this.beneficiaryData.beneficiaryAccountNumber = beneficiaryAccountNumber;

            let data = {
                beneficiaryBank: beneficiaryBank,
                beneficiaryAccountNumber: beneficiaryAccountNumber
            }

            this.confirmBeneficiary(data);
        }
    }

    presentActionSheet(beneficiaryName) {
        let actionSheet = this.actionSheetCtrl.create({
            title: Constants.properties['continue'] + '?',
            buttons: [
                {
                    text: beneficiaryName,
                    handler: () => {
                        this.continue();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }

    confirmBeneficiary(data) {
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);

        let url = Constants.RESOLVE_ACCOUNT_URL;
        let postData = {
            bankCode: data.beneficiaryBank,
            accountNumber: data.beneficiaryAccountNumber
        };

        this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            if (responseData.response_text === "success") {
                this.beneficiaryName = responseData.account_name;
                this.loading.dismiss();
                this.presentActionSheet(this.beneficiaryName);
            } else {
                Constants.showPersistentToastMessage(Constants.properties['resolve.account.error'], this.toastCtrl);
                this.loading.dismiss();
            }
        }, error => {
            this.loading.dismiss();
            Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
        });
    }

    continue() {
        this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
        let sb = this.sellForm.value;
        let coinAmount = +sb.numberOfBTC;
        let beneficiaryAccountNumber = this.beneficiaryData.beneficiaryAccountNumber;
        let beneficiaryBank = this.beneficiaryData.beneficiaryBank;
        let password = sb.password;
        let amountToRecieve = +sb.amountToRecieve;

        let rate = +sb.pricePerBTC;

        let fees = Constants.getCurrentWalletProperties();

        let btcValue = coinAmount;

        let key = Constants.WORKING_WALLET + "Address";
        let sellerFromAddress = this.ls.getItem(key);
        let sellerToAddress = beneficiaryBank + ":" + beneficiaryAccountNumber;

        let postData = {
            amountToSell: btcValue,
            amountToRecieve: amountToRecieve,
            sellerFromAddress: sellerFromAddress,
            sellerToAddress: sellerToAddress,
            fromCoin: Constants.WORKING_WALLET,
            toCoin: sb.acceptedPaymentMethods.toString(),
            rate: rate,
            emailAddress: this.ls.getItem("emailAddress"),
            password: password,
            networkAddress: sellerFromAddress,
            currencyId: fees.currencyId
        }

        //this is wrong
        let url = Constants.POST_TRADE_URL;

        this.http.post(url, postData, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            this.clearForm();
            this.loading.dismiss();
            if (responseData.response_text === "success") {
                Constants.showPersistentToastMessage(Constants.properties['order.placed.available.soon'], this.toastCtrl);
            } else {
                Constants.showPersistentToastMessage(responseData.result, this.toastCtrl);
            }
        }, error => {
            this.loading.dismiss();
            Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
        });
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

    loadRate() {
        let fees = Constants.getCurrentWalletProperties();
        let tickerSymbol = fees.tickerSymbol;
        let url = Constants.GET_USD_RATE_URL + tickerSymbol;

        this.http.get(url, Constants.getHeader()).map(res => res.json()).subscribe(responseData => {
            this.usdRate = responseData.result.buy;
            this.btcRate = responseData.result.rate;
            this.btcToNgn = this.btcRate / this.usdRate;
            this.sellForm.controls.pricePerBTC.setValue(this.btcToNgn);
        }, error => {
            //doNothing
        });
    }

    loadBalanceFromStorage() {
        let key = Constants.WORKING_WALLET + "Address";
        this.networkAddress = this.ls.getItem(key);
        if (this.networkAddress !== null) {
            this.confirmedAccountBalance = this.ls.getItem(Constants.WORKING_WALLET + "confirmedAccountBalance");
        }
    }

    clearForm() {
        this.sellForm.controls.pricePerBTC.setValue("");
        this.sellForm.controls.numberOfBTC.setValue("");
        this.sellForm.controls.password.setValue("");
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

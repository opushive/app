import { Mnemonics } from './../utils/mnemonics';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { Console } from '../utils/console';
import { Platform, AlertController, NavController, NavParams, Loading, LoadingController, ToastController, IonicPage } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TabsPage } from '../tabs/tabs';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Storage } from '@ionic/storage';
import { StorageService } from '../utils/storageservice';
import Web3 from 'web3';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    splash = true;
    enableGuest = false;

    loginForm;
    loading: Loading;
    useFingerprint: boolean = true;

    passwordText: string;
    getHelpText: string;
    forgotPasswordText: string;
    loginText: string;
    emailAddressText: string;
    dontHaveAccountText: string;
    registerText: string;
    pageTitle: string;
    ls: StorageService;    

    emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    constructor(public storage: Storage, public alertCtrl: AlertController, public platform: Platform, public http: Http, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
        this.loginForm = formBuilder.group({
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            email: new FormControl({ value: '', disabled: true }),
            //email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(this.emailRegex), Validators.required])]
        });

        this.initProps();

        this.ls = new StorageService(this.storage);
        this.enableGuest = Constants.ENABLE_GUEST;

        let app = this;

        setTimeout(function () {
            app.loginForm.controls.email.setValue(app.ls.getItem("emailAddress"));
        }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);
    }

    ionViewDidLoad() {
        setTimeout(() => this.splash = false, 4000);
        this.useFingerprint = true;
        let faio: FingerprintAIO = new FingerprintAIO();
        faio.isAvailable().then(result => {
            this.useFingerprint = true;
        }, error => {
            //this.useFingerprint = false;
        });
        Console.log('ionViewDidLoad LoginPage');
    }

    ionViewDidEnter() {
    }

    login() {
        let isValid = false;
        let rf = this.loginForm.value;

        if (this.loginForm.valid) {
            isValid = true;
        } else {
            Constants.showLongToastMessage(Constants.properties['password.invalid.message'], this.toastCtrl);
        }

        if (isValid) {
            this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
            let emailAddress = this.ls.getItem('emailAddress');
            let password = rf.password;
            this.ls.setItem('emailAddress', emailAddress);
            this.ls.setItem('password', password);
            this.loginOnServer(password, emailAddress);
        }
    }

    postKYCInfoToBlockchain(password, emailAddress) {
        let url = Constants.ADD_KYC_URL;
        let mnemonicCode = Constants.normalizeMnemonicCode(this.ls);
        let xendNetworkAddress = this.ls.getItem('XNDAddress');
        let requestData = {
            emailAddress: emailAddress,
            password: password,
            passphrase: mnemonicCode,
            networkAddress: xendNetworkAddress
        };

        this.http.post(url, requestData, Constants.getHeader())
            .map(res => res.json())
            .subscribe(responseData => { }, error => { });
    }

    guest() {
        this.ls.setItem('isGuest', true);
        this.ls.setItem("lastLoginTime", new Date().getTime() + "");
        StorageService.ACCOUNT_TYPE = "ADVANCED";
        this.ls.setItem("accountType", "ADVANCED");
        // StorageService.ACCOUNT_TYPE = "BASIC";
        // this.ls.setItem("accountType", "BASIC");        
        if (this.ls.getItem('mnemonic') === undefined) {
            let guestEmail = "guest-" + Math.ceil(Math.random() * 1000000000) + "@xendbit.com";
            this.ls.setItem('emailAddress', guestEmail);
            this.ls.setItem('password', 'guest');
            this.ls.setItem('accountNumber', '0109998058');
            this.ls.setItem('bankCode', '058');
            Mnemonics.generateMnemonic(this.ls, this.loading, this.loadingCtrl, this.toastCtrl, this.navCtrl, this.http);
        } else {
            this.navCtrl.push(TabsPage);
        }
    }

    loginOnServer(password, emailAddress) {
        this.ls.setItem('isGuest', false);
        this.ls.setItem('emailAddress', emailAddress);
        this.ls.setItem('password', password);
        let url = Constants.LOGIN_URL;
        let ls = this.ls;
        let key = Constants.WORKING_WALLET + "Address";
        let mnemonicCode = Constants.normalizeMnemonicCode(ls);

        let requestData = {
            emailAddress: emailAddress,
            password: password,
            networkAddress: this.ls.getItem(key),
            passphrase: mnemonicCode            
        };

        this.http.post(url, requestData, Constants.getHeader())
            .map(res => res.json())
            .subscribe(responseData => {
                if (responseData.response_text === "success") {
                    this.loading.dismiss();
                    let user = responseData.result.user;
                    let walletType = user['walletType'];
                    ls.setItem('walletType', walletType);
                    ls.setItem("lastLoginTime", new Date().getTime() + "");
                    StorageService.ACCOUNT_TYPE = user.accountType;
                    StorageService.IS_BENEFICIARY = user.beneficiary;
                    ls.setItem("accountType", user.accountType);

                    try {
                        ls.setItem("accountNumber", user.kyc.accountKYC.bankAccountNumber);
                        ls.setItem("bankCode", user.kyc.accountKYC.bankCode);
                    } catch (e) {
                        Console.log(e);
                    }
                    if (walletType === 'trader') {
                        this.postKYCInfoToBlockchain(password, emailAddress);
                        this.navCtrl.push(TabsPage);
                    } else {
                        Console.log('We are coming');
                    }
                } else {
                    this.loading.dismiss();
                    Constants.showPersistentToastMessage(responseData.result, this.toastCtrl);
                }
            },
                error => {
                    this.loading.dismiss();
                    Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
                });

    }

    loginWithPrint() {
        //this.ethWallet();
        //this.deployContract();
        //0xd0e35b25607d4df00dfb35a8fe12da2cb2f4740499e83d15085b5f7bfae82489
        let ls = this.ls;
        let faio: FingerprintAIO = new FingerprintAIO();
        faio.show({
            clientId: "Fingerprint-Demo",
            clientSecret: "password", //Only necessary for Android
            disableBackup: false  //Only for Android(optional)
        })
            .then((result: any) => {
                this.loginForm.controls.password.setValue(ls.getItem("password"));
                this.login();
            })
            .catch((error: any) => {
                Console.log(error);
                Constants.showLongToastMessage(Constants.properties['fingerprint.invalid'], this.toastCtrl);
            });
    }

    register() {
        this.navCtrl.push('TermsPage');
    }

    initProps() {
        this.emailAddressText = Constants.properties['email'];
        this.passwordText = Constants.properties['wallet.password'];
        this.loginText = Constants.properties['login'];
        this.registerText = Constants.properties['register'];
        this.dontHaveAccountText = Constants.properties['dont.have.account'];
        this.pageTitle = Constants.properties['login.page.title'];
        this.forgotPasswordText = Constants.properties['forgot.password'];
        this.getHelpText = Constants.properties['get.help'];        
    }

    deployContract() {
        let web3 = new Web3(new Web3.providers.HttpProvider(Constants.GETH_PROXY));
        let abi = Constants.ABI;

        Console.log(abi);

        let code = Constants.CODE;

        Console.log(code);

        let SampleContract = web3.eth.contract(abi);

        var password = "Wq017kmg@tm";
        try {
            Console.log("Unlocking Account");
            web3.personal.unlockAccount('0xb812082dd702a53ec36c874a49480f3991043aed', password);
            Console.log("Account Unlocked Successfully");
        } catch (e) {
            Console.log(e);
            return;
        }

        Console.log("Deploying the contract");
        let contract = SampleContract.new({ from: '0xb812082dd702a53ec36c874a49480f3991043aed', gas: 1000000, data: code });
        Console.log("Your contract is being deployed in transaction at http://rinkeby.etherscan.io/tx/" + contract.transactionHash);
    }
}

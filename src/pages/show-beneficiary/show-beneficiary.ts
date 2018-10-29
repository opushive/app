import { Storage } from '@ionic/storage';
import { StorageService } from './../utils/storageservice';
import { Console } from './../utils/console';
import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController, ViewController, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ShowBeneficiaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage() 
@Component({
  selector: 'page-show-beneficiary',
  templateUrl: 'show-beneficiary.html',
})
export class ShowBeneficiaryPage {

  ls: StorageService;
  dateRegistered = "";
  beneficiary;
  dataImage = "";
  loading: Loading;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage) {
    this.beneficiary = Constants.registrationData['beneficiary'];
    Console.log(this.beneficiary);
    this.dateRegistered = new Date(this.beneficiary.dateRegistered).toLocaleString();    

    this.ls = new StorageService(this.storage);
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    let app = this;
    setTimeout(function () {
      //Wait for sometimes for storage to be ready
      app.loading.dismiss();
      app.loadImage(app.beneficiary);
    }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);    
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad ShowBeneficiaryPage');
  }

  makeDonation() {
    Console.log('makeDonation');
    this.viewCtrl.dismiss();    
    Constants.registrationData['viewBeneficiaries'].navCtrl.push('DonatePage');
  }

  disposeDialog() {
    this.viewCtrl.dismiss();
  }

  loadImage(beneficiary) {
    Console.log("loadImage called");
    let url = Constants.GET_IMAGE_URL;
    let key = Constants.WORKING_WALLET + "Address";

    Console.log(beneficiary.kyc.accountKYC.proofOfIdentity);

    let requestData = {
      password: this.ls.getItem("password"),
      networkAddress: this.ls.getItem(key),
      emailAddress: this.ls.getItem("emailAddress"),
      idImage: beneficiary.kyc.accountKYC.proofOfIdentity
    }

    this.http.post(url, requestData, Constants.getHeader()).map(res => res.json()).subscribe(
      responseData => {
        Console.log(responseData);
        this.dataImage = 'data:image/jpeg;base64,' + responseData.result;
      }, error => {
        Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
      }
    )    
  }  
    

}
import { Constants } from './../utils/constants';
import { Storage } from '@ionic/storage';
import { StorageService } from './../utils/storageservice';
import { Console } from './../utils/console';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController, ModalController, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ViewBeneficiariesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-view-beneficiaries',
  templateUrl: 'view-beneficiaries.html',
})
export class ViewBeneficiariesPage {

  ls: StorageService;
  loading: Loading;
  beneficiaries = [];

  constructor(public loadingCtrl: LoadingController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public modalCtrl: ModalController) {
    this.ls = new StorageService(this.storage);
    this.loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);
    let app = this;
    setTimeout(function () {
      //Wait for sometimes for storage to be ready
      app.loading.dismiss();
    }, Constants.WAIT_FOR_STORAGE_TO_BE_READY_DURATION);    
  }

  ionViewDidEnter(){
    this.loadBeneficiaries();
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad ViewBeneficiariesPage');
  }

  loadBeneficiaries(): any {
    let url = Constants.LOAD_BENEFICIARIES_URL;
    let key = Constants.WORKING_WALLET + "Address";

    let requestData = {
      password: this.ls.getItem("password"),
      networkAddress: this.ls.getItem(key),
      emailAddress: this.ls.getItem("emailAddress")      
    }

    let loading = Constants.showLoading(this.loading, this.loadingCtrl, Constants.properties['loading.dialog.text']);

    this.http.post(url, requestData, Constants.getHeader()).map(res => res.json()).subscribe(
      responseData => {
        loading.dismiss();
        this.beneficiaries = responseData['result'];
        Console.log(responseData);
      }, error => {
        loading.dismiss();
        Constants.showAlert(this.alertCtrl, "Server unavailable", "The server is temporarily unable to service your request due to maintenance downtime");
      }
    )
  }

  showDetails(beneficiary) {
    Constants.registrationData['beneficiary'] = beneficiary;
    Constants.registrationData['viewBeneficiaries'] = this;
    let modal = this.modalCtrl.create('ShowBeneficiaryPage',{},{showBackdrop:true, enableBackdropDismiss:true});
    modal.present();     
  }
}
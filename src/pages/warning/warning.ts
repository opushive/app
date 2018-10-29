import { Constants } from './../utils/constants';
import { Component } from '@angular/core';
import {Console} from '../utils/console';
import { NavController, NavParams, IonicPage } from 'ionic-angular';


/*
  Generated class for the Warning page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-warning',
  templateUrl: 'warning.html'
})
export class WarningPage {

 pageTitle: string;
 imReadyText: string;
 warning1Text: string;
 warning2Text: string;
 warning3Text: string;
 warning4Text: string;
 takeNoteText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageTitle = Constants.properties['warning.page.title'];
    this.imReadyText = Constants.properties['i.am.ready'];
    this.warning1Text = Constants.properties['warning.1'];
    this.warning2Text = Constants.properties['warning.2'];
    this.warning3Text = Constants.properties['warning.3'];
    this.warning4Text = Constants.properties['warning.4'];
    this.takeNoteText = Constants.properties['take.not'];
  }

  ionViewDidLoad() {
    Console.log('ionViewDidLoad WarningPage');
  }

  ready() {
   this.navCtrl.push('CreateMnemonicPage', { 'mnemonic': '', 'shouldRegister': false, 'fromTabs': false }); 
  }

}

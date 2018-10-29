import { TabsPage } from './../tabs/tabs';
import { Console } from './console';
import { StorageService } from './storageservice';
import { Http } from '@angular/http';
import { Constants } from './constants';
import { Loading, LoadingController, ToastController, NavController } from "ionic-angular";
import 'rxjs/add/operator/map';
import { HDNode } from 'bitcoinjs-lib';
import { mnemonicToSeed } from 'bip39';

declare var genwallet: any;

export class Mnemonics {
  
  static generateMnemonic(ls: StorageService, loading: Loading, loadingCtrl: LoadingController, toastCtrl: ToastController, navCtrl: NavController, http: Http) {
        loading = Constants.showLoading(loading, loadingCtrl, Constants.properties['loading.dialog.text']);
        let generateAnotherMnemonic = true;
        while (generateAnotherMnemonic) {
          let result = genwallet();         
          let splitted = result.mnemonic.split(" ").splice(0, 12);
          let wordCount = {};
          generateAnotherMnemonic = false;
          for (let x of splitted) {
            let count = wordCount[x];
            if (count === undefined) {
              wordCount[x] = 1;
            } else {
              //if it's not undefined, then we have duplicate word, so generate another
              generateAnotherMnemonic = true;
              break;
            }
          }

          let postData = {
            passphrase: splitted.join(' ')
          };

          Console.log(postData);

          http.post(Constants.GET_13TH_WORD, postData, Constants.getHeader()).map(res => res.json()).subscribe(
            responseData => {
              loading.dismiss();
              if (responseData.response_code == 0) {
                let lastWord = responseData.result;
                let fullMnemonic = result.mnemonic + " " + lastWord;
                let mnemonicCode = splitted.join(' ');
                var hd = HDNode.fromSeedBuffer(mnemonicToSeed(mnemonicCode), Constants.NETWORK).derivePath("m/0/0/0");

                ls.setItem('BTCAddress', hd.getAddress());
                ls.setItem('mnemonic', fullMnemonic);
                Constants.xndWallet(ls, loading, loadingCtrl, http, toastCtrl, 'XND');
                Constants.xndWallet(ls, loading, loadingCtrl, http, toastCtrl, 'NXT');
                Constants.xndWallet(ls, loading, loadingCtrl, http, toastCtrl, 'ARDR');
                Constants.xndWallet(ls, loading, loadingCtrl, http, toastCtrl, 'IGNIS');
                navCtrl.push(TabsPage);
              } else {
                throw(responseData.response_text);
              }
            },
            error => {
              loading.dismiss();
              throw (error);
            }
          );
        }
      }
}

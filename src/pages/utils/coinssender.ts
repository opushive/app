import {HDNode, TransactionBuilder} from 'bitcoinjs-lib';
import {mnemonicToSeed} from 'bip39';
import {Console} from './console';
import {Constants} from './constants';
import Web3 from 'web3';

export class CoinsSender {

    static sendCoinsXnd(data, successCall, errorCall, fees) {
        let amount = data['amount'];
        let recipientAddress = data['recipientAddress'];
        let loading = data['loading'];
        let loadingCtrl = data['loadingCtrl'];
        let ls = data['ls'];
        let toastCtrl = data['toastCtrl'];
        let http = data['http'];
        let password = ls.getItem('password');
        let brokerAccount = data['brokerAccount'];

        loading = Constants.showLoading(loading, loadingCtrl, Constants.properties['loading.dialog.text']);        
        let mnemonicCode = Constants.normalizeMnemonicCode(ls);        

        let val = Math.round(+amount * +fees.multiplier)        
        let xendFees = (amount * +fees.xendFees * +fees.multiplier);
        let xendAddress = fees.xendAddress;

        Console.log(fees);
        Console.log(val);
        Console.log(xendFees);
        Console.log(fees.multiplier);

        let url = Constants.PUSH_TX_URL;

        let requestData = {
            emailAddress: ls.getItem("emailAddress"),
            password: password,
            toAddress: recipientAddress,
            btcValue: val,
            passphrase: mnemonicCode,
            currencyId: fees.currencyId,
            equityId: fees.equityId,
            xendFees: xendFees,
            xendAddress: xendAddress,
            brokerAccount: brokerAccount,
            networkAddress: ls.getItem("XNDAddress")
        };

        http.post(url, requestData, Constants.getWalletHeader(fees.btcText)).map(res => res.json()).subscribe(responseData => {
            loading.dismiss();
            if (responseData.result.broadcasted === true) {
                Constants.showLongerToastMessage("Transaction Successful. The assets have been transfered.", toastCtrl);
                successCall(data);
            }

            if ("errorDescription" in responseData.result) {
                Constants.showLongerToastMessage(responseData.result.errorDescription, toastCtrl);
                errorCall(data);
            }
        }, error => {
            loading.dismiss();
            errorCall(data);
            Constants.showLongerToastMessage(error, toastCtrl);
        });
    }

    //static sendCoinsEth(data, amount, recipientAddress, password) {
    static sendCoinsEth(data, successCall, errorCall, coin) {
        let amount = data['amount'];
        let recipientAddress = data['recipientAddress'];
        let loading = data['loading'];
        let loadingCtrl = data['loadingCtrl'];
        let ls = data['ls'];
        let toastCtrl = data['toastCtrl'];
        //let http = data['http'];
        //let password = ls.getItem('password');

        loading = Constants.showLoading(loading, loadingCtrl, Constants.properties['loading.dialog.text']);

        let mnemonicCode = Constants.normalizeMnemonicCode(ls);

        let privateKey = ls.getItem('ETHPrivateKey');

        let fees = Constants.getWalletProperties(coin);

        let web3 = new Web3(new Web3.providers.HttpProvider(Constants.GETH_PROXY));

        var contractAddress = fees.contract;
        var xendContract = web3.eth.contract(Constants.ABI);
        var instance = xendContract.at(contractAddress);

        let key = coin + "Address";
        let sender = ls.getItem(key);


        try {
            web3.personal.importRawKey(privateKey, mnemonicCode);
        } catch (e) {
            //Console.log(e);
        }

        try {
            web3.personal.unlockAccount(sender, mnemonicCode);
        } catch (e) {
            errorCall(data);
            loading.dismiss();
            Constants.showLongerToastMessage("An error occurred sending your ether", toastCtrl);
            return;
        }

        let val = +amount * +fees.multiplier
        let xendFees = (+amount * +fees.xendFees) * +fees.multiplier

        Console.log(fees);
        Console.log(val);
        Console.log(xendFees);
        Console.log(fees.multiplier);

        try {
            instance.send(recipientAddress, xendFees, {value: val, from: sender}, function (err, result) {
                if (err) {
                    errorCall(data);
                    loading.dismiss();
                    Constants.showLongerToastMessage("An error occurred sending your ether", toastCtrl);
                }

                if (result) {
                    successCall(data);
                    loading.dismiss();
                    web3.personal.lockAccount(sender, mnemonicCode);
                    Constants.showLongerToastMessage("Transaction Successful. The coins have been transfered.", toastCtrl);
                }
            });
        } catch (e) {
            errorCall(data);
            loading.dismiss();
            Constants.showLongerToastMessage("An error occurred sending your ether", toastCtrl);
        }
    }

    static sendCoinsBtc(data, successCall, errorCall, coin, fromAddress, network) {
        Console.log("sendCoinsBtc");
        let fees = Constants.getWalletProperties(coin);
        let amount: number = +data['amount'];
        let recipientAddress = data['recipientAddress'];
        let loading = data['loading'];
        let loadingCtrl = data['loadingCtrl'];
        let ls = data['ls'];
        let toastCtrl = data['toastCtrl'];
        let http = data['http'];
        let password = ls.getItem('password');

        let xendFees = (amount * +fees.xendFees);

        loading = Constants.showLoading(loading, loadingCtrl, Constants.properties['loading.dialog.text']);
        let url = Constants.GET_UNSPENT_OUTPUTS_URL + fromAddress;
        let amountToSend: number = amount + xendFees + +fees.blockFees;
        let postData = {
            btcValue: amountToSend
        };

        http.post(url, postData, Constants.getWalletHeader(coin)).map(res => res.json()).subscribe(responseData => {
            if (responseData.response_text === "error") {
                loading.dismiss();
                Constants.showLongerToastMessage(responseData.result, toastCtrl);
                errorCall(data);
            } else {
                var hd = HDNode.fromSeedBuffer(mnemonicToSeed(ls.getItem('mnemonic').trim()), network).derivePath("m/0/0/0");
                var keyPair = hd.keyPair;
                var txb = new TransactionBuilder(network);
                var utxos = responseData.result;
                let sum = 0;
                for (let utxo in utxos) {
                    txb.addInput(utxos[utxo]['hash'], utxos[utxo]['index']);
                    sum = sum + +utxos[utxo]['value'];
                }                                

                amount = Math.trunc(amount * +fees.multiplier);
                xendFees = Math.trunc(xendFees * +fees.multiplier);
                sum = Math.trunc(sum * +fees.multiplier);
                let blockFees = Math.trunc(+fees.blockFees * +fees.multiplier);
                let change = Math.trunc(sum - amount - blockFees - xendFees); 

                Console.log(fees);
                Console.log(sum);
                Console.log(amount);
                Console.log(xendFees);
                Console.log(fees.multiplier);
                Console.log(change);        

                txb.addOutput(recipientAddress, amount);
                txb.addOutput(fees.xendAddress, xendFees);
                txb.addOutput(fromAddress, change);

                let index = 0;
                for (let utxo in utxos) {
                    txb.sign(index, keyPair);
                    index = index + 1;
                }

                let hex = txb.build().toHex();
                CoinsSender.submitTx(data, coin, hex, password, loading, successCall, errorCall);
            }
        }, error => {
            loading.dismiss();
            Constants.showLongerToastMessage("Error getting your transactions", toastCtrl);
            errorCall(data);
        });
    }

    static submitTx(data, coin, hex, password, loading, successCall, errorCall) {
        let ls = data['ls'];
        let http = data['http'];
        let toastCtrl = data['toastCtrl'];
        let url = Constants.PUSH_TX_URL;
        let requestData = {
            emailAddress: ls.getItem("emailAddress"),
            password: password,
            "transactionHex": hex
        };

        http.post(url, requestData, Constants.getWalletHeader(coin)).map(res => res.json()).subscribe(responseData => {
            loading.dismiss();
            if (responseData.result.response_text !== "success") {
                errorCall(data);
                Constants.showLongerToastMessage(responseData.result.error.message, toastCtrl);
            } else {
                successCall(data);
                Constants.showLongerToastMessage("Transaction Successful. The coins have been transfered.", toastCtrl);
            }
        }, error => {
            errorCall(data);
            loading.dismiss();
            Constants.showLongerToastMessage(error, toastCtrl);
        });
    }

}
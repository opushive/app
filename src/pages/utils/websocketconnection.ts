import { Constants } from './constants';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { Console } from './console';

export class WSConnection {
    static startListeningForNotifications(home) {
        let app = home;
        Console.log(Constants.NOTIFICATION_SOCKET_URL);
    
        let ws = new $WebSocket(Constants.NOTIFICATION_SOCKET_URL);
        let data = {
          "emailAddress": app.emailAddress,
          "action": "setEmailAddress",
        };
    
        ws.connect(true);
    
        Constants.properties['ws_connection'] = ws;
    
        ws.send(Constants.encryptData(JSON.stringify(data))).subscribe((data) => {
          //doNothing
        }, (error) => {
          //doNothing
        }, () => {
          //doNothing
        });
    
        Console.log("Connected: OKAY");
        Constants.properties['ws_connection'] = ws;
  
        // Log messages from the server
        ws.onMessage((msg: MessageEvent) => {
          Console.log(msg.data);
          let message = JSON.parse(msg.data);
          Console.log(message);
          if (message['action'] === 'startTrade') {
            Constants.startTrade(message, app, ws);
            app.localNotifications.hasPermission().then((value) => {
              app.localNotifications.schedule({
                id: 1,
                title: "Xendbit: Start Trade",
                text: message['message'],
                data: { secret: "key" }
              });
            }, error => {
              //doNothing
            })
          } else if(message['action'] === 'notOnline') {
            Constants.showAlert(app.alertCtrl, "User not online", "The user is not online");            
          } else if (message['action'] === 'accountNotApproved') {
            Constants.showAlert(app.alertCtrl, "Account Error", message['message']);
          } else if (message['action'] === 'cancelTrade') {
            Constants.showAlert(app.alertCtrl, "Trade Cancelled", "User cancelled the trade");
          } else if(message['action'] === 'sendCoinsToSeller') {
            Constants.sendCoinsToSeller(message, app, ws, message['buyerOtherAddress']);     
          } else if(message['action'] === 'paySeller') {            
            Constants.paySeller(message, app.navCtrl);
          } else if(message['action'] === 'errorSendingToSeller') {      
            Constants.showAlert(app.alertCtrl, "Urgent!!!", "We can not send coins to the seller from your wallet, even though the seller has sent coins to you. Please make sure you have sufficient balance. We will retry again in about 5 mins. Thank you");
          } else if(message['action'] === 'success') {
            Constants.showLongerToastMessage("Trade Successful. Please refresh page to see new balance", app.toastCtrl);
          } else if(message['action'] === 'buyerConfirmedBankPayment') {  
            let alertMessage = "Buyer " + message['buyerFullname'] + " notified that they have paid you " + message['amountToRecieve'] + " for your " + message['fromCoin'] + " Please check your bank for confirmation. You have to go to My Sell Orders on the home page and click on confirm (to release the coins to they buyer) once you get confirmation from the bank that the money has been paid."
            Constants.showAlert(app.alertCtrl, "Buyer Paid You", alertMessage);
          } else if(message['action'] === 'provideAddressToDonor') {  
            Constants.askBeneficiaryForAddress(message, app);
          } else if(message['action'] === 'addressProvidedToDonor') {  
            let donatePage = Constants.properties['donatePage'];
            let coin = message['coin'];
            donatePage.donateForm.controls.networkAddress.setValue(message['address']);
            Constants.showAlert(donatePage.alertCtrl, 'Success', 'Beneficiary provided his ' + coin + " address. Now you can proceed to send the coins");
          } else {
            Console.log("Unknown Message " + msg.data + " recieved");
          }
        },
          { autoApply: false }
        );
      }
        
}
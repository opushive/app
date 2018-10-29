import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { StartPage } from '../pages/start/start';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

 rootPage: any;
  constructor(public splashScreen: SplashScreen, public stBar: StatusBar, public platform: Platform) {
    var app = this;      
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.            
      //this.loadSettings(app);
      stBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();            
        app.rootPage = StartPage;
      }, 5000);      
    });
  }
}

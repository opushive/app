import {Config, browser} from 'protractor';
import * as tsNode from 'ts-node';
import * as path from 'path';

const serverAddress = 'http://localhost:4723/wd/hub';
const testFilePAtterns: Array<string> = [
  'specs/**/*.e2e-spec.ts'
];
const packageName = "com.xendbit";
const iPhoneXCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  app: path.resolve(__dirname, '../platforms/ios/build/emulator/superApp.app'),
  version: '11.4',
  platform: 'iOS',
  deviceName: 'iPhone X',
  platformName: 'iOS',
  name: 'IOStest',
  automationName: 'XCUITest',
  nativeWebTap: 'true'
};
const androidPixel2XLCapability = {
  browserName: '',
  name: 'Androidtest',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  platformName: 'Android',
  deviceName: 'pixel',
  // app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/armv7/debug/android-armv7-debug.apk'),
  // app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/x86/debug/android-x86-debug.apk'),
  app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/debug/android-debug.apk'),
  appPackage: packageName,
  appActivity: 'MainActivity',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  chromedriverExecutableDir: path.resolve(__dirname, 'chrome-drivers/'),
  // androidDeviceSocket: packageName + "_devtools_remote",
  // chromeOptions: {
  //   androidDeviceSocket: packageName + "_devtools_remote"
  // },
  newCommandTimeout: 300000
};

export let config: Config = {

  framework: 'custom',
  specs: [
    path.resolve(__dirname,'../features/**/*.feature') // accepts a glob
  ],
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    // require step definitions
    require: [
      path.resolve(__dirname,'/definitions/**/*.steps.ts') // accepts a glob
    ]
  },
  baseUrl: '',
  multiCapabilities: [
    androidPixel2XLCapability,
    // iPhoneXCapability
  ],
  allScriptsTimeout: 15000,
  seleniumAddress: serverAddress,
  onPrepare: () => {
    tsNode.register({
      project: 'e2e/tsconfig.e2e.json'
    });
    browser.waitForAngularEnabled(false)
  }
};
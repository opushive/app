import {Config, browser} from 'protractor';
import * as tsNode from 'ts-node';
import * as path from 'path';

// const serverAddress = 'http://localhost:4723/wd/hub';
const serverAddress = 'http://hub-cloud.browserstack.com/wd/hub';
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
const browseStack = {
  browserName: '',
  readDevice: true,
  // 'browserstackUser': 'opusadmin1',
  // 'browserstackKey': '1ij5JKBFjzfqymrQQv4v',
  'browserstack.user' : 'opusadmin1',
  'browserstack.key' : '1ij5JKBFjzfqymrQQv4v',
  'build' : 'Node Android',
  'name': 'single_test',
  // 'app' : 'bs://<hashed app-id>',
  'browserstack.debug' : true,
  'device' : 'Google Nexus 6',
  'os_version' : '6.0',
  "app":"bs://4a5a0252f554044ceb2bd1b9b5ce6ca9fb5f4840",
  // name: 'Androidtest',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  platformName: 'Android',
  // device: 'Galaxy S6',
  // os_version: '5.0',
  // deviceName: 'samsung',
  // app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/armv7/debug/android-armv7-debug.apk'),
  // app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/x86/debug/android-x86-debug.apk'),
  // app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/debug/android-debug.apk'),
  appPackage: packageName,
  // appActivity: 'MainActivity',
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

  specs: testFilePAtterns,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  // framework: 'custom',
  // specs: [
  //   path.resolve(__dirname,'../features/**/*.feature') // accepts a glob
  // ],
  // frameworkPath: require.resolve('protractor-cucumber-framework'),
  // cucumberOpts: {
  //   // require step definitions
  //   require: [
  //     path.resolve(__dirname,'/definitions/**/*.steps.js') // accepts a glob
  //   ]
  // },
  baseUrl: '',
  multiCapabilities: [
    // androidPixel2XLCapability,
    // iPhoneXCapability,
    browseStack
  ],
  allScriptsTimeout: 15000,
  resultJsonOutputFile: './Report.json',
  seleniumAddress: serverAddress,
  onPrepare: () => {
    tsNode.register({
      project: 'e2e/tsconfig.e2e.json'
    });
    browser.waitForAngularEnabled(false)
  }
};
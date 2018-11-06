import {Config} from 'protractor';
import * as tsNode from 'ts-node';
import * as path from 'path';

const serverAddress = 'http://localhost:4723/wd/hub';
const testFilePAtterns: Array<string> = [
  '../tests/**/*/*.e2e-spec.ts'
];
const iPhoneXCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  app: path.resolve(__dirname, '../platforms/ios/build/emulator/superApp.app'),
  version: '11.4',
  platform: 'iOS',
  deviceName: 'iPhone X',
  platformName: 'iOS',
  name: 'My First Mobile Test',
  automationName: 'XCUITest',
  nativeWebTap: 'true'
};
const androidPixel2XLCapability = {
  browserName: '',
  autoWebview: true,
  autoWebviewTimeout: 20000,
  platformName: 'Android',
  deviceName: 'pixel',
  // app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/armv7/debug/android-armv7-debug.apk'),
  app: path.resolve(__dirname, '../platforms/android/build/outputs/apk/x86/debug/android-x86-debug.apk'),
  'app-package': 'com.xendbit',
  'app-activity': 'MainActivity',
  autoAcceptAlerts: 'true',
  autoGrantPermissions: 'true',
  newCommandTimeout: 300000
};

export let config: Config = {
  allScriptsTimeout: 11000,
  specs: testFilePAtterns,
  baseUrl: '',
  multiCapabilities: [
    androidPixel2XLCapability,
    // iPhoneXCapability
  ],
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  seleniumAddress: serverAddress,
  onPrepare: () => {
    tsNode.register({
      project: 'e2e/tsconfig.e2e.json'
    });
  }
};
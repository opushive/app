"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var tsNode = require("ts-node");
var path = require("path");
var serverAddress = 'http://localhost:4723/wd/hub';
var testFilePAtterns = [
    'specs/**/*.e2e-spec.ts'
];
var packageName = "com.xendbit";
var iPhoneXCapability = {
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
var androidPixel2XLCapability = {
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
exports.config = {
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
        androidPixel2XLCapability,
    ],
    allScriptsTimeout: 15000,
    seleniumAddress: serverAddress,
    onPrepare: function () {
        tsNode.register({
            project: 'e2e/tsconfig.e2e.json'
        });
        protractor_1.browser.waitForAngularEnabled(false);
    }
};
//# sourceMappingURL=protractor.config.js.map
import {browser, by, element, ElementFinder, protractor} from 'protractor';

describe('App', () => {
  describe('Start Screen', () => {
    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('should see the register new account button', async () => {
      const registerButton: ElementFinder = await element(by.buttonText('Register New Account'));
      
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(registerButton));
      // const registerButtonLabel: string = await registerButton.getText();
      // expect(registerButtonLabel).toEqual('Register New Account');
      const registerButtonPresent = await registerButton.isPresent();
      expect(registerButtonPresent).toBeTruthy("Register New Account Button should be Present on Start page");

      await registerButton.click();

      // const IAcceptBtn: ElementFinder = await element(by.partialButtonText('I Accept'));
      // expect(registerButton.isPresent()).toBeTruthy("I Agree Button should be Present on Terms page");
      // await browser.wait(protractor.ExpectedConditions.elementToBeClickable(IAcceptBtn));
      // // const IAcceptBtnLabel: string = await IAcceptBtn.getText();
      // // expect(loginBtnLabel).toEqual('SIGN IN');

      // IAcceptBtn.click();
      // const createAdvWalletBtn: ElementFinder = await element(by.partialButtonText('Create Advance Wallet'));
      // expect(createAdvWalletBtn.isPresent()).toBeTruthy("I should see the create Advance Wallet button");
    });

    it('should be able to accept agreement', async () => {
      // const registerButton: ElementFinder = element(by.buttonText('Register New Account'));
      // await browser.wait(protractor.ExpectedConditions.elementToBeClickable(registerButton));
      // const registerButtonLabel: string = await registerButton.getText();
      // expect(registerButtonLabel).toEqual('Register New Account');

      // registerButton.click();

      const IAcceptBtn: ElementFinder = await element(by.partialButtonText('I Accept'));
      expect(IAcceptBtn.isPresent()).toBeTruthy("I Agree Button should be Present on Terms page");
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(IAcceptBtn));
      // const IAcceptBtnLabel: string = await IAcceptBtn.getText();
      // expect(loginBtnLabel).toEqual('SIGN IN');

      IAcceptBtn.click();
      // const createAdvWalletBtn: ElementFinder = await element(by.partialButtonText('Create Advance Wallet'));
      // expect(createAdvWalletBtn.isPresent()).toBeTruthy("I should see the create Advance Wallet button");
    });

    it('should be able to create advanced wallet', async (/* doneFn */) => {
      // const registerButton: ElementFinder = element(by.buttonText('Register New Account'));
      // await browser.wait(protractor.ExpectedConditions.elementToBeClickable(registerButton));
      // const registerButtonLabel: string = await registerButton.getText();
      // expect(registerButtonLabel).toEqual('Register New Account');

      // registerButton.click();

      // const IAcceptBtn: ElementFinder = await element(by.partialButtonText('I Accept'));
      // expect(IAcceptBtn.isPresent()).toBeTruthy("I Agree Button should be Present on Terms page");
      // await browser.wait(protractor.ExpectedConditions.elementToBeClickable(IAcceptBtn));
      // // const IAcceptBtnLabel: string = await IAcceptBtn.getText();
      // // expect(loginBtnLabel).toEqual('SIGN IN');

      // IAcceptBtn.click();
      const createAdvWalletBtn: ElementFinder = await element(by.partialButtonText('Create Advanced Wallet'));
      const  createAdvWalletBtnPresent = await createAdvWalletBtn.isPresent()
      expect(createAdvWalletBtnPresent).toBeTruthy("I should see the 'Create Advance Wallet button'");
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(createAdvWalletBtn));
    });
  });
});
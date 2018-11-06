import {browser, by, element, ElementFinder, protractor} from 'protractor';

describe('App', () => {
  describe('Tutorial Screen', () => {
    it('should see the register new account button', async () => {
      const registerButton: ElementFinder = element(by.buttonText('Register New Account'));
      expect(registerButton.isPresent()).toBeTruthy("Register New Account Button should be Present on Start page");
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(registerButton));
      // const registerButtonLabel: string = await registerButton.getText();
      // expect(registerButtonLabel).toEqual('Register New Account');

      registerButton.click();

      const IAcceptBtn: ElementFinder = await element(by.partialButtonText('I Accept'));
      expect(registerButton.isPresent()).toBeTruthy("I Agree Button should be Present on Terms page");
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(IAcceptBtn));
      // const IAcceptBtnLabel: string = await IAcceptBtn.getText();
      // expect(loginBtnLabel).toEqual('SIGN IN');

      IAcceptBtn.click();
      const createAdvWalletBtn: ElementFinder = await element(by.partialButtonText('Create Advance Wallet'));
      expect(createAdvWalletBtn.isPresent()).toBeTruthy("I should see the create Advance Wallet button");
    });
  });
});
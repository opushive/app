import {browser, by, element, ElementFinder, protractor} from 'protractor';

describe('App', () => {
  describe('Tutorial Screen', () => {
    it('should skip to the welcome screen and have the correct button labels', async () => {
      const registerButton: ElementFinder = element(by.buttonText('Register New Account'));
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(registerButton));
      const registerButtonLabel: string = await registerButton.getText();
      expect(registerButtonLabel).toEqual('Register New Account');

      registerButton.click();

      const loginBtn: ElementFinder = await element(by.id('btn-login'));
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(loginBtn));
      const loginBtnLabel: string = await loginBtn.getText();
      expect(loginBtnLabel).toEqual('SIGN IN');

      loginBtn.click();
    });
  });
});
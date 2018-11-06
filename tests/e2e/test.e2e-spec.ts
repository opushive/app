import {browser, by, element, ElementFinder, protractor} from 'protractor';

describe('App', () => {
  describe('Tutorial Screen', () => {
    it('should skip to the welcome screen and have the correct button labels', async () => {
      const skipButton: ElementFinder = element(by.id('skip'));
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(skipButton));
      const skipButtonLabel: string = await skipButton.getText();
      expect(skipButtonLabel).toEqual('SKIP');

      skipButton.click();

      const loginBtn: ElementFinder = await element(by.id('btn-login'));
      await browser.wait(protractor.ExpectedConditions.elementToBeClickable(loginBtn));
      const loginBtnLabel: string = await loginBtn.getText();
      expect(loginBtnLabel).toEqual('SIGN IN');

      loginBtn.click();
    });
  });
});
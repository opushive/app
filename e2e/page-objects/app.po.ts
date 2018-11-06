import { browser, by, element } from 'protractor';

export class Page {

  navigateTo(destination) {
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getPageOneTitleText() {
    return element(by.tagName('page-start')).element(by.tagName('ion-title')).element(by.css('.toolbar-title')).getText();
  }
}

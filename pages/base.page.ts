import { type Locator, type Page } from '@playwright/test';
import type { BasketPage } from './basket.page';

export class BasePage {
  readonly page: Page;
  readonly yourBasket: Locator;
  readonly basketCount: Locator;
  readonly closeWelcomeBanner: Locator;
  readonly cookieConsent: Locator;
  readonly dismissCookieMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.yourBasket = page.getByRole('button', { name: 'Show the shopping cart' });
    this.basketCount = this.yourBasket.locator('span.warn-notification');
    this.closeWelcomeBanner = page.getByLabel('Close Welcome Banner');
    this.cookieConsent = page.locator('div[aria-label="cookieconsent"]');
    this.dismissCookieMessage = this.cookieConsent.getByRole('button', {
      name: 'dismiss cookie message',
    });
  }

  protected async dismissOverlays() {
    await this.closeWelcomeBanner.click({ timeout: 3_000 }).catch(() => {});
    await this.dismissCookieMessage.click({ timeout: 3_000 }).catch(() => {});
  }

  async openBasket(): Promise<BasketPage> {
    await this.yourBasket.click();
    const { BasketPage } = await import('./basket.page');
    const basket = new BasketPage(this.page);
    await basket.price.waitFor();
    return basket;
  }
}

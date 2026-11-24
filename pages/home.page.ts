import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ProductDetailsModal } from './modals/product-details.modal';

export class Product {
  readonly root: Locator;
  readonly name: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToBasketButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.name = root.locator('.name');
    this.price = root.locator('.price');
    this.image = root.locator('.image-container');
    this.addToBasketButton = root.getByRole('button', { name: 'Add to Basket' });
  }

  // Matched by product name: other snackbars (e.g. language change) can be on
  // screen at the same time, and a previous add's snackbar may still be showing.
  async addToBasket(): Promise<void> {
    const name = (await this.name.innerText()).trim();
    const confirmation = this.root
      .page()
      .locator('mat-snack-bar-container')
      .filter({ hasText: `Placed ${name} into basket` });
    await this.addToBasketButton.click();
    await confirmation.waitFor({ state: 'visible' });
  }

  async openDetails(): Promise<ProductDetailsModal> {
    await this.image.click();
    const details = new ProductDetailsModal(this.root.page());
    await details.waitUntilOpen();
    return details;
  }
}

export class HomePage extends BasePage {
  readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.products = page.locator('article.product');
  }

  async goto() {
    await this.page.goto('http://127.0.0.1:3000/#/');
    await this.dismissOverlays();
  }

  product(name: string | RegExp): Product {
    return new Product(this.products.filter({ has: this.page.locator('.name', { hasText: name }) }));
  }
}

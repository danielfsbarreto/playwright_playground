import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class BasketItem {
  readonly root: Locator;
  readonly image: Locator;
  readonly name: Locator;
  readonly quantity: Locator;
  readonly price: Locator;
  readonly decrease: Locator;
  readonly increase: Locator;
  readonly remove: Locator;

  constructor(root: Locator) {
    this.root = root;
    const cells = root.getByRole('cell');
    this.image = root.locator('app-product-image img');
    this.name = cells.nth(1);
    this.quantity = cells.nth(2).locator('span.cell-initial-font');
    this.price = cells.nth(3);
    this.decrease = cells.nth(2).getByRole('button').first();
    this.increase = cells.nth(2).getByRole('button').last();
    this.remove = cells.nth(4).getByRole('button');
  }

  async quantityCount(): Promise<number> {
    return parseInt((await this.quantity.innerText()).trim(), 10);
  }

  async priceValue(): Promise<number> {
    return parseFloat((await this.price.innerText()).trim());
  }

  async snapshot(): Promise<{ name: string; quantity: number; price: number }> {
    return {
      name: (await this.name.innerText()).trim(),
      quantity: await this.quantityCount(),
      price: await this.priceValue(),
    };
  }
}

export class BasketPage extends BasePage {
  readonly price: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.price = page.locator('#price');
    this.items = page.locator('app-purchase-basket mat-row');
  }

  item(name: string | RegExp): BasketItem {
    return new BasketItem(this.items.filter({ has: this.page.getByRole('cell').filter({ hasText: name }) }));
  }

  async allItems(): Promise<BasketItem[]> {
    const count = await this.items.count();
    return Array.from({ length: count }, (_, i) => new BasketItem(this.items.nth(i)));
  }
}

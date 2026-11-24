import { type Locator, type Page } from '@playwright/test';
import { BaseModal } from './base.modal';

export class Review {
  readonly root: Locator;
  readonly email: Locator;
  readonly content: Locator;
  readonly thumbsUp: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.email = root.locator('cite');
    this.content = root.locator('.review-message');
    this.thumbsUp = root.locator('.like-counter');
  }

  async thumbsUpCount(): Promise<number> {
    return parseInt((await this.thumbsUp.innerText()).trim(), 10);
  }

  async snapshot(): Promise<{ email: string; content: string; thumbs_up: number }> {
    return {
      email: (await this.email.innerText()).trim(),
      content: (await this.content.innerText()).trim(),
      thumbs_up: await this.thumbsUpCount(),
    };
  }
}

export class ProductDetailsModal extends BaseModal {
  readonly image: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly reviewsPanel: Locator;
  readonly reviewsCount: Locator;
  readonly reviews: Locator;

  constructor(page: Page) {
    super(
      page,
      page.locator('mat-dialog-container').filter({ has: page.locator('app-product-details') }),
    );
    this.image = this.root.locator('app-product-image img');
    this.title = this.root.getByRole('heading', { level: 1 });
    this.description = this.title.locator('xpath=following-sibling::div[1]');
    this.price = this.root.locator('.item-price');
    this.reviewsPanel = this.root.locator('mat-expansion-panel');
    this.reviewsCount = this.reviewsPanel.locator('mat-panel-title span').last();
    this.reviews = this.root.locator('.review-list li.comment');
  }

  override async waitUntilOpen() {
    await this.title.waitFor();
  }

  // Reviews are collapsed by default, so they're not rendered until expanded.
  async expandReviews() {
    if ((await this.reviewsPanel.getAttribute('class'))?.includes('mat-expanded')) return;
    await this.reviewsPanel.getByRole('button').first().click();
    await this.reviews.first().waitFor();
  }

  review(index: number): Review {
    return new Review(this.reviews.nth(index));
  }

  async allReviews(): Promise<Review[]> {
    const count = await this.reviews.count();
    return Array.from({ length: count }, (_, i) => this.review(i));
  }
}

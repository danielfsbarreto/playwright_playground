import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('product image opens a details dialog with all its content', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  const details = await home.product('Carrot Juice').openDetails();

  await expect(details.image).toBeVisible();
  await expect(details.title).toHaveText('Carrot Juice (1000ml)');
  await expect(details.description).toHaveText('As the old German saying goes: "Carrots are good for the eyes. Or has anyone ever seen a rabbit with glasses?"');
  await expect(details.price).toHaveText('2.99¤');
  await expect(details.reviewsCount).toHaveText('(1)');

  await details.expandReviews();
  await expect(details.reviews).toHaveCount(1);

  const first = details.review(0);
  await expect(first.email).toHaveText('uvogin@juice-sh.op');
  await expect(first.content).toHaveText('0 st4rs f0r 7h3 h0rr1bl3 s3cur17y');
  expect(await first.thumbsUpCount()).toBe(0);

  await details.close();
  await expect(details.root).toBeHidden();
});

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test('adds products by name and maps every basket line', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.product('Apple Juice').addToBasket();
  await expect(home.basketCount).toHaveText('1');
  await home.product('Banana Juice').addToBasket();
  await expect(home.basketCount).toHaveText('2');
  await home.product('Basil Smoothie').addToBasket();
  await expect(home.basketCount).toHaveText('3');

  const basket = await home.openBasket();
  await expect(basket.basketCount).toHaveText('3');
  await expect(basket.items).toHaveCount(3);

  const apple = basket.item('Apple Juice');
  await expect(apple.name).toHaveText(/Apple Juice/);
  await expect(apple.quantity).toHaveText('1');
  await expect(apple.price).toHaveText('1.99¤');

  const banana = basket.item('Banana Juice');
  await expect(banana.name).toHaveText(/Banana Juice/);
  await expect(banana.quantity).toHaveText('1');
  await expect(banana.price).toHaveText('1.99¤');

  const basil = basket.item('Basil Smoothie');
  await expect(basil.name).toHaveText(/Basil Smoothie/);
  await expect(basil.quantity).toHaveText('1');
  await expect(basil.price).toHaveText('2.99¤');

  const lines = await Promise.all((await basket.allItems()).map((i) => i.snapshot()));
  expect(lines.map((l) => l.name)).toEqual([
    expect.stringContaining('Apple Juice'),
    expect.stringContaining('Banana Juice'),
    expect.stringContaining('Basil Smoothie'),
  ]);
  expect(lines.every((l) => l.quantity === 1 && l.price > 0)).toBe(true);

  await expect(basket.price).toHaveText('Total Price: 6.97¤');
});

import { type Locator, type Page } from '@playwright/test';

// Subclasses must scope `root` to their own dialog: closing dialogs (e.g. the
// welcome banner) can linger in the DOM and break strict-mode locators.
export abstract class BaseModal {
  readonly page: Page;
  readonly root: Locator;
  readonly closeButton: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
    this.closeButton = root.getByRole('button', { name: 'Close Dialog' });
  }

  abstract waitUntilOpen(): Promise<void>;

  async close() {
    await this.closeButton.click();
    await this.root.waitFor({ state: 'detached' });
  }
}

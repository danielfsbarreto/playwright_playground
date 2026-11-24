# Playwright Playground

A small playground to showcase my Playwright skills, using TypeScript against [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/).

## What's inside

- **Page Object Model**: pages in [pages/](pages), with a shared `BasePage`.
- **Modal abstraction**: `BaseModal` plus `ProductDetailsModal` in [pages/modals/](pages/modals).
- **Component objects**: `Product`, `Review` and `BasketItem` wrap a single card, review or basket line, each with a `snapshot()` for plain values.
- **Explicit waits on UI feedback**: `Product.addToBasket()` waits for the "Placed … into basket" snackbar before moving on.
- **Cross-browser**: chromium and webkit.
- **CI**: GitHub Actions workflow in [.github/workflows/](.github/workflows).

## Requirements

- Node.js
- Docker (runs Juice Shop)

## Running

```sh
npm ci
npx playwright install
bin/test
```

`bin/test` starts Juice Shop at `http://127.0.0.1:3000` with `docker compose` and then runs `npx playwright test`. Any extra arguments are passed through:

```sh
bin/test --project=chromium
bin/test tests/basket.spec.ts
```

Open the HTML report with:

```sh
npx playwright show-report
```

## Layout

```
pages/        page objects (home, basket)
pages/modals/ modal objects
tests/        specs
bin/test      starts Juice Shop, then runs the tests
```

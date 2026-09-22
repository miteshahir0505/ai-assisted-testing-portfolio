import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

// NOTE: locators below use SauceDemo's public data-test attributes.
// I did not have live DevTools access while generating this file — verify
// each locator against the real page before treating this as passing.
// If a data-test attribute has changed, update the locator, not the test logic.

test.describe('SauceDemo Login', () => {

  // Converted from TC-01 (Project 1: final_test_cases.md)
  // Manual result when executed: Pass
  test('TC-01: valid login redirects to the inventory page', async ({ page }) => {
    await page.goto(BASE_URL);

    // Step 1: Enter valid username
    await page.locator('[data-test="username"]').fill('standard_user');

    // Step 2: Enter valid password
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Step 3: Click Login
    await page.locator('[data-test="login-button"]').click();

    // Expected result: redirected to /inventory.html with product list visible
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  // Converted from TC-06 (Project 1: final_test_cases.md)
  // Manual result when executed: Pass — confirmed exact message on live site
  test('TC-06: invalid username shows the mismatch error', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Expected result: exact SauceDemo error message, confirmed during manual execution
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );

    // User should remain on the login page, not be redirected
    await expect(page).toHaveURL(BASE_URL);
  });

  // Converted from TC-11 (Project 1: final_test_cases.md)
  // Manual result when executed: Pass — confirmed exact message on live site
  test('TC-11: locked-out user cannot log in', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );
    await expect(page).toHaveURL(BASE_URL);
  });

});

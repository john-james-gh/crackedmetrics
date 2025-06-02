import {expect, test} from '@playwright/test';

test('has title', async ({page}) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.getByRole('link', {name: 'Home'}).innerText()).toContain('Home');
});

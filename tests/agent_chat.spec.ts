import { test, expect, Page } from '@playwright/test';

/**
 * Handles page setup for tests that require suggestion pills to be visible.
 * This function navigates to the site, dismisses the cookie banner, and
 * implements a workaround for the suggestion pills which most of the time fail to load
 * on the initial visit. It will attempt one reload if they are not found.
 * @param page The Playwright Page object.
 */
async function setupPage(page: Page) {
  await page.goto('https://ask.permission.ai/');

  const chatInput = page.locator('[data-testid="agent-chat-input"]');
  const sendButton = page.locator('[data-testid="agent-chat-input-send-button"]');

  // Dismiss cookie banner if it appears
  const acceptButton = page.getByRole('button', { name: 'Accept All' });
  if (await acceptButton.isVisible({ timeout: 5000 })) {
    console.log('Cookie banner found. Dismissing it.');
    await acceptButton.click();
    await expect(acceptButton).not.toBeVisible();
  } else {
    console.log('Cookie banner not found or already dismissed.');
  }

  await expect(chatInput).toBeVisible();
  await expect(sendButton).toBeVisible();

  // Workaround for suggestion pills not loading on first visit
  const suggestionPill = page.getByRole('button', { name: 'What is Permission' });

  // Check if the pill is visible initially.
  const isVisibleInitially = await suggestionPill.first().isVisible({ timeout: 5000 });

  if (isVisibleInitially) {
    console.log('Suggested topic pills loaded on initial visit.');
  } else {
    console.log('Suggested topic pills not visible on initial visit, reloading page...');
    await page.reload();
    await expect(chatInput).toBeVisible();
    console.log('Page reloaded, now checking for pills again.');
  }

  // After either path, assert that the pill is now visible.
  // This ensures that if the reload failed to fix the issue, the test will fail here.
  await expect(suggestionPill.first()).toBeVisible();
  console.log('Assertion passed: Suggested topic pills are visible.');
}

test.describe('Agent Chat Page', () => {

  test('should display all initial suggested topic pills on page load', async ({ page }) => {
    await setupPage(page);

    const pillTexts = [
      'What is Permission',
      'Best way to earn ASK',
      'How permission uses my data',
      'What is passive earning',
      'What is data ownership',
      'Permission Wallet',
    ];

    const visibilityChecks = pillTexts.map(text =>
      expect(page.getByRole('button', { name: text }).first()).toBeVisible()
    );

    await Promise.all(visibilityChecks);
  });

  test('clicking "What is Permission" pill should trigger an agent response', async ({ page }) => {
    await setupPage(page);

    const whatIsPermissionPill = page.getByRole('button', { name: 'What is Permission' });
    await whatIsPermissionPill.click();

    //Wait for your reply pill to appear
    const yourReplyBubble = page.getByText('What is Permission?', { exact: true });
    await expect(yourReplyBubble).toBeVisible();

    // Wait for the typing indicator to appear
    const typingIndicator = page.getByText('Permission is typing...', { exact: true });
    await expect(typingIndicator).toBeVisible();

    // Wait for the typing indicator to disappear (agent finished typing)
    await expect(typingIndicator).not.toBeVisible();

    // Wait for the agent's response to appear
    const agentResponse = page.locator('p.mb-2.leading-relaxed.last\\:mb-0');
    await agentResponse.waitFor({ state: 'visible', timeout: 15000 });
    const responseText = await agentResponse.textContent();
    expect(responseText).not.toBeNull();
    expect(responseText!.length).toBeGreaterThan(20);

    // just to verify that valid text is stored getting generated
    console.log(responseText);
  });

});

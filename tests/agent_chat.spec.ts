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
  if (await acceptButton.isVisible({ timeout: 15000 })) {
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
    console.log('Test completed: should display all initial suggested topic pills on page load.');
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
    const sendButton = page.locator('[data-testid="agent-chat-input-send-button"]');
    const stopButton = page.getByTestId('agent-chat-input-stop-button');

    await expect(typingIndicator).toBeVisible();
    // During typing, the send button should disappear and the stop button should appear
    await expect(sendButton).not.toBeVisible();
    await expect(stopButton).toBeVisible();

    // Wait for the typing indicator to disappear (agent finished typing)
    await expect(typingIndicator).not.toBeVisible({ timeout: 15000 });
    // After typing, the stop button should disappear and the send button should reappear
    await expect(stopButton).not.toBeVisible();
    await expect(sendButton).toBeVisible();

    // Wait for the agent's response to appear within a reasonable time (15s)
    const agentResponse = page.locator('p.mb-2.leading-relaxed.last\\:mb-0').last();
    await agentResponse.waitFor({ state: 'visible', timeout: 15000 });

    const responseText = await agentResponse.textContent();
    expect(responseText, "Response should not be null or empty.").not.toBeNull();

    // 1. Minimum length assertion
    expect(responseText!.length, "Response should be longer than 50 characters.").toBeGreaterThan(50);

    // 2. No error-string leakage assertion
    const errorStrings = ['undefined', 'null', 'error', 'failed'];
    for (const error of errorStrings) {
      expect(responseText!.toLowerCase(), `Response should not contain "${error}"`).not.toContain(error);
    }

    // 3. Positive content assertion: Check for relevant keywords
    expect(responseText!.toLowerCase(), "Response should mention 'permission', 'data', or 'earning'.").toMatch(/permission|data|earning|earn/i);

    // Log for verification
    console.log(`Agent response received: "${responseText}"`);
    console.log('Test completed: clicking "What is Permission" pill should trigger an agent response.');
  });

  test('should allow user to ask custom question and receive an agent response', async ({ page }) => {
    await setupPage(page);

    const customQuestion = "Is my data ever shared without my consent?";
    const chatInput = page.locator('[data-testid="agent-chat-input"]');
    const sendButton = page.locator('[data-testid="agent-chat-input-send-button"]');

    await chatInput.fill(customQuestion);
    await sendButton.click();

    // Assert user's message bubble appears
    const userMessageBubble = page.getByText(customQuestion, { exact: true });
    await expect(userMessageBubble).toBeVisible();

    // Wait for the typing indicator to appear
    const typingIndicator = page.getByText('Permission is typing...', { exact: true });
    const stopButton = page.getByTestId('agent-chat-input-stop-button');

    await expect(typingIndicator).toBeVisible();
    // During typing, the send button should disappear and the stop button should appear
    await expect(sendButton).not.toBeVisible();
    await expect(stopButton).toBeVisible();

    // Wait for the typing indicator to disappear (agent finished typing)
    await expect(typingIndicator).not.toBeVisible({ timeout: 15000 });
    // After typing, the stop button should disappear and the send button should reappear
    await expect(stopButton).not.toBeVisible();
    await expect(sendButton).toBeVisible();

    // Wait for the agent's response to appear within a reasonable time (15s)
    const agentResponse = page.locator('p.mb-2.leading-relaxed.last\\:mb-0').last();
    await agentResponse.waitFor({ state: 'visible', timeout: 15000 });
    const responseText = await agentResponse.textContent();
    expect(responseText).not.toBeNull();
    expect(responseText!.length).toBeGreaterThan(50); // Ensure there's some content

    console.log(`Agent response to "${customQuestion}" --> ${responseText}`);
    console.log('Test completed: should allow user to ask custom question and receive an agent response.');
  });

  test('should allow multi-line input with Shift+Enter without triggering agent response', async ({ page }) => {
    await setupPage(page);

    const chatInput = page.locator('[data-testid="agent-chat-input"]');
    const typingIndicator = page.getByText('Permission is typing...', { exact: true });
    const agentResponseLocator = page.locator('p.mb-2.leading-relaxed.last\\:mb-0'); // Using a general locator for agent response

    const textPart1 = "Hello Agent";
    const textPart2 = "This is a new line.";

    await chatInput.fill(textPart1);
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    await chatInput.type(textPart2); // Use type to append text we are using this so we type character one by one

    // Assert the input's value contains a newline character
    const inputValue = await chatInput.inputValue();
    expect(inputValue).toContain('\n');
    expect(inputValue).toEqual(`${textPart1}\n${textPart2}`); // Verify content and newline

    // Assert no agent response appears (short timeout)
    await expect(typingIndicator).not.toBeVisible({ timeout: 3000 }); // Short timeout
    await expect(agentResponseLocator).not.toBeVisible({ timeout: 3000 }); // Short timeout

    console.log('Successfully tested Shift+Enter for multi-line input without triggering agent response.');
  });

  test('send button should be disabled when chat input is empty', async ({ page }) => {
    await setupPage(page);

    const chatInput = page.locator('[data-testid="agent-chat-input"]');
    const sendButton = page.locator('[data-testid="agent-chat-input-send-button"]');

    // Ensure the input is empty
    await chatInput.clear();
    await expect(chatInput).toHaveValue('');

    // Assert that the send button is disabled when the input is empty
    await expect(sendButton).toBeDisabled();

    console.log('Successfully tested that the send button is disabled when the chat input is empty.');
    console.log('Test completed: send button should be disabled when chat input is empty.');
  });

  test('clicking log in button navigates to login page', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('https://ask.permission.ai/');

    // Click the login button
    await page.locator('[data-testid="log-in-button"]').click();

    // Assert the URL contains "/login"
    await expect(page).toHaveURL(/.*\/login/);

    const loginHeading =  page.getByRole('heading', { name: 'Log in to your account' })
    await expect(loginHeading).toBeVisible();

    const welcomeHeading = page.getByRole('heading', { name: 'Welcome back! Please enter your details.' })
    await expect(welcomeHeading).toBeVisible();

    console.log('Test completed: clicking log in button navigates to login page.');
  });

});

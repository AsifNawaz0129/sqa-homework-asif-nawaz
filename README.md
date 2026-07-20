# SQA Homework Submission

[Live Report](https://asifnawaz0129.github.io/sqa-homework-asif-nawaz/)

## Setup and Running Tests

This project uses Playwright for end-to-end testing.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```

3.  **Run tests:**
    ```bash
    npx playwright test
    ```

## Test Strategy

The strategy covers:

*   Verifying basic functionality like page loads and core UI elements.
*   Testing key features like user interaction with the AI agent.
*   Assertions are focused on behavior and state changes rather than brittle checks on exact text, especially for AI-generated content.

## Key Decisions

*   **Framework Choice:** Selected Playwright for its robust features, cross-browser support, and debugging capabilities.
*   **Focused Test Scope:** Prioritized user-critical paths, specifically agent chat interactions and navigation to the login page, to maximize testing value.
*   **AI Response Strategy:** Avoided asserting on exact AI response text due to non-determinism; instead, verified response presence and length.

## AI Disclosure

Please refer to the [AI Workflow Disclosure](artifacts/ai-workflow.md).

## Next Steps

* Add tests for other key user flows, such as the referral, redeem processes, sign up, log in, testing UI on mobile resolutions, and mainly cover all important user journeys.

## Submission Checklist

☐ Repo named `sqa-homework-<first-last>` and default branch is `main`
☐ README includes exact Setup + run commands (verified from a clean clone)
☐ README word count ≤ 500 (excluding commands/checkboxes)
☐ Max 8 tests; all 4 required behaviors covered
☐ `artifacts/assertions.md` included (≤ 300 words)
☐ `artifacts/ux-review.md` included (≤ 400 words, desktop + mobile, post-signup exploration, 3–5 prioritized improvements)

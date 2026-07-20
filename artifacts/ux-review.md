# UX Review — Permission.ai

**Tested on:** Desktop (Chrome, macOS) and Mobile (Chrome DevTools responsive mode, iPhone XR viewport — no physical device used).

## What works

Signup is smooth, no email verification issue. Visual design stays consistent between pre-login and post-signup. Mobile responsiveness holds up well overall; layouts reflow cleanly and flows feel intuitive and user-friendly.

## What's rough

*   Login page has no back button and a non-clickable logo; while signup has both working.
*   Mobile hamburger menu shown on the Permission agent page pre-login expands to an empty menu.
*   Referral page's Share button produces no visible action.
*   Redeem's "Opt-in to a brand" row: only the arrow icon is clickable, not the label.
*   Permission Extension link works via Account Settings → My Details, but the same link if you ask from permission agent via chat shows custom 404 permission page.

## Prioritized improvements

1.  **Fix the non-functional referral share button.**
    *   **Why it matters:** Referrals drive growth for a rewards platform. A silently broken share flow blocks this and makes the button non-functional.
    *   **Change:** Wire it to the platform's native share UI, or integrate with different social media sites for sharing.

2.  **Fix the agent's broken extension link when asked while logged in.**
    *   **Why it matters:** A non-working link from the product's own AI assistant damages trust.
    *   **Change:** Point the agent's response to the correct URL. Currently, it directs to `https://ask.permission.ai/settings` when asked "can I get permission extension link?".

3.  **Remove the empty navigation menu on mobile resolution when logged out.**
    *   **Why it matters:** An empty menu, especially on a first impression, makes the product seem unfinished.
    *   **Change:** Hide the hamburger menu pre-login on mobile resolution.

4.  **Make login match signup: back button + clickable logo.**
    *   **Why it matters:** Inconsistent navigation between two nearly-identical entry points feels unpolished and can be confusing for users.
    *   **Change:** Mirror signup's header behavior on the login page.

5.  **Make the full Redeem row clickable, not just the arrow.**
    *   **Why it matters:** Smaller tap targets increase misclicks, especially on mobile, leading to a frustrating user experience.
    *   **Change:** Extend the clickable target to the entire row.

## Priority rationale

Improvements are prioritized based on what most hinders critical user actions (like referrals or agent-guided navigation). Next are issues like empty navigation menus that undermine user trust. Lastly, navigation inconsistencies, while less critical, still detract from a polished experience.
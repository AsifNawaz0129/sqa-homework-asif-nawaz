# AI Workflow Disclosure

## AI Tools Used

I used a Gemini-based interactive CLI agent. I chose it over web-based tools like ChatGPT or Claude because of its direct integration with my local development environment. Its ability to read files, execute shell commands, and modify code in place created a much tighter and more efficient feedback loop.

## What was Generated with AI vs. Corrected by Me

*   **Generated:** I used the AI to generate a couple of Playwright test scripts later on, based on very specific steps and selectors I provided. On a few occasions, when a test failed, the AI provided a potential fix after I supplied the error log. I also asked the AI to review content within my artifacts.
*   **Corrected/Rewritten:** I wrote the initial two tests manually. Later, I primarily debugged and fixed AI-generated tests myself, finding this approach more efficient than guiding the AI through corrections. For the `playwright.yml` file, I took the AI's initial draft and manually verified the commands, and added a manual `workflow_dispatch` trigger. I also utilized the AI to format my `.md` artifacts for better presentation and to suggest code comments for improved code readability. 

## One Thing the AI Got Wrong

The AI agent completely misunderstood the sequence of UI events for the agent chat test. It attempted to validate that the "typing..." indicator was gone *before* validating the agent's reply had appeared, which is logically impossible. I had to correct the order of `expect` calls to match the actual user flow.

## What was Deliberately Built by Hand

I did not use AI for any high-level strategic work. Key areas I handled manually include:

*   **Initial Testing & Test Case Design:** I wrote the initial Playwright tests myself and designed the test cases to automate.
*   **UX Analysis & Data Checks:** The entire `ux-review.md` artifact was based on my own manual analysis of the product's user experience, which also involved reviewing the site for data checks.
*   **Test Strategy:** I decided what to test, defined the core validation logic, and prioritized which failures to address.

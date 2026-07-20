# Validating a non-deterministic response

This document outlines the approach to validate the AI agent's responses for the "What is Permission" topic, designed for testing of non-deterministic output.

## What We Asserted (and Why)

Our strategy focuses on validating the *characteristics* of a healthy AI response, not its exact content.

1.  **Presence & Timeliness:**
    *   **What/Why:** Confirms a non-empty agent response within 15 seconds. Verifies dynamic UI: "typing" indicator shows, "send" button hides, "stop" appears, then reverts. Ensures basic interaction and UI responsiveness are sound.

2.  **Minimum Content Length:**
    *   **What/Why:** Response text must exceed 50 characters, preventing trivial or partial, meaningless replies.

3.  **Absence of Internal Error Leakage:**
    *   **What/Why:** Response must not contain "undefined," "null," "error," or "failed" (case-insensitive). Such terms indicate backend issues exposed to the user.

4.  **Topical Relevance (Keyword Check):**
    *   **What/Why:** For "What is Permission," response must include "permission," "data," or "earning" (case-insensitive). This offers assurance of broad relevance.

## What We Deliberately Did NOT Assert (and Why)

1.  **Exact Response Text:**
    *   **Why:** AI responses are non-deterministic. Fixed-string assertions cause flaky tests. We validate quality, not verbatim content.

2.  **Deep Semantic/Factual Accuracy:**
    *   **Why:** Robust semantic validation requires specialized LLM frameworks and golden datasets. This complexity is beyond an efficient small automated suite, focusing instead on functional testing.
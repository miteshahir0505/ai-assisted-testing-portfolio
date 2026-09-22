# Project 4: Manual Test Cases to Playwright Automation

**Goal:** Convert manually executed test cases into automated Playwright scripts using AI, and show what needed fixing before trusting the result.

## Folder contents

| File | What it is |
|---|---|
| [`login.spec.ts`](./login.spec.ts) | Playwright TypeScript tests converted from TC-01, TC-06 and TC-11 |

## Why these three cases

I picked TC-01 (valid login), TC-06 (invalid username), and TC-11 (locked-out user) from [Project 1's 29 executed test cases](../01-test-case-generation/final_test_cases.md) because:
- All three were already manually executed with confirmed, exact expected results — I'm automating checks I already know are true, not guessing.
- Together they cover the three core outcomes of the login feature: success, generic failure, and a specific blocked-account failure.

## Prompt used

[Prompt 7](../02-prompt-library/prompts.md#7-manual-test-to-playwright-script) from my prompt library.

```
Convert this manual test case into a Playwright test in TypeScript.

Requirements:
- Use stable locators (data-test attributes, roles, or labels), not
  brittle XPath or index-based selectors.
- Use Playwright's built-in auto-waiting; no fixed sleeps.
- One clear assertion per expected result.
- Add a short comment above each step matching the manual step.
- Put the base URL in a constant.

Manual test case:
[TC-01 / TC-06 / TC-11 from final_test_cases.md]

Page elements I inspected:
[data-test attributes for username, password, login button, error message]
```

## What I checked before trusting the output

1. **Locators.** SauceDemo publicly uses `data-test` attributes (`username`, `password`, `login-button`, `error`) — these are well-documented and stable, not brittle CSS or XPath. I did not have live DevTools access while writing this file, so **these need to be verified against the real page before the tests are treated as passing** — this is flagged directly in the script.
2. **Expected error text.** I used the exact strings confirmed during manual execution (`Epic sadface: Username and password do not match any user in this service` and `...locked out.`), not whatever the AI guessed — this is the same lesson from Project 1: never trust an AI-guessed message when a confirmed one exists.
3. **No fixed waits.** The AI used Playwright's built-in auto-waiting (`expect(...).toBeVisible()`, `toHaveURL()`) rather than `page.waitForTimeout()`, which is the correct pattern — a hard-coded sleep would make the suite slower and flakier.
4. **One assertion focus per test**, matching one manual test case each, rather than combining all three logins into a single giant test that would be harder to debug on failure.

## What I have not yet done

- **Run these tests against the live site** to confirm they pass. This requires a local Node/Playwright environment, so the next step is: `npm init playwright@latest`, drop this spec file in, and run `npx playwright test`.
- **Verify the actual `data-test` locator names** in DevTools rather than relying on public documentation of SauceDemo's structure.

## Outcome

- **Manual execution time for these 3 cases (from Project 1):** a few minutes each, but has to be repeated by hand every time.
- **Automation time (writing + review):** about [TODO] minutes for this first batch of 3.
- **Lesson:** automating a test I've already manually verified is much safer than automating one I haven't run, because I already know exactly what "correct" looks like — including the exact error text, which is where AI most often guesses wrong.

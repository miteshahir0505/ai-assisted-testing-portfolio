# Prompt Library for AI-Assisted Manual Testing

Reusable prompts I use, with what I check before trusting the output. Each prompt was refined after real use in [Project 1](../01-test-case-generation).

## Rules I follow with every prompt

Learned from comparing four AI tools on the same login feature:

1. **Give the AI real context** (URL, test accounts, exact messages). Without it, AI guesses error messages, passwords and URLs.
2. **Tell it to write "TBC" instead of guessing.** Unknown expected results should be flagged, not invented.
3. **Ask for assumptions separately** so each one can be checked.
4. **Never paste confidential data.** Use public apps or made-up data only.
5. **Review everything.** More output is not better output. Remove duplicates, fix wrong expected results, then run the tests.

## Contents

1. [Test case generation](#1-test-case-generation)
2. [Test case review (find duplicates and gaps)](#2-test-case-review)
3. [Test data generation](#3-test-data-generation)
4. [Bug report writing](#4-bug-report-writing)
5. [Exploratory testing charters](#5-exploratory-testing-charters)
6. [Risk-based test prioritization](#6-risk-based-test-prioritization)
7. [Manual test to Playwright script](#7-manual-test-to-playwright-script)
8. [Test cycle summary report](#8-test-cycle-summary-report)

---

## 1. Test case generation

**When to use:** You have a user story and need a first draft of manual test cases.

**Prompt:**
```
You are a senior QA engineer. Write manual test cases for the user story below.

Application context:
- URL: [URL]
- Test accounts: [usernames and passwords, or "none"]
- Known messages/behavior: [exact error messages, or "unknown"]

Output a table with columns: ID, Title, Preconditions, Test Data, Steps,
Expected Result, Type (Positive/Negative/Boundary/Edge/Security), Priority.

Rules:
- Cover happy path, negative cases, boundary values, special characters,
  and security checks relevant to the story.
- Do not invent features that are not in the story.
- If the exact expected result (such as a message) is not given above,
  write "TBC" instead of guessing.
- Do not repeat cases that differ only in wording.
- After the table, list every assumption you made under "Assumptions".

User story:
[paste story and acceptance criteria]
```

**Example input:** Login user story for saucedemo.com (see Project 1).

**Example output:** Full result, comparison across 4 AI tools, and execution against the live site: [`01-test-case-generation/`](../01-test-case-generation)

**What I check before trusting it:**
- Are expected results exact and testable, or vague ("appropriate error")?
- Are there duplicates or cases outside the story?
- Do steps use the real URL and test data?

---

## 2. Test case review

**When to use:** You have AI-generated (or your own) test cases and want a critical second opinion before executing them.

**Prompt:**
```
You are a QA lead reviewing a test case set. Review the test cases below
against the user story.

Report these sections:
1. Duplicates or near-duplicates (list the IDs together)
2. Test cases with vague expected results (quote the ID and the vague text)
3. Test cases whose test data does not match the title or steps
4. Test cases that go beyond the user story
5. Missing scenarios or acceptance criteria not covered
6. Suggested final count after cleanup

Do not rewrite the test cases. Only report findings.

User story:
[paste]

Test cases:
[paste]
```

**Example input:** The ChatGPT output from Project 1 (40 cases).

**Example output:** Full worked example, including my own check of whether the AI's review was accurate: [`example-2-test-case-review.md`](./example-2-test-case-review.md)

**Quick summary:** the AI found real duplicates, vague expected results, and one genuine coverage gap (no case for a locked-out user with a wrong password — which turned out to be one of the most interesting findings once executed). It also missed things a human execution pass caught, like a case that referenced a second account without naming one, making it impossible to actually run.

**What I check before trusting it:** Open each ID it flags and confirm the problem is real. AI reviewers can also invent problems.

---

## 3. Test data generation

**When to use:** You need realistic, invalid or edge-case data for a form or API.

**Prompt:**
```
Generate test data for the field(s) below.

Field(s): [name, type, rules, e.g., "Email: required, max 254 chars"]

Give me a table with columns: Value, Category (valid/invalid/boundary/
special characters/security), Why it is useful.

Include: valid values, empty and whitespace-only, minimum and maximum
length, one character over the maximum, special characters, Unicode,
and injection strings (SQL and script) for security checks.
Use only fictional data. Do not use real people, real emails or real
phone numbers.
```

**Example input:** `Postal code: required, 6 digits, numeric only`

**Example output** (generated for SauceDemo's checkout postal code field, `Postal code: required, format unspecified`):

| Value | Category | Why it is useful |
|---|---|---|
| `12345` | Valid | Standard numeric postal code |
| `SW1A 1AA` | Valid | Non-US alphanumeric format, since the field's rules weren't specified |
| *(empty)* | Invalid | Tests the "required" rule directly |
| `   ` (spaces only) | Invalid | Tests whether whitespace is treated as empty |
| `1` | Boundary | Shortest possible input |
| `123456789012345678901234567890` | Boundary | Very long input, checks for a max-length limit or overflow |
| `-12345` | Invalid | Negative number, tests numeric validation if any |
| `12 345` | Edge | Internal spacing, common real-world formatting |
| `!@#$%` | Special characters | Tests whether symbols are rejected or silently accepted |
| `' OR '1'='1` | Security | SQL injection payload, checks the field isn't passed unsanitized to a query |
| `<script>alert(1)</script>` | Security | Script injection payload, checks for output escaping |

**What I checked before trusting it:** the AI correctly noted the field's exact rules weren't given, so it covered both a plain numeric format and a non-US alphanumeric one rather than assuming US-only ZIP codes. I did not execute these against SauceDemo's checkout — this is an unexecuted example kept here to show the prompt working, not a verified result. Before using it for real testing, I'd run it against the actual field and note which values the form actually accepts.

**What I check before trusting it:** Do the "boundary" values really sit on the boundary of the stated rules? Are the valid values actually valid?

---

## 4. Bug report writing

**When to use:** You have rough notes from a failed test and need a clear, structured report.

**Prompt:**
```
Turn my rough notes into a bug report.

Format:
- Title (one line: what fails, where, under what condition)
- Environment (browser, OS, build/URL) - use only what I give you
- Preconditions
- Steps to reproduce (numbered, one action each)
- Expected result
- Actual result
- Severity and priority suggestion, with a one-line reason
- Attachments to include (screenshot, console log, network trace)

Rules:
- Do not add steps, data or environment details that I did not mention.
- If something important is missing, list it under "Questions for the
  reporter" instead of guessing.

My notes:
[paste rough notes]
```

**Example input:** Real rough notes from testing a cookie-persistence observation in Project 1.

**Example output:** Full before/after, including how I adjusted the AI's severity rating: [`03-bug-reports-exploratory/bug_report_example.md`](../03-bug-reports-exploratory/bug_report_example.md)

**What I check before trusting it:** Reproduce the steps exactly as written. Check that no invented details slipped in, and decide severity myself.

---

## 5. Exploratory testing charters

**When to use:** Before an exploratory session, to get ideas and structure a time-boxed charter.

**Prompt:**
```
Act as an exploratory testing coach. For the feature below, create 5
session charters in the format:

"Explore [area] with [resources/data/tools] to discover [risk/information]"

For each charter give: suggested time box (30-90 min), 5 "what if"
questions, and the main risk it targets.

Focus on unusual user behavior, interruptions (refresh, back button, lost
connection), data variations, permissions, and cross-browser or device
differences. Do not repeat basic happy-path checks.

Feature description:
[paste]
```

**Example input:** Shopping cart and checkout on saucedemo.com.

**Example output:** 5 AI-generated charters, 2 executed with real session notes: [`03-bug-reports-exploratory/exploratory_testing.md`](../03-bug-reports-exploratory/exploratory_testing.md)

**What I check before trusting it:** Pick the 2-3 charters that match real risk, run them, and note which "what if" questions found something.

---

## 6. Risk-based test prioritization

**When to use:** Limited time, many test cases, and you need to decide what to run first.

**Prompt:**
```
Prioritize the test cases below for a time-limited test run.

Context:
- What changed in this release: [describe]
- Known defect-prone areas: [describe or "unknown"]
- Time available: [e.g., 2 hours]

Group the test cases into: Must run, Should run, Can skip this cycle.
For each group, give a one-line reason per test case based on impact and
likelihood of failure. State any assumption you made about risk.

Test cases:
[paste ID and title list]
```

**Example input:** The 29 final cases from Project 1, with "login page redesign" as the change.

**Example output** (run against the real 29 cases from Project 1, with "login page redesign, 2 hours available" as the context):

**Must run (12 cases)** — core functional and security paths that a redesign is most likely to break:
TC-01 (valid login), TC-06/TC-07 (invalid credentials), TC-08/TC-09 (empty fields), TC-11 (locked-out user), TC-21/TC-22 (SQL injection), TC-23 (password masking), TC-25 (direct URL access), TC-03 (Enter key — layout changes often break keyboard handlers), TC-28 (error message doesn't leak which field was wrong)

**Should run (11 cases)** — boundary and edge cases, lower chance a redesign breaks them, but cheap to check:
TC-02 (other users), TC-05 (retry after failure), TC-10 (both fields empty), TC-12 (locked-out + wrong password), TC-13/TC-14/TC-15 (whitespace), TC-16 (case sensitivity), TC-17/TC-18 (long input), TC-26 (back button after logout)

**Can skip this cycle (6 cases)** — unlikely to be affected by a visual/layout change:
TC-04 (autofill — browser feature, not app logic), TC-19/TC-20 (special characters/Unicode — backend validation, not UI), TC-24 (password not in URL — routing, not layout), TC-27 (cookie observation — session logic, not UI), TC-29 (repeated failed logins — backend rate-limiting, not UI)

**What I checked before trusting it:** the grouping makes sense for a *layout* redesign specifically — if the change were instead "rewrote the authentication backend," I'd flag TC-19/20/24/27/29 as Must run and downgrade some UI-focused cases instead. The AI's risk reasoning is only as good as the "what changed" context it's given, so I re-ran this mentally for a backend-change scenario as a sanity check before trusting the first grouping.

**What I check before trusting it:** Does the grouping match what I know about the product? I make the final call. AI only sees what I told it.

---

## 7. Manual test to Playwright script

**When to use:** You want to automate a manual test case you have already verified by hand.

**Prompt:**
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
[paste one test case: preconditions, steps, expected result]

Page elements I inspected:
[paste locators, e.g., username input: [data-test="username"]]
```

**Example input:** TC-01, TC-06 and TC-11 from Project 1, already manually executed with confirmed expected results.

**Example output:** [`04-manual-to-automation/login.spec.ts`](../04-manual-to-automation/login.spec.ts)

**What I check before trusting it:** Run the script. Confirm it fails when the expected result is wrong (change an assertion and watch it break). Check that locators are real, since AI can invent them.

---

## 8. Test cycle summary report

**When to use:** End of a test cycle, to turn raw results into a summary for the team.

**Prompt:**
```
Write a concise test summary report from the data below for a
non-technical stakeholder.

Include: scope tested, pass/fail counts, top 3 risks or defects with
impact in plain language, what was not tested, and a go/no-go
recommendation with reasoning.

Use only the data I provide. If a number is missing, write "not provided".

Data:
[paste results table, defect list, and notes]
```

**Example input:** The execution results table from Project 1.

**Example output** (generated from the real Project 1 execution results and the Project 3 bug report):

> **Test Summary: SauceDemo Login Feature**
>
> **Scope tested:** Login with valid/invalid credentials, empty fields, locked-out accounts, whitespace and case handling, long and special-character input, SQL injection resistance, password masking, and unauthorized access to the inventory page (29 test cases total).
>
> **Results:** 28 of 29 passed. No failures. 2 items flagged for attention (see below).
>
> **Top items to know about:**
> 1. **No account lockout after repeated failed logins.** Anyone can retry as many times as they want with no rate limit. Low urgency on a demo site, but this would be worth a real policy decision on a production login.
> 2. **A cookie related to the inventory page isn't cleared on logout.** Retesting confirmed this does not allow unauthorized access — direct URL access and the browser Back button both correctly redirect to login after logout — but the leftover cookie itself hasn't been fully explained yet.
> 3. **The "please log in first" message reads like an error, not a prompt.** Functionally correct, but the wording ("Epic sadface: you can only access...") could confuse a real user into thinking something broke.
>
> **Not tested:** Cart, checkout, and sorting functionality were out of scope for this cycle (see separate exploratory notes for partial coverage of those areas).
>
> **Recommendation:** Go. Core login security and validation are solid — no bypass was found under any tested condition, including SQL injection, forged input, and stale sessions. The two flagged items are minor and don't block release, but are worth a follow-up ticket each.

**What I checked before trusting it:** every number and claim above traces back to the actual `final_test_cases.md` and `bug_report_example.md` files — the AI wasn't given anything to invent. I did tighten the "Recommendation" section myself; the first draft leaned slightly more cautious ("go, with monitoring") than the evidence supported, so I made the language match what was actually found rather than hedging by default.

**What I check before trusting it:** Every number matches my results table, and the recommendation is one I would defend in a meeting.

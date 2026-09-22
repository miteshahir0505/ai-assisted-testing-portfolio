# Project 1: AI-Assisted Test Case Generation

**App under test:** [saucedemo.com](https://www.saucedemo.com/) (public practice site)

**Feature:** Login

**Goal:** Use AI to draft manual test cases, then review, correct and execute them like a real tester.

## What I did

1. Wrote a user story with acceptance criteria for the login feature.
2. Gave the **same prompt** to four AI tools: ChatGPT, Claude, Gemini and Copilot.
3. Compared the four outputs side by side.
4. Merged, de-duplicated and corrected them into one final set of 29 test cases.
5. Executed all 29 test cases on the live site and recorded the results.

## Folder contents

| File | What it is |
|---|---|
| [`raw_outputs/`](./raw_outputs) | Unedited output from each AI tool |
| [`comparison.md`](./comparison.md) | Tool-by-tool comparison, disagreements, traceability |
| [`final_test_cases.md`](./final_test_cases.md) | The 29 reviewed and **executed** test cases with actual results |

## 1. Input

> As a registered user, I want to log in with my username and password so that I can access the product inventory.
>
> **Acceptance criteria**
> - Valid credentials take the user to the inventory page
> - Invalid credentials show an error message
> - Empty username or password shows a validation message
> - A locked-out user cannot log in

## 2. Prompt used

```
You are a senior QA engineer. Based on the user story below, write manual
test cases in a table with these columns: ID, Title, Preconditions, Steps,
Expected Result, Type (Positive/Negative/Boundary/Edge), Priority.

Cover happy path, negative cases, boundary values (e.g., very long input,
leading/trailing spaces), special characters, and security-related checks
(e.g., SQL injection strings, password masking). Do not invent features that
aren't in the story; list any assumptions separately at the end.

User story: [story and acceptance criteria above]
```

## 3. Results at a glance

| Tool | Test cases | Assumptions listed | Expected results precise? | Main strength | Main weakness |
|---|---|---|---|---|---|
| ChatGPT | 40 | 6 | No, mostly vague | Widest coverage | Duplicates, vague expected results |
| Claude | 32 | 9 | Partly | Deepest security ideas | Wrong password and placeholder URL |
| Gemini | 16 | 3 | **Yes** | Exact SauceDemo error messages | Missed many scenarios |
| Copilot | 15 | 8 | Specific but wrong wording | Compact | Guessed error messages |

**103 raw cases → 29 final cases** (93 merged into 27, 10 dropped, 2 added by me).
Full details and case-by-case traceability are in [`comparison.md`](./comparison.md).

## 4. My review

### What the AI got wrong (confirmed by execution)

1. **Guessed error messages were wrong.** Copilot's "Invalid username or password" / "Account is locked" and Claude's "This account has been locked out." don't exist on the site. Only Gemini's `Epic sadface: ...` wording matched exactly.
2. **Wrong test data.** Claude used the password `Secret123!` and a placeholder URL `<app-domain>`, neither of which works on SauceDemo (`secret_sauce` is correct).
3. **The whitespace-trimming disagreement is settled.** Copilot expected the app to trim leading/trailing spaces and still log in; Gemini and Claude expected it not to. Execution confirmed **no trimming happens** — spaces make the login fail. Copilot was wrong.
4. **Claude's lockout-policy assumption was wrong.** Claude assumed repeated failed logins would trigger a lockout or rate-limit (TC_30). Execution showed 6 straight failed attempts followed by a correct login worked with no lockout at all.
5. **None of the four tools tested "locked-out user + wrong password" correctly.** Execution showed this returns the generic mismatch message, not the lockout message — meaning credential-matching happens before the lockout check. This combination wasn't explicitly covered by any tool.
6. **Vague expected results (ChatGPT).** Most of ChatGPT's cases said "appropriate error message is displayed", which isn't objectively checkable. I replaced these with the confirmed exact message.
7. **Duplicate and mismatched cases.** ChatGPT TC-016 duplicated TC-001 despite a different title; TC-012 described spaces in the password but the test data had none.
8. **Invented requirements.** Claude added HTTPS enforcement and a browser "update saved password" prompt, neither in the story; Copilot assumed a 256-character limit that isn't stated anywhere.

### What the AI missed (I added and executed)

1. **Other SauceDemo users** (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`): all four tools only used `standard_user` and `locked_out_user`. All four additional users logged in successfully (TC-02).
2. **Submitting with the Enter key** worked the same as clicking Login (TC-03).
3. **Accidental double-clicking Login during a slow login** (`performance_glitch_user`) caused no duplicate-submission bug — a real-world scenario no tool suggested.

### An unresolved finding from execution

**TC-27 (forged/leftover cookie):** during testing, a cookie tied to `/inventory.html` was still present in DevTools after logout, while a separate session cookie was removed. Re-visiting the inventory page after logout still correctly redirected to login, so this did **not** allow a bypass. It's logged as an observation rather than a defect, with a suggested next step to isolate exactly what that cookie does. This is the kind of nuance that only shows up by actually running the tests, not from AI-generated cases.

## 5. Execution results

| Result | Count |
|---|---|
| ✅ Pass | 28 / 29 |
| ❌ Fail | 0 |
| 👁 Observations | 2 (TC-25 error-message UX, TC-27 cookie behavior — needs follow-up) |

**Notable finding:** the single most useful outcome of running all four tools side by side was catching **disagreements** between them (trimming behavior, lockout policy) — each disagreement pointed straight at something worth testing, and execution resolved every one of them in favor of Gemini's more conservative, fact-based output.

## 6. Outcome

- **Time to write these cases manually (estimate):** [100] minutes
- **Time with AI + my review and execution:** [60] minutes
- **Lessons learned:**
  - More test cases does not mean better test cases; 103 raw cases collapsed to 29 once duplicates were removed, and only Gemini's smaller set had accurate expected results.
  - AI does not know application-specific details (messages, URLs, credentials, actual security behavior) unless told, so it fills gaps with guesses — some of which turned out wrong once tested.
  - Comparing multiple tools surfaces disagreements that are worth testing directly; every disagreement in this project led to a real, confirmable answer.
  - Executing the cases on the real app, not just reading the AI's output, is what actually validates (or disproves) an AI's assumptions.

## 7. What I would try next

Re-run the same prompt after adding the exact error messages and test accounts, plus the instruction "if you do not know the expected message, write *to be confirmed* instead of guessing", then compare whether accuracy improves on a first pass.

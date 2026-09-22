# Project 1: AI-Assisted Test Case Generation

**App under test:** [saucedemo.com](https://www.saucedemo.com/) (public practice site)
**Feature:** Login
**Goal:** Use AI to draft manual test cases, then review, correct and execute them like a real tester.

## What I did

1. Wrote a user story with acceptance criteria for the login feature.
2. Gave the **same prompt** to four AI tools: ChatGPT, Claude, Gemini and Copilot.
3. Compared the four outputs side by side.
4. Merged, de-duplicated and corrected them into one final set of test cases.
5. Executed the final set on the live site and recorded the results.

## Folder contents

| File | What it is |
|---|---|
| [`raw_outputs/`](./raw_outputs) | Unedited output from each AI tool |
| [`comparison.md`](./comparison.md) | Tool-by-tool comparison, disagreements, traceability |
| [`final_test_cases.md`](./final_test_cases.md) | The 29 reviewed and executed test cases |

## 1. Input

> As a registered user, I want to log in with my username and password so that I can access the product inventory.
>
> **Acceptance criteria**
> - Valid credentials take the user to the inventory page
> - Invalid credentials show an error message
> - Empty username or password shows a validation message
> - A locked-out user cannot log in

## 2. Prompt used

[TODO: replace with the exact prompt you sent. If you added the SauceDemo URL or credentials, keep that line, because it explains why the tools used `standard_user`.]

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

### What the AI got wrong

1. **Guessed error messages.** Copilot expected "Invalid username or password" and "Account is locked"; Claude expected "This account has been locked out." SauceDemo uses `Epic sadface: ...` messages. Only Gemini had them right.
2. **Wrong test data.** Claude used the password `Secret123!` and the placeholder `<app-domain>`. SauceDemo's password is `secret_sauce`, so its steps could not be run as written.
3. **Vague expected results.** Most of ChatGPT's cases say "appropriate error message is displayed", which cannot be objectively passed or failed. I replaced them with exact messages.
4. **Duplicate and mismatched cases.** ChatGPT TC-016 ("valid password with special characters") uses the same data as TC-001. ChatGPT TC-012 ("password with spaces") shows a password with no spaces.
5. **Invented requirements.** Claude added a lockout policy, HTTPS redirect and a browser "update password" prompt; Copilot assumed a 256-character limit. None of these are in the story.
6. **Tools contradicted each other.** For a username with leading/trailing spaces, Copilot expected success and Gemini expected failure. I resolved this by testing it (TC-14).
7. **Predictions about site behavior to verify.** [TODO: after executing, confirm or correct each one below.]

| Item | AI claim | Actual behavior on site |
|---|---|---|
| Forged `session-username` cookie (TC-27) | Claude: access denied | [TODO] |
| Spaces around username (TC-14) | Copilot: trimmed, login succeeds | [TODO] |
| Spaces-only input (TC-13) | ChatGPT/Claude: validation message | [TODO] |
| Locked-out user with wrong password (TC-12) | not specified | [TODO] |

### What the AI missed (I added)

1. **Other SauceDemo users** (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`): all four tools only used `standard_user` and `locked_out_user` (TC-02).
2. **Submitting with the Enter key** (TC-03).
3. **Exact expected messages** for every negative case, and the real URL for direct-access tests.

### What I removed

Duplicates, tests of browser features rather than the app (password-manager prompts), and cases outside the story (HTTPS redirect, lockout policy, session refresh). Full list with reasons is in [`comparison.md`](./comparison.md#5-how-the-four-sets-became-one).

## 5. Execution results

[TODO: fill in after running]

| Result | Count |
|---|---|
| ✅ Pass | [TODO] |
| ❌ Fail | [TODO] |
| 👁 Observations | [TODO] |

Notable finding: [TODO: e.g., one sentence about the most interesting result]

## 6. Outcome

- **Time to write these cases manually (estimate):** [TODO] minutes
- **Time with AI + my review and execution:** [TODO] minutes
- **Lessons learned:**
  - More test cases does not mean better test cases; deduplication cut 103 cases to 29.
  - AI does not know application-specific details (messages, URLs, credentials) unless they are provided, so it fills gaps with guesses.
  - Different tools have different strengths, so combining them worked better than relying on one.
  - Executing the cases on the real app was the only way to tell which AI claims were right.

## 7. What I would try next

Re-run the same prompt after adding the exact error messages and test accounts, plus the instruction "if you do not know the expected message, write *to be confirmed* instead of guessing", then compare whether accuracy improves.

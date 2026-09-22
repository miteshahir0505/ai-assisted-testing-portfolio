# AI Tool Comparison: Login Test Cases

Same prompt and same user story (SauceDemo login) given to four tools. Raw outputs are in [`raw_outputs/`](./raw_outputs).

**Limits of this comparison:** one feature, one prompt, one run per tool. AI output changes between runs, so treat this as a snapshot, not a ranking.

## 1. Side-by-side

| Criteria | ChatGPT | Claude | Gemini | Copilot |
|---|---|---|---|---|
| Number of test cases | **40** | **32** | **16** | **15** |
| Assumptions listed separately? | Yes (6) | Yes (9) | Yes, but thin (3) | Yes (8) |
| Extras | Test-data table at the top | None | None | None |
| Boundary values | Spaces, 256 chars, Unicode | Spaces, 1 char, 1000 chars, Unicode | Whitespace, 300 chars | Spaces, 256 chars |
| Security checks | SQL injection (4), direct URL, back/forward, client-side bypass (vague), masking, password in URL | Broadest: SQL injection (3), forged cookie, request replay, DOM check, HTTPS, lockout, error-message leakage | SQL injection (2), direct URL, back button, masking | SQL injection (2), direct URL, masking |
| Followed requested table format? | Yes (+ added Test Data column) | Yes (+ Test Data) | Yes (+ Test Data) | Yes (+ Test Data, placed after Steps) |
| Invented or out-of-scope content | Little; one vague "another account" case | Lockout policy, HTTPS redirect, browser "update password" prompt, replay attack | None significant | Assumed a 256-char max length |
| Obvious duplicates (my rough count) | ~6 | ~4 | ~1 | ~1 |
| Expected results usable as-is? | Mostly vague ("appropriate error message") | Generic or wrong wording | **Most precise** (exact messages) | Specific but wrong wording |
| Runnable as written on SauceDemo? | Mostly | Partly (placeholder URL, wrong password) | Yes | Yes |
| SauceDemo special users covered | `locked_out_user` only | `locked_out_user` only | `locked_out_user` only | `locked_out_user` only |

## 2. Per-tool notes

### ChatGPT (40 cases): best coverage, weakest precision
- Strengths: widest range of scenarios; the up-front test data table is a good practice; clearly stated what it did *not* assume (CAPTCHA, MFA, password reset).
- Problems:
  - Most expected results say "appropriate error message is displayed", which a tester cannot pass or fail objectively.
  - TC-016 is titled "Valid password containing special characters" but uses the same data as TC-001 (duplicate).
  - TC-012 says "password with leading/trailing spaces" but the test data column shows plain `secret_sauce`.
  - TC-023 refers to "SauceDemo inventory page" without giving the URL.
  - TC-026 ("client-side manipulation") and TC-035 ("submit repeatedly according to test conditions") are too vague to execute.
  - Several cases overlap: TC-030, TC-037 and TC-004 all test invalid credentials.

### Claude (32 cases): deepest security thinking, least tied to the real app
- Strengths: unique ideas the others missed: forged cookie, request replay, "error must not reveal which field was wrong", case sensitivity, HTTPS, DOM inspection. Most thorough assumptions list.
- Problems:
  - Uses `Secret123!` as the password and `<app-domain>` as the URL, so steps cannot be run on SauceDemo as written. The login page lists `secret_sauce`.
  - Locked-out wording ("This account has been locked out.") is invented.
  - TC_30 (lockout after repeated failures), TC_28 (browser password-update prompt) and TC_32 (HTTPS redirect) go beyond the story.
  - TC_20 expects "Access denied" for a forged cookie, which needs checking against how SauceDemo actually stores its session.

### Gemini (16 cases): smallest set, most accurate
- Strengths: the only tool that quoted SauceDemo's real error messages (`Epic sadface: ...`), including the "you can only access '/inventory.html'" message. Every case is executable as written.
- Problems: only 16 cases. Missed Unicode, spaces-only input, case sensitivity, SQL injection in both fields, cookie forgery, and locked-out user with a wrong password. Its assumptions list is short.

### Copilot (15 cases): concise, but wording is guessed
- Strengths: compact, readable, covers the core acceptance criteria.
- Problems:
  - Expected messages are guessed: "Invalid username or password" and "Account is locked".
  - TC12 expects spaces to be trimmed and login to succeed, which contradicts Gemini.
  - TC14 is non-committal ("succeeds if credentials are valid; otherwise error").
  - TC03 and TC04 (empty fields) are typed as "Boundary" when they are negative tests.
  - Assumption 4 invents a 256-character limit that the story does not mention.

## 3. Where the tools disagreed

This is the most useful part of the comparison: each row is something I had to verify on the real site.

| Scenario | ChatGPT | Claude | Gemini | Copilot | Confirmed on site |
|---|---|---|---|---|---|
| Wrong credentials message | "appropriate error" | "generic error message" | `Epic sadface: Username and password do not match any user in this service` | "Invalid username or password" | **Gemini was exactly right.** `Epic sadface: Username and password do not match any user in this service` |
| Locked-out message | "appropriate error" | "This account has been locked out." | `Epic sadface: Sorry, this user has been locked out.` | "Account is locked" | **Gemini was exactly right.** `Epic sadface: Sorry, this user has been locked out.` |
| Spaces around username | "handled per validation rules" | "trims and logs in, or shows validation (confirm)" | "fails unless trimmed" | "spaces trimmed, login succeeds" | **Gemini and Claude were right; Copilot was wrong.** No trimming occurs — spaces make the login fail with the standard mismatch message. |
| Spaces-only input | "validation message" | "treated as empty; validation message" | not covered | not covered | **Neither guess was quite right.** Spaces are not treated as empty — they trigger the standard mismatch error, the same as any other invalid input. |
| Forged session cookie | "must not provide access" (vague) | "access denied" | not covered | not covered | **Partially confirmed.** Direct access to `/inventory.html` was correctly denied after logout (matches Claude's expectation), but a leftover cookie tied to `/inventory.html` was observed in DevTools after logout — logged separately as an observation in [Project 3's bug report](../03-bug-reports-exploratory/bug_report_example.md), since no actual access bypass was found. |
| Valid password | `secret_sauce` | `Secret123!` | `secret_sauce` | `secret_sauce` | **ChatGPT, Gemini and Copilot were right; Claude was wrong.** The real password is `secret_sauce` — Claude's `Secret123!` does not work on the site at all. |

## 4. What none of them covered

- **Other SauceDemo users:** `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`. All four tools only used `standard_user` and `locked_out_user`. I added TC-02 for this.
- **Submitting with the Enter key.** I added this as TC-03.
- **Exact application messages.** Only Gemini used real messages. The others cannot know them unless they are told, which is a general limit of AI test generation without access to the running app.

## 5. How the four sets became one

- **103** raw test cases (40 + 32 + 16 + 15)
- **93** were merged into 27 final cases (a few raw cases feed two final cases)
- **10** were dropped
- **2** were added by me (TC-02, TC-03)
- **29** final cases in [`final_test_cases.md`](./final_test_cases.md)

**Dropped cases and why**

| Raw case | Reason |
|---|---|
| ChatGPT TC-016 | Duplicate of TC-001 despite a different title |
| ChatGPT TC-030, TC-031, TC-032 | Depend on browser password-manager behavior, not the app; TC-031 also too vague |
| ChatGPT TC-039 | Session refresh is outside the login story |
| Claude TC_13 | Single-character input has the same outcome as any invalid credentials |
| Claude TC_22 | Request replay needs a proxy tool and does not fit a client-side demo app |
| Claude TC_25 | Autocomplete attribute policy is not in the story |
| Claude TC_28 | Tests the browser's "update password" prompt, not the app |
| Claude TC_32 | HTTPS enforcement is not in the story |

## 6. Traceability (raw case → final case)

| Final | ChatGPT | Claude | Gemini | Copilot |
|---|---|---|---|---|
| TC-01 | TC-001 | TC_01 | TC_LOG_001 | TC01 |
| TC-04 | TC-029 | TC_26, TC_27 | TC_LOG_002 | TC09 |
| TC-05 | TC-038 | | | |
| TC-06 | TC-002, TC-004 | TC_02, TC_04 | TC_LOG_004 | TC02 |
| TC-07 | TC-003 | TC_03 | TC_LOG_003 | TC02 |
| TC-08 | TC-005 | TC_05 | TC_LOG_006 | TC03 |
| TC-09 | TC-006 | TC_06 | TC_LOG_007 | TC04 |
| TC-10 | TC-007 | TC_07 | TC_LOG_008 | |
| TC-11 | TC-021 | TC_10 | TC_LOG_005 | TC05 |
| TC-12 | TC-022 | | | |
| TC-13 | TC-008, TC-009 | TC_08 | | |
| TC-14 | TC-010, TC-011 | TC_09 | TC_LOG_009 | TC12 |
| TC-15 | TC-012 | | | TC13 |
| TC-16 | TC-033 | TC_29 | | |
| TC-17 | TC-013 | TC_11 | TC_LOG_010 | TC10 |
| TC-18 | TC-014 | TC_12 | TC_LOG_010 | TC11 |
| TC-19 | TC-015 | TC_14 | TC_LOG_016 | TC14 |
| TC-20 | TC-034 | TC_15 | | |
| TC-21 | TC-017, TC-019, TC-020 | TC_16, TC_18 | TC_LOG_012 | TC06 |
| TC-22 | TC-018 | TC_17 | TC_LOG_013 | TC07 |
| TC-23 | TC-027 | TC_23, TC_24 | TC_LOG_011 | TC15 |
| TC-24 | TC-028 | | | |
| TC-25 | TC-023, TC-024, TC-037 | TC_19 | TC_LOG_014 | TC08 |
| TC-26 | TC-025, TC-040 | TC_21 | TC_LOG_015 | |
| TC-27 | TC-026 | TC_20 | | |
| TC-28 | TC-036 | TC_31 | | |
| TC-29 | TC-035 | TC_30 | | |

## 7. Takeaways

1. **More cases is not better.** ChatGPT's 40 shrank to a handful of unique scenarios once duplicates were removed. Gemini's 16 were the most accurate.
2. **AI guesses application-specific details.** Error messages, passwords and URLs were invented or left vague unless the tool already knew the site.
3. **Tools complement each other.** ChatGPT for breadth, Claude for security ideas, Gemini for precision. Using one tool to draft and another to fill gaps worked better than any single tool.
4. **Human review decides quality.** Deduplicating, correcting expected results and executing the cases on the real site was the real work.

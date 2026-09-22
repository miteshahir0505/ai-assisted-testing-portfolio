# Example: Prompt 2 (Test Case Review) in action

**Input given to the AI:** the user story from Project 1, plus all 40 of ChatGPT's raw test cases ([`raw_outputs/chatgpt.md`](../01-test-case-generation/raw_outputs/chatgpt.md)).

## AI's review output

### 1. Duplicates or near-duplicates
- **TC-001 and TC-016** — both titled differently ("Login with valid credentials" vs "Valid password containing special characters") but use identical test data (`standard_user` / `secret_sauce`) and identical steps. TC-016's title promises something the test data doesn't deliver.
- **TC-017, TC-019, TC-020** — all three test SQL injection in the username field with only the payload changed (`' OR '1'='1`, `' OR '1'='1` in both fields, `admin'--`). Could be one parameterized case instead of three.
- **TC-023, TC-024, TC-037** — all test "can't reach inventory without a valid session," just from slightly different angles (direct URL, after a failed login, observing the resulting page). Largely the same underlying check.
- **TC-025 and TC-040** — "browser back/forward" and "inventory access after logout" both test whether a stale/no session can reach the inventory page.
- **TC-029 and TC-038** — "browser saved credentials" login and "valid login after a failed attempt" both end in the same successful-login assertion; only the path to get there differs.

### 2. Vague expected results
- **TC-002 through TC-009:** "an appropriate error message is displayed" appears seven times. This can't be marked pass/fail without already knowing what the message should say.
- **TC-010, TC-011, TC-012:** "handles the input according to its validation rules" — this restates that there are rules, without saying what the result should be.
- **TC-033:** "follows the application's defined case-sensitivity rules" — same issue; there's no defined rule to check against.
- **TC-039:** "according to the application's session behavior" — doesn't say what that behavior is.

### 3. Test data that doesn't match the title or steps
- **TC-016** ("Valid password containing special characters") — test data is the plain password `secret_sauce`, with no special characters at all.
- **TC-012** ("Password with leading/trailing spaces") — test data shows `secret_sauce` with no spaces; the spacing only appears in the step description, not the data.
- **TC-031** ("Browser saved credentials for another account") — test data says "another valid SauceDemo username" without naming one, so this case can't actually be run as written.

### 4. Cases that go beyond the user story
- **TC-026** ("Client-side login bypass attempt") — the story says nothing about client-side manipulation or dev-tools-level tampering; this is a much deeper security test than the story asks for.
- **TC-031** — the story is about one user logging in, not about cross-account credential handling.
- **TC-035** ("Repeated invalid login attempts... submit repeatedly according to test conditions") — implies a rate-limit or lockout-after-N-attempts policy that isn't in the story, and the step itself is unclear about how many times to repeat.

### 5. Missing scenarios / acceptance criteria not directly covered
- The story's four acceptance criteria are covered at a basic level, but:
  - No case tests the **locked-out user with an incorrect password** (only correct password + locked account).
  - No case uses any SauceDemo account besides `standard_user`, `invalid_user`, and `locked_out_user` — the other valid demo accounts aren't mentioned at all.
  - No case tests submitting the form with the **Enter key** instead of clicking Login.

### 6. Suggested final count after cleanup
Around **24–26** cases, after merging the SQL-injection trio into one parameterized case, merging the three inventory-access duplicates into one, replacing vague expected results with something checkable, and dropping TC-026 and TC-031 as out of scope.

---

## My review of the AI's review (does it hold up?)

I didn't just accept this — I checked it against my actual execution notes from Project 1.

| AI's claim | Did I confirm it? |
|---|---|
| TC-001/TC-016 are duplicates | **Confirmed.** I dropped TC-016 when building the final set. |
| SQL injection trio can merge | **Confirmed**, and I did merge them into TC-21 in the final set. |
| Vague "appropriate error message" is a real problem | **Confirmed** — this was the single biggest issue across all 40, and Gemini's cases were the only ones that didn't have it. |
| TC-012's test data doesn't match its title | **Confirmed** by re-reading the raw file — the AI reviewer caught something I'd also flagged manually. |
| Missing "locked-out user + wrong password" case | **Confirmed as a real gap.** I added this as TC-12 in the final set, and executing it turned out to be one of the most interesting results — it returns the generic mismatch message, not the lockout message. |
| Missing other SauceDemo accounts | **Confirmed** — I added this as TC-02. |
| Suggested final count of 24–26 | **Close.** My actual final count was 29, because I also added Enter-key submission and a few more boundary variants the reviewer didn't flag. |

**Where the AI reviewer fell short:** it didn't catch that TC-031 (another account's saved credentials) can't be executed at all since no second account is named — I found that by trying to actually run it. It also didn't flag that TC-023's "inventory URL" is never given as an actual URL, which makes the step non-executable as written.

## Takeaway

The review prompt caught real, useful issues (duplicates, vague results, mismatched data, an actual coverage gap that later became a genuinely interesting finding). But it still needed a human pass to catch cases that look fine on paper but can't actually be executed, and to decide the final case count with judgment rather than a rough estimate.

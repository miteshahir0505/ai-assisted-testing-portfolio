# Bug Report: Session cookie persists after logout on /inventory.html

**Built using:** [Prompt 4 (bug report writing)](../02-prompt-library/prompts.md#4-bug-report-writing) from my prompt library, based on my own rough notes from testing TC-27 in [Project 1](../01-test-case-generation/final_test_cases.md).

## My rough notes (what I gave the AI)

```
tested forged cookie scenario on saucedemo login. logged in as standard_user,
opened devtools application cookies tab, saw a cookie related to inventory.html.
logged out. checked cookies again - the inventory.html related cookie is still
there, but a separate cookie holding the username got removed on logout.
tried navigating to /inventory.html after logout anyway - got redirected to
login page correctly, so no bypass happened. chrome, saucedemo.com.
```

## AI-generated bug report (unedited)

> **Title:** Cookie associated with `/inventory.html` is not cleared on logout
>
> **Environment:** Chrome, saucedemo.com
>
> **Preconditions:** User is logged in as `standard_user`
>
> **Steps to reproduce:**
> 1. Log in as `standard_user`
> 2. Open DevTools → Application → Cookies
> 3. Note the cookies present, including one associated with `/inventory.html`
> 4. Log out via the app's logout control
> 5. Return to DevTools → Application → Cookies and compare
>
> **Expected result:** All session-related cookies are cleared on logout
>
> **Actual result:** The username-holding session cookie is cleared, but a cookie associated with `/inventory.html` remains present
>
> **Severity / Priority suggestion:** Low / Low — reasoning: attempting to access `/inventory.html` after logout still correctly redirects to the login page, so the leftover cookie does not appear to grant any actual access
>
> **Attachments to include:** Screenshot of the Cookies panel before and after logout
>
> **Questions for the reporter:**
> - What is the exact name of the cookie that persists?
> - Does the same cookie reappear if you log in as a different user, or does a fresh one get created?
> - Does the persisting cookie have an expiry date, or is it a session cookie that should have been cleared with the browser tab close?

## My review

**What the AI got right:**
- It correctly refused to guess the cookie's name, or to escalate severity without evidence — it asked instead of assuming.
- It correctly reasoned that "no confirmed bypass" plus "cookie still present" nets out to Low severity, not a security-critical bug. It didn't overstate the risk from limited information, which is exactly what I'd want from a real bug report.
- The steps to reproduce are clear and match what I actually did.

**What I changed:**
- Reworded the title slightly for clarity in the tracker: *"Stale cookie remains after logout (no confirmed access impact)"* — makes the "no confirmed impact" part visible without opening the ticket.
- Added a note in the description that TC-26 (browser Back after logout) was independently retested and also correctly denied access, which supports the "no bypass" conclusion with a second data point.
- Left the reporter questions in as follow-up tasks rather than closing them out, since I haven't isolated the exact cookie name yet.

## Final bug report (as I'd file it)

**Title:** Stale cookie remains after logout on `/inventory.html` (no confirmed access impact)

**Severity:** Low **Priority:** Low

**Environment:** Chrome, https://www.saucedemo.com/

**Steps to reproduce:**
1. Log in as `standard_user`.
2. Open DevTools → Application → Cookies for `saucedemo.com`.
3. Note the cookies present.
4. Log out using the app's Logout menu option.
5. Re-open DevTools → Application → Cookies and compare against step 3.

**Expected:** All session-related cookies are cleared on logout.

**Actual:** A cookie associated with `/inventory.html` remains after logout, while the username/session cookie is correctly cleared.

**Impact assessment:** Retested by navigating directly to `/inventory.html` after logout (see TC-25) and via the browser Back button after logout (see TC-26) — both correctly redirect to the login page with an access-denied message. No evidence the leftover cookie grants any access on its own.

**Open questions before closing:**
- Exact name/value of the persisting cookie
- Whether it has an expiry date or should be a session-only cookie
- Whether it persists across different user logins

**Status:** Needs isolation before it can be confidently marked "no impact" and closed, or escalated if a bypass path is later found.

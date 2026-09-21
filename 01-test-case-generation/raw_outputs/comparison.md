# AI Tool Comparison: Login Test Cases

| Criteria | ChatGPT | Claude | Gemini | Copilot |
|---|---|---|---|---|
| Number of test cases | 40 | 32 | 16 | 15 |
| Listed assumptions separately? | Yes (6) | Yes (9) | Yes, but thin (3) | Yes (8) |
| Covered boundary values? | Yes: spaces, 256 chars, Unicode | Yes: spaces, 1 char, 1000 chars, Unicode | Partly: whitespace, 300 chars | Yes: spaces, 256 chars |
| Covered security checks? | Yes: SQL injection, direct URL, back/forward, masking, password in URL | Most thorough: SQL injection, forged cookie, request replay, DOM check, HTTPS, error-message leakage | Some: SQL injection, direct URL, back button, masking | Basic: SQL injection, direct URL, masking |
| Followed the table format I asked for? | Yes (added a Test Data column) | Yes (added a Test Data column) | Yes (added a Test Data column) | Yes (added a Test Data column, placed after Steps) |
| Invented features not in the story? | Little; one vague "another account" case | Yes: lockout policy, HTTPS redirect, browser password-update prompt, replay attack | None significant | Yes: assumed a 256-character limit and guessed error wording |
| Obvious duplicates (approx. count) | ~6 | ~4 | ~1 | ~1 |
| Knew about SauceDemo special users? | Only `locked_out_user` | Only `locked_out_user` | Only `locked_out_user` | Only `locked_out_user` |

## Observations
- **Which tool followed instructions best?** Gemini. It was the only one that stayed within the story ("do not invent features") and used the real SauceDemo error messages. ChatGPT was strongest at stating assumptions, including what it deliberately did not assume (CAPTCHA, MFA).
- **Which had the most unique cases?** ChatGPT had the most cases (40) but many overlapped. Claude had the most unique ideas: forged cookie, request replay, "error must not reveal which field was wrong", and HTTPS.
- **Which invented features?** Claude added the most out-of-scope content (lockout, HTTPS, browser prompt). Copilot guessed error messages and a length limit. Gemini and ChatGPT stayed closest to the story.
- **What did all four miss?** `problem_user`, `performance_glitch_user`, `error_user` and `visual_user`, plus submitting with the Enter key.

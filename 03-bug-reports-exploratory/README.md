# Project 3: Bug Reports & Exploratory Testing


**App under test:** [saucedemo.com](https://www.saucedemo.com/)

**Goal:** Show how AI helps write clear bug reports from rough notes, and how it can suggest exploratory testing charters — with my review on both.

## Folder contents

| File | What it is |
|---|---|
| [`bug_report_example.md`](./bug_report_example.md) | A real bug report, built from rough notes I wrote during Project 1's TC-27 execution |
| [`exploratory_testing.md`](./exploratory_testing.md) | AI-generated exploratory charters for cart/checkout, with my session notes |

## 1. Bug report writing

This isn't a staged example — TC-27 in Project 1 turned up a real observation (a cookie that outlives logout), and I ran my rough notes through [Prompt 4](../02-prompt-library/prompts.md#4-bug-report-writing) to turn it into a proper report.

**What stood out:** the AI didn't inflate the severity. Given "a cookie persists after logout" with no confirmed way to exploit it, a less careful write-up might call this a security vulnerability. The AI correctly rated it Low/Low and asked clarifying questions instead of guessing at impact — that's the behavior I want from a bug-report assistant, not one that manufactures urgency.

**What I changed:** I reworded the title to make the "no confirmed impact" part visible from the ticket list, and cross-referenced two other test cases (TC-25, TC-26) that independently support the "no bypass" conclusion. Full before/after is in [`bug_report_example.md`](./bug_report_example.md).

## 2. Exploratory testing

I asked the AI for 5 session charters covering cart and checkout, using [Prompt 5](../02-prompt-library/prompts.md#5-exploratory-testing-charters). All 5 stayed within what SauceDemo actually has — no invented features like coupon codes or saved addresses.

I picked 2 of the 5 to actually run, based on real-world risk (state consistency and order-total math matter most on a shopping site), rather than running all 5 just because they were generated. Session notes are in [`exploratory_testing.md`](./exploratory_testing.md).

## What this project shows

1. **AI is useful for structure, not judgment.** It turned messy notes into a properly formatted report and produced a reasonable, risk-scaled severity — but I still decided what to cross-reference and how to title it for the tracker.
2. **Not every AI suggestion needs to be run.** Five charters were generated; I chose 2 based on which risks actually matter for an e-commerce checkout, rather than treating quantity as a target.
3. **Real findings, not staged ones.** The bug report is built from an actual observation made while executing Project 1's test cases, not an invented example.

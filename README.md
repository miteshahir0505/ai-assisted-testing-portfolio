# Mitesh Ahir | QA Manager | Test Automation | Quality Engineering Leadership

QA and Quality Engineering leader with 15+ years of experience in software testing, test automation and team management across SaaS, e-commerce and mobile applications. I progressed from Software Test Engineer to Operations Manager, leading QA teams, defining test strategy and building quality into CI/CD pipelines.

Hands-on with Playwright, TypeScript, JavaScript, REST API testing, SQL and AI-assisted test automation. This page is the entry point to my portfolio. It shows how I use AI to test faster, and how I keep people in charge of the decisions.

**Rule I follow:** every AI output is reviewed by me. Each project documents what the AI got wrong and what I corrected.

---

## In one minute (for non-technical readers)

Software testing is the work of checking that a product does what the business promised before customers find the problems. It is slow and repetitive, and it breaks easily when a website changes.

I have built and tested several small projects that use AI to take on the repetitive parts, and I have tested the AI itself, because AI makes mistakes too. The projects answer four practical questions:

| Business question | What I built | Headline result |
|---|---|---|
| Can we write test plans and test cases faster, without losing quality? | [Dynamic QA Agent](#2-dynamic-qa-agent) and the [AI-assisted exercises](#ai-assisted-testing-exercises-in-this-repo) | One requirement document in, a full set of test documents and an automated test out. 29 test cases were merged from four AI tools and run on a live app |
| Can automated tests repair themselves when a website changes? | [Self-Learning Playwright Agent](#3-self-learning-playwright-agent) and [Self-Healing Test Agent](#4-self-healing-test-agent) | A repeat fix runs in about 9 milliseconds instead of about 6.5 seconds. The repair agent fixed a two-bug example in 5 of 5 runs |
| Can we trust an AI that checks things for us? | [AI QA Agent Core](#5-ai-qa-agent-core) | Found a "false pass", where the AI said a website was fine but had checked the wrong one, and fixed it with a safety check in code |
| Is there a solid, conventional test suite behind all this? | [SauceDemo Playwright Framework](#1-saucedemo-playwright-framework) | 30+ automated tests covering login, security, cart and checkout, run in three browsers |

**What this shows about how I work:** I use AI as a fast first draft, I check its work with independent tests, I say plainly where it falls short, and a person signs off before anything is released.

### How to read this page

- **Business and hiring readers:** read the sections called *The problem* and *What it means for a team* under each project. Skip the technical lines.
- **QA and engineering readers:** each project links to its own repository with setup steps, code and test reports.
- **Unfamiliar word?** See the [plain-English glossary](#plain-english-glossary) at the end.

---

## The projects in detail

### 1. SauceDemo Playwright Framework

[View the project](https://github.com/miteshahir0505/saucedemo-playwright-framework) | Playwright, JavaScript, Page Object Model

**The problem.** Checking every screen of an online shop by hand before each release takes a long time, and people miss things when they repeat the same steps. This is the "regular" automation project that the AI projects build on.

**What I built.** A set of automated tests that act like a customer on a practice shop website (saucedemo.com): logging in, browsing products, adding items to the cart and checking out.

**What it covers.**

- **Login:** correct and wrong passwords, locked-out users, empty fields, very long input, and attempts to break in with malicious text (SQL and script injection).
- **Cart:** adding and removing items, the cart counter, and what happens when the internet connection drops mid-action.
- **Checkout:** the full purchase, form error messages, cancelling, and a connection drop during payment.
- **30+ tests in total**, run in three browsers (Chromium, Firefox and WebKit, which stand in for Chrome, Firefox and Safari) and re-run automatically on GitHub Actions.

**What it means for a team.** The same checks run on every release with no extra effort, the structure is organised so one website change means one fix instead of many, and security and bad-connection cases get tested, not only the happy path.

**Honest limits.** It tests a public practice website, not a real company's product.

---

### 2. Dynamic QA Agent

[View the project](https://github.com/miteshahir0505/dynamic-qa-agent) | TypeScript, Python, Playwright, ChromaDB, Google Gemini

**The problem.** When a new feature is requested, a tester must read the requirement, write a test plan, list scenarios, write detailed test cases with test data, script them, run them, and decide whether the feature follows the business rules. That is a lot of manual work, repeated for every feature.

**What I built.** A tool where you give it one requirement document and it returns a complete first draft of the QA package:

| It produces | In plain terms |
|---|---|
| Test plan | What will be tested and how |
| Test scenarios | The situations that must be covered |
| Test cases with test data | Step-by-step checks and the exact inputs to use |
| Test metrics | A summary of how much is covered |
| Automated browser test | A script that runs the checks like a customer would |
| Verdict | Pass or fail, with a confidence level and written reasoning |

It was applied to three shop workflows: registration, cart and checkout.

**How it works, in five steps.**

1. **Read** the requirement document.
2. **Remember** the business rules in a searchable store, so the AI works from the official rules and does not guess.
3. **Draft** the test documents and the automated test.
4. **Run** the test in a real browser, clicking through the site.
5. **Judge** the outcome: an AI compares what the site actually did with what the requirement says, and explains why.

**Why each design choice matters to a business.**

- **The AI looks up the rules before it writes.** An AI has never seen your company's requirements. Without this step it invents plausible but wrong tests, which is the most dangerous kind of mistake because it looks right.
- **Rules are stored on the local computer.** There is no server to pay for, it works offline, and the full rule set is not sent out. Only the relevant rules and the test evidence go to the AI service.
- **There is a time limit and an offline mode.** If the AI service is slow or unavailable, the run does not hang. It switches to a simple rule-matching judge.
- **A person stays in charge.** The AI drafts and explains. A QA professional reviews and approves.

**What it means for a team.** Testers start from a draft instead of a blank page, every feature gets the same structure of test documents, and each verdict can be traced back to the exact rule it was checked against.

**Honest limits.** Today the rule store holds three requirement documents. The design is meant to keep working when there are many more, but that has not been tested at scale. The AI judge can be wrong, which is why it shows its reasoning and confidence for a person to review.

---

### 3. Self-Learning Playwright Agent

[View the project](https://github.com/miteshahir0505/self-learning-playwright-agent) | Playwright, TypeScript, Google Gemini

**The problem.** Automated tests break when a website changes. A button gets a new name or ID, and dozens of tests fail even though nothing is actually wrong. Fixing them takes QA time that could be spent finding real defects. Writing test cases for every new feature is also slow.

**What I built.** Two abilities in one project:

1. **Test cases from requirements.** A requirement written in a simple text file goes to an AI, which returns prioritised test cases (normal, negative and edge cases) saved in a structured file, so each test traces back to its requirement. One example requirement produced 8 test cases, including edge cases a first manual review might miss, such as a double click that adds an item twice.
2. **A repair agent for broken tests.** When a test cannot find a button, the agent asks the AI for a working replacement using the page's real content. It then checks that replacement against the live page before using it, and saves it. If the same problem happens again, the saved fix is reused with no AI call.

**What I measured.**

| Situation | Result |
|---|---|
| First time a broken element is found | About 6.5 seconds (AI call plus check) |
| Every time after that | About 9 milliseconds, roughly 700 times faster, with no extra AI cost |
| An element whose ID changes on every page load | One AI call produced a pattern-based fix that worked on 5 later runs, each with a different random ID |

**What it means for a team.** Less time spent repairing tests, and a lower AI bill, because repeat problems are solved from memory.

**Honest limits.** The generated tests are a starting draft. A person implements and reviews them, and the AI's suggestion is always checked before it is trusted, so a wrong guess fails visibly instead of passing silently. The measurements come from small local demos, not a large production system.

---

### 4. Self-Healing Test Agent

[View the project](https://github.com/miteshahir0505/self-healing-test-agent) | TypeScript, Groq AI model, Langfuse, LangSmith

**The problem.** AI is good at spotting a bug when shown the code and the failing test, but it is not reliable at fixing it safely. It can answer in the wrong format, make things worse, or return nothing. This project is about the safety code *around* the AI.

**What I built.** An agent that follows a repeating loop: run the test, and if it fails, ask the AI for a fix, check the answer with plain code, apply the fix, and run the test again. It stops when the test passes or after 3 attempts. Every step is recorded in an observability tool, so a failed run can be investigated afterwards instead of guessed at.

**The safety rules (all plain code, so they behave the same every time).**

- An unusable AI answer is ignored and changes nothing.
- The line the AI points at must match the file exactly once.
- **The test is the judge.** A fix only counts if the test passes, and the agent never edits the test itself.
- **Rollback.** If the run ends without a passing test, the original file is restored, so a failed run never leaves a half-fixed file.

**Before and after.** I built two versions to compare. The first version threw away any fix that did not pass the test on its own. On a file with two bugs, that meant it discarded each correct fix because the other bug was still there, and it gave up after 3 attempts. The improved version keeps a fix unless it crashes the test.

| Version | On a file with two bugs |
|---|---|
| Before | Gave up after 3 attempts in the recorded run |
| After | Healed in 2 to 3 attempts, in 5 of 5 runs (2.4 attempts on average) |

**What I learned.** The AI answers differently from run to run, so results must be counted over several runs. Also, three answers were *correct* but written in a way the code could not read. Looking at the exact recorded answer is what revealed this.

**What it means for a team.** It shows how to put an AI inside an automated process safely, with limits, checks, rollback and a full audit trail.

**Honest limits.** One AI model, one small file with a one-function test, and five runs. Read "5 of 5" as "5 of 5 on this test", not as a general reliability figure. The two versions also used different recording tools, so the comparison is not perfectly controlled.

---

### 5. AI QA Agent Core

[View the project](https://github.com/miteshahir0505/ai-qa-agent-core) | TypeScript, Groq AI models

**The problem.** If AI is used to check that websites and services are working, who checks the AI?

**What I built.** A small AI agent that answers questions in plain English such as "Is this website up?" or "Does this data service return a title field?", plus a test suite that measures how reliably three different AI models behave as that agent.

**The story that started the project.** I asked the agent whether a company's website was up, giving only the company name. The AI invented a web address, checked that one, and reported "up and running". It was the wrong website. This is called a **false pass**, and it is the worst failure for a testing tool, because the result looks green and is wrong.

**The fix: two layers of safety.** First I wrote a rule telling the AI not to guess. That helped, but on one model the rule for an unusual address ending worked only about half the time. So I moved the safety into code, which gives the same answer every time. A written rule is a request. A code check is a guarantee.

**Results.**

| Layer | Result |
|---|---|
| Code safety layer | 8 of 8 test cases passed |
| AI layer, three models | About 88% to 90% of counted runs passed (44, 45 and 44 of 50) |

Each AI test is repeated 5 times because AI answers vary. Runs refused by the free service's rate limits are not counted as failures, because they say nothing about the AI.

**What it means for a team.** Do not let an AI make a high-stakes call on its own. Put a code check in front of it, and measure it over many runs.

**Honest limits.** The project lists its own gaps. Models often refuse a short address typed without `https://`, and a typo that happens to be a real website would get past the code check. This is Day 1 of a planned seven-project series, and the later projects are not built yet.

---

## AI-assisted testing exercises (in this repo)

These are the smaller, hands-on exercises in this repository. Each shows how I use AI day to day while keeping my own judgment.

| # | Exercise | What it shows | In plain terms |
|---|---|---|---|
| 1 | [Test case generation](./01-test-case-generation) | Same prompt run across 4 AI tools, compared, merged into 29 cases, all executed on the live app | I did not trust one AI. I compared four, kept the best parts, and ran every case for real |
| 2 | [Prompt library](./02-prompt-library) | 8 reusable prompts for testers, with real worked examples | Ready-made instructions that a tester can reuse to get consistent AI help |
| 3 | [Bug reports & exploratory testing](./03-bug-reports-exploratory) | A real bug report from an actual finding, plus AI-generated exploratory charters | A clear, usable defect report, and AI-suggested areas to explore beyond the planned tests |
| 4 | [Manual to automation](./04-manual-to-automation) | 3 executed manual test cases converted into Playwright scripts | Turning checks a person did by hand into automated tests that can run on every release |

---

## QA leadership

[QA & Operations Playbook](https://clean-lawyer-756.notion.site/Mitesh-Ahir-QA-Operations-Playbook-4055be0ed8d5808aa90ee6c6b128bf43): the frameworks I use to run releases in fast-moving teams.

| Framework | In plain terms |
|---|---|
| **Green / Yellow / Red release risk matrix** | Before a major release, each feature is rated. Green is ready, Yellow needs a named person to accept known trade-offs, and Red automatically stops the release until fixed |
| **Scope freeze and change requests** | After a set date, no new requirements are added without an impact assessment: what is dropped, what is the testing risk, and who approves |
| **Business-language bug summaries** | Technical bug reports are rewritten as business impact for executives, for example "prevents checkout timeouts and revenue loss at peak hours" |
| **Cross-functional dependency and QA handshake** | A shared log of every outside team or supplier a release depends on, with owners, risk levels, buffer dates and a clear escalation path that presents facts instead of blame |

---

## Skills

- **Testing:** Test Planning, Test Case Design, Test Execution, Integration, Regression, UI and API Testing, Web Accessibility, Defect Management
- **Automation:** Playwright, TypeScript, JavaScript, Page Object Model, CI/CD, GitHub Actions, Test-Driven Development
- **APIs and data:** REST APIs, Postman, SQL, ETL
- **AI in QA:** AI-assisted test generation, prompt engineering, LLM and AI agent testing, RAG, Langfuse, LangSmith
- **Management:** Team Management, Mentoring, Release Management, Risk Management, Scrum, Waterfall, Jira, Trello

## Tools used

Playwright, TypeScript, JavaScript, Postman, GitHub Actions, Jira, Claude, ChatGPT, Gemini, Copilot (free tiers), Langfuse, LangSmith, ChromaDB

---

## Plain-English glossary

| Term | What it means |
|---|---|
| **Test case** | A written set of steps and expected results used to check one thing works |
| **Test automation** | A script that runs test cases by itself instead of a person clicking through |
| **Playwright** | A tool that controls a real web browser to run automated tests |
| **Regression** | Checking that something that worked before still works after a change |
| **Selector** | The address an automated test uses to find a button or field on a page. If the page changes, the selector can break |
| **Self-healing** | An automated test that detects its own broken selector and repairs it |
| **AI agent** | An AI that does a task in steps, using tools, instead of only answering a question |
| **LLM** | A large language model, the kind of AI behind chat assistants |
| **RAG** | "Retrieval-Augmented Generation": the AI first looks up the relevant facts from a trusted source, then answers. An open-book exam instead of a closed-book one |
| **Guardrail** | A check that stops the AI from doing something unsafe or wrong, no matter what the AI decides |
| **False pass** | A test result that says everything is fine when it is not. The most dangerous kind of failure for a testing tool |
| **Rollback** | Undoing a change and restoring the original, if the change did not work |
| **Observability / tracing** | Recording every step the AI took, so a failure can be investigated afterwards |
| **CI (continuous integration)** | Tests that run automatically every time code changes |

---

## Note

All examples use public practice apps (saucedemo.com) and made-up requirements. No confidential data.

## Connect

- LinkedIn: https://www.linkedin.com/in/mitesh-ahir-48376828/
- GitHub: https://github.com/miteshahir0505

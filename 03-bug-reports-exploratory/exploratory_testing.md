# Exploratory Testing: Cart & Checkout

**Built using:** [Prompt 5 (exploratory testing charters)](../02-prompt-library/prompts.md#5-exploratory-testing-charters) from my prompt library.
**Feature explored:** Adding/removing items, sorting, and checkout on saucedemo.com.
**Session length:** [TODO: fill in once run, e.g., 45 min]

## Prompt input

```
Act as an exploratory testing coach. For the feature below, create 5
session charters...

Feature description:
Shopping cart and checkout flow on saucedemo.com — adding/removing
products, sorting the product list, entering checkout details, and
completing an order.
```

## AI-generated charters (unedited)

> **Charter 1 — Explore adding/removing items with rapid repeated actions to discover state inconsistencies**
> Time box: 30 min
> - What if I add the same item twice quickly?
> - What if I remove an item, then immediately re-add it before the UI updates?
> - What if I add all items, then remove them in a different order than I added them?
> - What if I open the cart while an add/remove action is still processing?
> - What if I add an item, refresh the page, and check if it's still in the cart?
> Main risk: cart count or contents becoming out of sync with what's actually in the cart.
>
> **Charter 2 — Explore sorting with edge-case interactions to discover display bugs**
> Time box: 20 min
> - What if I sort by price low-to-high, then immediately sort by name Z-A?
> - What if I sort, then add an item to the cart — does the sort order survive?
> - What if I sort, then use the browser Back button — does it remember the sort?
> - What if I sort by price when multiple items share the same price?
> - What if I open a product detail page mid-sort and go back?
> Main risk: the product list losing or duplicating items, or resetting sort unexpectedly.
>
> **Charter 3 — Explore checkout form with unusual and interrupted input to discover validation gaps**
> Time box: 30 min
> - What if I enter only whitespace in the name fields?
> - What if I go back from the overview page and change my cart, then continue?
> - What if I refresh the browser mid-checkout?
> - What if I use the browser Back button after reaching the confirmation page and try to check out again?
> - What if I open checkout in a second tab while the first is mid-flow?
> Main risk: an order being placed with invalid/incomplete data, or a duplicate order.
>
> **Charter 4 — Explore cart state across navigation and session boundaries to discover persistence bugs**
> Time box: 20 min
> - What if I add items, log out, then log back in — is the cart preserved?
> - What if I add items as one user, log out, and log in as a different user?
> - What if I close the tab and reopen the site — does the cart survive?
> - What if I add items, then navigate directly to the checkout URL without visiting the cart first?
> - What if I remove every item from the cart at the checkout overview step, then try to finish?
> Main risk: cart contents leaking between users, or checkout proceeding with an empty cart.
>
> **Charter 5 — Explore the order total and math with varied cart contents to discover calculation bugs**
> Time box: 20 min
> - What if I add every available product and check whether the total matches the sum?
> - What if I add one item, remove it, add it back, and check the total each time?
> - What if I add the most expensive and least expensive items only?
> - What if I check whether the displayed tax amount matches a consistent rate across different cart totals?
> - What if I cancel checkout partway and re-enter — does the total recompute correctly?
> Main risk: a total that doesn't match the actual sum of item prices plus tax.

## My review of the charters

All five stay reasonably close to the feature and none invent functionality that doesn't exist (no charter assumes coupon codes, saved addresses, or other things SauceDemo doesn't have). Charter 4's "log in as a different user" idea is especially good, since cart-state leaking between accounts would be a serious bug on a real e-commerce site.

I picked the two most realistic-risk charters to actually run, given limited time: **Charter 1** (state consistency) and **Charter 5** (total math), since these map most directly to money and correctness — the things a real business would care about most.

## Session notes

[TODO: fill in as you run Charter 1 and Charter 5 — or any others]

### Charter 1: Adding/removing items — session notes

| What if... | What happened |
|---|---|
| Add the same item twice quickly | [TODO] |
| Remove then immediately re-add before UI updates | [TODO] |
| Add all items, remove in a different order | [TODO] |
| Add an item, refresh the page | [TODO] |

**Bugs/observations found:** [TODO]

### Charter 5: Order total and math — session notes

| What if... | What happened |
|---|---|
| Add every product, check total vs. sum | [TODO] |
| Add, remove, re-add same item — total each time | [TODO] |
| Most expensive + least expensive only | [TODO] |
| Tax rate consistent across different totals | [TODO] |

**Bugs/observations found:** [TODO]

## Session summary

- **Charters run:** [TODO — e.g., "1 and 5 of 5"]
- **Time spent:** [TODO]
- **Bugs found:** [TODO]
- **Would I run the other charters?** [TODO — e.g., "Yes, Charter 4 next since cross-user cart leakage would be the most serious possible finding"]

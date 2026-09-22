# Exploratory Testing: Cart & Checkout

**Built using:** [Prompt 5 (exploratory testing charters)](../02-prompt-library/prompts.md#5-exploratory-testing-charters) from my prompt library.

**Feature explored:** Adding/removing items, sorting, and checkout on saucedemo.com.

**Session length:** ~40 minutes

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

### Charter 1: Adding/removing items — session notes

| What if... | What happened |
|---|---|
| Add the same item twice quickly | Not actually possible to trigger — after the first click, the **Add to cart** button immediately becomes a **Remove** button, so a second click removes the item instead of adding a duplicate. The UI prevents this case by design. |
| Remove then immediately re-add before UI updates | No race condition observed. The cart badge correctly shows `1` (or disappears entirely when empty) and the button reliably toggles between **Add to cart** and **Remove** on each click, with no lag or stuck state. |
| Add all items, remove in a different order | Cart count decreased correctly every time, regardless of the order items were removed in. No item was left behind or double-counted. |
| Add an item, refresh the page | The cart contents and count persisted correctly after a full page refresh — no reset to empty. |

**Bugs/observations found:** None. Cart add/remove state handling is solid — no desync between the displayed count and actual cart contents under any of these conditions, and the UI's Add↔Remove toggle prevents the double-add scenario by design rather than needing extra validation.

### Charter 5: Order total and math — session notes

| What if... | What happened |
|---|---|
| Add every product, check total vs. sum | The checkout overview page lists each item's individual price alongside the overall total for all selected items. Individual prices were visible and consistent with what was shown on the product list. |
| Add, remove, re-add the same item — total each time | Price stayed consistent across remove/re-add — no drift or rounding change. **Observation:** removing an item from the checkout overview page and then re-adding it causes that item to reappear at the **bottom of the list** rather than its original position. Not a pricing bug, but a minor ordering inconsistency worth noting. |
| Most expensive + least expensive only | Not run as an isolated case this session — general pricing behavior was already confirmed consistent across the other two checks, so this was deprioritized given time. Flagged to run in a future session. |
| Tax rate consistent across different totals | Confirmed consistent. Tax scaled up and down correctly as items were added or removed, in line with a fixed percentage of the item total rather than a flat amount. |

**Bugs/observations found:** One minor UX observation — an item removed and re-added during checkout moves to the bottom of the item list instead of staying in its original position. No pricing or total-calculation bugs found; individual prices, the item total, and tax all stayed mathematically consistent throughout.

## Session summary

- **Charters run:** Charter 1 and Charter 5 (of 5). Charters 2, 3 and 4 not run.
- **Time spent:** ~40 minutes 
- **Bugs found:** None severity-worthy. One minor UX observation: re-added checkout items reorder to the bottom of the list rather than keeping their original position.
- **Would I run the other charters?** Charter 4 (cart state across users/sessions) next — cross-user cart leakage would be the most serious possible finding on a real e-commerce site, more so than sorting (Charter 2) or checkout-interruption edge cases (Charter 3).

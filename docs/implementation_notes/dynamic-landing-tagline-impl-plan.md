# Dynamic Landing Tagline Implementation Plan

## Overview
Update the landing page tagline in `se/components/LandingPage.vue` to be dynamic, generating text that references the project categories from the portfolio store (`se/stores/portfolio.ts`).

## Approach
- Add a computed property `tagline` in the LandingPage.vue script that extracts unique categories from `portfolioStore.projects`, maps them to readable names, and constructs a descriptive string.
- Update the ShinyText component in the template to bind the `text` prop to the computed `tagline`.

## Specific Code Changes
1. Import `computed` from 'vue' in the script setup.
2. Add the `tagline` computed property after the store initialization.
3. Replace the static `text` prop with `:text="tagline"` in the ShinyText component.

## Potential Challenges
- TypeScript indexing issues with category mapping; resolved by using `as keyof typeof categoryNames`.
- Ensuring the component re-renders if projects are updated dynamically (currently projects are static).

## Testing
- Manual verification that the tagline displays the expected text based on project categories.
- Check for TypeScript compilation errors.
- Ensure the dev server runs without issues.
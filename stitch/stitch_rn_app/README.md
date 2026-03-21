# Stitch React Native App

This project implements all Stitch template pages in React Native using Expo and TypeScript.

## Implemented pages

- Helper Cane Chat page
- Upgrade to Pro paywall page
- User Profile page

## Template-to-screen mapping

- `stitch/helper_cane_chat/code.html` -> `src/screens/HelperCaneChatScreen.tsx`
- `stitch/upgrade_to_pro/code.html` -> `src/screens/UpgradeToProScreen.tsx`
- `stitch/user_profile/code.html` -> `src/screens/UserProfileScreen.tsx`
- `stitch/mint_moss/DESIGN.md` -> `src/theme/tokens.ts` and shared visual styles

## Tech stack

- Expo + React Native + TypeScript
- React Navigation (stack + bottom tabs)
- Expo Linear Gradient
- Expo Blur
- Plus Jakarta Sans via Expo Google Fonts

## Run locally

1. Go to the app folder:
   - `cd stitch/stitch_rn_app`
2. Install dependencies:
   - `npm install`
3. Start development server:
   - `npm run start`
4. Run on a device:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Or scan the QR with Expo Go

## Navigation flow

- Bottom tabs:
  - Chat
  - Profile
- Modal route:
  - UpgradeToPro (opened from the Profile premium card)

## Design implementation notes

- Uses the botanical token palette from your provided design document.
- Keeps the no-line structure by favoring layered surface tiers over hard dividers.
- Applies the signature premium gradient to key CTAs and the profile promo card.
- Uses glass-like blur for floating navigation and headers.

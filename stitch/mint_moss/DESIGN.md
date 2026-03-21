# Design System Document: The Botanical Intelligence

## 1. Overview & Creative North Star
### Creative North Star: "The Living Conservatory"
This design system rejects the clinical, sterile aesthetic of typical AI interfaces. Instead, it adopts a high-end editorial approach titled **The Living Conservatory**. The goal is to make the chatbot feel less like a machine and more like a curated, organic experience. 

We break the "template" look by utilizing heavy asymmetric whitespace, overlapping "frosted" surfaces, and a typography scale that favors dramatic contrast. The UI should feel like a high-end wellness magazine—breathable, sophisticated, and intentionally soft. We prioritize "Tonal Depth" over structural rigidity, ensuring every screen feels like a physical layer of fine vellum paper or soft-touch organic material.

---

## 2. Colors
Our palette is a sophisticated range of botanical greens and lithographic neutrals. 

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning or containment. Structural separation must be achieved through background shifts (e.g., a `surface-container-low` card sitting on a `surface` background).

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- **Base Level:** `surface` (`#f7faf7`)
- **Secondary Tier:** `surface-container-low` (`#f0f5f1`) for grouped content.
- **Floating Tier:** `surface-container-lowest` (`#ffffff`) for interactive cards that need to "pop."

### The "Glass & Gradient" Rule
To elevate beyond standard Material Design:
- **Glassmorphism:** Use `surface-container-lowest` with 80% opacity and a 20px backdrop-blur for floating headers or navigation bars.
- **Signature Textures:** For high-impact areas (Premium CTA), use a subtle linear gradient from `primary` (`#146c49`) to `secondary` (`#2b6b40`) at a 135-degree angle. This provides a "soul" and depth that flat color cannot replicate.

---

## 3. Typography: Plus Jakarta Sans
We use **Plus Jakarta Sans** for its geometric clarity and contemporary warmth. 

- **Display (Large/Med):** Reserved for "Hero" moments in the profile or paywall. Use `display-md` (2.75rem) to create editorial impact.
- **Headline (Sm/Med):** Used for section titles. Pair `headline-sm` (1.5rem) with increased letter-spacing (-0.02em) for a custom, premium feel.
- **Title (Med/Lg):** For chat headers and card titles. This is our primary instructional weight.
- **Body (Lg):** Our primary chat bubble text (`1rem`). It provides maximum readability without feeling "small."
- **Label (Md/Sm):** Specifically for metadata and micro-copy. Always use `on-surface-variant` (`#58615e`) to maintain hierarchy.

---

## 4. Elevation & Depth
Traditional drop shadows are replaced by **Ambient Occlusion** and **Tonal Layering**.

### The Layering Principle
Depth is achieved by stacking:
1. `surface` (Bottom)
2. `surface-container-low` (Section)
3. `surface-container-lowest` (Interactive Card)

### Ambient Shadows
Where floating is required (e.g., the bottom input bar), use an extra-diffused shadow:
- **Blur:** 32px
- **Opacity:** 6% 
- **Color:** `on-surface` (`#2c3431`) 
*This creates an ethereal lift rather than a heavy "drop."*

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use the `outline-variant` (`#abb4b0`) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Chat Bubbles
- **User Bubble:** `primary-container` (`#a2f4c6`) with `on-primary-container` (`#005e3d`) text. Radius: `DEFAULT` (1rem), with the bottom-right corner set to `sm` (0.5rem).
- **AI Bubble:** `surface-container-highest` (`#dce5e0`) with `on-surface`. Radius: `DEFAULT`, with bottom-left corner set to `sm`.
- **Spacing:** Use Spacing Scale `2` (0.7rem) between related bubbles and `4` (1.4rem) between speaker changes.

### The 'Premium' Paywall CTA
- **Background:** 135° Gradient from `primary` to `secondary`.
- **Radius:** `lg` (2rem).
- **Content:** Use `title-md` for the offer and `label-md` for the subtext. 
- **Iconography:** Use a high-contrast `on-primary` chevron or "star" icon to signify exclusivity.

### Input Fields
- **Container:** `surface-container-lowest` with a "Ghost Border."
- **Radius:** `full` (9999px) to maintain the "friendly" aesthetic.
- **Elevation:** Use an Ambient Shadow to make the input feel like it sits above the chat stream.

### Profile Sections
- **List Items:** Forbid dividers. Use Spacing Scale `6` (2rem) of vertical whitespace and a subtle background shift on press states using `surface-container-high`.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical padding. Give the top of the screen more breathing room than the sides.
- **Do** use `surface-tint` sparingly to highlight active states in the navigation.
- **Do** embrace "Empty Space." High-end design is defined by what you leave out.

### Don't
- **Don't** use pure black (`#000000`) for text. Always use `on-surface` (`#2c3431`) for a softer, more editorial look.
- **Don't** use sharp corners. Our lowest roundedness should be `sm` (0.5rem); anything sharper breaks the "Friendly" brand pillar.
- **Don't** use standard 1px dividers. If you feel the need to separate, increase the Spacing Scale or shift the Surface Tier.
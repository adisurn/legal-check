---
name: Legal Check
description: Neutral, task-focused workspaces for consumer and business resolution
colors:
  primary: "#4461ad"
  primary-hover: "#334e93"
  sky: "#7696d1"
  sand: "#f6cf90"
  cream: "#fff6e7"
  background: "#f5f7fb"
  surface: "#ffffff"
  surface-alt: "#edf1f9"
  text: "#26314b"
  muted: "#5b6980"
  line: "#dce2ec"
  brand-soft: "#eaf0fc"
  brand-ink: "#365497"
  dark-background: "#151c2b"
  dark-surface: "#1e283b"
  dark-surface-alt: "#26334b"
  dark-text: "#edf1fa"
  dark-muted: "#b0bed4"
  dark-line: "#3b4961"
  dark-brand-soft: "#2a3a5a"
  dark-brand-ink: "#b4caf6"
typography:
  headline:
    fontFamily: '"Inter Variable", "Noto Sans Thai Variable", Thonburi, "Leelawadee UI", system-ui, sans-serif'
    fontSize: "clamp(24px, 2.5vw, 30px)"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  title:
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.55
  body:
    fontFamily: '"Inter Variable", "Noto Sans Thai Variable", Thonburi, "Leelawadee UI", system-ui, sans-serif'
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontSize: "12px"
    fontWeight: 550
rounded:
  control: "8px"
  surface: "12px"
  onboarding: "16px"
spacing:
  tight: "8px"
  field: "20px"
  surface: "24px"
  workspace: "34px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Legal Check

## Overview

**Creative North Star: "A shared resolution workspace"**

The existing Legal Check blue/cream identity is extended into separate Consumer,
Business, and Moderator demo workspaces. Familiar application navigation, native inputs,
explicit statuses, and readable Thai content take priority over decorative expression.
The same system supports both light and dark appearances.

**Key Characteristics:**

- Clear separation of roles without changing the underlying component language.
- Blue selection and actions; warm tones for guidance and business context.
- Neutral complaint presentation, never an accusation feed.
- Flat, bordered work surfaces and a mobile phone-preview frame.

## Colors

The brand commitments remain primary, sky, sand, and cream. Semantic foreground and
surface pairs are defined in `src/styles.css`; dark mode changes these pairs together.

### Primary

- **Resolution Blue:** primary actions and selected navigation.
- **Blue Ink:** readable links and text on the light blue supporting surface.
- **Sky:** secondary indicators, timeline accents, and browser surfaces.

### Secondary

- **Sand and Cream:** consumer guidance and business identity. Do not use pale sand
  as body text on a light background.

### Neutral

- Background separates the shell from work surfaces; line separates rows and sections.
- Muted text carries supporting context, not disabled-state styling.
- Dark surfaces use their own light foregrounds and borders rather than color inversion.

**The Paired Surface Rule.** Use semantic foreground/background pairs. Statuses always
include a text label; color alone never communicates risk or publication state.

## Typography

Use **Inter for English** and **Noto Sans Thai for Thai**, including mixed-language
content. The shared stack puts Inter first and falls through to Noto Sans Thai for
Thai glyphs. Fontsource bundles the Latin and Thai upright variable-font subsets
with the app, supporting the existing weights without synthetic bold. Fonts are
served locally with `font-display: swap`; no Google Fonts or external font requests
are needed. Platform Thai/system fonts remain loading and failure fallbacks.

- Headline: the tokenized responsive heading, reduced to 23px inside the phone workspace.
- Title: section headings; compact phone sections use 17px.
- Body: 14px with generous Thai line height; legal reading is constrained to 75ch.
- Labels: 12px for fields, filters, and statuses. Phone form text uses 16px to avoid
  browser auto-zoom.
- Numerical summaries use tabular numerals. Long user content wraps and preserves newlines.

## Layout

Desktop uses a 244px navigation rail, 72px topbar, and 34px horizontal work-area padding.
At the 1050px app-container breakpoint the rail becomes 215px and padding 25px.
At 700px the rail becomes a dismissible drawer and role-specific bottom navigation
appears; work-area padding is 16px.

Application breakpoints use the named `app` container so a phone preview behaves as
a phone even in a large browser. The preview toolbar and phone bezel are presentation,
not part of the complaint workflow. Work areas scroll independently.

Guided tasks use numbered steps only where the sequence has meaning. Evidence and
summary review stay in the main task area; complaint inspection uses a focused dialog.

## Elevation & Depth

Most depth is conveyed through tonal surfaces and single-pixel borders. Work surfaces
do not stack shadows over borders. Soft offset shadows are reserved for dialogs,
temporary status messages, and the inherited phone frame.

## Shapes

Controls use the control radius, work surfaces the surface radius, and onboarding
choices the larger onboarding radius. Small rectangular badges distinguish metadata
from actions. The shield mark and phone silhouette preserve the incumbent identity.

## Components

### Buttons

Actions have a 44px minimum height. Primary buttons are blue with white text.
Secondary actions use the surface and a border. Destructive publication actions use
semantic danger colors, not the primary action treatment. Focus is a visible 3px outline.

### Inputs and filters

Native inputs and selects use semantic surfaces and a one-pixel border. Search sits
above the four filters it scopes. Empty results explain recovery and retain filter controls.

### Navigation

Selected navigation is solid blue with white text; inactive navigation uses the muted
foreground. Role identity and available items change together. On mobile, the drawer
holds profile switching and the bottom navigation holds frequent tasks.

### Status badges

Brand, success, warning, and danger variants pair a labeled foreground and background.
Verification badges explicitly say they are simulated and never assert a claim is true.

### Resolution path

The consumer introduction connects three actual workflow stages with a simple vertical
line and consistent stroke icons. This is process geometry, not decorative illustration.

## Do's and Don'ts

### Do:

- **Do** keep complaint handling separate from public-publication status.
- **Do** use the same semantic tokens across onboarding, dialogs, and phone presentation.
- **Do** keep optional fields skippable and summarize what will happen before submission.
- **Do** use clear language for simulated capabilities and storage failures.

### Don't:

- **Don't** use color, counts, or verification as proof of wrongdoing.
- **Don't** expose raw private complaints or evidence as community decoration.
- **Don't** add decorative eyebrow headings or an aggressive social-feed visual language.
- **Don't** rely on hosted assets for the core prototype to render or function.
